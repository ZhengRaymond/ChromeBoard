import React, {Component} from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import classNames from 'classnames';

const Button = styled.button`
  bored-style: none;

  padding: 10px;
  background-color: ${ props => "" + props.colorLight };
  opacity: ${ props => props.active ? 1.0 : 0.3 };

  &:focus {
    outline: 0
  }
`


class ColorPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "black"
    }
    this.clickHandler = this.clickHandler.bind(this)
  }

  clickHandler(color) {
    this.setState({ color })
    this.props.onClick(color);
  }

  render() {
    let colors = [
      {
          name: "black",
          light: "rgba(0, 0, 0, 0.5)"
      },
      {
          name: "red",
          light: "rgba(255, 100, 100, 0.5)"
      },
      {
          name: "blue",
          light: "rgba(0, 100, 255, 0.5)"
      },
      {
          name: "green",
          light: "rgba(0, 255, 100, 0.5)"
      }
    ]
    return (
      <div>
        {
            _.map(colors, (color) => (
              <Button
                color={color.name}
                colorLight={color.light}
                active={color.name === this.state.color}
                onClick={() => this.clickHandler(color.name)}>
                {color.name}
              </Button>
            ))
        }
      </div>
    );
  }
}

export default ColorPicker;
