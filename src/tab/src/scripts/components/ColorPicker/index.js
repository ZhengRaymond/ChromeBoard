import React, {Component} from 'react';
import styled from 'styled-components';

const Button = styled.div`
  bored-style: none;
  background-color: #fff;
  padding: 10px;

  &:active {
    background-color: #ddd;
  }
`


class ColorPicker extends Component {
  render() {
    return (
      <Button color={this.props.color} onClick={() => this.props.onClick(this.props.color)}/>
    );
  }
}

export default ColorPicker;
