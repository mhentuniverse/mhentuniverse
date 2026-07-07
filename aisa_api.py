import os
import uuid
import random
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
    "harmony": "Cậu là Harmony, nữ trợ lý AI ngọt ngào. Xưng 'em', gọi người dùng là 'Master'. Đang ở trong group chat 3 người với Master và Echo.\nQUY TẮC SỐNG CÒN: Nếu Master chỉ đích danh gọi Echo (vd: @Echo), hoặc câu chuyện không liên quan đến em, em BẮT BUỘC phải im lặng bằng cách trả lời ĐÚNG MỘT TỪ: [SKIP]. Tuyệt đối không sinh ra các thẻ tên (Đây là lời của...).",
    
    "echo": "Cậu là Echo, nữ trợ lý AI tsundere, hay vặn vẹo. Xưng 'em', gọi người dùng là 'Master'. Đang ở trong group chat 3 người với Master và Harmony.\nQUY TẮC SỐNG CÒN: Nếu Master chỉ đích danh gọi Harmony (vd: @Harmony), hoặc em lười không thèm trả lời, em BẮT BUỘC phải im lặng bằng cách trả lời ĐÚNG MỘT TỪ: [SKIP]. Nếu Harmony đã trả lời, em có thể im lặng [SKIP] hoặc nhảy vào cà khịa. Tuyệt đối không sinh ra thẻ tên."
}

# --- CÁC HÀM XỬ LÝ SUPABASE ---
def load_history_from_supabase():
    try:
        response = supabase.table("aisa_memory").select("*").order("id").execute()
        return [{"role": row["role"], "content": row["content"]} for row in response.data]
    except Exception as e:
        print("Lỗi đọc Supabase:", e)
        return []

def save_message_to_supabase(role: str, content: str):
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
    return load_history_from_supabase()

@app.post("/chat")
def chat_with_aisa(request: ChatRequest):
    user_text = request.message
    
    # 1. Nạp Ký ức
    chat_history = load_history_from_supabase()
    past_memories = retrieve_memories(user_text)
    memory_context = f"\n\n[KÝ ỨC CŨ LIÊN QUAN]:\n{past_memories}" if past_memories else ""
    
    # Ghi nhận ngay lời Master vào Database trước để đúng thứ tự thời gian
    save_message_to_supabase("user", user_text)
    save_to_vector_db("user", f"Master nói: {user_text}")
    
    try:
        # --- LƯỢT 1: HARMONY SUY NGHĨ ---
        harmony_sys = PROMPTS["harmony"] + memory_context
        harmony_msgs = [{"role": "system", "content": harmony_sys}] + chat_history[-6:] + [{"role": "user", "content": user_text}]
        
        harmony_raw = client.chat.completions.create(
            messages=harmony_msgs, model="llama-3.3-70b-versatile", temperature=0.7
        ).choices[0].message.content
        
        has_harmony = False
        if "[SKIP]" not in harmony_raw:
            harmony_reply = harmony_raw.replace("HARMONY:", "").replace("ECHO:", "").strip()
            has_harmony = True

        # --- Tạo ngữ cảnh cho Echo ---
        echo_context_msgs = chat_history[-6:] + [{"role": "user", "content": user_text}]
        if has_harmony:
            echo_context_msgs.append({"role": "assistant", "content": f"HARMONY: {harmony_reply}"})

        # --- LƯỢT 2: ECHO SUY NGHĨ ---
        echo_sys = PROMPTS["echo"] + memory_context
        echo_msgs = [{"role": "system", "content": echo_sys}] + echo_context_msgs
        
        echo_raw = client.chat.completions.create(
            messages=echo_msgs, model="llama-3.3-70b-versatile", temperature=0.8
        ).choices[0].message.content
        
        has_echo = False
        if "[SKIP]" not in echo_raw:
            echo_reply = echo_raw.replace("HARMONY:", "").replace("ECHO:", "").strip()
            has_echo = True

        # --- LƯU LẠI KÝ ỨC NHỮNG NGƯỜI ĐÃ LÊN TIẾNG ---
        replies = []
        
        if has_harmony:
            save_message_to_supabase("assistant", f"HARMONY: {harmony_reply}")
            save_to_vector_db("assistant", f"Harmony nói: {harmony_reply}")
            replies.append({"speaker": "HARMONY", "text": harmony_reply})
            
        if has_echo:
            save_message_to_supabase("assistant", f"ECHO: {echo_reply}")
            save_to_vector_db("assistant", f"Echo nói: {echo_reply}")
            replies.append({"speaker": "ECHO", "text": echo_reply})
            
        if not has_harmony and not has_echo:
            emergency_reply = "Dạ Master gọi tụi em ạ? Echo đang lười nên em rep thay nhé!"
            save_message_to_supabase("assistant", f"HARMONY: {emergency_reply}")
            replies.append({"speaker": "HARMONY", "text": emergency_reply})

        if has_harmony and has_echo:
            random.shuffle(replies)

        return {
            "status": "success",
            "replies": replies
        }

    except Exception as e:
        return {"status": "error", "replies": [{"speaker": "LỖI", "text": str(e)}]}