import React from 'react';
import { NavLink } from "react-router-dom";
import { withAuth } from '@okta/okta-react';

import AdminNavbarLinks from "../../../template/components/Navbars/AdminNavbarLinks.jsx";

import logo from "assets/img/reactlogo.png";


class Sidebar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            authenticated: null
        };
        this.checkAuthentication = this.checkAuthentication.bind(this);
        this.checkAuthentication();
    }

    updateDimensions() {
        this.setState({ width: window.innerWidth });
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));
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

        const sidebarBackground = {
            backgroundImage: "url( assets/img/sidebar-3.jpg )"
        };

        const routes = { 
            Menu: "/menu",
            Tables: "/tables",
            Tickets: "/tickets",
            Profile: "/profile"
        }

        return (
            <div
            id="sidebar"
            className="sidebar"
            data-color={this.props.color}
            data-image={this.props.image}
            >
                {this.props.hasImage ? (
                <div className="sidebar-background" style={sidebarBackground} />
                ) : (
                null
                )}
            <div className="logo">
                <div className="simple-text logo-normal">
                    Servo
                </div>
            </div>
            <div className="sidebar-wrapper">
                <ul className="nav">
                {this.state.width <= 991 ? <AdminNavbarLinks /> : null}
                {
                    Object.keys(routes).map((key, index) => {
                        return (
                            <li
                                key={key}
                            >
                                <NavLink
                                to={routes[key]}
                                className="nav-link"
                                activeClassName="active"
                                >
                                <p>{key}</p>
                                </NavLink>
                            </li>
                        );
                    })
                }
                </ul>
            </div>
            </div>
        );
    }
}



// class Sidebar extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = { authenticated: null };
//         this.checkAuthentication = this.checkAuthentication.bind(this);
//         this.checkAuthentication();
//     }

//     async checkAuthentication() {
//         const authenticated = await this.props.auth.isAuthenticated();
//         if (authenticated !== this.state.authenticated) {
//             this.setState({ authenticated });
//         }
//     }

//     componentDidUpdate() {
//         this.checkAuthentication();
//     }

//     render() {
        
//         // Hide if user is not logged in
//          if (this.state.authenticated === null || !this.state.authenticated) return null;

//     //     const navAuth = (
//     // 	        <ul className="nav flex-column">
//     // 	          <li className="nav-item">
//     // 	              <Link className="nav-link" to="/menu"> Menu </Link>
//     // 	              <Link className="nav-link" to="/tickets"> Tickets </Link>
//     // 	              <Link className="nav-link" to="/tables"> Tables </Link>
//     // 	              <Link className="nav-link" to="/profile"> Profile </Link>
//     // 	          </li>
//     // 	      </ul>
//     //         );

//     //   return (
//     //         <div className="navbar-dark bg-dark">
//     //             {navAuth}
//     //         </div>
//     //   )

//         const sidebarBackground = {
//             backgroundImage: "url( assets/img/sidebar-3.jpg )"
//         };
//         return (

//             <div
//                 id="sidebar"
//                 className="sidebar"
//                 data-color="black"
//             >
//             <div className="sidebar-background" style={sidebarBackground} />
//             <div className="sidebar-wrapper">
//                 <ul className="nav">
//                     <NavLink to="/menu" className="nav-link" activeClassName="active"> <p>Menu</p> </NavLink>
//                     <NavLink to="/tables" className="nav-link" activeClassName="active"> <p>Tables</p> </NavLink>
//                     <NavLink to="/tickets" className="nav-link" activeClassName="active"> <p>Tickets</p> </NavLink>
//                     <NavLink to="/profile" className="nav-link" activeClassName="active"> <p>Menu</p> </NavLink>
//                 </ul>
//             </div>
//         </div>

//         )
//     }

// };

export default withAuth(Sidebar);