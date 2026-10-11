// Dùng sự kiện này để đảm bảo giao diện HTML đã load xong hết rồi mới chạy logic đổi nút
document.addEventListener("DOMContentLoaded", () => {
    // 1. Móc thẻ Căn cước từ SSO Cookie hoặc localStorage
    const sessionUser = (typeof window.getMHEntUser === 'function') ? window.getMHEntUser() : null;
    let appToken = localStorage.getItem('mhent_app_token');
    let appUid = localStorage.getItem('mhent_app_uid') || (sessionUser ? sessionUser.uid : null);

    // 2. Tìm các phần tử trên giao diện
    const btnLogin = document.getElementById('btn-login');
    const userProfile = document.getElementById('user-profile');

    // 3. Kiểm tra xem có thẻ Căn cước / MHEnt ID không
    if (sessionUser || (appToken && appUid)) {
        console.log("✅ Đã nhận diện Căn cước MHEnt ID! Chào mừng trở lại Đại sảnh.");
        
        if (btnLogin) btnLogin.classList.add('hidden-by-auth');
        if (userProfile) userProfile.classList.add('show-by-auth');

        if (typeof window.syncMHEntNavbarUI === 'function') {
            window.syncMHEntNavbarUI();
        }
    } else {
        console.log("❌ Chưa có Căn cước, yêu cầu khách xuất trình (Đăng nhập).");
        
        if (btnLogin) btnLogin.classList.remove('hidden-by-auth');
        if (userProfile) userProfile.classList.remove('show-by-auth');
    }
});