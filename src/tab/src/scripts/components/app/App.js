import React, {Component} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';
import Toolbar from 'components/Toolbar'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
  width: 100%;
  height: 100%;
`

const Editor = styled.textarea`
  width: 100%;
  height: 100%;
  padding: 50px 20%;

  line-height: 1.2em;
  padding: 20px;
  caret-color: rgb(0, 150, 255);

  &:focus {
    outline: 0;
  }
`

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "black"
    }
    this.changeColor = this.changeColor.bind(this);
  }

  changeColor(color) {
    this.setState({
      ...this.state,
      color
    })
  }

  render() {
    var text = "Hello: $\\alpha$"
    return (
      <Container>
        {this.color}
        <Editor autoFocus={true} styled={{}}>
          {text}
        </Editor>
      </Container>
    );
  }
}

export default App;
