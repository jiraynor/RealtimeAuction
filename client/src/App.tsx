import React, { useState } from 'react';
import './App.css';
import { legacy_createStore as createStore } from 'redux';
import { Provider, useSelector, useDispatch } from 'react-redux';
import reducer from './reducers';
import Nav from './components/views/Nav';

const store = createStore(reducer);

export default function App() {
  return (
    <Provider store={store}>
      <div className="container">
        <Nav />
      </div>
    </Provider>
  );
}
