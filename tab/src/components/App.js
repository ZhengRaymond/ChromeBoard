import React, {Component} from 'react';
import "./app.css";

import SplitPane from 'react-split-pane';
import Toolbar from './Toolbar';
import Navigator from './Navigator';
import TeXEditor from './TeXEditor';
import TeXEditor2 from './TeXEditor2';
import Tabs from './Tabs';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tabs: [
        { name: "Tab1" },
        { name: "Tab2 WITH A VERY VERY VERY VERY LONG NAME THAT GOES ON FOR PAGES" },
        { name: "Tab3" },
        { name: "Tab4" }
      ]
    }
    this.addTab = this.addTab.bind(this);
    this.removeTab = this.removeTab.bind(this);
    this.selectTab = this.selectTab.bind(this);
  }

  addTab() {
    var tabs = this.state.tabs.slice();
    const index = tabs.length + 1;
    tabs.push({ name: `Tab${index}` });
    this.setState({ ...this.state, tabs });
  }

  removeTab(index) {
    var tabs = this.state.tabs.slice();
    tabs.splice(index, 1);
    this.setState({ ...this.state, tabs });
  }

  selectTab(index) {
    console.log(`Selected tab #${index}`);
  }

  render() {
    return (
      <div className="flex-vertical">
          <Tabs tabs={this.state.tabs} onAdd={this.addTab} onSelect={this.selectTab} onRemove={this.removeTab} />
          <div>
            <SplitPane split="vertical" defaultSize={200}>
                <Navigator />
                <TeXEditor2 />
            </SplitPane>
          </div>
      </div>
    )
  }
}

export default App;
