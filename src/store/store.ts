import {createStore, applyMiddleware, Middleware, combineReducers} from "redux";
import thunk from "redux-thunk";
import fsReducer, {FsState} from "./fsReducer";

export interface StoreState {
	fs: FsState;
}

const store = createStore(combineReducers({fs: fsReducer}), applyMiddleware(thunk));

export default store;

