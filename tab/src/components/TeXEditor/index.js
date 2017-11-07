import React, {Component} from 'react';
import {Map} from 'immutable';
import {EditorState, RichUtils} from 'draft-js';
import Editor, { composeDecorators } from 'draft-js-plugins-editor';

import 'draft-js-inline-toolbar-plugin/lib/plugin.css';
import "./editor.css";

import TeXBlock from '../TeXBlock';
import TeXBlock2 from '../TeXBlock2';
import {insertTeXBlock} from './modifiers/insertTeXBlock';
import {removeTeXBlock} from './modifiers/removeTeXBlock';

import Toolbar from '../Toolbar';

/* PLUGINS: */
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
// import createMarkdownShortcutsPlugin from '../../markdownPlugin';
// import createImagePlugin from 'draft-js-image-plugin';
// import createAlignmentPlugin from 'draft-js-alignment-plugin';
// import createDragNDropUploadPlugin from 'draft-js-drag-n-drop-upload-plugin';

const inlineToolbarPlugin = createInlineToolbarPlugin();
const { InlineToolbar } = inlineToolbarPlugin;
const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
// const markdownShortcutsPlugin = createMarkdownShortcutsPlugin();
// const alignmentPlugin = createAlignmentPlugin();
// const { AlignmentTool } = alignmentPlugin;
// const imagePlugin = createImagePlugin({ decorator });
// const dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
//   handleUpload: mockUpload,
//   addImage: imagePlugin.addImage,
// });

const decorator = composeDecorators(
  resizeablePlugin.decorator,
  focusPlugin.decorator,
  blockDndPlugin.decorator
  // alignmentPlugin.decorator,
);

const plugins = [
  blockDndPlugin,
  focusPlugin,
  resizeablePlugin,
  inlineToolbarPlugin
  // markdownShortcutsPlugin,
  // imagePlugin,
  // dragNDropFileUploadPlugin,
  // alignmentPlugin,
];

class TeXEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      liveTeXEdits: Map(),
    };
    this.setFocus = ref => ref.focus();
    this.onChange = this.onChange.bind(this);
    this._removeTeX = this._removeTeX.bind(this);
    this._insertTeX = this._insertTeX.bind(this);
    this._blockRenderer = this._blockRenderer.bind(this);
    this._handleKeyCommand = this._handleKeyCommand.bind(this);
    this._toggleBlockType = this._toggleBlockType.bind(this);
    this._toggleInlineStyle = this._toggleInlineStyle.bind(this);
  }

  _handleKeyCommand (command, editorState) {
    var newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this._onChange(newState);
      return true;
    }
    return false;
  };

  _removeTeX(blockKey) {
    var {editorState, liveTeXEdits} = this.state;
    this.setState({
      liveTeXEdits: liveTeXEdits.remove(blockKey),
      editorState: removeTeXBlock(editorState, blockKey),
    });
  };

  _insertTeX() {
    this.setState({
      liveTeXEdits: Map(),
      editorState: insertTeXBlock(this.state.editorState),
    });
  };

  _blockRenderer(block) {
    if (block.getType() === 'atomic') {
      return {
        component: TeXBlock,
        editable: false,
        props: {
          onStartEdit: (blockKey) => {
            var {liveTeXEdits} = this.state;
            this.setState({liveTeXEdits: liveTeXEdits.set(blockKey, true)});
          },
          onFinishEdit: (blockKey, newContentState) => {
            var {liveTeXEdits} = this.state;
            this.setState({
              liveTeXEdits: liveTeXEdits.remove(blockKey),
              editorState:EditorState.createWithContent(newContentState),
            });
          },
          onRemove: (blockKey) => this._removeTeX(blockKey),
        },
      };
    }
    return null;
  }

  onChange(editorState) {
    this.setState({ editorState })
  }

  _toggleBlockType(blockType) {
    if (blockType === 'math-block') {

    }
    else if (blockType === 'custom-code-block') {

    }
    // else {
      this.onChange(
        RichUtils.toggleBlockType(
          this.state.editorState,
          blockType
        )
      );
    // }
  }

  _toggleInlineStyle(inlineStyle) {
    if (inlineStyle === 'MATH') {

    }
    // else {
      this.onChange(
        RichUtils.toggleInlineStyle(
          this.state.editorState,
          inlineStyle
        )
      );
    // }
  }

  render() {
    // <TeXBlock2 defaultTeX="\infty" onStartEdit={() => null} onFinishEdit={() => null} onRemove={() => null}/>
    return (
      <div className="editor-container">
        <Toolbar
          toggleInlineStyle={this._toggleInlineStyle}
          toggleBlockType={this._toggleBlockType}
          editorState={this.state.editorState}
          />
        <Editor
          blockRendererFn={this._blockRenderer}
          editorState={this.state.editorState}
          handleKeyCommand={this._handleKeyCommand}
          onChange={this.onChange}
          placeholder="Start a document..."
          plugins={plugins}
          readOnly={this.state.liveTeXEdits.count()}
          ref="editor"
        />
        <InlineToolbar />
      </div>
    )
  }
}

export default TeXEditor;
