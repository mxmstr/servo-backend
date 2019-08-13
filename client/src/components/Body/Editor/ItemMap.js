import React from 'react';
import { Button, ButtonGroup, Container, Table } from 'react-bootstrap';
import { withAuth } from '@okta/okta-react';
import {fetchItemsApiCall, deleteItemApiCall} from "../../../actions/ItemList";
import {clearItemApiCall, addItemApiCall, fetchItemApiCall} from "../../../actions/ItemEdit";
import { makeStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import Draggable from 'react-draggable';
import Loading from "../Loading";

class ItemMap extends React.Component {
    static defaultProps = {
      columns: [],
      filters: [],
      updateInterval: 0,
      add: false,
      actions: []
    }

    constructor(props){
        super(props);
        this.state = { user: null, mounted: false };
        this.getCurrentUser = this.getCurrentUser.bind(this);
        this.addItem = this.addItem.bind(this);
        this.editItem = this.editItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
    }

    async getCurrentUser() {
      // Request user credentials from oAuth provider
      // Then fetch items using the credentials

        await this.props.auth.getUser()
        	.then(user => {
        		this.setState({user});
            
        		var data = {uri: this.props.uri, user: user};
		        this.props.fetchItemsApiCall(data);
        	});
        	
    }

    componentDidMount() {
        this.getCurrentUser();
        this.setState({mounted: true});
    }

    async addItem() {
        await this.props.clearItemApiCall();

        var data = {fields: this.props.editable};
        this.props.addItemApiCall(data);
    }

    async editItem(id) {
        await this.props.clearItemApiCall();

        var data = {uri: this.props.uri, user: this.state.user, id: id};
        this.props.fetchItemApiCall(data);
    }

    async removeItem(id) {
      await this.props.clearItemApiCall();

      var data = {uri: this.props.uri, user: this.state.user, id: id};
      await this.props.deleteItemApiCall(data);
      this.props.fetchItemsApiCall(data);
	  }

    render() {
    	
    	if (!this.state.mounted || !this.state.user) return <Loading/>;
      
      const noItems = this.props.items.length == 0;


      const classes = makeStyles(theme => ({
        reactDraggable: {
          background: '#ddd',
          border: '1px solid #999',
          'border-radius': '3px',
          display: 'block',
          'margin-bottom': '10px',
          padding: '3px 5px',
          'text-align': 'center'
        },
        box: {
          background: '#fff',
          border: '1px solid #999',
          'border-radius': '3px',
          width: '180px',
          height: '180px',
          margin: '10px',
          padding: '10px',
          float: 'left'
        }
      }));

      const body = noItems ? [] : this.props.items.map(item => {

            for (var field in this.props.filters) {
              if (item[field] !== this.props.filters[field])
                return null;
            }

    	      return <Draggable
                className={classes.box}
                defaultPosition={ item.position ? {x: item.position[0], y: item.position[1]} : {x:100, y:100} }
                onStart={this.handleStart}
                onDrag={this.handleDrag}
                onStop={this.handleStop}>
                <div> {item.id} </div>
              </Draggable>
    	    });

      return (
        <div>
            { body }
        </div>
        
      )
    }
};

const mapStateToProps = (state) => {
    return {
        items: state.itemlist.items,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
      clearItemApiCall: (data) => dispatch(clearItemApiCall(data)),
      addItemApiCall: (data) => dispatch(addItemApiCall(data)),
      deleteItemApiCall: (data) => dispatch(deleteItemApiCall(data)),
      fetchItemApiCall: (data) => dispatch(fetchItemApiCall(data)),
      fetchItemsApiCall: (data) => dispatch(fetchItemsApiCall(data))
    }
};

export default connect(
	mapStateToProps,
  mapDispatchToProps
)(withAuth(ItemMap));