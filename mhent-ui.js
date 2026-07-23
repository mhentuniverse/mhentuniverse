// ==========================================
// 🚀 MHEnt. UI Library - Core Alerts & Popups (V1.3 - Smooth Transitions)
// ==========================================

const svgSuccess = `<svg viewBox="0 0 24 24" width="50" height="50" stroke="#10b981" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
const svgError = `<svg viewBox="0 0 24 24" width="50" height="50" stroke="#ef4444" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
const svgWarning = `<svg viewBox="0 0 24 24" width="50" height="50" stroke="#f59e0b" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;

// ==========================================
// 1. POPUP THÔNG THƯỜNG
// ==========================================
window.showPopup = function(message, isError = false) {
    removeExistingOverlays();
    const overlay = document.createElement('div');
    overlay.className = 'mhent-ui-overlay'; // Bỏ chữ 'show' ở đây
    overlay.id = 'mhent-active-popup';
    overlay.innerHTML = `
        <div class="mhent-ui-box ${isError ? 'error' : 'success'}">
            <div class="mhent-ui-icon">${isError ? svgError : svgSuccess}</div>
            <h3 class="mhent-ui-title">${isError ? "Ối, Lỗi Rùi!" : "Thành Công!"}</h3>
            <p class="mhent-ui-msg">${message}</p>
            <button class="mhent-ui-btn-primary" onclick="closePopup()">Tuyệt vời</button>
        </div>
    `;
    document.body.appendChild(overlay);

    // Dùng setTimeout cực ngắn để ép trình duyệt render class .show sau khi tạo DOM => Kích hoạt transition
    setTimeout(() => { overlay.classList.add('show'); }, 10);

    if (isError) {
        setTimeout(() => { closePopup(); }, 3000);
    }
};

// ==========================================
// 2. POPUP XÁC NHẬN (CONFIRM)
// ==========================================
window.showConfirmPopup = function(title, message, onConfirm) {
    removeExistingOverlays();
    const overlay = document.createElement('div');
    overlay.className = 'mhent-ui-overlay'; 
    overlay.id = 'mhent-active-confirm';
    overlay.innerHTML = `
        <div class="mhent-ui-box warning">
            <div class="mhent-ui-icon">${svgWarning}</div>
            <h3 class="mhent-ui-title">${title}</h3>
            <p class="mhent-ui-msg">${message}</p>
            <div class="mhent-ui-actions">
                <button class="mhent-ui-btn-outline" id="mhent-cancel">Hủy bỏ</button>
                <button class="mhent-ui-btn-primary" id="mhent-accept">Xác nhận</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => { overlay.classList.add('show'); }, 10);

    document.getElementById('mhent-cancel').onclick = () => closeConfirmPopup();
    document.getElementById('mhent-accept').onclick = () => {
        closeConfirmPopup();
        if (typeof onConfirm === 'function') onConfirm();
    };
};

// ==========================================
// HÀM TẮT POPUP CÓ ANIMATION OUT
// ==========================================
window.closePopup = function() {
    const popup = document.getElementById('mhent-active-popup');
    if (popup) {
        popup.classList.remove('show');
        popup.classList.add('out');
        setTimeout(() => popup.remove(), 400); // Chờ animation FadeOut (400ms)
    }
};

window.closeConfirmPopup = function() {
    const confirm = document.getElementById('mhent-active-confirm');
    if (confirm) {
        confirm.classList.remove('show');
        confirm.classList.add('out');
        setTimeout(() => confirm.remove(), 400);
    }
};

function removeExistingOverlays() {
    const existing = document.querySelectorAll('.mhent-ui-overlay');
    existing.forEach(el => el.remove());
}

