import axios from "axios/index";


export const updateItem = (data) => ({
    type: 'UPDATE_ITEM',
    payload: data
});


export const clearItemApiCall = () => {
    return dispatch => {
    	dispatch(updateItem({item: null, create: false}));
    };
};

export const addItemApiCall = (data) => {
    return dispatch => {
		var item = {};
		data.fields.map(field => { item[field] = ''; });

    	dispatch(updateItem( {item: item, create: true}));
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
			  dispatch(updateItem({item: data, create: false}));
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
	    	  dispatch(updateItem({item: null, create: false}));
	      })
	      .catch(err => {
	            console.log(err.message);
	        });
    };
};

export const postItemApiCall = (data) => {
    return dispatch => {

    	return fetch(`/api/${data.uri}`, {
    	      method: 'POST',
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
	    	  dispatch(updateItem({item: null, create: false}));
	      })
	      .catch(err => {
	            console.log(err.message);
	        });
    };
};