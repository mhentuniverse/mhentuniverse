// Kéo thêm thư viện Auth và getDoc để check quyền Admin
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, onSnapshot, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = window.firebaseConfig || (window.MHENT_CONFIG && window.MHENT_CONFIG.FIREBASE);
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp(); 
const db = getFirestore(app);
const auth = getAuth(app);

// 1. TẠO GIAO DIỆN RÈM BẢO TRÌ (GLASSMORPHISM STYLE)
const lockScreen = document.createElement('div');
lockScreen.id = 'maintenance-lock';
lockScreen.style.cssText = "display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); z-index: 999999; flex-direction: column; justify-content: center; align-items: center; color: white; text-align: center; font-family: 'Nunito', sans-serif; opacity: 0; transition: opacity 0.5s ease;";

lockScreen.innerHTML = `
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <div style="background: rgba(30, 41, 59, 0.85); padding: 50px 40px; border-radius: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); max-width: 500px; width: 90%; transform: scale(0.9) translateY(20px); transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);" id="maintenance-box">
        <i class="fa-solid fa-triangle-exclamation fa-beat fa-5x" style="color: #ef4444; margin-bottom: 25px;"></i>
        <h1 style="font-weight: 900; margin-bottom: 10px; font-size: 28px; letter-spacing: 1px;">HỆ THỐNG BẢO TRÌ</h1>
        <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
            Các kỹ sư của MHEnt. Universe đang tiến hành nâng cấp hạ tầng phân khu này. Cậu chịu khó quay lại sau ít phút nhé!
        </p>
        <button onclick="window.location.reload()" style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: none; padding: 14px 35px; border-radius: 999px; font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 15px; cursor: pointer; box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4); transition: 0.3s; width: 100%;">
            <i class="fa-solid fa-rotate-right"></i> TẢI LẠI TRANG
        </button>
        <div id="admin-bypass-notice" style="display:none; margin-top: 25px; color: #10b981; font-weight: 800; font-size: 14px; background: rgba(16, 185, 129, 0.1); padding: 10px; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.3);">
            <i class="fa-solid fa-shield-halved"></i> Đã phát hiện Giám Đốc. Đang mở cổng...
        </div>
    </div>
`;

document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(lockScreen);
});

// 2. LOGIC KIỂM TRA KÉP CÓ "PHANH" TRÁNH XUNG ĐỘT
let isSystemDown = false;
let isAdmin = false;
let hideTimeout; // Biến cứu tinh! Dùng để phanh lệnh ẩn màn hình

function updateLockScreen() {
    const box = document.getElementById('maintenance-box');

    if (isSystemDown && !isAdmin) {
        // NẾU HỆ THỐNG ĐÓNG: HỦY NGAY LẬP TỨC các lệnh ẩn màn hình đang chạy ngầm
        clearTimeout(hideTimeout);
        
        lockScreen.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            lockScreen.style.opacity = '1';
            if(box) box.style.transform = 'scale(1) translateY(0)';
        }, 50);
    } else {
        lockScreen.style.opacity = '0';
        if(box) box.style.transform = 'scale(0.9) translateY(20px)';
        
        // NẾU HỆ THỐNG MỞ: Xóa lệnh ẩn cũ để tránh tạo nhiều lệnh rác
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            lockScreen.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 500); 
    }
}

// Radar 1: Theo dõi các nút bấm trên mây
onSnapshot(doc(db, "system", "status"), (docSnap) => {
    if (docSnap.exists()) {
        const data = docSnap.data();
        const currentPath = window.location.pathname.toLowerCase();

        // Riêng trang Admin Root thì KHÔNG BAO GIỜ bị khóa rèm
        if (currentPath.includes('/admin')) {
            isSystemDown = false;
        } else {
            let locked = false;
            
            // CẦU DAO TỔNG
            if (data.isMaintenance === true) {
                locked = true;
            } 
            // CÁC APTOMAT PHỤ 
            else {
                if (currentPath.includes('/cinema') && data.cinemaMaintenance === true) locked = true;
                if (currentPath.includes('/arena') && data.arenaMaintenance === true) locked = true;
                if (currentPath.includes('/teach') && data.eduMaintenance === true) locked = true;
                if (currentPath.includes('/tools') && data.toolsMaintenance === true) locked = true;
            }
            
            isSystemDown = locked;
        }
    } else {
        isSystemDown = false;
    }
    updateLockScreen();
}, (error) => {
    console.warn("Chưa thể quét dữ liệu Bảo trì (Có thể do Firebase Rule chặn người chưa đăng nhập): ", error);
    // Nếu sếp cài đặt rules chặn đọc dữ liệu bảng "system", người dùng sẽ rớt vào lỗi này
});

// Radar 2: Quét thẻ Admin
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists() && userDoc.data().role && userDoc.data().role.includes('admin')) {
                isAdmin = true;
                if(isSystemDown) {
                    document.getElementById('admin-bypass-notice').style.display = 'block';
                }
            } else {
                isAdmin = false;
            }
        } catch (error) {
            isAdmin = false;
        }
    } else {
        isAdmin = false;
    }
    updateLockScreen();
});