import React, { Component } from 'react';
import _ from 'lodash';
var classNames = require('classnames');

class InputError extends Component {

	state = {
		message: 'Input is invalid'
    };

	constructor(props) {
		super(props);
	}
	
  render() { 
    var errorClass = classNames({
      'error_container':   true,
      'visible':           this.props.visible,
      'invisible':         !this.props.visible
    });

    return (
      <div className={errorClass}>
        <span>{this.props.errorMessage}</span>
      </div>
    )
  }

}

export default InputError;