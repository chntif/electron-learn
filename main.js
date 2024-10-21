const { app, BrowserWindow, ipcMain, screen, Tray, Menu } = require('electron');


function createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize; // 获取屏幕尺寸
    const win = new BrowserWindow({
        width: 300,
        height: 400,
        x: width - 300, // 将窗口放置在屏幕右下角
        y: height - 400,
        frame: false, // 无边框
        transparent: true, // 背景透明
        alwaysOnTop: false, // 始终保持在最前
        skipTaskbar: true, // 不显示在任务栏中
        resizable: false, // 不允许调整大小
        movable: true, // 可移动窗口
        webPreferences: {
            preload: `${__dirname}/preload.js`, // 预加载脚本
            contextIsolation: true, // 启用上下文隔离
            enableRemoteModule: false, // 禁用 remote 模块
            nodeIntegration: false // 禁用 Node.js 集成
        }
    });

    win.loadFile('index.html'); // 加载待办事项应用页面

    // 确保窗口不能移动到桌面之外
    win.on('move', () => {
        const [x, y] = win.getPosition();
        if (x < 0 || y < 0) {
            win.setPosition(Math.max(x, 0), Math.max(y, 0));
        }
    });
    // #region
    // 当窗口最小化时隐藏到托盘
    win.on('minimize', (event) => {
        event.preventDefault();
        win.hide();
    });

    // 当用户点击托盘图标时恢复窗口
    tray = new Tray('favicon.ico'); // 添加托盘图标
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Show App', click: () => win.show() },
        { label: 'Quit', click: () => app.quit() }
    ]);
    tray.setToolTip('Todo Application');
    tray.setContextMenu(contextMenu);
    tray.on('click', () => {
        win.show();
    });
    // #endregion
}

// 监听来自渲染进程的最小化请求
ipcMain.on('minimize-window', (event) => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
        win.minimize();
    }
});

app.whenReady().then(createWindow);





app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
