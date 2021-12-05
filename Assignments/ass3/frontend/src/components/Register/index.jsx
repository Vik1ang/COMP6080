import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { Link, useHistory } from 'react-router-dom';
import { LockOutlined as LockOutlinedIcon } from "@mui/icons-material";
import localforage from "localforage";
import { requestRegister } from '../../services/request';
import theme from "../../theme";
import { sleep } from "../../utils/utils";
import msgPopup from "../../utils/msgPopup";

export default function Register() {

  const history = useHistory();

  const handleRegister = event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const payload = {
      email: data.get('email'),
      password: data.get('password'),
      name: data.get('name'),
    };

    requestRegister(payload)
      .then(async response => {
        await localforage.setItem('token', response.token);
        await localforage.setItem('user', payload.email);
        msgPopup('SignUp Successfully', 'success');
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign up
          </Typography>
          <Box component='form' noValidate onSubmit={handleRegister} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField required fullWidth id='email' label='Email Address' name='email' autoComplete='email' />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name='password'
                  label='Password'
                  type='password'
                  id='password'
                  autoComplete='new-password'
                />
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth name='name' label='Name' autoComplete='name' />
              </Grid>
            </Grid>
            <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </Button>
            <Grid container justifyContent='flex-end'>
              <Grid item>
                {/* FIXME: there has some problem */}
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <Link to='/login' variant='body2'>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
