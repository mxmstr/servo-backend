import React from 'react';
import { Button } from 'react-bootstrap';
import {connect} from "react-redux";
import {fetchItemsApiCall, deleteItemApiCall} from "../../../actions/ItemList";
import {clearItemApiCall, addItemApiCall, fetchItemApiCall, putItemApiCall, postItemApiCall} from "../../../actions/ItemEdit";
import { IoMdColorWand, IoMdCreate, IoMdClose, IoMdCheckmarkCircleOutline, IoMdFlag, IoMdUndo } from 'react-icons/io';


const mapStateToProps = (state) => {
    return {}
};

const mapDispatchToProps = (dispatch) => {
    return {
      clearItemApiCall: (data) => dispatch(clearItemApiCall(data)),
      addItemApiCall: (data) => dispatch(addItemApiCall(data)),
      deleteItemApiCall: (data) => dispatch(deleteItemApiCall(data)),
      putItemApiCall: (data) => dispatch(putItemApiCall(data)),
      postItemApiCall: (data) => dispatch(postItemApiCall(data)),
      fetchItemApiCall: (data) => dispatch(fetchItemApiCall(data)),
      fetchItemsApiCall: (data) => dispatch(fetchItemsApiCall(data))
    }
};


const Add = connect(mapStateToProps, mapDispatchToProps)(class Add extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  };
        this.onClick = this.onClick.bind(this);
    }

    async onClick() {
        await this.props.clearItemApiCall();

        var data = {fields: this.props.editable};
        this.props.addItemApiCall(data);
    }

    render() {

      return (
            <Button color="success" onClick={ this.onClick }>
                <IoMdColorWand/>
            </Button>
      )
    }

});

const Edit = connect(mapStateToProps, mapDispatchToProps)(class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  };
        this.onClick = this.onClick.bind(this);
    }

    async onClick() {
        await this.props.clearItemApiCall();

        var data = {uri: this.props.uri, user: this.props.user, id: this.props.item.id};
        this.props.fetchItemApiCall(data);
    }

    render() {

      return (
            <Button color="primary" onClick={ this.onClick }>
                <IoMdCreate/>
            </Button>
      )
    }

});

const Delete = connect(mapStateToProps, mapDispatchToProps)(class Delete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  };
        this.onClick = this.onClick.bind(this);
    }

    async onClick() {
        await this.props.clearItemApiCall();

        var data = {uri: this.props.uri, user: this.props.user, id: this.props.item.id};
        await this.props.deleteItemApiCall(data);
        this.props.fetchItemsApiCall(data);
    }

    render() {

      return (
            <Button color="danger" onClick={ this.onClick }>
                <IoMdClose/>
            </Button>
      )
    }

});

const Open = connect(mapStateToProps, mapDispatchToProps)(class Open extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  };
        this.onClick = this.onClick.bind(this);
    }

    async onClick() {
        var data = { uri: this.props.uri, user: this.props.user, item: this.props.item };
        data.item.status = 'OPEN'

        await this.props.putItemApiCall(data);
        this.props.fetchItemsApiCall(data);
    }

    render() {

      return (
            <Button color="primary" onClick={ this.onClick }>
                <IoMdUndo/>
            </Button>
      )
    }

});

const Complete = connect(mapStateToProps, mapDispatchToProps)(class Complete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  };
        this.onClick = this.onClick.bind(this);
    }

    async onClick() {
        var data = { uri: this.props.uri, user: this.props.user, item: this.props.item };
        data.item.status = 'COMPLETE'

        await this.props.putItemApiCall(data);
        this.props.fetchItemsApiCall(data);
    }

    render() {

      return (
            <Button color="success" onClick={ this.onClick }>
                <IoMdCheckmarkCircleOutline/>
            </Button>
      )
    }

});

const Incomplete = connect(mapStateToProps, mapDispatchToProps)(class Incomplete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  };
        this.onClick = this.onClick.bind(this);
    }

    async onClick() {
        var data = { uri: this.props.uri, user: this.props.user, item: this.props.item };
        data.item.status = 'INCOMPLETE'

        await this.props.putItemApiCall(data);
        this.props.fetchItemsApiCall(data);
    }

    render() {

      return (
            <Button color="warning" onClick={ this.onClick }>
                <IoMdFlag/>
            </Button>
      )
    }

});


export default {
    Add, Edit, Delete, Open, Complete, Incomplete
}