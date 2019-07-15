import React from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import { withAuth } from '@okta/okta-react';
import {fetchItemsApiCall, deleteItemApiCall} from "../../../actions/ItemList";
import {clearItemApiCall, addItemApiCall, fetchItemApiCall} from "../../../actions/ItemEdit";
import {connect} from "react-redux";
import Loading from "../Loading";
import ItemEdit from "./ItemEdit";

class ItemList extends React.Component {
    static defaultProps = {
      editable: [],
      add: false,
      edit: false,
      delete: false
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


    	const columns = noItems ? [] : Object.keys(Object.values(this.props.items)[0]);
    	const head = columns.map(key => {
        const keyUpper = key.charAt(0).toUpperCase() + key.slice(1);

    		return <th>{ keyUpper }</th>
      });
      
      head.push(<th>Actions</th>);
      
      console.log("this.props.items");
      console.log(this.props.items);
    	const body = noItems ? [] : this.props.items.map(item => {
    		
    		const values = Object.values(item).map(value => {
    	      			return <td style={{whiteSpace: 'nowrap'}}>{ value }</td>
    	      		});
    		
    	      return <tr key={item.id}>
    	      	{values}
    	        <td>
	    	        <ButtonGroup>
                { this.props.edit ? <Button size="sm" color="primary" onClick={() => this.editItem(item.id)}>Edit</Button> : null}
                { this.props.delete ? <Button size="sm" color="danger" onClick={() => this.removeItem(item.id)}>Delete</Button> : null}
	    	        </ButtonGroup>
	    	      </td>
	    	    </tr>
    	    });
    	
        return (
        		<Container fluid>

              <div><ItemEdit uri={ this.props.uri } editable={ this.props.editable } /></div>
              
              { this.props.add ?
              <div className="float-right">
                <Button color="success" onClick={ this.addItem }>Add Item</Button>
              </div>
              : null }

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