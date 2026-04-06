// ========================================================
// HỆ THỐNG BẢO VỆ MIENT UNIVERSE (CLOUDFLARE TURNSTILE)
// ========================================================

// Nếu phát hiện đang chạy trên App MHEnt Universe (Electron)
if (navigator.userAgent.includes('Electron')) {
    // Ẩn luôn cái màn hình Cloudflare
    document.getElementById('tên-id-của-khung-cloudflare').style.display = 'none'; 
    
    // (Nếu có hàm nào để chuyển vào trang chủ thì cậu gọi luôn ở đây nhé)
    // Ví dụ: window.location.href = '/home.html';
    
    return; // Dừng việc tải Cloudflare lại
}

(function() {
    // 1. Cấu hình thời gian (2 tiếng = 2 * 60 * 60 * 1000 ms)
    const EXPIRE_TIME_MS = 2 * 60 * 60 * 1000;
    const lastVerified = localStorage.getItem('mhent_human_verified_time');
    const now = Date.now();

    // 2. Nếu đã xác minh và bùa còn hạn -> Bỏ qua, cho vào web luôn
    if (lastVerified && (now - parseInt(lastVerified)) < EXPIRE_TIME_MS) {
        return; 
    }

    // 3. Nếu chưa xác minh -> Gọi viện binh Cloudflare
    const script = document.createElement('script');
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    // 4. Dựng bức tường HTML chặn đứng màn hình
    const shieldHTML = `
        <div id="global-bot-shield" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: var(--bg-color, #f8fafc); z-index: 9999999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.5s ease;">
            <div style="background: var(--card-bg, white); padding: 40px 30px; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.1); text-align: center; max-width: 400px; width: 90%; border: 1px solid var(--border-color, #e2e8f0);">
                <div style="width: 70px; height: 70px; background: rgba(139, 92, 246, 0.1); color: #8b5cf6; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 20px auto;">
                    <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <h2 style="margin: 0 0 15px 0; color: var(--text-main, #1e293b); font-weight: 900; font-size: 22px; font-family: 'Nunito', sans-serif;">Xin lỗi vì đã làm phiền bạn</h2>
                <p style="color: var(--text-sub, #64748b); font-size: 14px; margin-bottom: 30px; line-height: 1.6; font-weight: 600; font-family: 'Nunito', sans-serif;">
                    Để đảm bảo trải nghiệm tốt nhất cho mọi người, chúng tôi cần xác nhận bạn không phải là robot.<br>Chỉ mất vài giây thôi!
                </p>
                <div style="display: flex; justify-content: center; min-height: 65px;">
                    <div class="cf-turnstile" data-sitekey="0x4AAAAAACwtHy6UkrJ-sLav" data-callback="onGlobalHumanVerified"></div>
                </div>
            </div>
        </div>
    `;

    // 5. Gắn bức tường vào thân trang ngay khi trang vừa tải xong
    document.addEventListener("DOMContentLoaded", () => {
        document.body.insertAdjacentHTML('beforeend', shieldHTML);
        document.body.style.overflow = 'hidden'; // Khóa cuộn trang

        // Đồng bộ màu sắc nếu user đang bật Dark Mode
        if (document.body.classList.contains('dark-mode') || localStorage.getItem('mhent_dark_mode') === 'on') {
            const shield = document.getElementById('global-bot-shield');
            shield.style.setProperty('--bg-color', '#0f172a');
            shield.style.setProperty('--card-bg', '#1e293b');
            shield.style.setProperty('--border-color', '#334155');
            shield.style.setProperty('--text-main', '#ffffff');
            shield.style.setProperty('--text-sub', '#94a3b8');
        }
    });

    // 6. Hàm mở khóa khi Cloudflare xác nhận thành công
    window.onGlobalHumanVerified = function(token) {
        console.log("MHEnt System: Xác minh con người thành công!");
        localStorage.setItem('mhent_human_verified_time', Date.now());
        
        const shield = document.getElementById('global-bot-shield');
        if (shield) {
            shield.style.opacity = '0'; // Hiệu ứng mờ dần
            setTimeout(() => {
                shield.style.display = 'none';
                document.body.style.overflow = ''; // Mở khóa cuộn trang
            }, 500);
        }
    };
})();