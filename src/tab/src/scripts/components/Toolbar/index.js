import React, {Component} from 'react';
import styled from 'styled-components';
import ColorPicker from '../ColorPicker'

const Bar = styled.div`
  display: absolute;
  width: 100%;
  background-color: #ddd;
  border-style: none;
  border-bottom-style: solid;
`

class Toolbar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Bar>
        <div>
          <ColorPicker onClick={this.props.onClick}/>
        </div>
      </Bar>
    );
  }
}

export default Toolbar;
