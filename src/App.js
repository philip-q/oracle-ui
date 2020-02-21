import React from 'react';
import {Provider} from "react-redux";
import './App.scss';
import {FileBrowser} from "./components/FileBrowser";
import store from "./store/store";
import OpenedFiles from "./components/OpenedFiles";

class App extends React.Component {

  render() {
    return <Provider store={store}>
      <div className="App">
        <FileBrowser/>
        <OpenedFiles/>
      </div>
    </Provider>
  }
}

export default App;
