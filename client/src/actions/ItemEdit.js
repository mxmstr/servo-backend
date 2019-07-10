import axios from "axios/index";


export const clearItem = () => ({
    type: 'CLEAR_ITEM',
    payload: null
});

export const updateItem = (data) => ({
    type: 'UPDATE_ITEM',
    payload: data
});

export const clearItemApiCall = (data) => {
    return dispatch => {
    	dispatch(clearItem(data));
    };
};

export const fetchItemApiCall = (data) => {
    return dispatch => {

    	return fetch(`/api/${data.uri}/${data.id}`, {
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
	    	  dispatch(updateItem(data));
	      })
	      .catch(err => {
	            console.log(err.message);
	        });
    };
};

export const putItemApiCall = (data) => {
    return dispatch => {

    	return fetch(`/api/${data.uri}/${data.item.id}`, {
    	      method: 'PUT',
    	      headers: {
				'UserId': data.user.sub,
    	        'Accept': 'application/json',
    	        'Content-Type': 'application/json'
			  },
			  body: JSON.stringify(data.item),
    	      credentials: 'include'
    	    })
    	.then(response => response.json())
	      .then(data => {
	    	  //console.log(data);
	    	  //dispatch(updateItem(data));
	      })
	      .catch(err => {
	            console.log(err.message);
	        });
    };
};