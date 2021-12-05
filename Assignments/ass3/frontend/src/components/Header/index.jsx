import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ThemeProvider } from '@mui/styles';
import {
  AppBar,
  Badge,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import { AccountCircle as AccountCircleIcon, House as HouseIcon, History as HistoryIcon } from '@mui/icons-material';
import localforage from 'localforage';
import { requestLogout } from '../../services/request';
import theme from '../../theme';
import { isLogin } from '../../utils/utils';

export default function Header() {
  const [anchorEl, setAnchorEl] = useState(null);

  const [login, setLogin] = useState(null);

  const [open, setOpen] = React.useState(false);

  const isMenuOpen = Boolean(anchorEl);

  const history = useHistory();

  useEffect(() => {
    // eslint-disable-next-line promise/catch-or-return
    isLogin().then(response => {
      setLogin(response);
      return undefined;
    });
  }, []);

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const showHostedListing = () => {
    history.push('/host');
  };

  const showHistory = () => {
    history.push('/history');
  }

  const goBackHomePage = () => {
    history.push('/');
  };

  const handleLogout = event => {
    event.preventDefault();
    requestLogout()
      .then(response => {
        localforage.removeItem('token');
        localforage.removeItem('user');
        if (window.location.href === 'http://localhost:3000/') {
          window.location.reload(true);
        } else {
          history.push('/');
        }
        return { ...response };
      })
      .catch(error => {
        localforage.removeItem('token');
        localforage.removeItem('user');
        console.error(error);
        history.push('/');
      });
  };

  const renderLogoutDialog = (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        handleMenuClose();
      }}
      aria-labelledby='logout-confirm-dialog'
      aria-describedby='logout-confirm-dialog-description'>
      <DialogTitle id='alert-dialog-title'>Do you want logout?</DialogTitle>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false);
            handleMenuClose();
          }}>
          Cancel
        </Button>
        <Button onClick={handleLogout} autoFocus>
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}>
      {login ? (
        <div>
          <MenuItem onClick={() => setOpen(true)}>Logout</MenuItem>
        </div>
      ) : (
        <div>
          <MenuItem onClick={() => history.push('/login')}>Login</MenuItem>
          <MenuItem onClick={() => history.push('/register')}>Register</MenuItem>
        </div>
      )}
    </Menu>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='static'>
          <Toolbar>
            <Typography
              variant='h6'
              noWrap
              component='div'
              sx={{ display: { xs: 'none', sm: 'block' } }}
              onClick={goBackHomePage}>
              AirBrB
            </Typography>
            <IconButton size='large' aria-label='show host listing' color='inherit' onClick={goBackHomePage}>
              <Badge>
                <HouseIcon />
              </Badge>
            </IconButton>
            <Typography
              variant='h6'
              noWrap
              component='div'
              sx={{ display: { xs: 'none', sm: 'block' } }}
              onClick={goBackHomePage}>
              Landing
            </Typography>
            {/* <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}> */}
            <IconButton size='large' aria-label='show host listing' color='inherit' onClick={showHostedListing}>
              <Badge>
                <HouseIcon />
              </Badge>
            </IconButton>
            <Typography
              variant='h6'
              noWrap
              component='div'
              sx={{ display: { xs: 'none', sm: 'block' } }}
              onClick={showHostedListing}>
              Hosted
            </Typography>
            <IconButton size='large' aria-label='show host listing' color='inherit' onClick={showHistory}>
              <Badge>
                <HistoryIcon />
              </Badge>
            </IconButton>
            <Typography
                variant='h6'
                noWrap
                component='div'
                sx={{ display: { xs: 'none', sm: 'block' } }}
                onClick={showHistory}>
              History
            </Typography>
            <IconButton
              size='large'
              edge='end'
              aria-label='account of current user'
              aria-controls={menuId}
              aria-haspopup='true'
              onClick={handleProfileMenuOpen}
              color='inherit'>
              <AccountCircleIcon />
            </IconButton>
            <Typography
              variant='h6'
              noWrap
              component='div'
              sx={{ display: { xs: 'none', sm: 'block' } }}
              onClick={handleProfileMenuOpen}>
              Profile
            </Typography>
            {/* </Box> */}
          </Toolbar>
        </AppBar>
        {renderMenu}
        {renderLogoutDialog}
      </Box>
    </ThemeProvider>
  );
}
