const initialState = {
    item: null
};

const itemedit = (state = initialState, action) => {
    switch (action.type) {
        case 'CLEAR_ITEM':
            return Object.assign({}, state, {item: action.payload});
        case 'UPDATE_ITEM':
            return Object.assign({}, state, {item: action.payload});
        default:
            return state;
    }
};

export default itemedit;