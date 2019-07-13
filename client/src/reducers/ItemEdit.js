const initialState = {
    item: null,
    create: false
};

const itemedit = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_ITEM':
            return Object.assign({}, state, {...action.payload});
        default:
            return state;
    }
};

export default itemedit;