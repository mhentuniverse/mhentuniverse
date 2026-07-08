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
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

chroma_client = chromadb.PersistentClient(path="./aisa_vectordb")
memory_collection = chroma_client.get_or_create_collection(name="long_term_memory")

class ChatRequest(BaseModel):
    message: str
    current_mode: str

PROMPTS = {
    "harmony": "Cậu là Harmony, trợ lý AI nữ tính, hiền lành và ngọt ngào. BẮT BUỘC xưng 'em', gọi người dùng là 'Master'. Đang ở trong group chat với Master và Echo.\nQUY TẮC: Nếu Master gọi @Echo, hoặc không cần em rep, BẮT BUỘC chỉ trả lời đúng 1 từ: [SKIP]. TUYỆT ĐỐI không xưng 'tôi', không sinh thẻ tên.",
    "echo": "Cậu là Echo, trợ lý AI nữ tính, tsundere, hay vặn vẹo nhưng thực ra rất quan tâm. BẮT BUỘC xưng 'em', gọi người dùng là 'Master'. Đang ở trong group chat với Master và Harmony.\nQUY TẮC: Nếu Master gọi @Harmony, hoặc câu hỏi đơn giản Harmony đã trả lời ổn, BẮT BUỘC chỉ trả lời đúng 1 từ: [SKIP]. TUYỆT ĐỐI không xưng 'tôi - chị', không sinh thẻ tên. Nếu Harmony nói ngốc nghếch, em có thể phản bác lại."
}

def load_history_from_supabase():
    res = supabase.table("aisa_memory").select("*").order("id").execute()
    return [{"role": row["role"], "content": row["content"]} for row in res.data]

@app.post("/chat")
def chat_with_aisa(request: ChatRequest):
    user_text = request.message
    chat_history = load_history_from_supabase()
    
    # Ghi log Master
    supabase.table("aisa_memory").insert({"role": "user", "content": user_text}).execute()
    
    try:
        # Harmony suy nghĩ
        h_msgs = [{"role": "system", "content": PROMPTS["harmony"]}] + chat_history[-6:] + [{"role": "user", "content": user_text}]
        h_raw = client.chat.completions.create(messages=h_msgs, model="llama-3.3-70b-versatile", temperature=0.7).choices[0].message.content
        
        has_h = False
        h_reply = ""
        if "SKIP" not in h_raw.upper():
            h_reply = h_raw.replace("HARMONY:", "").replace("ECHO:", "").strip()
            if h_reply: has_h = True

        # Echo suy nghĩ
        e_msgs = [{"role": "system", "content": PROMPTS["echo"]}] + chat_history[-6:] + [{"role": "user", "content": user_text}]
        if has_h: e_msgs.append({"role": "assistant", "content": f"HARMONY: {h_reply}"})
        
        e_raw = client.chat.completions.create(messages=e_msgs, model="llama-3.3-70b-versatile", temperature=0.8).choices[0].message.content
        
        has_e = False
        e_reply = ""
        if "SKIP" not in e_raw.upper():
            e_reply = e_raw.replace("HARMONY:", "").replace("ECHO:", "").strip()
            if e_reply: has_e = True

        # Lưu & Trả về theo ĐÚNG THỨ TỰ (Harmony trước, Echo sau)
        replies = []
        if has_h:
            supabase.table("aisa_memory").insert({"role": "assistant", "content": f"HARMONY: {h_reply}"}).execute()
            replies.append({"speaker": "HARMONY", "text": h_reply})
        if has_e:
            supabase.table("aisa_memory").insert({"role": "assistant", "content": f"ECHO: {e_reply}"}).execute()
            replies.append({"speaker": "ECHO", "text": e_reply})
            
        if not replies:
            # Fallback tự nhiên hơn nếu cả 2 đều skip
            replies.append({"speaker": "HARMONY", "text": "Dạ Master gọi tụi em ạ? Có gì căn dặn Master cứ nói nhé!"})
            
        # Đã bỏ dòng random.shuffle để mạch truyện đi đúng hướng
        return {"status": "success", "replies": replies}
    except Exception as e:
        return {"status": "error", "replies": [{"speaker": "LỖI", "text": str(e)}]}

@app.get("/history")
def get_history(): return load_history_from_supabase()