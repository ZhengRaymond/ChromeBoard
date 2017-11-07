import React, {Component} from 'react';
import localforage from 'localforage';
import { map, extend } from 'lodash';
import './tabs.css';

class Tabs extends Component {
  constructor(props) {
    super(props);
    /** State:
      *   tabs: [],
      *   documents:
      *     name: 'Untitled 1/NameOfFile',
      *     unsaved: true/false,
      *     raw: 'notes here...',
      *     selection: xxx
      *   activeTab: 0,
      *   selection: 0
      *   untitledCount: 0,
      */
    this.state = {
      tabs: [],
      documents: {},
      activeTab: null,
      selection: null,
      untitledCount: 0
    }
    this.addTab = this.addTab.bind(this);
    this.removeTab = this.removeTab.bind(this);
    this.deleteDocument = this.deleteDocument.bind(this);
    this.selectTab = this.selectTab.bind(this);
    this.loadFromLocal = this.loadFromLocal.bind(this);
  }

  addTab() {
    var untitledCount = this.state.untitledCount + 1;
    var name = `Untitled ${untitledCount}`;
    while (this.state.documents[name]) {
      untitledCount = untitledCount + 1;
      name = `Untitled ${untitledCount}`;
    }
    var newDoc = {
      name,
      unsaved: true,
      raw: '',
      selection: 0
    }

    var tabs = this.state.tabs.slice();
    tabs.push(name);
    var activeTab = tabs.length - 1;
    var documents = { ...this.state.documents, [name]: newDoc }

    // update state:
    this.setState({ tabs, documents, untitledCount, activeTab });

    // update localstorage
    let setters = [
      localforage.setItem(`KEY_${name}`, newDoc),
      localforage.setItem('tabs', tabs),
      localforage.setItem('activeTab', activeTab)
    ]
    Promise.all(setters).catch((err) => console.error("Failed to save new doc, error message: ", err));
  }

  removeTab(event, index) {
    event.stopPropagation();
    var newState = {};

    var docName = this.state.tabs[index];
    if (this.state.documents[docName].unsaved) {
      let proceed = confirm(`${docName} has unsaved changes, closing this will delete them. Proceed deleting anyways?`)
      if (!proceed) return; // cancel
      this.deleteDocument(docName);
    }
    newState.documents = extend({}, this.state.documents, { [docName]: undefined });

    newState.tabs = this.state.tabs.slice();
    // need to switch to new tab context
    console.log("INDEXING:", index, this.state.activeTab, newState.tabs.length)
    var newIndex = -1;
    if (index === this.state.activeTab) {
      if (index < newState.tabs.length - 1) {
        newIndex = index;
      }
      else if (index - 1 >= 0) {
        newIndex = index - 1;
      }
      setTimeout(() => this.selectTab(newIndex), 0);
    }
    else if (index < this.state.activeTab){
      newState.activeTab = this.state.activeTab - 1;
    }

    // update State
    newState.tabs.splice(index, 1);
    this.setState(extend({}, this.state, newState));

    //update state
    localforage.setItem("tabs", newState.tabs);
    console.log("Removal tab state update");
  }

  deleteDocument(docName) {
    // update state if needed
    if (this.state.documents[docName]) {
      let stateExtension = { documents: { [docName]: { unsaved: true }}};
      this.setState(extend({}, this.state, stateExtension));
    }

    // update localstorage
    localforage.getItem(`KEY_${docName}`).then((document) => {
      return [
        localforage.setItem(`DELETED_${docName}`, document),
        localforage.removeItem(`KEY_${docName}`),
      ]
    }).catch((err) =>
      console.error("Failed to delete doc, error message: ", err
    ));
  }

  selectTab(index) {
    var selectedDocument;
    if (index === -1) {
      selectedDocument = null;
    }
    else {
      selectedDocument = this.state.documents[this.state.tabs[index]];
    }

    // update state
    console.log("Selection state update");
    this.setState({
      ...this.state,
      activeTab: index
    });

    // update localforage
    let setters = [
      localforage.setItem('activeTab', index)
    ]
    Promise.all(setters).catch((err) => console.error("Failed to set to localforage, error message: ", err));

    // update editor state
    this.props.switchTabFn(selectedDocument)
  }

  loadFromLocal() {
    localforage.getItem('initialized').then((initialized) => {
      if (!initialized) {
        var newDoc = {
          name: 'Untitled 1',
          unsaved: true,
          raw: ''
        }
        var selection = 0;
        var activeTab = 0;
        var tabs = [ 'Untitled 1' ];
        var untitledCount = 1;

        let setters = [
          localforage.setItem('tabs', tabs),
          localforage.setItem('selection', selection),
          localforage.setItem('activeTab', activeTab),
          localforage.setItem('untitledCount', untitledCount),
          localforage.setItem('KEY_Untitled 1', newDoc),
          localforage.setItem('initialized', true)
        ]

        this.setState({
          activeTab,
          selection,
          documents: { 'Untitled 1': newDoc },
          tabs,
          untitledCount
        });

        return Promise.all(setters);
      }
      else {
        var getters = [
          localforage.getItem('tabs'),
          localforage.getItem('activeTab'),
          localforage.getItem('untitledCount')
        ]
        var newState = {}
        return Promise.all(getters).then((data) => {
          newState.tabs = data[0];
          newState.activeTab = data[1];
          newState.untitledCount = data[2];
          newState.documents = {};
          var fetchTabData = newState.tabs.map((tab) =>
            localforage.getItem(`KEY_${tab}`).then((data) =>
              newState.documents[tab] = data)
          );
          return Promise.all(fetchTabData);
        }).then(() => this.setState(newState));
      }
    }).catch((err) => console.error("LocalForage loading/initialization failure, error message: ", err));
  }

  componentDidMount() {
    this.loadFromLocal();
  }

  render() {
    return (
      <div className="tab-container">
        <ul className="tabs clearfix" >
          {
            map(this.state.tabs, (tab, index) => {
              return (
              <li key={tab}
                onClick={() => this.selectTab(index)}
                className={index === this.state.activeTab ? "active" : ""}
                >
                <span>{tab}</span>
                <button onClick={(event) => this.removeTab(event, index)} className="close-tab-button">&times;</button>
              </li>)
            })
          }
        </ul>
        <span className="add-tab-button-container">
          <button onClick={this.addTab} className={this.state.tabs.length <= 15 ? "add-tab-button active" : "add-tab-button disabled"}>&#65291;</button>
          <button onClick={() => console.log(this.state)} style={{ marginRight: "80px" }} className="add-tab-button active">view state</button>
        </span>
      </div>
    )
  }
}

export default Tabs;
