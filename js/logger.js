import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = window.firebaseConfig || (window.MHENT_CONFIG && window.MHENT_CONFIG.FIREBASE);
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

// HÀM QUYỀN LỰC: Ghi lại hành động của Admin
export async function logAdminAction(actionText, moduleName) {
    // Chờ một chút để đảm bảo Auth đã nhận diện được user
    const user = auth.currentUser;
    if (!user) return; 

    try {
        let adminName = user.displayName || user.email.split('@')[0];
        await addDoc(collection(db, "logs"), {
            timestamp: Date.now(),
            adminName: adminName,
            action: actionText,
            module: moduleName
        });
        console.log("✔️ Đã ghi nhật ký hệ thống.");
    } catch (e) {
        console.error("❌ Lỗi ghi nhật ký:", e);
    }
}