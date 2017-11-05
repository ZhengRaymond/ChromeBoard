import React, {Component} from 'react';
import styled from 'styled-components';
import {MegadraftEditor, editorStateFromRaw} from "megadraft";

import "./editor.css";

import TeXBlock2 from '../TeXBlock2';

class TeXEditor2 extends Component {
  constructor(props) {
    super(props);
    this.state = {editorState: editorStateFromRaw(null)};
    this.onChange = this.onChange.bind(this);
    // this.setFocus = ref => ref.focus();
    // this._removeTeX = this._removeTeX.bind(this);
    // this._insertTeX = this._insertTeX.bind(this);
    // this._blockRenderer = this._blockRenderer.bind(this);
    // this._handleKeyCommand = this._handleKeyCommand.bind(this);
  }

  // _handleKeyCommand (command, editorState) {
  //   var newState = RichUtils.handleKeyCommand(editorState, command);
  //   if (newState) {
  //     this._onChange(newState);
  //     return true;
  //   }
  //   return false;
  // };
  //
  // _removeTeX(blockKey) {
  //   var {editorState, liveTeXEdits} = this.state;
  //   this.setState({
  //     liveTeXEdits: liveTeXEdits.remove(blockKey),
  //     editorState: removeTeXBlock(editorState, blockKey),
  //   });
  // };
  //
  // _insertTeX() {
  //   this.setState({
  //     liveTeXEdits: Map(),
  //     editorState: insertTeXBlock(this.state.editorState),
  //   });
  // };
  //
  // _blockRenderer(block) {
  //   if (block.getType() === 'atomic') {
  //     return {
  //       component: TeXBlock,
  //       editable: false,
  //       props: {
  //         onStartEdit: (blockKey) => {
  //           var {liveTeXEdits} = this.state;
  //           this.setState({liveTeXEdits: liveTeXEdits.set(blockKey, true)});
  //         },
  //         onFinishEdit: (blockKey, newContentState) => {
  //           var {liveTeXEdits} = this.state;
  //           this.setState({
  //             liveTeXEdits: liveTeXEdits.remove(blockKey),
  //             editorState:EditorState.createWithContent(newContentState),
  //           });
  //         },
  //         onRemove: (blockKey) => this._removeTeX(blockKey),
  //       },
  //     };
  //   }
  //   return null;
  // }
  //
  // onChange(editorState) {
  //   this.setState({ editorState })
  // }

  onChange(editorState) {
      this.setState({editorState});
  }

  render() {
    return (
      <div className="editor-container">
        <Title placeholder="Title" />
        <MegadraftEditor
          editorState={this.state.editorState}
          onChange={this.onChange}
          />
      </div>
    )
  }
  //
  // render() {
  //   return (
  //     <div className="editor-container">
  //       <TeXBlock2 defaultTeX="\infty" onStartEdit={() => null} onFinishEdit={() => null} onRemove={() => null}/>
  //       <Editor
  //         blockRendererFn={this._blockRenderer}
  //         editorState={this.state.editorState}
  //         handleKeyCommand={this._handleKeyCommand}
  //         onChange={this.onChange}
  //         placeholder="Start a document..."
  //         readOnly={this.state.liveTeXEdits.count()}
  //         ref="editor"
  //         spellCheck={true}
  //       />
  //     </div>
  //   )
  // }
}

const Title = styled.input`
  background-color: transparent;
  height: 30px;
  font-size: 25px;
  padding: 2px 10px 10px 10px;
  border: none;
  border-bottom: 1px solid #000;

  &:focus {
    outline: none;
  }
`

export default TeXEditor2;
