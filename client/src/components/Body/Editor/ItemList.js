import React from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import { withAuth } from '@okta/okta-react';
import {fetchItemsApiCall, deleteItemApiCall} from "../../../actions/ItemList";
import {clearItemApiCall, addItemApiCall, fetchItemApiCall} from "../../../actions/ItemEdit";
import {connect} from "react-redux";
import Loading from "../Loading";
import Buttons from "./Buttons";

class ItemList extends React.Component {
    static defaultProps = {
      columns: [],
      editable: [],
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
      
      const noItems = this.props.items.length === 0;


      // Create the table header from columns attribute
    	const columns = noItems ? [] : this.props.columns;
    	const head = columns.map(key => {
        const keyUpper = key.charAt(0).toUpperCase() + key.slice(1);

    		return <th>{ keyUpper }</th>
      });
      
      head.push(<th>Actions</th>);
      

      // Create rows for each item, add action buttons
    	const body = noItems ? [] : this.props.items.map(item => {

            for (var field in this.props.filters) {
              if (item[field] !== this.props.filters[field])
                return null;
            }

            const cellStyle = {
              'maxWidth': '50px',
              'white-space' : 'nowrap',
              'overflow' : 'hidden'
            }

    		    const values = this.props.columns.map(column => {
    	      			return <td style={ cellStyle }>{ item[column] }</td>
    	      		});

    	      return <tr key={item.id}>
    	      	{values}
    	        <td>
                <ButtonGroup>
                { 
                  this.props.actions.map(action => {
                    return <action.type item={ item } uri={ this.props.uri } editable={ this.props.editable } user={ this.state.user } />;
                  })
                }
	    	        </ButtonGroup>
	    	      </td>
	    	    </tr>
    	    });
        
        return (
        		<Container fluid>
              
              { 
                // Optional add item button
                this.props.add ?
                <div className="float-right">
                  <Buttons.Add uri={ this.props.uri } editable={ this.props.editable } user={ this.state.user } />
                </div>
                : null
              }

              <h3>{ this.props.title }</h3>
              { noItems ? 
                <h6>There are no items to display...</h6> : 
                <Table className="mt-4">
                  <thead>
                  <tr>
                  {head}
                  </tr>
                  </thead>
                  <tbody>
                  {body}
                  </tbody>
                </Table> 
              }
              

            </Container>
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
)(withAuth(ItemList));