import React from 'react';
import logo from './logo.svg';
import './App.css';

const remote = window.require("electron").remote;

const fs = remote.require("fs");
// console.log(fs);
// console.log(process.cwd());
//
// fs.stat("./", (err, stat) => {
//   console.log("stat: ", stat);
//   console.log("stat.isFile(): ", stat.isFile());
// });
//
// fs.readdir("./", (err, files) => {
//   console.log("files: ", files);
//   for (let file of files) {
//     console.log(file);
//   }
// });
//
// fs.readFile('.gitignore', (err, fd, three) => {
//   console.log("opened");
//
//   console.log("fd: ", fd);
//   console.log("three: ", three);
//
//   if (err) throw err;
//   fs.close(fd, (err) => {
//     if (err) throw err;
//   });
// });

// 1: Get the list of files in current folder

const scanFiles = () => {
  return new Promise((resolve) => {
    fs.readdir("./", (err, files) => {
      console.log("Found files: ", files);
      for (let file of files) {
        console.log("filename: ", file);
      }
    });
  })
};


class App extends React.Component {

  constructor(props) {
    super(props);
    console.log("Constructor");
    this.state = {
      files: []
    }
  }

  componentDidMount() {
    console.log("componentDidMound");
    scanFiles().then(files => this.setState({files}))
  }

  render() {
    return <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p>
          Edit <code>src/App.js</code> and save to reload. new
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>;
  }
}

export default App;
