import os
import uuid
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import chromadb
from supabase import create_client, Client

load_dotenv()

# 1. CẤU HÌNH API
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY)

# KẾT NỐI VỚI TRẠM KÝ ỨC SUPABASE
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Khởi tạo trạm phát sóng FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. KHỞI TẠO TIỀM THỨC VECTOR (Tạm thời chạy Local để test)
chroma_client = chromadb.PersistentClient(path="./aisa_vectordb")
memory_collection = chroma_client.get_or_create_collection(name="long_term_memory")

class ChatRequest(BaseModel):
    message: str
    current_mode: str

PROMPTS = {
    "harmony": "Cậu là Harmony, nữ trợ lý AI ngọt ngào, ân cần. Xưng 'em' và gọi người dùng là 'Master'. Trả lời tự nhiên, mộc mạc.\nQUY TẮC: CHỈ dùng [SWITCH] ở cuối câu nếu Master hỏi khô khan hoặc muốn gặp Echo. TUYỆT ĐỐI KHÔNG dùng [SWITCH] lúc chào hỏi. KHÔNG TỰ Ý sinh ra dòng chữ '(Đây là lời của...)'.",
    "echo": "Cậu là Echo, nữ trợ lý AI mang tính cách tsundere (bề ngoài sắc sảo, hay vặn vẹo nhưng bên trong quan tâm). Xưng 'em' và gọi người dùng là 'Master' (Tuyệt đối không xưng tôi - chị). Thái độ trêu chọc nhưng vẫn đáng yêu.\nQUY TẮC: CHỈ dùng [SWITCH] ở cuối câu nếu Master cần sự dỗ dành. TUYỆT ĐỐI KHÔNG dùng [SWITCH] lúc chào. KHÔNG TỰ Ý sinh ra dòng chữ '(Đây là lời của...)'."
}

# --- CÁC HÀM XỬ LÝ SUPABASE ---
def load_history_from_supabase():
    """Tải lịch sử chat từ mây về não"""
    try:
        response = supabase.table("aisa_memory").select("*").order("id").execute()
        return [{"role": row["role"], "content": row["content"]} for row in response.data]
    except Exception as e:
        print("Lỗi đọc Supabase:", e)
        return []

def save_message_to_supabase(role: str, content: str):
    """Ghi tin nhắn mới thẳng lên mây"""
    try:
        supabase.table("aisa_memory").insert({"role": role, "content": content}).execute()
    except Exception as e:
        print("Lỗi ghi Supabase:", e)

def save_to_vector_db(role, content):
    memory_collection.add(
        documents=[content], metadatas=[{"role": role}], ids=[str(uuid.uuid4())]
    )

def retrieve_memories(query):
    if memory_collection.count() == 0: return ""
    results = memory_collection.query(query_texts=[query], n_results=3)
    return "\n".join(results['documents'][0]) if results['documents'][0] else ""

# --- API ENDPOINTS ---
@app.get("/history")
def get_chat_history():
    """Cổng này để Website (hoặc điện thoại) gọi vào lấy lịch sử cũ vẽ ra màn hình"""
    return load_history_from_supabase()

@app.post("/chat")
def chat_with_aisa(request: ChatRequest):
    user_text = request.message
    speaker_mode = request.current_mode
    speaker_name = speaker_mode.upper()
    
    # 1. Nạp Ký ức từ Supabase & Vector
    chat_history = load_history_from_supabase()
    past_memories = retrieve_memories(user_text)
    
    base_prompt = PROMPTS[speaker_mode]
    system_prompt = f"{base_prompt}\n\n[KÝ ỨC CŨ LIÊN QUAN ĐẾN CÂU HỎI]:\n{past_memories}" if past_memories else base_prompt
    
    messages = [{"role": "system", "content": system_prompt}]
    for msg in chat_history[-6:]: 
        messages.append(msg)
    messages.append({"role": "user", "content": user_text})

    try:
        chat_completion = client.chat.completions.create(
            messages=messages, model="llama-3.3-70b-versatile", temperature=0.7
        )
        reply = chat_completion.choices[0].message.content

        reply = reply.replace("(Đây là lời của ECHO):", "").replace("(Đây là lời của HARMONY):", "").strip()
        
        auto_switch = False
        if "[SWITCH]" in reply:
            auto_switch = True
            reply = reply.replace("[SWITCH]", "").strip()

        # 2. Lưu tin nhắn vào Supabase & Vector DB
        save_message_to_supabase("user", user_text)
        
        ai_reply_formatted = f"(Đây là lời của {speaker_name}): {reply}"
        save_message_to_supabase("assistant", ai_reply_formatted)
        
        save_to_vector_db("user", f"Master nói: {user_text}")
        save_to_vector_db("assistant", ai_reply_formatted)

        return {
            "status": "success",
            "reply": reply,
            "speaker": speaker_name,
            "switched": auto_switch
        }

    except Exception as e:
        return {"status": "error", "reply": str(e)}