export const getDirFiles = (path) => {
  return new Promise((resolve => {
    switch (path) {
      case "./":
      default:
        resolve(ROOT_ENTRY);
        break;
    }
  }))

};

export const readCsvData = (path) => {
  alert("!!!");
};

const ROOT_ENTRY = [
  {
    "name": ".git",
    "extension": "",
    "size": 4096,
    "modified": new Date(),
    "isDirectory": true
  },
  {
    "name": ".gitignore",
    "extension": "",
    "size": 28,
    "modified": new Date(),
    "isDirectory": false
  },
  {
    "name": ".idea",
    "extension": "",
    "size": 4096,
    "modified": new Date(),
    "isDirectory": true
  },
  {
    "name": "README.md",
    "extension": ".md",
    "size": 2884,
    "modified": new Date(),
    "isDirectory": false
  },
  {
    "name": "node_modules",
    "extension": "",
    "size": 36864,
    "modified": new Date(),
    "isDirectory": true
  },
  {
    "name": "package.json",
    "extension": ".json",
    "size": 1441,
    "modified": new Date(),
    "isDirectory": false
  },
  {
    "name": "public",
    "extension": "",
    "size": 4096,
    "modified": new Date(),
    "isDirectory": true
  },
  {
    "name": "src",
    "extension": "",
    "size": 4096,
    "modified": new Date(),
    "isDirectory": true
  },
  {
    "name": "start.js",
    "extension": ".js",
    "size": 985,
    "modified": new Date(),
    "isDirectory": false
  },
  {
    "name": "tsconfig.json",
    "extension": ".json",
    "size": 491,
    "modified": new Date(),
    "isDirectory": false
  },
  {
    "name": "yarn.lock",
    "extension": ".lock",
    "size": 511924,
    "modified": new Date(),
    "isDirectory": false
  }
];

