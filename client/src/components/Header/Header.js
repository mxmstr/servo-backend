import React from 'react';
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { withAuth } from '@okta/okta-react';

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.mobileSidebarToggle = this.mobileSidebarToggle.bind(this);
        this.state = { authenticated: null, sidebarExists: false };
        this.checkAuthentication = this.checkAuthentication.bind(this);
        this.checkAuthentication();
    }

    mobileSidebarToggle(e) {
        if (this.state.sidebarExists === false) {
            this.setState({
            sidebarExists: true
            });
        }
        e.preventDefault();
        document.documentElement.classList.toggle("nav-open");
        var node = document.createElement("div");
        node.id = "bodyClick";
        node.onclick = function() {
            this.parentElement.removeChild(this);
            document.documentElement.classList.toggle("nav-open");
        };
        document.body.appendChild(node);
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
            <Nav pullRight>
                <NavItem eventKey={3} href="javascript:void(0)" onClick={this.props.auth.logout}>
                    Logout
                </NavItem>
            </Nav>
        );

        let navNotAuth = (
            <Nav pullRight>
                <NavItem eventKey={3} href="/">
                    Log in
                </NavItem>
                <NavItem eventKey={3} href="/register">
                    Register
                </NavItem>
            </Nav>
        );

        const authNav = this.state.authenticated ? navAuth : navNotAuth;


        return (
            <Navbar fluid>
            <Navbar.Header>
                <Navbar.Brand>
                    <p>{ this.state.authenticated ? "Dashboard" : "Servo" }</p>
                </Navbar.Brand>
                <Navbar.Toggle onClick={this.mobileSidebarToggle} />
            </Navbar.Header>
            <Navbar.Collapse>
                { authNav }
            </Navbar.Collapse>
            </Navbar>
        );

    }

}

export default withAuth(Header);