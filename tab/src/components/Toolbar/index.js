import { map } from "lodash";
import React, {Component} from 'react';

class Toolbar extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        Toolbar
        {
          map(props.tools, (handler, toolName) => {
            return (
              <button key={toolName} onClick={handler}>{toolName}</button>
            )
          })
        }
      </div>
    )
  }
}

export default Toolbar;