// ==========================================
// 3. TOAST THÔNG BÁO GÓC MÀN HÌNH
// ==========================================
window.showToast = function(title, message, type = 'success') {
    let container = document.getElementById('mhent-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'mhent-toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `mhent-toast ${type}`;
    let icon = type === 'error' ? svgError : (type === 'info' ? svgWarning : svgSuccess);
    
    toast.innerHTML = `
        <div class="mhent-toast-icon">${icon}</div>
        <div class="mhent-toast-content">
            <div class="mhent-toast-title">${title}</div>
            <div class="mhent-toast-desc">${message}</div>
        </div>
    `;
    container.appendChild(toast);
    
    setTimeout(() => { 
        toast.style.animation = 'toastFadeOut 0.4s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275)'; 
        setTimeout(() => toast.remove(), 400);
    }, 3000);
};

// ==========================================
// CÁC HÀM TIỆN ÍCH (Giữ nguyên)
// ==========================================
function initializeBackToTopButton() {
    if (document.getElementById('btn-back-to-top')) return;
    const button = document.createElement('button');
    button.id = 'btn-back-to-top';
    button.type = 'button';
    button.title = 'Lên đầu trang';
    button.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`;
    button.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    const toggleVisibility = () => { window.scrollY > 300 ? button.classList.add('visible') : button.classList.remove('visible'); };
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();
    document.body.appendChild(button);
}

window.buildLoginRedirectUrl = function(defaultPath = null) {
    const currentPath = defaultPath || `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (!currentPath || currentPath.startsWith('/login') || currentPath.startsWith('/auth-action')) return '/login';
    return `/login?redirect=${encodeURIComponent(currentPath)}`;
};

window.redirectToLogin = function(defaultPath = null) {
    window.location.href = window.buildLoginRedirectUrl(defaultPath);
};

function initializeLoginRedirectButtons() {
    const loginSelectors = ['#btn-login', '.btn-login', '.btn-auth'];
    document.addEventListener('click', (event) => {
        const target = event.target.closest ? event.target.closest(loginSelectors.join(',')) : null;
        if (!target || target.getAttribute('onclick') || target.closest('.dropdown-menu')) return;
        const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        if (currentPath.startsWith('/login') || currentPath.startsWith('/auth-action')) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
    }, true);
}

document.addEventListener('DOMContentLoaded', () => {
    initializeBackToTopButton();
    initializeLoginRedirectButtons();
});

// ==========================================
// 4. HIỆU ỨNG GÕ CHỮ (TYPING POPUP)
// ==========================================
window.showTypingPopup = function(message = "Đang xử lý...") {
    if (document.getElementById('mhent-typing-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'mhent-typing-overlay';
    overlay.innerHTML = `
        <div class="mhent-typing-box">
            <div class="mhent-typing-indicator"><span></span><span></span><span></span></div>
            <div class="mhent-typing-text">${message}</div>
        </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => { overlay.classList.add('show'); }, 10);
};

window.hideTypingPopup = function() {
    const overlay = document.getElementById('mhent-typing-overlay');
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 300);
    }
};

// ==========================================
// 5. HIỆU ỨNG POPUP NHẬP LIỆU (INPUT DIALOG)
// ==========================================
window.showInputPopup = function(title, placeholder, confirmText, callback) {
    if (document.getElementById('mhent-input-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'mhent-input-overlay';
    overlay.innerHTML = `
        <div class="mhent-input-box">
            <div class="mhent-input-title">${title}</div>
            <input type="text" id="mhent-custom-input" class="mhent-input-field" placeholder="${placeholder}" autocomplete="off">
            <div class="mhent-input-actions">
                <button class="mhent-btn-cancel" onclick="closeInputPopup()">Hủy</button>
                <button class="mhent-btn-confirm" id="mhent-btn-confirm-input">${confirmText}</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => { overlay.classList.add('show'); }, 10);

    const inputField = document.getElementById('mhent-custom-input');
    inputField.focus();
    inputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') document.getElementById('mhent-btn-confirm-input').click();
    });

    document.getElementById('mhent-btn-confirm-input').addEventListener('click', () => {
        const val = inputField.value.trim();
        closeInputPopup();
        if (callback) callback(val);
    });
};

window.closeInputPopup = function() {
    const overlay = document.getElementById('mhent-input-overlay');
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 300);
    }
};

// ==========================================================================
// 🚀 HỆ THỐNG MENU ĐÁY TỰ ĐỘNG & TÙY CHỈNH (BOTTOM NAV AUTO-RENDER)
// ==========================================================================

