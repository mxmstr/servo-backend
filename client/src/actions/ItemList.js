import axios from "axios/index";


export const updateItemList = (data) => ({
    type: 'UPDATE_ITEM_LIST',
    payload: data
});

export const fetchItemsApiCall = (data) => {
    return dispatch => {
		// data.user
    	return fetch(`/api/${data.uri}`, {
    	      method: 'GET',
    	      headers: {
				'UserId': data.user.sub,
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