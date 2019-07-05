import axios from "axios/index";


export const fetchItemList = (data) => {
    return dispatch => {

    	fetch('api/menuitems/', {credentials: 'include'})
	      .then(response => response.json())
	      .then(data => this.setState({groups: data}))
	      .catch(() => this.props.history.push('/'));
    	
    	return axios({
            method: 'get',
            url: '/api/menuitems',
            data: data,
            config: {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }
    	})
    };
};