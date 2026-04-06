const { ipcRenderer } = require('electron');

// 1. Cấp quyền cho giao diện mở Chrome
window.openChrome = (url) => {
    ipcRenderer.send('open-external-browser', url);
};

// 2. Cắm chốt đợi Chrome bắn link về
ipcRenderer.on('deep-link-received', (event, url) => {
    // Xóa dấu / ở cuối nếu có để tránh lỗi parse
    const cleanUrl = url.replace(/\/$/, ""); 
    console.log("🚀 Preload đang xử lý link: ", cleanUrl);
    
    try {
        const urlObj = new URL(cleanUrl);
        
        // Kiểm tra xem có chứa chữ 'auth' trong link không
        if (cleanUrl.includes('auth')) {
            const token = urlObj.searchParams.get('token');
            const uid = urlObj.searchParams.get('uid');
            
            if (uid && token) {
                localStorage.setItem('mhent_app_token', token);
                localStorage.setItem('mhent_app_uid', uid);
                
                console.log("✅ Đã lưu Token. Chuẩn bị về Đại Sảnh!");
                window.location.href = '/index.html'; 
            } else {
                console.error("❌ Link thiếu UID hoặc Token!");
            }
        }
    } catch (e) {
        console.error("❌ Lỗi giải mã URL: ", e);
    }
});