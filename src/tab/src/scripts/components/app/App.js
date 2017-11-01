import _ from 'lodash';
import React, {Component} from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import Immutable from 'immutable';
import {
  Editor,
  EditorState,
  Entity,
  AtomicBlockUtils,
  CompositeDecorator,
  RichUtils,
  convertToRaw,
  DefaultDraftBlockRenderMap,
  convertFromRaw
} from 'draft-js';
import style from "./style.css";

const MQ = MathQuill.getInterface(2);

/* REGEX's for decorating */
const INLINE_MATH_REGEX = /[^\ ]\$[\w ]+\$|^\$[\w ]+\$/g;
const BLOCK_MATH_REGEX = /\$\$[\w \r\n]+\$\$/g;
const HEADER_2_REGEX = /[^\#][\#]{2}[\w ]+|^[\#]{2}[\w ]+/g;
const HEADER_1_REGEX = /[\#]{3}[\w ]+/g;
const INLINE_CODE_REGEX = /[^`]{1,2}`[\w ]+`|^`[\w ]+`/g;
const BLOCK_CODE_REGEX = /[`]{3}[\w \r\n]+[`]{3}/g;

/* Components */
const BlockMath = (props) => {
  console.log(props)
  return (
    <div
      data-offset-key={props.offsetKey}
      style={{color: "blue"}}
      >
      {props.children}
    </div>
  )
}

class BlockMathDiv extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div
        className="BlockMathDiv"
        style={{color: "pink"}}
        >
        {this.props.children}
      </div>
    )
  }
}

class InlineMath extends React.Component {


  componentDidMount() {
    var answerSpans = document.getElementsByClassName("mathField");
    console.log(answerSpans);

    _.map(answerSpans, answerSpan => MQ.MathField(answerSpan, {
      handlers: {
        edit: () => {
          var enteredMath = answerSpan.latex();
          checkAnswer(enteredMath);
        }
      }
    }));
  }

  render() {
    return (
      <span
        data-offset-key={this.props.offsetKey}
        style={{color: "red"}}
        className="mathField"
        >
        {this.props.children}
      </span>
    )
  }
}

const Header1 = (props) => {
  console.log(props)
  return (
    <div
      data-offset-key={props.offsetKey}
      style={{fontSize: "36px", color: "purple"}}
      >
      {props.children}
    </div>
  )
}

const Header2 = (props) => {
  return (
    <div
      data-offset-key={props.offsetKey}
      style={{fontSize: "24px", color: "green"}}
      >
      {props.children}
    </div>
  )
}

const BlockCode = (props) => {
  return (
    <div
      data-offset-key={props.offsetKey}
      style={{
        color: "orange",
        fontFamily: "monospace",
        backgroundColor: "#eee",
        padding: "10px",
        borderRadius: "5px",
        margin: "10px",
        border: "solid 3px",
        borderColor: "#ccc #bbb #888 #999"
      }}
      >
      {props.children}
    </div>
  )
}

const InlineCode = (props) => {
  return (
    <span
      data-offset-key={props.offsetKey}
      style={{color: "red", fontFamily: "monospace"}}
      >
      {props.children}
    </span>
  )
}

/* Strategies */
function findStrategy(regex) {
  return (contentBlock, callback, contentState) => findWithRegex(regex, contentBlock, callback)
}

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

const compositeDecorator = new CompositeDecorator([
  {
    strategy: findStrategy(INLINE_MATH_REGEX),
    component: InlineMath,
  },
  {
    strategy: findStrategy(BLOCK_MATH_REGEX),
    component: BlockMathDiv,
  },
  {
    strategy: findStrategy(HEADER_2_REGEX),
    component: Header2,
  },
  {
    strategy: findStrategy(HEADER_1_REGEX),
    component: Header1,
  },
  {
    strategy: findStrategy(INLINE_CODE_REGEX),
    component: InlineCode,
  },
  {
    strategy: findStrategy(BLOCK_CODE_REGEX),
    component: BlockCode,
  },
]);

function getStateWithEntity(editorState, data) {
  const entityKey = Entity.create (type, mutability, data)

  var selection = editorState.getSelection()
  var start = selection.getStartOffset()
  var end = selection.getEndOffset()

  // empty selection hack
  if (start == end) {
    const zws = String.fromCharCode(8203)
    var modifiedContent = Modifier.insertText(
      editorState.getCurrentContent(),
      selection,
      zws,
      null,
      entityKey
    )
    return EditorState.push(editorState, modifiedContent, editorState.getLastChangeType())
  }
  else {
    const editorStateWithEntity = Modifier.applyEntity(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      entityKey
    )
    return EditorState.push(editorState, editorStateWithEntity, 'apply-entity')
  }
}

const blockRenderMap = Immutable.Map({
  'BlockMathDiv': {
    element: 'BlockMathDiv',
  }
})

const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty(compositeDecorator)};
    this.setFocus = ref => ref.focus();
    // this.onChange = (editorState) => this.setState({editorState});
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.viewSelectionState = this.viewSelectionState.bind(this);
  }

  viewSelectionState() {
    const {editorState} = this.state;
    const selectionState = editorState.getSelection();
    var anchorKey = selectionState.getAnchorKey();
    var currentContent = editorState.getCurrentContent();
    var currentContentBlock = currentContent.getBlockForKey(anchorKey);
    console.log("TYPE:", convertToRaw(currentContent));
    // console.log("SELECTION DATA:");
    // console.log(currentContentBlock, currentContentBlock.getText())
    // console.log(selectionState.getAnchorKey(), selectionState.getStartOffset(), selectionState.getEndOffset() )
    console.log("\n\n");
  }

  handleEditorChange(editorState) {
    // const BLOCK_MATH_REGEX = /\$\$[^\$]+\$\$/g;
    // const blockMap = editorState.getCurrentContent().getBlockMap()
    // blockMap.map((block, i) => {
    //   const blockKey = block.getKey()
    //   block.findStyleRanges(
    //     (charMeta) => {
    //       console.log("searching...", charMeta.getEntity())
    //       const entityKey = charMeta.getEntity()
    //       return (entityKey !== null && contentState.getEntity(entityKey).getType() === 'BlockMath')
    //     },
    //     (range, i) => {
    //       console.log("doing");
    //       const start = range.start
    //       const end = range.end
    //
    //       var selection = new SelectionState({
    //         anchorKey: blockKey,  anchorOffset: start,
    //         focusKey: blockKey,   focusOffset: end,
    //       })
    //
    //       const entityKey = block.getEntityAt(start)
    //       if (entityKey == null) {
    //         editorState = getStateWithEntity(editorState, selection, {mathBlock: "true", text: "hello"})
    //       }
    //     }
    //   )
    // })
    this.setState({ editorState })
  }



  render() {
    return (
      <div className={style.horizontal}>
        <div style={{ flex: "2" }}>
          <iframe frameborder="0" width="95%" height="85%" src="https://repl.it/?lite=true"
             style={{ resize: "horizontal" }}/>
        </div>
        <div style={{ width: "1px", color: "grey", height: "100%" }}/>
        <div className={style.vertical}>
          <button onClick={this.insertMathEntity}>insertMathEntity</button>
          <Editor
            editorState={this.state.editorState}
            onChange={this.handleEditorChange}
            blockRenderMap={extendedBlockRenderMap}
            placeholder="Write some notes..."
            ref={this.setFocus}
            />
        </div>
      </div>
    )
  }
}

export default App;







// const Container = styled.div`
//   display: flex;
//   height: 100%;
// `

// const Editor = styled.textarea`
//   width: 100%;
//   height: 100%;
//   padding: 8vw 10vw;
//   overflow: hidden;
//
//   font-size: 18px;
//   border-style: none;
//   line-height: 1.2em;
//   caret-color: rgb(0, 150, 255);
//
//   &:focus {
//     outline: 0;
//   }
// `
// const MathInline = styled.span`
//   background-color: #ddd;
//   padding: 0 5px;
//   margin: 0;
// `
//
// const MathBlock = (props) => {
//   console.log(props)
//   const { blockProps } = props
//   return (
//     <MathInline onChange={() => console.log("changed")}>{blockProps.code}</MathInline>
//   )
// }


// constructor(props) {
//   super(props);
//   this.state = {
//     text: "Hello: $$\\alpha$$"
//   }
//   this.inputHandler = this.inputHandler.bind(this);
// }
//
// componentDidMount() {
//   editor = document.getElementById("editor")
// }
//
// inputHandler(e) {
//   console.log("rerendering...", e.target.value);
//   this.setState({
//     text: e.target.value
//   });
//   setTimeout(() => {
//     renderMathInElement(editor, {
//       ignoredTags: ["script", "noscript", "style", "pre", "code"]
//     });
//   }, 1000);
// }




// {content:{type: plaintext, value:  line1}}
//
// $\lim_{x->\infty} \frac{1}{x} = 0$
// <div style={{fahsdiqwioueyr color: red}}>
//   $ math apples $
// </div>
//
// onChange(editorState):
//     selection = editorState.getSelection()
//     currentBlocks = selection.findRagneofblocks
//     for each block in currentBlocks:
//           reprocess()
//
// reprocess() {
//     within blocks, find all matching regex entities:
//         rerenderEntities()
// {content:{type:entity, value: aQ8df}}
// ___
//
// entityList: {
//     "aQ8df": {
//         type: MathBlock
//         content: "x^2 = \infty"
//         fn: MathQuill.render(content)
// }
