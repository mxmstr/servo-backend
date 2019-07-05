import React from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';
import {fetchItemList} from "../../../actions/ItemList";
import {connect} from "react-redux";
import axios from "axios/index";

class ItemList extends React.Component {
    constructor(props){
        super(props);
        this.state = { user: null, data: [] };
        this.getCurrentUser = this.getCurrentUser.bind(this);
    }

    async getCurrentUser() {
        await this.props.auth.getUser()
        	.then(user => {
        		this.setState({user});
        		console.log(user);
        	}
        	);
//            .then(() => {
//            	
//            	console.log(this.state.user);
////            	
////            	axios({
////                    method: 'get',
////                    url: this.props.uri,
////                    config: {
////                        headers: {
////                        	'X-XSRF-TOKEN': user.sub,
////                            'Accept': 'application/json',
////                            'Content-Type': 'application/json'
////                        },
////                    },
////                    withCredentials: true
////                })
////                    .then(json => {
////                        console.log(json);
////                    })
////                    .catch(err => {
////                        console.log(err);
////                    });
//            	
////	            fetch(this.props.uri, {
////	    	      method: 'GET',
////	    	      headers: {
////	    	        'X-XSRF-TOKEN': user.sub,
////	    	        'Accept': 'application/json',
////	    	        'Content-Type': 'application/json'
////	    	      },
////	    	      credentials: 'include'
////	              })
////	              .then(response => response.json())
////	              .then(response => 
////	              		{console.log(response)
////	              })
////	              .catch(err => {
////	                  console.log(err);
////	              });
//            	
//            });
    }

    componentDidMount() {
        this.getCurrentUser();
        
        //console.log(this.state.user);
        
//        await fetch(this.props.uri, {
//  	      method: 'GET',
//  	      headers: {
//  	        'X-XSRF-TOKEN': this.state.user.sub,
//  	        'Accept': 'application/json',
//  	        'Content-Type': 'application/json'
//  	      },
//  	      credentials: 'include'
//        })
//        .then(response => response.json())
//        .catch(err => {
//            console.log(err);
//        });
//  	    }).then(() => {
//  	    	
//  	        let updatedGroups = [...this.state.groups].filter(i => i.id !== id);
//  	        this.setState({groups: updatedGroups});
//  	      })
        
    }

    render() {
    	
    	if(!this.state.user) return null;
    	
    	const {data} = this.state;
    	
        return (
        		<Container fluid>
                <div className="float-right">
                  <Button color="success" tag={Link} to="/menu/new">Add Item</Button>
                </div>
                <h3>{ this.props.title }</h3>
                <Table className="mt-4">
                  <thead>
                  <tr>
                    <th width="20%">Name</th>
                    <th width="20%">Location</th>
                    <th>Events</th>
                    <th width="10%">Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {data}
                  </tbody>
                </Table>
              </Container>
        )
    }
};

export default withAuth(ItemList);