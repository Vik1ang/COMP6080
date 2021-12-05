import React from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@mui/styles';
import { CssBaseline } from '@mui/material';
import App from './App';
import theme from './theme';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
    <ToastContainer position='top-center' autoClose={5000} newestOnTop closeOnClick pauseOnHover draggable />
  </ThemeProvider>,
  document.getElementById('root'),
);
