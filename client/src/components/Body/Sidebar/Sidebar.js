import React from 'react';
import { Link } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { authenticated: null };
        this.checkAuthentication = this.checkAuthentication.bind(this);
        this.checkAuthentication();
    }

    async checkAuthentication() {
        const authenticated = await this.props.auth.isAuthenticated();
        if (authenticated !== this.state.authenticated) {
            this.setState({ authenticated });
        }
    }

    componentDidUpdate() {
        this.checkAuthentication();
    }

    render() {
        
        // Hide if user is not logged in
        if (this.state.authenticated === null || !this.state.authenticated) return null;

        const navAuth = (
    	        <ul className="nav flex-column">
    	          <li className="nav-item">
    	              <Link className="nav-link" to="/menu"> Menu </Link>
    	              <Link className="nav-link" to="/tickets"> Tickets </Link>
    	              <Link className="nav-link" to="/tables"> Tables </Link>
    	              <Link className="nav-link" to="/profile"> Profile </Link>
    	          </li>
    	      </ul>
            );

      return (
            <div className="navbar-dark bg-dark">
                {navAuth}
            </div>
      )
    }

};

export default withAuth(Sidebar);