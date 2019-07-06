import { combineReducers } from 'redux';
import registration from './Registration';
import login from "./Login";
import profile from "./Profile";
import itemlist from "./ItemList";

const OktaAppReducer = combineReducers({
    registration: registration,
    login: login,
    profile: profile,
    itemlist: itemlist
});

export default OktaAppReducer;