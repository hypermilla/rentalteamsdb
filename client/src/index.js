import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';


import App from './components/App';
import reducers from './reducers';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
		</React.StrictMode>,
	document.getElementById('root')
);