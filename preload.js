const { ipcRenderer } = require('electron');

// 1. Cấp quyền cho giao diện mở Chrome
window.openChrome = (url) => {
    ipcRenderer.send('open-external-browser', url);
};

// 2. Cắm chốt đợi Chrome bắn link về
ipcRenderer.on('deep-link-received', (event, url) => {
    console.log("🔥 APP ĐÃ NHẬN ĐƯỢC LINK TỪ CHROME: ", url);
    
    try {
        // Nắn lại URL nếu Windows lỡ nuốt mất dấu // (Biến mhent:auth thành mhent://auth)
        let normalizedUrl = url;
        if (url.startsWith('mhent:') && !url.startsWith('mhent://')) {
            normalizedUrl = url.replace('mhent:', 'mhent://');
        }
        
        // Cắt đuôi thừa và quét URL
        const cleanUrl = normalizedUrl.replace(/\/$/, ""); 
        const urlObj = new URL(cleanUrl);
        
        if (cleanUrl.includes('auth')) {
            const token = urlObj.searchParams.get('token');
            const uid = urlObj.searchParams.get('uid');
            
            if (uid && token) {
                // Nhét vào túi quần (localStorage) của App
                localStorage.setItem('mhent_app_token', token);
                localStorage.setItem('mhent_app_uid', uid);
                
                console.log("✅ Đã lưu Căn Cước. Đang ép App mở cửa...");
                window.location.href = 'app://-/index.html'; 
            }
        }
    } catch (e) {
        console.error("❌ Lỗi xử lý link:", e);
    }
});