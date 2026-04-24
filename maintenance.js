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

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp(); 
const db = getFirestore(app);
const auth = getAuth(app);

// 1. TẠO GIAO DIỆN CÓ CHỨA LINK FONT NUNITO (Giữ nguyên của sếp)
const lockScreen = document.createElement('div');
lockScreen.id = 'maintenance-lock';
lockScreen.style.cssText = "display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #0f172a; z-index: 999999; flex-direction: column; justify-content: center; align-items: center; color: white; text-align: center; font-family: 'Nunito', sans-serif;";
lockScreen.innerHTML = `
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <i class="fa-solid fa-triangle-exclamation fa-beat fa-5x" style="color: #ef4444; margin-bottom: 25px;"></i>
    <h1 style="font-weight: 900; margin-bottom: 10px; font-size: 32px; letter-spacing: 1px;">HỆ THỐNG ĐANG BẢO TRÌ</h1>
    <p style="color: #94a3b8; max-width: 500px; font-size: 16px; line-height: 1.6; padding: 0 20px;">
        Các kỹ sư của MHEnt. Universe đang tiến hành nâng cấp hệ thống để mang lại trải nghiệm tốt hơn. Vui lòng quay lại sau ít phút nhé!
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

// 2. LOGIC KIỂM TRA KÉP (Bảo trì + Quyền Admin + Đồng hồ)
let isSystemDown = false;
let isAdmin = false;
let systemData = null; // Biến lưu cấu hình từ Firebase

function updateLockScreen() {
    if (isSystemDown && !isAdmin) {
        lockScreen.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    } else {
        lockScreen.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ✨ HÀM MỚI: TỰ NGÓ ĐỒNG HỒ XEM CÓ ĐẾN GIỜ ĐÓNG/MỞ CỬA CHƯA
function checkTimeSchedule() {
    if (!systemData) return;
    const now = Date.now();
    let shouldLock = false;

    // Ưu tiên 1: Nút đóng thủ công của sếp
    if (systemData.isMaintenance === true) {
        shouldLock = true;
    } 
    // Ưu tiên 2: Chạy theo lịch hẹn
    else if (systemData.scheduleEnabled && systemData.startTime && systemData.endTime) {
        if (now >= systemData.startTime && now <= systemData.endTime) {
            shouldLock = true; // Đang trong giờ giới nghiêm
        }
    }

    // Nếu trạng thái thay đổi thì mới cập nhật màn hình
    if (isSystemDown !== shouldLock) {
        isSystemDown = shouldLock;
        updateLockScreen();
    }
}

// Cứ mỗi 10 giây, bảo vệ lại ngó đồng hồ 1 lần để tự động thả/khóa người dùng
setInterval(checkTimeSchedule, 10000);

// Radar 1: Theo dõi Database (Cập nhật Radar 1.0 của sếp lên 2.0)
onSnapshot(doc(db, "system", "status"), (docSnap) => {
    if (docSnap.exists()) {
        systemData = docSnap.data();
        checkTimeSchedule(); // Chạy ngay lập tức khi sếp vừa bấm lưu
    } else {
        systemData = null;
        isSystemDown = false;
        updateLockScreen();
    }
});

// Radar 2: Quét xem người dùng hiện tại có thẻ Admin không (Giữ nguyên của sếp)
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
        } catch (error) { isAdmin = false; }
    } else { isAdmin = false; }
    updateLockScreen();
});