import axios from "axios/index";


export const updateItemList = (data) => ({
    type: 'UPDATE',
    payload: data
});

export const fetchItemsApiCall = (data) => {
    return dispatch => {

    	return fetch(`/api/${data.uri}/${data.user.sub}`, {
    	      method: 'GET',
    	      headers: {
    	        'Accept': 'application/json',
    	        'Content-Type': 'application/json'
    	      },
    	      credentials: 'include'
    	    })
    	.then(response => response.json())
	      .then(data => {
	    	  //console.log(data);
	    	  dispatch(updateItemList(data));
	      })
	      .catch(err => {
	            console.log(err.message);
	        });
    };
};