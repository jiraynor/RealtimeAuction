import React, { useState } from 'react';
import './App.css';
import { legacy_createStore as createStore } from 'redux';
import { Provider, useSelector, useDispatch } from 'react-redux';

function reducer(currentState: any, action: any) {
  if (currentState === undefined) {
    return {
      number: 1,
    };
  }
  const newState = { ...currentState };
  if (action.type === 'PLUS') {
    newState.number++;
  }
  return newState;
}

const store = createStore(reducer);

export default function App() {
  return (
    <div id="container">
      <h1>Root</h1>
      <div id="grid">
        <Provider store={store}>
          <Left1></Left1>
          <Right1></Right1>
        </Provider>
      </div>
    </div>
  );
}

function Left1(props: any) {
  return (
    <div>
      <h1>left1</h1>
      <Left2></Left2>
    </div>
  );
}

function Left2(props: any) {
  console.log('2');
  return (
    <div>
      <h1>left2: </h1>
      <Left3></Left3>
    </div>
  );
}

function Left3(props: any) {
  console.log('3');
  const number = useSelector((state: any) => state.number);
  return (
    <div>
      <h1>left3: {number}</h1>
    </div>
  );
}

function Right1(props: any) {
  return (
    <div>
      <h1>right1</h1>
      <Right2></Right2>
    </div>
  );
}

function Right2(props: any) {
  return (
    <div>
      <h1>right2</h1>
      <Right3></Right3>
    </div>
  );
}

function Right3(props: any) {
  const dispatch = useDispatch();
  return (
    <div>
      <h1>right3</h1>
      <button
        type="button"
        onClick={() => {
          dispatch({ type: 'PLUS' });
        }}
      >
        +
      </button>
    </div>
  );
}
