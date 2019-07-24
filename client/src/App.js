import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Route } from 'react-router-dom';
import { SecureRoute, ImplicitCallback } from '@okta/okta-react';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Sidebar from './components/Body/Sidebar/Sidebar';
import RegistrationForm from './components/Body/Registration/RegistrationForm';
import config from './app.config';
import LoginPage from './components/Body/Login/LoginPage';
import ProfilePage from './components/Body/Profile/ProfilePage';
import Menu from './components/Body/Editor/Menu';
import Tickets from './components/Body/Editor/Tickets';
import Tables from './components/Body/Editor/Tables';
import './App.css';

export default class App extends Component {
    render() {
        return (
            <div>
                <Header />
                <Container fluid>
                    <main role="main">
                    <Row >
                        <Sidebar />
                        <Col>
                            <Route path="/" exact={true} render={() => <LoginPage baseUrl={config.url} />} />
                            <Route path="/implicit/callback" component={ImplicitCallback} />
                            <Route path="/register" component={RegistrationForm} />
                            <SecureRoute path="/profile" component={ProfilePage} />
                            <SecureRoute path="/menu" component={Menu} />
                            <SecureRoute path="/tickets" component={Tickets} />
                            <SecureRoute path="/tables" component={Tables} />
                        </Col>
                    </Row>
                    </main>
                </Container>
                <Footer />
            </div>
        );
    }
}