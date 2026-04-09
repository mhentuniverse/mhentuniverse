const { ipcRenderer } = require('electron');

window.openChrome = (url) => {
    ipcRenderer.send('open-external-browser', url);
};

ipcRenderer.on('deep-link-received', (event, url) => {
    // Gỡ lỗi nhanh: Nếu thấy cái này hiện ra là App đã nhận được data!
    console.log("🔥 ĐÃ NHẬN LINK:", url);

    try {
        // Chuẩn hóa link (thêm // nếu thiếu)
        let formattedUrl = url.replace('mhent:', 'mhent://').replace('mhent:////', 'mhent://');
        const urlObj = new URL(formattedUrl);
        
        const token = urlObj.searchParams.get('token');
        const uid = urlObj.searchParams.get('uid');

        if (token && uid) {
            localStorage.setItem('mhent_app_token', token);
            localStorage.setItem('mhent_app_uid', uid);
            
            // Báo hiệu thành công
            console.log("✅ Lưu Căn cước thành công! Đang chuyển vùng...");
            window.location.href = 'app://-/index.html';
        } else {
            console.error("❌ Link thiếu token hoặc uid:", url);
        }
    } catch (e) {
        console.error("❌ Lỗi xử lý URL:", e);
    }
});