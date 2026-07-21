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