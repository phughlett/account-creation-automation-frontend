import React, {Component} from 'react'
import {DropzoneArea} from 'material-ui-dropzone'
//https://www.npmjs.com/package/material-ui-dropzone



class DropzoneAreaExample extends Component{
  constructor(props){
    super(props);
    this.state = {
      files: []
    };
  }
  handleChange(files){
    this.setState({
      files: files
    });
  }
  render(){
    return (
      <DropzoneArea
        onChange={this.handleChange.bind(this)}
        />
    )
  }
}

export default DropzoneAreaExample;