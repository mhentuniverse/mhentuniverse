// ==========================================
// 🚀 MHEnt. UI Library - Core Alerts & Popups (V1.2)
// ==========================================

const svgSuccess = `<svg viewBox="0 0 24 24" width="50" height="50" stroke="#10b981" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
const svgError = `<svg viewBox="0 0 24 24" width="50" height="50" stroke="#ef4444" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
const svgWarning = `<svg viewBox="0 0 24 24" width="50" height="50" stroke="#f59e0b" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;

// 1. BỘ MÁY GỌI POPUP (Tự động tắt sau 3s nếu là lỗi)
window.showPopup = function(message, isError = false) {
    removeExistingOverlays();
    const overlay = document.createElement('div');
    overlay.className = 'mhent-ui-overlay show';
    overlay.id = 'mhent-active-popup'; // Gắn ID để dễ tìm mà đóng
    overlay.innerHTML = `
        <div class="mhent-ui-box ${isError ? 'error' : 'success'}">
            <div class="mhent-ui-icon">${isError ? svgError : svgSuccess}</div>
            <h3 class="mhent-ui-title">${isError ? "Ối, Lỗi Rùi!" : "Thành Công!"}</h3>
            <p class="mhent-ui-msg">${message}</p>
            <button class="mhent-ui-btn-primary" onclick="closePopup()">Tuyệt vời</button>
        </div>
    `;
    document.body.appendChild(overlay);

    if (isError) {
        setTimeout(() => { closePopup(); }, 3000);
    }
};

// 2. BỘ MÁY GỌI CONFIRM POPUP (Xác nhận hành động)
window.showConfirmPopup = function(title, message, onConfirm) {
    removeExistingOverlays();
    const overlay = document.createElement('div');
    overlay.className = 'mhent-ui-overlay show';
    overlay.id = 'mhent-active-confirm'; // Gắn ID 
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

    document.getElementById('mhent-cancel').onclick = () => closeConfirmPopup();
    document.getElementById('mhent-accept').onclick = () => {
        closeConfirmPopup();
        if (typeof onConfirm === 'function') onConfirm();
    };
};

// 3. CÁC HÀM ĐÓNG POPUP BẰNG CODE (Backward Compatibility)
window.closePopup = function() {
    const popup = document.getElementById('mhent-active-popup');
    if (popup) {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300); // Chờ animation mờ đi rồi mới xóa khỏi DOM
    }
};

window.closeConfirmPopup = function() {
    const confirm = document.getElementById('mhent-active-confirm');
    if (confirm) {
        confirm.classList.remove('show');
        setTimeout(() => confirm.remove(), 300);
    }
};

function removeExistingOverlays() {
    const existing = document.querySelectorAll('.mhent-ui-overlay');
    existing.forEach(el => el.remove());
}

// 4. BỘ MÁY GỌI TOAST (Góc phải màn hình)
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
        toast.style.animation = 'mhentPopOut 0.4s forwards'; 
        setTimeout(() => toast.remove(), 400);
    }, 3000);
};

function initializeBackToTopButton() {
    if (document.getElementById('btn-back-to-top')) return;

    const button = document.createElement('button');
    button.id = 'btn-back-to-top';
    button.type = 'button';
    button.title = 'Lên đầu trang';
    button.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
        </svg>`;

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();
    document.body.appendChild(button);
}

document.addEventListener('DOMContentLoaded', initializeBackToTopButton);
