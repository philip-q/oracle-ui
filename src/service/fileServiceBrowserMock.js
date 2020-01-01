import rootDirectoryMock from "./mocks/rootDirectoryMock"
import predictionsMock from "./mocks/predictionsMock"

export const getDirFiles = (path) => {
  return Promise.resolve(rootDirectoryMock);

};

export const readCsvData = (path) => {
  console.log("mock readCsvData");
  return Promise.resolve(predictionsMock)
};


