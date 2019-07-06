const initialState = {
    items: []
};

const itemlist = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE':
            return Object.assign({}, state, {items: action.payload});
        default:
            return state;
    }
};

export default itemlist;