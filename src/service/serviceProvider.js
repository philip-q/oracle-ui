const isElectronApp = () => {
  return !!(window && window.process && window.process.type)
};

let file_service = null;

const getFileService = () => {
  if (file_service) {
    return Promise.resolve(file_service);
  } else {
    if (isElectronApp()) {
      return import("./fileService").then((fs) => {
        console.log("Imported real file service.");
        file_service = fs;
        return Promise.resolve(fs);
      })
    } else {
      return import("./fileServiceBrowserMock").then((mockfs) => {
        console.log("Imported mock file service.");
        file_service = mockfs;
        return Promise.resolve(mockfs);
      })
    }
  }
};

export const getDirFiles = (path) => {
  return getFileService().then(fs => fs.getDirFiles(path));
};

