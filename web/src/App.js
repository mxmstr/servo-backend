import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import Register from './Register';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import GroupList from './GroupList';
import GroupEdit from './GroupEdit';
import { CookiesProvider } from 'react-cookie';

class App extends Component {
	
	
	componentDidMount(){
      const ele = document.getElementById('ipl-progress-indicator')
      if(ele){
        // fade out
        ele.classList.add('available')
        setTimeout(() => {
          // remove from DOM
          ele.outerHTML = ''
        }, 2000)
      }
	}
	
  render() {
    return (
    	<CookiesProvider>
    	<Router>
	        <Switch>
	        	<Route path='/' exact={true} component={Home}/>
	        	<Route path='/register' exact={true} component={Register}/>
	        	<Route path='/groups' exact={true} component={GroupList}/>
	        	<Route path='/groups/:id' component={GroupEdit}/>
	        </Switch>
        </Router>
        </CookiesProvider>
      
    )
  }
}
export default App;