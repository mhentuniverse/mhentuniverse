// Dùng sự kiện này để đảm bảo giao diện HTML đã load xong hết rồi mới chạy logic đổi nút
document.addEventListener("DOMContentLoaded", () => {
    // 1. Móc thẻ Căn cước từ trong túi ra
    let appToken = localStorage.getItem('mhent_app_token');
    let appUid = localStorage.getItem('mhent_app_uid');

    // 2. Tìm các phần tử trên giao diện (Cậu nhớ sửa lại id cho khớp với web của cậu nha)
    const btnLogin = document.getElementById('nut-dang-nhap'); // Nút Đăng nhập cũ
    const userProfile = document.getElementById('khu-vuc-avatar'); // Khu vực hiện Avatar/Tên

    // 3. Kiểm tra xem có thẻ không
    if (appToken && appUid) {
        console.log("✅ Đã nhận diện Căn cước trong App! Chào mừng trở lại Đại sảnh.");
        
        // Giấu nút Đăng nhập đi
        if (btnLogin) btnLogin.style.display = 'none';
        
        // Hiện khu vực Avatar lên
        if (userProfile) {
            userProfile.style.display = 'flex'; // hoặc 'block' tùy CSS của cậu
            
            // Ở bước này, nếu cậu có lưu tên hoặc link ảnh của user trên localStorage, 
            // cậu có thể chèn thẳng vào đây luôn!
            // Ví dụ: document.getElementById('ten-user').innerText = localStorage.getItem('mhent_app_name');
        }
    } else {
        console.log("❌ Chưa có Căn cước, yêu cầu khách xuất trình (Đăng nhập).");
        
        // Hiện nút Đăng nhập
        if (btnLogin) btnLogin.style.display = 'block';
        
        // Giấu khu vực Avatar đi
        if (userProfile) userProfile.style.display = 'none';
    }
});