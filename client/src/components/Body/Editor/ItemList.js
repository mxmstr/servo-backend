import React from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';
import {fetchItemsApiCall} from "../../../actions/ItemList";
import {connect} from "react-redux";
import axios from "axios/index";

class ItemList extends React.Component {
    constructor(props){
        super(props);
        this.state = { user: null, items: [] };
        this.getCurrentUser = this.getCurrentUser.bind(this);
    }

    async getCurrentUser() {
        await this.props.auth.getUser()
        	.then(user => {
        		this.setState({user});
        		
        		var data = {user: user, uri: this.props.uri};
		        this.props.fetchItemsApiCall(data);
        	});
        	
    }

    componentDidMount() {
        this.getCurrentUser();
        
    }

    render() {
    	
    	if (!this.state.user) return null;
    	
    	if (this.props.items.length == 0) return null;
    	
    	const columns = Object.keys(Object.values(this.props.items)[0]);
    	
    	const head = columns.map(key => { 
    		return <th>{key}</th>
    	});
    	
    	const body = this.props.items.map(item => {
    		
    		const values = Object.values(item).map(value => {
    			console.log(value);
    	      			return <td style={{whiteSpace: 'nowrap'}}>{ JSON.stringify(value) }</td>
    	      		});
    		
    	      return <tr key={item.id}>
    	      	{values}
    	        <td>
	    	        <ButtonGroup>
	    	          <Button size="sm" color="primary" tag={Link} to={`/${this.props.uri}/` + item.id}>Edit</Button>
	    	          <Button size="sm" color="danger" onClick={() => this.remove(item.id)}>Delete</Button>
	    	        </ButtonGroup>
	    	      </td>
	    	    </tr>
    	    });
    	
    	
        return (
        		<Container fluid>
                <div className="float-right">
                  <Button color="success" tag={Link} to="/menu/new">Add Item</Button>
                </div>
                <h3>{ this.props.title }</h3>
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
        fetchItemsApiCall: (data) => dispatch(fetchItemsApiCall(data))
    }
};

export default connect(
	mapStateToProps,
    mapDispatchToProps
)(withAuth(ItemList));