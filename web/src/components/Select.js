import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import PropTypes from 'prop-types';
import InputError from './InputError.js';

var classes = function classNames() {
  var args = arguments;
  var classes = [];

  for (var i = 0; i < args.length; i++) {
      var arg = args[i];
      if (arg == null) {
          continue;
      }

      if ('string' === typeof arg) {
          classes.push(arg);
      } else if ('object' === typeof arg) {
          for (var key in arg) {
              if (!arg.hasOwnProperty(key) || !arg[key]) {
                  continue;
              }
              classes.push(key);
          }
      }
  }
  return classes.join(' ');
}

var requestId = 0;

var sizerStyle = { position: 'absolute', visibility: 'hidden', height: 0, width: 200, overflow: 'scroll', whiteSpace: 'nowrap' };

class Input extends Component {

	_ismounted = false;
  displayName = 'AutosizeInput';

  static propTypes = {
	    value: PropTypes.any,                 // field value
	    defaultValue: PropTypes.any,          // default field value
	    onChange: PropTypes.func,             // onChange handler: function(newValue) {}
	    style: PropTypes.object,              // css styles for the outer element
	    className: PropTypes.string,          // className for the outer element
	    inputStyle: PropTypes.object,         // css styles for the input element
	    inputClassName: PropTypes.string      // className for the input element
	  }
  
  state = {
	  inputWidth: 1
  }
  
  constructor(props) {
	  super(props);
	  
	  //this.props.minWidth = 1;
	  
	  this.setState({
		  inputWidth: this.props.minWidth
	  });

	  this.updateInputWidth = this.updateInputWidth.bind(this);
	  this.getInput = this.getInput.bind(this);
	  this.focus = this.focus.bind(this);
	  this.select = this.select.bind(this);
	  
  }
  
  componentDidMount() {
	  this._ismounted = true;
    this.copyInputStyles();
    this.updateInputWidth();
  }
  
  componentDidUpdate() {
    this.updateInputWidth();
  }
  
  copyInputStyles() {
    if (!this._ismounted || !window.getComputedStyle) {
      return;
    }
    var inputStyle = window.getComputedStyle(ReactDOM.findDOMNode(this.refs.input));
    var widthNode = ReactDOM.findDOMNode(this.refs.sizer);
    widthNode.style.fontSize = inputStyle.fontSize;
    widthNode.style.fontFamily = inputStyle.fontFamily;
  }
  
  updateInputWidth() {
    if (!this._ismounted) {
      return;
    }
    var newInputWidth = ReactDOM.findDOMNode(this.refs.sizer).scrollWidth + 2;
    if (newInputWidth < this.props.minWidth) {
      newInputWidth = this.props.minWidth;
    }
    if (newInputWidth !== this.state.inputWidth) {
      this.setState({
        inputWidth: newInputWidth
      });
    }
  }
  
  getInput() {
    return this.refs.input;
  }
  
  focus() {
	ReactDOM.findDOMNode(this.refs.input).focus();
  }
  
  select() {
	ReactDOM.findDOMNode(this.refs.input).select();
  }
  
  render() {
    
    var nbspValue = (this.props.value || '').replace(/ /g, '&nbsp;');
    
    var wrapperStyle = this.props.style || {};
    wrapperStyle.display = 'inline-block';
    
    var inputStyle = this.props.inputStyle || {};
    inputStyle.width = this.state.inputWidth;
    
    return (
      <div className={this.props.className} style={wrapperStyle}>
        <input {...this.props} ref="input" className={this.props.inputClassName} style={inputStyle} />
        <div ref="sizer" style={sizerStyle} dangerouslySetInnerHTML={{ __html: nbspValue }} />
      </div>
    );
    
  }
  
}

class Value extends Component {

  displayName = 'Value';
  
  static propTypes = {
    label: PropTypes.string.isRequired
  }
  
  blockEvent(event) {
    event.stopPropagation();
  }
  
  render() {
    return (
      <div className="Select-item">
        <span className="Select-item-icon" onMouseDown={this.blockEvent} onClick={this.props.onRemove} onTouchEnd={this.props.onRemove}>&times;</span>
        <span className="Select-item-label">{this.props.label}</span>
      </div>
    );
  }
  
}

