import React from 'react';
import './App.scss';
import {FileBrowser} from "./components/FileBrowser";

class App extends React.Component {

  render() {
    return <div className="App">
      <FileBrowser/>
    </div>;
  }
}

export default App;
