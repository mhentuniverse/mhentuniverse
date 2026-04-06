const { ipcRenderer } = require('electron');

// 1. Cấp quyền cho giao diện mở Chrome
window.openChrome = (url) => {
    ipcRenderer.send('open-external-browser', url);
};

// 2. Cắm chốt đợi Chrome bắn link về
ipcRenderer.on('deep-link-received', (event, url) => {
    console.log("🔥 APP ĐÃ NHẬN ĐƯỢC LINK TỪ CHROME: ", url);
    
    // Tách lấy dữ liệu từ cái link (Ví dụ: mhent://auth?token=abc)
    const urlObj = new URL(url);
    if (urlObj.hostname === 'auth') {
        const token = urlObj.searchParams.get('token');
        const uid = urlObj.searchParams.get('uid');
        
        // Lưu tạm vào localStorage của App
        localStorage.setItem('mhent_app_token', token);
        localStorage.setItem('mhent_app_uid', uid);
        
        // Đăng nhập thành công, chuyển thẳng vào Đại Sảnh!
        alert("Đăng nhập thành công qua App!");
        window.location.href = '/index.html'; 
    }
});