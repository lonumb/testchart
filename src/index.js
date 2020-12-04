import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import store from './store/index';
import App from './pages/App';
import './styles/style.scss';
import './i18n/I18n';
import reportWebVitals from './reportWebVitals';

const getLibrary = (provider) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 15000;
  return library;
};

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <Provider store={store}>
      <App />
    </Provider>
  </Web3ReactProvider>,
  document.getElementById('root')
);

reportWebVitals();
