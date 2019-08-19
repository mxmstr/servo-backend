import React from 'react';
import config from '../../../app.config';
import { ButtonGroup, Grid, Row, Col, Table } from 'react-bootstrap';
import OktaAuth from '@okta/okta-auth-js';
import { withAuth } from '@okta/okta-react';
import {fetchItemsApiCall, deleteItemApiCall} from "../../../actions/ItemList";
import {clearItemApiCall, addItemApiCall, fetchItemApiCall} from "../../../actions/ItemEdit";
import {connect} from "react-redux";
import Loading from "../Loading";
import Buttons from "./Buttons";
import Card from "../../../template/components/Card/Card.jsx";


class ItemList extends React.Component {
    static defaultProps = {
      columns: [],
      editable: [],
      filters: [],
      updateInterval: 0,
      add: false,
      actions: [],
      style: {},
      cellStyle: {}
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
            
        		var data = {uri: this.props.uri, user: user, auth: this.props.auth};
		        this.props.fetchItemsApiCall(data);
        	});
        	
    }

    componentDidMount() {
        this.getCurrentUser();
        this.setState({mounted: true});
    }

    async addItem() {
        await this.props.clearItemApiCall();

        var data = {fields: this.props.editable, auth: this.props.auth};
        this.props.addItemApiCall(data);
    }

    async editItem(id) {
        await this.props.clearItemApiCall();

        var data = {uri: this.props.uri, user: this.state.user, auth: this.props.auth, id: id};
        this.props.fetchItemApiCall(data);
    }

    async removeItem(id) {
      await this.props.clearItemApiCall();

      var data = {uri: this.props.uri, user: this.state.user, auth: this.props.auth, id: id};
      await this.props.deleteItemApiCall(data);
      this.props.fetchItemsApiCall(data);
	  }

    render() {

    	if (!this.state.mounted || !this.state.user) return <Loading/>;
      
      const noItems = this.props.items.length === 0;


      // Create the table header from columns attribute
      const columns = noItems ? [] : this.props.columns;
      const head = this.props.columns.map(key => {
        const keyUpper = key.charAt(0).toUpperCase() + key.slice(1);
        return <th>{ keyUpper }</th>
      });
      head.push(<th>Actions</th>);


      // Optional add item button
      const add = this.props.add ?
        <div>
          <Buttons.Add uri={ this.props.uri } editable={ this.props.editable } user={ this.state.user } auth={ this.props.auth } />
        </div>
        : null;
        
      const title = <Grid fluid><Row><Col md={4}>{this.props.title}</Col> <Col className="pull-right">{add}</Col></Row></Grid>

      
      // Create rows for each item, add action buttons
      const body = noItems ? [] : this.props.items.map((item, key) => {

        for (var field in this.props.filters) {
          if (item[field] !== this.props.filters[field])
            return null;
        }

        const values = this.props.columns.map(column => item[column]);

        return (
          <tr key={key}>
            {
              values.map((prop, key) => {
                return <td key={key} style={ this.props.cellStyle }>{prop}</td>;
              })
            }
            <td style={ {} }>
              <ButtonGroup>
              {
                this.props.actions.map(action => {
                  return <action.type item={ item } uri={ this.props.uri } editable={ this.props.editable } user={ this.state.user } auth={ this.props.auth } />;
                })
              }
              </ButtonGroup>
            </td>
          </tr>
        );

      })


      const items = noItems ? [] : this.props.items

      return (
        <div className="content" style={ this.props.style }>
          <Grid fluid>
            <Row>
              <Col md={12}>
                <Card
                  title={ title }
                  ctTableFullWidth
                  ctTableResponsive
                  content={
                    <Table striped hover>
                      <thead>
                        <tr>{ head }</tr>
                      </thead>
                      <tbody>
                        { body }
                      </tbody>
                    </Table>
                  }
                />
              </Col>
            </Row>
          </Grid>
        </div>
      );
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