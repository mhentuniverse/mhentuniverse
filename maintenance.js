// Kéo thư viện Firebase (Nó sẽ tự chạy ngầm mà không làm phiền code chính của web)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 1. Cấu hình Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDKDAAnmeqWFRqUZWTVa--m5-cORyHCoUk",
    authDomain: "mhentuniverse.firebaseapp.com",
    projectId: "mhentuniverse",
    storageBucket: "mhentuniverse.firebasestorage.app",
    messagingSenderId: "377044322952",
    appId: "1:377044322952:web:d657d1b0806d37d9246d3d"
};

// Mẹo nhỏ của CTO: Đặt tên app là "MaintenanceApp" để không bị đụng độ với cái Firebase ở trang chính
const app = initializeApp(firebaseConfig, "MaintenanceApp"); 
const db = getFirestore(app);

// 2. Dùng JS để tự động vẽ Màn hình UI và nhét vào trang
const lockScreen = document.createElement('div');
lockScreen.id = 'maintenance-lock';
lockScreen.style.cssText = "display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #0f172a; z-index: 999999; flex-direction: column; justify-content: center; align-items: center; color: white; text-align: center; font-family: 'Nunito', sans-serif;";
lockScreen.innerHTML = `
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <i class="fa-solid fa-triangle-exclamation fa-beat fa-5x" style="color: #ef4444; margin-bottom: 25px;"></i>
    <h1 style="font-weight: 900; margin-bottom: 10px; font-size: 32px; letter-spacing: 1px;">HỆ THỐNG ĐANG BẢO TRÌ</h1>
    <p style="color: #94a3b8; max-width: 500px; font-size: 16px; line-height: 1.6; padding: 0 20px;">
        Các kỹ sư của MHEnt. Universe đang tiến hành nâng cấp hệ thống để mang lại trải nghiệm tốt hơn. Vui lòng quay lại sau ít phút nhé!
    </p>
    <button onclick="window.location.reload()" style="margin-top: 30px; background: #6366f1; color: white; border: none; padding: 12px 30px; border-radius: 12px; font-weight: 900; font-size: 16px; cursor: pointer; box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3); transition: 0.3s;">
        <i class="fa-solid fa-rotate-right"></i> TẢI LẠI TRANG
    </button>
`;

// Chờ HTML load xong thì nhét cái màn hình này vào body
document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(lockScreen);
});

// 3. Radar theo dõi lệnh từ Root Admin
onSnapshot(doc(db, "system", "status"), (docSnap) => {
    if (docSnap.exists() && docSnap.data().isMaintenance === true) {
        lockScreen.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Khóa cuộn trang
    } else {
        lockScreen.style.display = 'none';
        document.body.style.overflow = 'auto'; // Mở cuộn trang
    }
});