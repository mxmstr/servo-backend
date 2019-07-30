import React from 'react';
import { withAuth } from '@okta/okta-react';
import {connect} from "react-redux";
import { fetchItemsApiCall } from "../../../actions/ItemList";
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import ItemList from "./ItemList";
import ItemEdit from "./ItemEdit";
import Buttons from "./Buttons";


class Tickets extends React.Component {

    intervalID;

    constructor(props){
        super(props);
        this.state = { user: null, oldPassword: '', newPassword: '' };
        this.getCurrentUser = this.getCurrentUser.bind(this);
    }

    async getCurrentUser(){
        // Request user credentials from oAuth provider
        // Then start a timer to continually refresh items
        
        this.props.auth.getUser()
            .then(user => {
                this.setState({user});

                this.intervalID = setInterval(() => {
                    this.props.fetchItemsApiCall({uri: 'ticket', user: user});
                }, 5000);
            });
    }
    
    componentDidMount(){
        this.getCurrentUser();
    }

    componentWillUnmount() {
        clearTimeout(this.intervalID);
    }

    render() {
        if (!this.state.user) return null;

        const classes = makeStyles(theme => ({
            root: {
              flexGrow: 1,
            },
            paper: {
              padding: theme.spacing(2),
              textAlign: 'center',
              color: theme.palette.text.secondary,
            },
          }));

        return (

            <div className={classes.root}>

                <ItemEdit uri="ticket" />

                <Grid container spacing={0}>
                    <Grid item xs={4}>
                        <ItemList
                            className={classes.paper}
                            title="Open" 
                            uri="ticket"
                            columns={ ['id', 'timestamp'] }
                            actions={ [<Buttons.Edit/>, <Buttons.Complete/>, <Buttons.Incomplete/>] }
                            filters={ { status: 'OPEN' } } />
                    </Grid>
                    <Grid item xs={4}>
                        <ItemList 
                            title="Closed" 
                            uri="ticket"
                            columns={ ['id', 'timestamp'] }
                            actions={ [<Buttons.Edit/>, <Buttons.Open/>, <Buttons.Incomplete/>] }
                            filters={ { status: 'COMPLETE' } } />
                    </Grid>
                    <Grid item xs={4}>
                        <ItemList 
                            title="Unresolved" 
                            uri="ticket"
                            columns={ ['id', 'timestamp'] }
                            actions={ [<Buttons.Edit/>, <Buttons.Open/>, <Buttons.Complete/>] }
                            filters={ { status: 'INCOMPLETE' } } />
                    </Grid>
                </Grid>
            </div>
            
        )
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
      fetchItemsApiCall: (data) => dispatch(fetchItemsApiCall(data))
    }
};

export default connect(
	null,
    mapDispatchToProps
)(withAuth(Tickets));