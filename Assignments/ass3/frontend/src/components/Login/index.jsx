import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { Link, useHistory } from "react-router-dom";
import localforage from "localforage";
import {Login as LoginIcon} from '@mui/icons-material'
import { requestLogin } from '../../services/request';
import theme from "../../theme";
import msgPopup from "../../utils/msgPopup";
import { sleep } from "../../utils/utils";

export default function Login() {

  const history = useHistory();

  const handleLogin = event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const payload = {
      email: data.get('email'),
      password: data.get('password'),
    };

    requestLogin(payload)
      .then(async response => {
        await localforage.setItem('token', response.token);
        await localforage.setItem('user', payload.email);
        msgPopup('Login Successfully', 'success');
        await sleep(2000);
        return history.push('/');
      })
      .catch(err => ({ ...err }));
  };
  return (
    <ThemeProvider theme={theme}>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LoginIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Log In
          </Typography>
          <Box component='form' noValidate onSubmit={handleLogin} sx={{ mt: 3 }}>
            <TextField
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              autoFocus
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
            />
            <FormControlLabel control={<Checkbox value='remember' color='primary' />} label='Remember me' />
            <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
              Sign in
            </Button>
            <Grid container justifyContent='flex-end'>
              <Grid item>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <Link to='/register' variant='body2'>
                  {'Don\'t have an account? Sign Up'}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
