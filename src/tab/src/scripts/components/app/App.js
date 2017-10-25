import React, {Component} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';
import Toolbar from '../Toolbar'

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

  &:focus {
    outline: 0;
  }
`

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: `<span color="black">Hello: $\\alpha$`
    }
    this.changeColor = this.changeColor.bind(this);
  }

  changeColor(color) {
    this.setState({
      text: `${this.state.text}</span><span color=${color}>`
    })
  }

  render() {
    var text = ""
    return (
      <div>
        <Toolbar onClick={this.changeColor}/>
        <Container>
          <Editor autoFocus={true} style={{"caretColor": this.state.color, "color": this.state.color}}>
            {this.state.text }
          </Editor>
        </Container>
      </div>
    );
  }
}

export default App;
