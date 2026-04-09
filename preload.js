const { ipcRenderer } = require('electron');

window.openChrome = (url) => {
    ipcRenderer.send('open-external-browser', url);
};

// Lắng nghe dữ liệu đã được mổ xẻ sẵn từ main.js
ipcRenderer.on('auth-success', (event, data) => {
    console.log("🔥 ĐÃ NHẬN DATA TỪ MAIN:", data);

    if (data && data.uid && data.token) {
        // Cất vào túi
        localStorage.setItem('mhent_app_token', data.token);
        localStorage.setItem('mhent_app_uid', data.uid);
        
        // Hiện thông báo đập thẳng vào mắt
        alert("🎉 ĐĂNG NHẬP THÀNH CÔNG! Đang vào Đại sảnh...");
        
        // Chuyển trang
        window.location.reload();
    }
});