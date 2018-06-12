const fs = require('fs');
const mv = require('mv');
const path = require('path');
const rimraf = require('rimraf');
const deasync = require('deasync');
const rimrafSync = deasync(rimraf);
const readdirSync = deasync(fs.readdir);
const mvSync = deasync(mv);

module.exports = (buildPath, electronVersion, platform, arch, callback) => {
  switch (platform) {
    case 'linux':
      breakoutLinux(buildPath, callback);
      break;
    case 'win32':
      breakoutWindows(buildPath, callback);
      break;
    case 'darwin':
    default:
      throw Error(`Application does not support platform ${platform}`);
  }
}

breakoutWindows = (buildPath, callback) => {
  const unzip = require('unzip');
  const filename = 'polyswarmd.zip';
  const app = path.resolve(buildPath);
  const backend = path.resolve(app, 'backend');
  const polyswarmd = path.resolve(app,  'polyswarmd');
  const temp = path.resolve(app, 'temp');


  // Gracefully handle case where user did not add polyswarmd. (Maybe it is a dev environment)
  if (!fs.existsSync(path.resolve(backend, filename))) {
    console.error("Did not find the daemon in backend/. Expecting you to run it separately.");
    callback();
    return;
  }

  rimrafSync(polyswarmd);

  fs.createReadStream(path.resolve(backend, filename))
    .pipe(unzip.Extract({path: temp}))
    .on('close', () => {
      const list = fs.readdirSync(temp);

      list.forEach((f) => {
        mvSync(path.resolve(temp,f), polyswarmd);
        rimrafSync(f);
      })
      rimrafSync(temp);


      if (buildPath.match(/[\\/]tmp/)) {
        rimrafSync(backend)
      }
      callback();
    });
}

breakoutLinux = (buildPath, callback) => {
  const tar = require('tar');
  const tarXSync = deasync(tar.x);

  const filename = 'polyswarmd.tar.gz';
  const app = path.resolve(buildPath);
  const backend = path.resolve(app, 'backend');
  const polyswarmd = path.resolve(app,  'polyswarmd');

  // Gracefully handle case where user did not add polyswarmd. (Maybe it is a dev environment)
  if (!fs.existsSync(path.resolve(backend, filename))) {
    console.error("Did not find the daemon in backend/. Expecting you to run it separately.");
    callback();
    return;
  }

  rimrafSync(polyswarmd);
  fs.mkdirSync(polyswarmd);
  tarXSync({
    file: path.resolve(backend, filename),
    strip: 1,
    C: polyswarmd
  });

  if (buildPath.match(/[\\/]tmp/)) {
    rimrafSync(backend)
  }
  callback()
}