// 1. TỪ ĐIỂN CÁC VŨ TRỤ TRONG MHENT
const MHENT_APPS_DICT = {
    cinema: { name: 'Cinema', url: '/cinema', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>' },
    arena:  { name: 'Arena',  url: '/arena',  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect><line x1="6" y1="12" x2="10" y2="12"></line><line x1="8" y1="10" x2="8" y2="14"></line><line x1="15" y1="13" x2="15.01" y2="13"></line><line x1="18" y1="11" x2="18.01" y2="11"></line></svg>' },
    teach:  { name: 'Edu',    url: '/teach',  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>' },
    game:   { name: 'Game',   url: '/game',   icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><circle cx="15.5" cy="15.5" r="1.5"></circle><circle cx="15.5" cy="8.5" r="1.5"></circle><circle cx="8.5" cy="15.5" r="1.5"></circle><circle cx="12" cy="12" r="1.5"></circle></svg>' },
    music:  { name: 'Music',  url: '#',       icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>' },
    manga:  { name: 'Manga',  url: '#',       icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>' },
    novel:  { name: 'Novel',  url: '#',       icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>' }
};

// 2. HÀM VẼ MENU ĐÁY TỰ ĐỘNG
window.renderBottomNav = function() {
    // Nếu màn hình > 768px (Máy tính) thì thôi, không vẽ
    if (window.innerWidth > 768) return;

    let nav = document.getElementById('mhent-bottom-nav');
    if (!nav) {
        nav = document.createElement('div');
        nav.id = 'mhent-bottom-nav';
        nav.className = 'mhent-bottom-nav';
        document.body.appendChild(nav);
    }

    // Đọc danh sách app yêu thích của user (Mặc định là Cinema & Arena)
    let favApps = JSON.parse(localStorage.getItem('mhent_custom_nav') || '["cinema", "arena"]');

    // Lấy đường dẫn hiện tại để bật sáng nút tương ứng
    let currentPath = window.location.pathname;

    // Nút 1: Đại Sảnh (Luôn cố định đầu tiên)
    let isHomeActive = (currentPath === '/' || currentPath === '/index.html') ? 'active' : '';
    let html = `
        <a onclick="window.location.href='/'" class="bottom-nav-item ${isHomeActive}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>
            <span>Đại Sảnh</span>
        </a>
    `;

    // Nút 2 & 3 (Hoặc 4): Các vũ trụ user thích
    favApps.forEach(appKey => {
        let app = MHENT_APPS_DICT[appKey];
        if (app) {
            let isActive = currentPath.includes(app.url) && app.url !== '#' ? 'active' : '';
            html += `
                <a onclick="window.location.href='${app.url}'" class="bottom-nav-item ${isActive}">
                    ${app.icon}
                    <span>${app.name}</span>
                </a>
            `;
        }
    });

    // Nút cuối: Hồ Sơ (Luôn cố định cuối cùng)
    let isProfileActive = currentPath.includes('/profile') ? 'active' : '';
    html += `
        <a onclick="window.location.href='/profile#info'" class="bottom-nav-item ${isProfileActive}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>Hồ Sơ</span>
        </a>
    `;

    nav.innerHTML = html;
};

// Tự động gọi hàm vẽ Menu khi trang web tải xong
document.addEventListener("DOMContentLoaded", () => {
    window.renderBottomNav();
});

// 3. HÀM MỞ BẢNG CHỌN VŨ TRỤ YÊU THÍCH (GỌI KHI BẤM NÚT TÙY CHỈNH)
window.openNavCustomizer = function() {
    let favApps = JSON.parse(localStorage.getItem('mhent_custom_nav') || '["cinema", "arena"]');
    
    // Xây dựng danh sách nút Checkbox
    let appsHTML = '';
    for (let key in MHENT_APPS_DICT) {
        let app = MHENT_APPS_DICT[key];
        let isChecked = favApps.includes(key) ? 'checked' : '';
        appsHTML += `
            <label style="display: flex; align-items: center; justify-content: space-between; padding: 12px 15px; background: rgba(0,0,0,0.03); border: 1px solid var(--border-color); border-radius: 12px; margin-bottom: 8px; cursor: pointer; font-family: 'Nunito', sans-serif; font-weight: 800; color: var(--text-primary);">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="color: var(--theme-accent, #ff85a2);">${app.icon}</span>
                    <span>MHEnt. ${app.name}</span>
                </div>
                <input type="checkbox" name="custom_app_item" value="${key}" ${isChecked} style="width: 18px; height: 18px; accent-color: var(--theme-accent, #ff85a2); cursor: pointer;">
            </label>
        `;
    }

    // Tạo Overlay Modal
    let overlay = document.createElement('div');
    overlay.className = 'mhent-ui-overlay show';
    overlay.id = 'modal-nav-customizer';
    overlay.innerHTML = `
        <div class="mhent-ui-box" style="text-align: left; max-width: 420px;">
            <h3 style="font-weight: 900; color: var(--text-primary); margin-top: 0; margin-bottom: 5px; text-align: center;">Tùy chỉnh Menu Đáy 📱</h3>
            <p style="color: var(--text-secondary); font-size: 13.5px; text-align: center; margin-bottom: 20px;">Chọn từ 2 đến 3 vũ trụ cậu hay ghé thăm nhất để ghim xuống thanh điều hướng nhé!</p>
            
            <div style="max-height: 300px; overflow-y: auto; margin-bottom: 20px; padding-right: 5px;">
                ${appsHTML}
            </div>

            <div style="display: flex; gap: 10px;">
                <button onclick="document.getElementById('modal-nav-customizer').remove()" class="mhent-ui-btn-outline" style="flex: 1;">Hủy</button>
                <button onclick="saveCustomNav()" class="mhent-ui-btn-primary" style="flex: 1; background: var(--theme-accent, #ff85a2);">Lưu Ngay</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
};

// 4. HÀM LƯU LẠI VÀ VẼ LẠI MENU NGAY LẬP TỨC
window.saveCustomNav = function() {
    let checkedBoxes = document.querySelectorAll('input[name="custom_app_item"]:checked');
    if (checkedBoxes.length < 1 || checkedBoxes.length > 3) {
        if (typeof showToast === 'function') showToast("Lỗi", "Cậu vui lòng chọn từ 1 đến 3 vũ trụ nhé!", "error");
        else alert("Vui lòng chọn từ 1 đến 3 vũ trụ!");
        return;
    }

    let selectedApps = [];
    checkedBoxes.forEach(box => selectedApps.push(box.value));

    // Lưu vào bộ nhớ máy
    localStorage.setItem('mhent_custom_nav', JSON.stringify(selectedApps));

    // Đóng Modal
    let modal = document.getElementById('modal-nav-customizer');
    if (modal) modal.remove();

    // Vẽ lại thanh Menu dưới đáy lập tức mà không cần F5!
    window.renderBottomNav();

    if (typeof showToast === 'function') showToast("Thành công", "Đã cập nhật thanh Menu của cậu!", "success");
};