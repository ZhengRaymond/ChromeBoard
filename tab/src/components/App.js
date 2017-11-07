import React, {Component} from 'react';
import "./app.css";
import localforage from 'localforage';

import SplitPane from 'react-split-pane';
import Navigator from './Navigator';
import TeXEditor from './TeXEditor';
import Tabs from './Tabs';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentTab: null
    }
    this.switchTabFn = this.switchTabFn.bind(this);
  }

  switchTabFn(tab) {
    console.log("Editor switching to tab:", tab);
  }

  render() {
    return (
      <div>
        <button onClick={() => localforage.keys().then((value) => console.log("forager:", value))}>View LocalForage Keys</button>
        <button onClick={() => {
          var fn = (key) => localforage.getItem(key).then((data) => console.log(key, data));
          fn('initialized');
          fn('tabs');
        }}>Get LocalForage State</button>
        <button onClick={() => localforage.setItem('initialized', false)} style={{color: "red"}}>RESET LocalForage</button>
        <button onClick={() => localforage.clear()} style={{color: "red"}}>DELETE LOCALFORAGE</button>
        <div className="flex-vertical">
            <Tabs switchTabFn={this.switchTabFn} />
            <div>
              <SplitPane split="vertical" defaultSize={200}>
                  <Navigator />
                  <TeXEditor />
              </SplitPane>
            </div>
        </div>
      </div>
    )
  }
}

export default App;