class Select extends Component {

  displayName = 'Select';

  static propTypes = {
    value: PropTypes.any,                // initial field value
    multi: PropTypes.bool,               // multi-value input
    options: PropTypes.array,            // array of options
    delimiter: PropTypes.string,         // delimiter to use to join multiple values
    asyncOptions: PropTypes.func,        // function to call to get options
    autoload: PropTypes.bool,            // whether to auto-load the default async options set
    placeholder: PropTypes.string,       // field placeholder, displayed when there's no value
    placeholderTitle: PropTypes.string,       // field placeholder, displayed when there's no value
    noResultsText: PropTypes.string,     // placeholder displayed when there are no matching search results
    clearable: PropTypes.bool,           // should it be possible to reset value
    clearValueText: PropTypes.string,    // title for the "clear" control
    clearAllText: PropTypes.string,      // title for the "clear" control when multi: true
    searchable: PropTypes.bool,          // whether to enable searching feature or not
    searchPromptText: PropTypes.string,  // label to prompt for search input
    name: PropTypes.string,              // field name, for hidden <input /> tag
    onChange: PropTypes.func,            // onChange handler: function(newValue) {}
    className: PropTypes.string,         // className for the outer element
    filterOption: PropTypes.func,        // method to filter a single option: function(option, filterString)
    filterOptions: PropTypes.func,       // method to filter the options array: function([options], filterString, [values])
    matchPos: PropTypes.string,          // (any|start) match the start or entire string when filtering
    matchProp: PropTypes.string,         // (any|label|value) which option property to filter on
    errorMessage: PropTypes.string,
    errorVisible: PropTypes.bool
  }
  
  state = {
	  options: [],
  }

  constructor(props) {
	super(props);
		
    this.setState({
      /*
       * set by getStateFromValue on componentWillMount:
       * - value
       * - values
       * - filteredOptions
       * - inputValue
       * - placeholder
       * - focusedOption
      */
      options: this.props.options,
      isFocused: false,
      isOpen: false,
      isLoading: false,
      errorVisible: false,
      errorMessage: this.props.errorMessage
    });
    
    this.filterOptions = this.filterOptions.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    
  }

  componentWillMount() {
    this._optionsCache = {};
    this._optionsFilterString = '';
    this.setState(this.getStateFromValue(this.props.value));

    if (this.props.asyncOptions && this.props.autoload) {
      this.autoloadAsyncOptions();
    }
  }

  componentWillUnmount() {
    clearTimeout(this._blurTimeout);
    clearTimeout(this._focusTimeout);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.value !== this.state.value) {
      this.setState(this.getStateFromValue(newProps.value, newProps.options));
    }
    if (JSON.stringify(newProps.options) !== JSON.stringify(this.props.options)) {
      this.setState({
        options: newProps.options,
        filteredOptions: this.filterOptions(newProps.options)
      });
    }

