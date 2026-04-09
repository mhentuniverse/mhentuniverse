const { app, BrowserWindow, ipcMain, shell } = require('electron');
const serve = require('electron-serve');
const path = require('path');

const loadURL = (serve.default || serve)({ directory: __dirname });
let mainWindow;

if (process.defaultApp) {
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient('mhent', process.execPath, [path.resolve(process.argv[1])]);
    }
} else {
    app.setAsDefaultProtocolClient('mhent');
}

const gotTheLock = app.requestSingleInstanceLock();

// HÀM SĂN TOKEN BẤT CHẤP ĐỊNH DẠNG
function handleDeepLink(rawString) {
    if (!rawString || !mainWindow) return;
    
    console.log("-> Bắt đầu xử lý chuỗi: ", rawString);
    
    // Dùng Regex bóc tách trực tiếp bỏ qua mọi định dạng URL
    const uidMatch = rawString.match(/uid=([^&/\s"']+)/);
    const tokenMatch = rawString.match(/token=([^&/\s"']+)/);
    
    if (uidMatch && tokenMatch) {
        const payload = {
            uid: uidMatch[1].trim(),
            token: tokenMatch[1].trim()
        };
        
        console.log("-> Bóc tách thành công! UID:", payload.uid);

        const sendAuth = () => {
            mainWindow.webContents.send('auth-success', payload);
        };

        if (mainWindow.webContents.isLoading()) {
            mainWindow.webContents.once('did-finish-load', sendAuth);
        } else {
            sendAuth();
        }
    }
}

if (!gotTheLock) {
    app.quit();
} else {
    // KHI APP ĐANG MỞ SẴN
    app.on('second-instance', (event, commandLine) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
            
            // TÌM CHÍNH XÁC ĐOẠN CHỨA TOKEN, bỏ qua vụ tên miền mhent://
            const authArg = commandLine.find(arg => arg.includes('uid=') && arg.includes('token='));
            if (authArg) {
                handleDeepLink(authArg);
            }
        }
    });

    function createWindow() {
        mainWindow = new BrowserWindow({
            width: 1200, height: 800,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                contextIsolation: false,
                nodeIntegration: true
            }
        });

        loadURL(mainWindow).then(() => {
            mainWindow.loadURL('app://-/index.html');
            // Mở Console sẵn để soi lỗi
            mainWindow.webContents.openDevTools();

            // KHI APP VỪA ĐƯỢC BẬT LÊN
            const startArg = process.argv.find(arg => arg.includes('uid=') && arg.includes('token='));
            if (startArg) {
                setTimeout(() => handleDeepLink(startArg), 1500);
            }
        });
    }

    app.whenReady().then(createWindow);

    app.on('open-url', (event, url) => {
        event.preventDefault();
        handleDeepLink(url);
    });
}

ipcMain.on('open-external-browser', (event, url) => {
    shell.openExternal(url);
});