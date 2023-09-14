import {app, shell, BrowserWindow, BrowserView, ipcMain} from 'electron'
import {join} from 'path'
import {electronApp, optimizer, is} from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? {icon} : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return {action: 'deny'}
  })


  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  interface CustomBrowserView {
    name: string;
    bit: number;
    src: string;
    view?: BrowserView | null;
  }

  const browserViewArr: CustomBrowserView[] = [];
  browserViewArr.push({
    name: 'baidu',
    bit: 1,
    src: 'https://www.baidu.com'
  }, {
    name: '360',
    bit: 2,
    src: 'https://www.360.com'
  })


  ipcMain.on('showEvent', (event, showBit) => {
    console.log(event)

    browserViewArr.forEach(item => {
      if ((item.bit & showBit) == item.bit) {
        if (item.view !== null) {
          return
        }
        //创建对象
        const view = new BrowserView()
        view.setAutoResize({horizontal: true, vertical: true})
        //设置在主窗口的位置和view的大小
        view.setBounds({x: 0, y: 0, width: 100, height: 100})
        //设置到主窗口
        mainWindow.addBrowserView(view)
        view.webContents.loadURL(item.src)

        item.view = view

      } else {
        if (item.view != null) {
          mainWindow.removeBrowserView(item.view)
          item.view = null;
        }
      }
    })

    // browserViewArr.forEach((item, index, arr) => {
    //   console.log(item, index, arr)
    // })

    let objects = browserViewArr.filter(_ => _.view != null);
    let viewNum = objects.length;
    if (viewNum !== 0) {
      const mainWindowHeight = mainWindow.getSize()[1]
      const mainWindowWidth = mainWindow.getSize()[0]
      const itemHeight = Math.floor(((mainWindowHeight - 40) / viewNum)-20)

      objects.forEach((item, index) => {
        item.view?.setBounds({x: 0, y: index * itemHeight, width: mainWindowWidth, height: itemHeight})
        console.log(item.view?.getBounds())
      })
    }

  })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
