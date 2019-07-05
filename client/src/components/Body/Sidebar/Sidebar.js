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

        if (this.state.authenticated === null) return null;

        let navAuth = (
    	        <ul className="nav flex-column navbar-dark bg-dark">
    	          <li className="nav-item">
    	              <Link className="nav-link" to="/menu"> Menu </Link>
    	              <Link className="nav-link" to="/menu"> Menu </Link>
    	          </li>
    	      </ul>
            );
        
        const authNav = this.state.authenticated ? navAuth : null;

      return (
	      /* Navigation */
              <div className="container">
              	{navAuth}
              </div>
      )
    }

};

export default withAuth(Sidebar);