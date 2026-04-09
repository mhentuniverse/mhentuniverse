const { app, BrowserWindow, ipcMain, shell } = require('electron');
const serve = require('electron-serve');
const path = require('path');

const loadURL = (serve.default || serve)({ directory: __dirname });
let mainWindow;

// 1. ĐĂNG KÝ PROTOCOL
if (process.defaultApp) {
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient('mhent', process.execPath, [path.resolve(process.argv[1])]);
    }
} else {
    app.setAsDefaultProtocolClient('mhent');
}

const gotTheLock = app.requestSingleInstanceLock();

// Hàm xử lý bóc tách link cực mạnh & Không bao giờ làm rơi data
function handleDeepLink(url) {
    if (!url || !mainWindow) return;
    
    // Xóa ngoặc kép và khoảng trắng thừa do Windows
    let cleanUrl = url.replace(/"/g, '').trim();
    if (cleanUrl.includes('mhent:')) {
        console.log("-> Deep Link bẫy được: ", cleanUrl);
        
        // KIỂM TRA: Nếu giao diện đang bận load, phải ĐỢI nó load xong mới ném link sang
        if (mainWindow.webContents.isLoading()) {
            console.log("-> Giao diện đang tải, đợi chút xíu mới bắn link...");
            mainWindow.webContents.once('did-finish-load', () => {
                mainWindow.webContents.send('deep-link-received', cleanUrl);
            });
        } else {
            // Giao diện đã sẵn sàng, ném luôn!
            mainWindow.webContents.send('deep-link-received', cleanUrl);
        }
    }
}

if (!gotTheLock) {
    app.quit();
} else {
    // 2. BẮT LINK KHI APP ĐANG CHẠY (SECOND INSTANCE)
    app.on('second-instance', (event, commandLine) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
            
            // Windows gửi link qua commandLine
            const url = commandLine.find(arg => arg.includes('mhent:'));
            handleDeepLink(url);
        }
    });

    function createWindow() {
        mainWindow = new BrowserWindow({
            width: 1200, height: 800,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                contextIsolation: false, // Để preload.js xài được localStorage dễ hơn
                nodeIntegration: true
            }
        });

        loadURL(mainWindow).then(() => {
            mainWindow.loadURL('app://-/index.html');
            mainWindow.webContents.openDevTools();

            // 3. BẮT LINK KHI APP VỪA BẬT (COLD START)
            // Kiểm tra xem trong argv có link không (Dành cho Windows)
            const startUrl = process.argv.find(arg => arg.includes('mhent:'));
            if (startUrl) {
                // Đợi app load xong giao diện mới bắn link qua
                setTimeout(() => handleDeepLink(startUrl), 1500);
            }
        });
    }

    app.whenReady().then(createWindow);

    // Dành cho macOS
    app.on('open-url', (event, url) => {
        event.preventDefault();
        handleDeepLink(url);
    });
}

ipcMain.on('open-external-browser', (event, url) => {
    shell.openExternal(url);
});