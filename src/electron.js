import { app, BrowserWindow } from 'electron';
import installExtension, {
  REACT_DEVELOPER_TOOLS
} from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';
import { spawn } from 'child_process';
import ps from 'ps-node';
import config from './config';
import path from 'path';

if (require('electron-squirrel-startup')) app.quit();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let pid;

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) enableLiveReload({ strategy: 'react-hmr' });

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    show: false,
    width: 1400,
    height: 800,
    icon: path.resolve(__dirname, '..', 'public', 'favicon.ico')
  });

  // Open the DevTools.
  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
  }

  mainWindow.on('close', e => {
    if (pid != null) {
      e.preventDefault();
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', pid, '/F', '/T']);
        pid = null;
        mainWindow.close();
      } else {
        ps.kill(pid, () => {
          pid = null;
          mainWindow.close();
        });
      }
    }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.reload();
    mainWindow.show();
  });

  // and load the index.html of the app.
  const file = path.resolve(__dirname, '..', 'public', 'index.html');
  mainWindow.loadURL(`file:${file}`);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
  startBackend(process.platform).then(p => {
    pid = p;
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
const startBackend = platform => {
  return new Promise(resolve => {
    const spawnOptions = {
      detached: true,
      cwd: path.resolve(`${__dirname}`, '..', `${config.daemon}/`),
      env: process.env,
      stdio: 'inherit'
    };
    let command;
    const args = [];
    switch (platform) {
    case 'win32':
      command = 'cmd';
      args.push('/K');
      args.push('polyswarmd.exe');
      break;
    case 'linux':
      command = './polyswarmd';
      break;
    case 'darwin':
    default:
      throw Error(`Application does not support platform ${platform}`);
    }

    const daemon = spawn(command, args, spawnOptions);
    resolve(daemon.pid);
  });
};
