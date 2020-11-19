import React from 'react';
import { Provider } from 'react-redux';
import { HashRoute } from 'react-router-dom';
import App from './app';

const Root = ({ store }) => (
  <Provider store={store}>
    <HashRoute>
      <App />
    </HashRoute>
  </Provider>
);

export default Root;