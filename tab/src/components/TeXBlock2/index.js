

/**
 * Copyright (c) 2013-present, Facebook, Inc. All rights reserved.
 *
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict';

import katex from 'katex';
import React from 'react';
import style from "./style.css";

class KatexOutput extends React.Component {
  constructor(props) {
    super(props);
    this._timer = null;
  }

  _update() {
    if (this._timer) {
      clearTimeout(this._timer);
    }

    this._timer = setTimeout(() => {
      katex.render(
        this.props.content,
        this.refs.container,
        {displayMode: true},
      );
    }, 0);
  }

  componentDidMount() {
    this._update();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.content !== this.props.content) {
      this._update();
    }
  }

  componentWillUnmount() {
    clearTimeout(this._timer);
    this._timer = null;
  }

  render() {
    return <div ref="container" onClick={this.props.onClick} />;
  }
}

export default class TeXBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      texValue: this.props.defaultTeX || ""
    };

    this._onClick = () => {
      if (this.state.editMode) {
        return;
      }

      this.setState({
        ...this.state,
        editMode: true,
      })
    };

    this._onValueChange = evt => {
      var value = evt.target.value;
      var invalid = false;
      try {
        katex.__parse(value);
      } catch (e) {
        invalid = true;
      } finally {
        this.setState({
          invalidTeX: invalid,
          texValue: value,
        });
      }
    };

    this._save = () => {
      this.setState({
        ...this.state,
        invalidTeX: false,
        editMode: false,
      });
    };

    this._remove = () => {
      // this.props.blockProps.onRemove(this.props.block.getKey());
    };
  }

  render() {
    var texContent = null;

    if (this.state.editMode && this.state.invalidTeX) {
      texContent = '';
    } else {
      texContent = this.state.texValue;
    }

    var className = this.state.editMode ? "TeX activeTeX" : "TeX";

    var editPanel = null;
    if (this.state.editMode) {
      var buttonClass = this.state.invalidTeX ? "invalidButton" : "saveButton";

      editPanel =
        <div className="panel">
          <textarea
            className="value"
            onChange={this._onValueChange}
            ref="textarea"
            value={this.state.texValue}
          />
          <div className="menu">
            <button
              className={buttonClass}
              disabled={this.state.invalidTeX}
              onClick={this._save}>
              {this.state.invalidTeX ? 'Invalid TeX' : 'Done'}
            </button>
            <button className="removeButton" onClick={this._remove}>
              Remove
            </button>
          </div>
        </div>;
    }

    return (
      <div className={className}>
        <KatexOutput content={texContent} onClick={this._onClick} />
        {editPanel}
      </div>
    );
  }
}
