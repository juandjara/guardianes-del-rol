import React, { Component } from 'react';
import ReactQuill, { Quill } from 'react-quill/dist/index';
import ImageUpload from 'quill-plugin-image-upload';
import ImageResize from 'quill-image-resize';
import slugg from 'slugg';
import { storage } from '../../firebase';

Quill.register('modules/imageUpload', ImageUpload);
Quill.register('modules/imageResize', ImageResize);

const editorConfig = {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['link', 'image'],
      ['blockquote', {list: 'ordered'}, {list: 'bullet'}],
      [{header: [1,2,false]}]
    ],
    imageUpload: {
      upload: file => {
        const fileRef = `editor_files/${Date.now()}_${slugg(file.name)}`;
        return storage.child(fileRef).put(file, {contentType: file.type})
        .then(snapshot => snapshot.ref.getDownloadURL())
      }
    },
    imageResize: {
      modules: ['Resize', 'DisplaySize']
    }
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
