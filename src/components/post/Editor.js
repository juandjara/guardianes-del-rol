import React, { Component } from 'react';
import ReactQuill from 'react-quill/dist/index';

const editorConfig = {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['link', 'image'],
      ['blockquote', {list: 'ordered'}, {list: 'bullet'}],
      [{header: [1,2,false]}]
    ]
  }
}

class Editor extends Component {
  handleChange = (value, change, source, editor) => {
    if (source === 'user') {
      this.props.onChange(editor.getContents());
    }
  }

  render() {
    return (
      <ReactQuill
        modules={editorConfig.modules}
        value={this.props.value}
        onChange={this.handleChange}
      />
    )
  }
}

export default Editor;
