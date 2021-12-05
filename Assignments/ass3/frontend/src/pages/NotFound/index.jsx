import React from 'react';
import { Button, ThemeProvider, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import theme from '../../theme';
import Header from '../../components/Header';

export default function NotFound() {
  const history = useHistory();

  return (
    <>
      <ThemeProvider theme={theme}>
        <Header />
        <Typography variant='h1'>Page Not Found</Typography>
        <Button variant='contained' onClick={() => history.goBack()}>
          Go Back
        </Button>
        <Button variant='contained' onClick={() => history.push('/')}>
          Go Home
        </Button>
      </ThemeProvider>
    </>
  );
}
