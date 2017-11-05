import React, {Component} from 'react';
import { map } from 'lodash';
import './tabs.css';

class Tabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0
    }
  }

  render() {
    return (
      <div className="tab-container">
        <ul className="tabs clearfix" >
          {
            map(this.props.tabs, (tab, index) => (
              <li key={tab.name}
                onClick={() => {
                  this.setState({ activeIndex: index });
                  this.props.onSelect(index);
                }}
                className={index == this.state.activeIndex ? "active" : ""}
                >
                <span>{tab.name}</span>
                <button onClick={() => this.props.onRemove(index)} className="close-tab-button">&times;</button>
              </li>
            ))
          }
        </ul>
        <span className="add-tab-button-container">
          <button onClick={this.props.onAdd} className={this.props.tabs.length <= 15 ? "add-tab-button active" : "add-tab-button disabled"}>&#65291;</button>
        </span>
      </div>
    )
  }
}

export default Tabs;
