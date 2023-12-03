import { app, shell, BrowserWindow, ipcMain, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url)) + '/'

import { GetAuthState, GetForum, GetTopic, Login, SetAuthToken, SetBBData, OpenFile, SaveFile } from './ipc-router'
import { store } from './store'

export let mainWindow: BrowserWindow | null = null
function createWindow(): void {
  // Create the browser window.
  const mainBrowserWindow = new BrowserWindow({
    width: 1020,
    height: 700,
    minWidth: 600,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      nodeIntegration: false,
      contextIsolation: true
    }
  })
  mainWindow = mainBrowserWindow

  mainBrowserWindow.on('ready-to-show', () => {
    mainBrowserWindow.show()
  })

  mainBrowserWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainBrowserWindow.webContents.session.webRequest.onBeforeSendHeaders(
    (details, callback) => {
      callback({ requestHeaders: { Origin: '*', ...details.requestHeaders } })
    },
  )

  mainBrowserWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        'Access-Control-Allow-Origin': ['*'],
        ...details.responseHeaders,
      },
    })
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainBrowserWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainBrowserWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('dev.hloth.sofastgaybrowser')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const isMac = process.platform === 'darwin'
  const template = [
    ...(isMac
      ? [{
        label: app.name,
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      }]
      : []),
    {
      label: 'Пользователь',
      submenu: [
        {
          label: 'Выйти',
          click: () => {
            mainWindow?.webContents.send('logout')
            store.delete('token')
          }
        }
      ]
    },
    { role: 'editMenu' },
    { role: 'viewMenu' },
    { role: 'windowMenu' }
  ]
  // @ts-ignore ...
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  ipcMain.handle('get_auth_state', () => GetAuthState())
  ipcMain.handle('set_auth_token', (_, token: string) => SetAuthToken(token))
  ipcMain.handle('login', (_, username: string, password: string, captcha?: string) => Login(username, password, captcha))
  ipcMain.handle('get_forum', (_, forumID: number, page: number) => GetForum(forumID, page))
  ipcMain.handle('get_topic', (_, topicID: number) => GetTopic(topicID))
  ipcMain.handle('set_bb_data', (_, token: string) => SetBBData(token))
  ipcMain.handle('save_torrent_file', (_, topicId: number) => SaveFile(topicId))
  ipcMain.handle('open_torrent_file', (_, topicId: number) => OpenFile(topicId))

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
