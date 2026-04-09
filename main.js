const { app, BrowserWindow, ipcMain, shell } = require('electron');
const serve = require('electron-serve');
const path = require('path');

const loadURL = (serve.default || serve)({ directory: __dirname });
let mainWindow;

// 1. ĐĂNG KÝ TÊN MIỀN RIÊNG CHO APP (Giống như mhent://)
if (process.defaultApp) {
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient('mhent', process.execPath, [path.resolve(process.argv[1])]);
    }
} else {
    app.setAsDefaultProtocolClient('mhent');
}

// 2. KHÓA APP (Chỉ cho phép 1 cửa sổ duy nhất hoạt động)
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit(); 
} else {
    // 3. BẮT ĐƯỜNG LINK TỪ CHROME BẮN VỀ (PHIÊN BẢN CHỐNG HỤT)
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();

            // TRICK: Quét từ khóa linh hoạt hơn vì Windows hay làm méo link (vứt // hoặc bọc ngoặc kép)
            let deepLink = commandLine.find(arg => arg.includes('mhent:') || arg.includes('mhent://'));
            
            if (deepLink) {
                // Xóa bỏ ngoặc kép thừa (nếu có) do Windows tự gắn vào
                deepLink = deepLink.replace(/"/g, '').trim();
                console.log("-> Đã bắt được link từ Chrome: ", deepLink);
                mainWindow.webContents.send('deep-link-received', deepLink);
            } else {
                console.log("-> Có gọi App nhưng không tìm thấy link trong CommandLine: ", commandLine);
            }
        }
    });

    // 3.5 BẮT LINK DÀNH RIÊNG CHO MACOS (Vì macOS không dùng second-instance)
    app.on('open-url', (event, url) => {
        event.preventDefault();
        if (mainWindow) {
            console.log("-> [macOS] Đã bắt được link: ", url);
            mainWindow.webContents.send('deep-link-received', url);
        }
    });

    // 4. HÀM TẠO CỬA SỔ CHÍNH
    function createWindow() {
        mainWindow = new BrowserWindow({
            width: 1280,
            height: 800,
            title: "MHEnt. Universe",
            icon: path.join(__dirname, 'assets', 'icon-web.png'),
            autoHideMenuBar: true,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: false, 
                preload: path.join(__dirname, 'preload.js') 
            }
        });

        // Đánh chặn mở tab mới
        mainWindow.webContents.setWindowOpenHandler(({ url }) => {
            mainWindow.loadURL(url);
            return { action: 'deny' }; 
        });

        // Giả lập Vercel Clean URLs 
        mainWindow.webContents.on('will-navigate', (event, url) => {
            if (url.startsWith('app://')) {
                let [baseUrl, ...queryParts] = url.split('?');
                let queryString = queryParts.length > 0 ? '?' + queryParts.join('?') : '';
                let [pathWithoutHash, hash] = baseUrl.split('#');
                let hashString = hash ? '#' + hash : '';
                
                let lastSegment = pathWithoutHash.split('/').filter(Boolean).pop();
                const folders = ['cinema', 'arena', 'teach', 'assets'];

                if (lastSegment && !lastSegment.includes('.')) {
                    event.preventDefault(); 
                    let cleanPath;
                    if (folders.includes(lastSegment)) {
                        cleanPath = `${pathWithoutHash}/index.html`;
                    } else {
                        cleanPath = `${pathWithoutHash}.html`;
                    }
                    mainWindow.loadURL(`${cleanPath}${queryString}${hashString}`);
                }
            }
        });

        // Load Đại sảnh và Bật DevTools
        loadURL(mainWindow).then(() => {
            mainWindow.loadURL('app://-/index.html');
            
            // Đã nhét lệnh mở DevTools vào đúng chỗ an toàn
            mainWindow.webContents.openDevTools();
        });
    }

    // 5. CHỈ KHỞI ĐỘNG 1 LẦN DUY NHẤT
    app.whenReady().then(() => {
        createWindow();

        app.on('activate', function () {
            if (BrowserWindow.getAllWindows().length === 0) createWindow();
        });
    });
}

// Lệnh mở link ra trình duyệt Chrome bên ngoài (Dành cho UI gọi)
ipcMain.on('open-external-browser', (event, url) => {
    shell.openExternal(url);
});

// Thoát App khi bấm dấu X 
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});