    this.setState({
      errorVisible: false
    })
  }

  componentDidUpdate() {
    if (this._focusAfterUpdate) {
      clearTimeout(this._blurTimeout);
      this._focusTimeout = setTimeout(function() {
        this.getInputNode().focus();
        this._focusAfterUpdate = false;
      }.bind(this), 50);
    }

    if (this._focusedOptionReveal) {
      if (this.refs.focused && this.refs.menu) {
        var focusedDOM = this.refs.focused.getDOMNode();
        var menuDOM = this.refs.menu.getDOMNode();
        var focusedRect = focusedDOM.getBoundingClientRect();
        var menuRect = menuDOM.getBoundingClientRect();

        if (focusedRect.bottom > menuRect.bottom ||
          focusedRect.top < menuRect.top) {
          menuDOM.scrollTop = (focusedDOM.offsetTop + focusedDOM.clientHeight - menuDOM.offsetHeight);
        }
      }

      this._focusedOptionReveal = false;
    }
  }

  getStateFromValue(value, options) {

    if (!options) {
      options = this.state.options;
    }

    // reset internal filter string
    this._optionsFilterString = '';

    var values = this.initValuesArray(value, options),
      filteredOptions = this.filterOptions(options, values);

    return {
      value: values.map(function(v) { return v.value; }).join(this.props.delimiter),
      values: values,
      inputValue: '',
      filteredOptions: filteredOptions,
      placeholder: !this.props.multi && values.length ? values[0].label : this.props.placeholder,
      focusedOption: !this.props.multi && values.length ? values[0] : filteredOptions[0],
      placeholderTitle: this.props.placeholderTitle,
    };

  }

  initValuesArray(values, options) {

    if (!Array.isArray(values)) {
      if ('string' === typeof values) {
        values = values.split(this.props.delimiter);
      } else {
        values = values ? [values] : [];
      }
    }

    return values.map(function(val) {
      return ('string' === typeof val) ? val = _.findWhere(options, { value: val }) || { value: val, label: val } : val;
    }.bind(this));

  }

  setValue(value) {
    this._focusAfterUpdate = true;
    var newState = this.getStateFromValue(value);
    newState.isOpen = false;
    this.fireChangeEvent(newState);
    this.setState(newState);

    // hide error message
    this.setState({
      errorVisible: false
    });
  }

  selectValue(value) {
    if (!this.props.multi) {
      this.setValue(value);
    } else if (value) {
      this.addValue(value);
    }
  }

  addValue(value) {
    this.setValue(this.state.values.concat(value));
  }

  popValue() {
    this.setValue(_.initial(this.state.values));
  }

  removeValue(value) {
    this.setValue(_.without(this.state.values, value));
  }

  clearValue(event) {
    // if the event was triggered by a mousedown and not the primary
    // button, ignore it.
    if (event && event.type == 'mousedown' && event.button !== 0) {
      return;
    }
    this.setValue(null);
  }

  resetValue() {
    this.setValue(this.state.value);
  }

  getInputNode() {
    var input = this.refs.input;
    return this.props.searchable ? input : input.getDOMNode();
  }

  fireChangeEvent(newState) {
    if (newState.value !== this.state.value && this.props.onChange) {
      this.props.onChange(newState.value, newState.values);
    }
  }

  handleMouseDown(event) {
    // if the event was triggered by a mousedown and not the primary
    // button, ignore it.
    if (event.type == 'mousedown' && event.button !== 0) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    if (this.state.isFocused) {
      this.setState({
        isOpen: true
      });
    } else {
      this._openAfterFocus = true;
      this.getInputNode().focus();
    }
  }

  handleInputFocus() {
    this.setState({
      isFocused: true,
      isOpen: this.state.isOpen || this._openAfterFocus
    });
    this._openAfterFocus = false;
  }

  handleInputBlur(event) {
    this._blurTimeout = setTimeout(function() {
      if (this._focusAfterUpdate) return;
      this.setState({
        isOpen: false,
        isFocused: false
      });

      if(_.isEmpty(this.state.value)) {
        this.setState({
          errorMessage: this.props.errorMessage,
          errorVisible: true
        });
      } else {
        this.setState({
          errorVisible: false
        });
      }
    }.bind(this), 50);
  }

  handleKeyDown(event) {

    switch (event.keyCode) {

      case 8: // backspace
        if (!this.state.inputValue) {
          this.popValue();
        }
        return;
      break;

      case 9: // tab
        if (event.shiftKey || !this.state.isOpen || !this.state.focusedOption) {
          return;
        }
        this.selectFocusedOption();
      break;

      case 13: // enter
        this.selectFocusedOption();
      break;

      case 27: // escape
        if (this.state.isOpen) {
          this.resetValue();
        } else {
          this.clearValue();
        }
      break;

      case 38: // up
        this.focusPreviousOption();
      break;

      case 40: // down
        this.focusNextOption();
      break;

      default: return;
    }

    event.preventDefault();

  }

  handleInputChange(event) {

    // assign an internal variable because we need to use
    // the latest value before setState() has completed.
    this._optionsFilterString = event.target.value;

    if (this.props.asyncOptions) {
      this.setState({
        isLoading: true,
        inputValue: event.target.value
      });
      this.loadAsyncOptions(event.target.value, {
        isLoading: false,
        isOpen: true
      });
    } else {
      var filteredOptions = this.filterOptions(this.state.options);
      this.setState({
        isOpen: true,
        inputValue: event.target.value,
        filteredOptions: filteredOptions,
        focusedOption: _.includes(filteredOptions, this.state.focusedOption) ? this.state.focusedOption : filteredOptions[0]
      });
    }

  }

  autoloadAsyncOptions() {
    this.loadAsyncOptions('', {}, function() {});
  }

  loadAsyncOptions(input, state) {

    for (var i = 0; i <= input.length; i++) {
      var cacheKey = input.slice(0, i);
      if (this._optionsCache[cacheKey] && (input === cacheKey || this._optionsCache[cacheKey].complete)) {
        var options = this._optionsCache[cacheKey].options;
        this.setState(_.extend({
          options: options,
          filteredOptions: this.filterOptions(options)
        }, state));
        return;
      }
    }

    var thisRequestId = this._currentRequestId = requestId++;

    this.props.asyncOptions(input, function(err, data) {

      this._optionsCache[input] = data;

      if (thisRequestId !== this._currentRequestId) {
        return;
      }

      this.setState(_.extend({
        options: data.options,
        filteredOptions: this.filterOptions(data.options)
      }, state));

    }.bind(this));

  }

  filterOptions(options, values) {
    if (!this.props.searchable) {
      return options;
    }

    var filterValue = this._optionsFilterString;
    var exclude = (values || this.state.values).map(function(i) {
      return i.value;
    });
    if (this.props.filterOptions) {
      return this.props.filterOptions.call(this, options, filterValue, exclude);
    } else {
      var filterOption = function(op) {
    	  if (this.props.multi && _.contains(exclude, op)) return false;
          if (this.props.filterOption) return this.props.filterOption.call(this, op, filterValue);
          return !filterValue || (this.props.matchPos === 'start') ? (
            (this.props.matchProp !== op.toLowerCase().substr(0, filterValue.length) === filterValue)
          ) : (
            (this.props.matchProp !== op.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0)
          );
//        if (this.props.multi && _.contains(exclude, op.value)) return false;
//        if (this.props.filterOption) return this.props.filterOption.call(this, op, filterValue);
//        return !filterValue || (this.props.matchPos === 'start') ? (
//          (this.props.matchProp !== 'label' && op.value.toLowerCase().substr(0, filterValue.length) === filterValue) ||
//          (this.props.matchProp !== 'value' && op.label.toLowerCase().substr(0, filterValue.length) === filterValue)
//        ) : (
//          (this.props.matchProp !== 'label' && op.value.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0) ||
//          (this.props.matchProp !== 'value' && op.label.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0)
//        );
      };
      filterOption = filterOption.bind(this);
      return _.filter(options, filterOption, this);
    }
  }

  selectFocusedOption() {
    return this.selectValue(this.state.focusedOption);
  }

  focusOption(op) {
    this.setState({
      focusedOption: op
    });
  }

  focusNextOption() {
    this.focusAdjacentOption('next');
  }

  focusPreviousOption() {
    this.focusAdjacentOption('previous');
  }

  focusAdjacentOption(dir) {
    this._focusedOptionReveal = true;

    var ops = this.state.filteredOptions;

    if (!this.state.isOpen) {
      this.setState({
        isOpen: true,
        inputValue: '',
        focusedOption: this.state.focusedOption || ops[dir === 'next' ? 0 : ops.length - 1]
      });
      return;
    }

    if (!ops.length) {
      return;
    }

    var focusedIndex = -1;

    for (var i = 0; i < ops.length; i++) {
      if (this.state.focusedOption === ops[i]) {
        focusedIndex = i;
        break;
      }
    }

    var focusedOption = ops[0];

    if (dir === 'next' && focusedIndex > -1 && focusedIndex < ops.length - 1) {
      focusedOption = ops[focusedIndex + 1];
    } else if (dir === 'previous') {
      if (focusedIndex > 0) {
        focusedOption = ops[focusedIndex - 1];
      } else {
        focusedOption = ops[ops.length - 1];
      }
    }

    this.setState({
      focusedOption: focusedOption
    });

  }

  unfocusOption(op) {
    if (this.state.focusedOption === op) {
      this.setState({
        focusedOption: null
      });
    }
  }

  buildMenu() {

    var focusedValue = this.state.focusedOption ? this.state.focusedOption.value : null;

    var ops = _.map(this.state.filteredOptions, function(op) {
      var isFocused = focusedValue === op.value;

      var optionClass = classes({
        'Select-option': true,
        'is-focused': isFocused
      });

      var ref = isFocused ? 'focused' : null;

      var mouseEnter = this.focusOption.bind(this, op),
        mouseLeave = this.unfocusOption.bind(this, op),
        mouseDown = this.selectValue.bind(this, op);

      return <div ref={ref} key={'option-' + op.value} className={optionClass} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} onClick={mouseDown}>{op.label}</div>;

    }, this);

    return ops.length ? ops : (
      <div className="Select-noresults">
        {this.props.asyncOptions && !this.state.inputValue ? this.props.searchPromptText : this.props.noResultsText}
      </div>
    );

  }

  isValid() {
    if(_.isEmpty(this.state.value)) {
      this.setState({
        valid: false,
        errorVisible: true
      });
    }
  }

  render() {

    var selectClass = classes('Select', this.props.className, {
      'is-multi': this.props.multi,
      'is-searchable': this.props.searchable,
      'is-open': this.state.isOpen,
      'is-focused': this.state.isFocused,
      'is-loading': this.state.isLoading,
      'has-value': this.state.value
    });

    var value = [];

    if (this.props.multi) {
      this.state.values.forEach(function(val) {
        var props = _.extend({
          key: val.value,
          onRemove: this.removeValue.bind(this, val)
        }, val);
        value.push(<Value {...props} />);
      }, this);
    }

    if (!this.state.inputValue && (!this.props.multi || !value.length)) {
      value.push(<div className="Select-actual-placeholder" key="placeholderTitle">{this.state.placeholderTitle}</div>);
      value.push(<div className="Select-placeholder" key="placeholder">{this.state.placeholder}</div>);
    } else if (this.state.inputValue) {
      value.push(<div className="Select-actual-placeholder" key="placeholderTitle">{this.state.placeholderTitle}</div>);
    }

    var loading = this.state.isLoading ? <span className="Select-loading" aria-hidden="true" /> : null;
    var clear = this.props.clearable && this.state.value ? <span className="Select-clear" title={this.props.multi ? this.props.clearAllText : this.props.clearValueText} aria-label={this.props.multi ? this.props.clearAllText : this.props.clearValueText} onMouseDown={this.clearValue} onClick={this.clearValue} dangerouslySetInnerHTML={{ __html: '&times;' }} /> : null;
    var menu = this.state.isOpen ? <div ref="menu" onMouseDown={this.handleMouseDown} className="Select-menu">{this.buildMenu()} </div> : null;

    var commonProps = {
      ref: 'input',
      className: 'Select-input',
      tabIndex: this.props.tabIndex || 0,
      onFocus: this.handleInputFocus,
      onBlur: this.handleInputBlur,
    };
    var input;

    if (this.props.searchable) {
      input = <Input value={this.state.inputValue} defaultValue="" onChange={this.handleInputChange} minWidth="5" {...commonProps} />;
    } else {
      input = <div {...commonProps}>&nbsp;</div>;
    }

    return (
      <div ref="wrapper" className={selectClass}>
        <input type="hidden" ref="value" name={this.props.name} value={this.state.value} />
        <div className="Select-control" ref="control" onKeyDown={this.handleKeyDown} onMouseDown={this.handleMouseDown} onTouchEnd={this.handleMouseDown}>
          {value}
          {input}
          <span className="Select-arrow" />
          {loading}
        </div>
        {menu}

        <InputError 
          visible={this.state.errorVisible} 
          errorMessage={this.state.errorMessage} 
        />
      </div>
    );

  }

}
      
Select.defaultProps = {
      value: undefined,
      options: [],
      delimiter: ',',
      asyncOptions: undefined,
      autoload: true,
      placeholder: 'Select...',
      placeholderTitle: 'Select',
      noResultsText: 'No results found',
      clearable: true,
      clearValueText: 'Clear value',
      clearAllText: 'Clear all',
      searchable: true,
      searchPromptText: 'Type to search',
      name: undefined,
      onChange: undefined,
      className: undefined,
      matchPos: 'any',
      matchProp: 'any'
}


export default Select;