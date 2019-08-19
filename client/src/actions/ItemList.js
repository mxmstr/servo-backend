import axios from "axios/index";


export const updateItemList = (data) => ({
    type: 'UPDATE_ITEM_LIST',
    payload: data
});

export const deleteItemApiCall = (data) => {
    return async dispatch => {

		const sessionId = await data.auth.getAccessToken();

		return fetch(`/api/${data.uri}/${data.id}`, {
				method: 'DELETE',
				headers: {
					'UserId': data.user.sub,
					'Authorization': 'Bearer ' + sessionId
				}
			})
		.then(response => response.json())
			.then(data => {
				//console.log(data);
			})
			.catch(err => {
				console.log(err.message);
			});
    };
};

export const fetchItemsApiCall = (data) => {
    return async dispatch => {

		const sessionId = await data.auth.getAccessToken();

    	return fetch(`/api/${data.uri}`, {
    	      method: 'GET',
    	      headers: {
				'UserId': data.user.sub,
				'Authorization': 'Bearer ' + sessionId
    	      },
    	    })
    	.then(response => response.json())
		.then(data => {
			//console.log(data);
			if (data.status === 404)
				dispatch(updateItemList([]));
			else
				dispatch(updateItemList(data));
		})
		.catch(err => {
			console.log(err.message);
		});
    };
};