// Kéo thêm thư viện Auth và getDoc để check quyền Admin
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, onSnapshot, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDKDAAnmeqWFRqUZWTVa--m5-cORyHCoUk",
    authDomain: "mhentuniverse.firebaseapp.com",
    projectId: "mhentuniverse",
    storageBucket: "mhentuniverse.firebasestorage.app",
    messagingSenderId: "377044322952",
    appId: "1:377044322952:web:d657d1b0806d37d9246d3d"
};

// Kiểm tra xem web đã có app Firebase nào chạy chưa
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp(); 
const db = getFirestore(app);
const auth = getAuth(app);

// 1. TẠO GIAO DIỆN RÈM BẢO TRÌ (Giữ nguyên của sếp vì nó quá xịn)
const lockScreen = document.createElement('div');
lockScreen.id = 'maintenance-lock';
lockScreen.style.cssText = "display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #0f172a; z-index: 999999; flex-direction: column; justify-content: center; align-items: center; color: white; text-align: center; font-family: 'Nunito', sans-serif;";
lockScreen.innerHTML = `
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <i class="fa-solid fa-triangle-exclamation fa-beat fa-5x" style="color: #ef4444; margin-bottom: 25px;"></i>
    <h1 style="font-weight: 900; margin-bottom: 10px; font-size: 32px; letter-spacing: 1px;">HỆ THỐNG ĐANG BẢO TRÌ</h1>
    <p style="color: #94a3b8; max-width: 500px; font-size: 16px; line-height: 1.6; padding: 0 20px;">
        Các kỹ sư của MHEnt. Universe đang tiến hành nâng cấp hạ tầng phân khu này. Vui lòng quay lại sau ít phút nhé!
    </p>
    <button onclick="window.location.reload()" style="margin-top: 30px; background: #6366f1; color: white; border: none; padding: 12px 30px; border-radius: 12px; font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 16px; cursor: pointer; box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3); transition: 0.3s;">
        <i class="fa-solid fa-rotate-right"></i> TẢI LẠI TRANG
    </button>
    <div id="admin-bypass-notice" style="display:none; margin-top: 20px; color: #10b981; font-weight: bold; font-size: 14px;">
        <i class="fa-solid fa-shield-halved"></i> Đã phát hiện Admin. Đang mở cổng...
    </div>
`;

document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(lockScreen);
});

// 2. LOGIC KIỂM TRA KÉP (Bảo trì Từng Khu + Quyền Admin)
let isSystemDown = false;
let isAdmin = false;

function updateLockScreen() {
    // Chỉ hiện rèm bảo trì khi: Khu vực bị khóa VÀ người dùng không phải là Admin
    if (isSystemDown && !isAdmin) {
        lockScreen.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    } else {
        lockScreen.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Radar 1: Theo dõi các nút bấm trên mây
onSnapshot(doc(db, "system", "status"), (docSnap) => {
    if (docSnap.exists()) {
        const data = docSnap.data();
        const currentPath = window.location.pathname.toLowerCase();

        // Riêng trang Admin Root thì KHÔNG BAO GIỜ bị khóa rèm (để sếp còn đường vào mở khóa)
        if (currentPath.includes('/admin.html')) {
            isSystemDown = false;
        } else {
            let locked = false;
            
            // CẦU DAO TỔNG - Gạt phát sập toàn bộ
            if (data.isMaintenance === true) {
                locked = true;
            } 
            // CÁC APTOMAT PHỤ - Chỉ khóa theo đường dẫn
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
});

// Radar 2: Quét thẻ Admin (Giữ nguyên của sếp)
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