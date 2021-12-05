import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ThemeProvider } from '@mui/styles';
import { Box, Button, Container, CssBaseline, Grid, Typography } from '@mui/material';
import localforage from 'localforage';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import theme from '../../theme';
import Header from '../../components/Header';
import { requestGetListings, requestGetOneListing } from '../../services/request';
import HostedListing from '../HostedListing';
import msgPopup from '../../utils/msgPopup';

import useEffectDeep from '../../hooks/useEffectDeep';
import ProfitsGraph from '../../components/ProfitsGraph';

export default function Host() {
  const history = useHistory();

  const handleNewHost = () => {
    history.push('/host/new');
  };

  const [user, setUser] = useState();
  const [logged, setLogged] = useState(false);
  const [details, setDetails] = useState([]);
  const [all, setAll] = useState(true);
  const [published, setPublished] = useState(false);
  const [unpublished, setUnpublished] = useState(false);

  const getList = async () => {
    const userAccount = await localforage.getItem('user');
    console.log(userAccount);
    if (userAccount !== null) {
      setLogged(true);
    } else {
      history.goBack();
      msgPopup("You haven't logged in yet.");
      return;
    }
    if (logged) {

      try {
        const response = await requestGetListings();
        setUser(await localforage.getItem('user'));
        const temp = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const listing of response.listings) {
          // eslint-disable-next-line no-await-in-loop
          const res = await requestGetOneListing(listing.id);
          temp.push({ ...res.listing, id: listing.id });
        }
        setDetails(temp);
      } catch (error) {
        msgPopup(error.message);
      }
    }
    
  };

  useEffectDeep(() => {
    getList();
  }, [details, logged]);

  return (
    <>
    {logged && (<ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <main>
        <Box>
          <Container maxWidth='sm'>
            <ProfitsGraph />
            <Typography component='h1' variant='h2' align='center' gutterBottom>
              My Host
            </Typography>
            <Typography component='h1' variant='h2' align='center' gutterBottom>
              <Button variant='contained' onClick={handleNewHost}>
                adding new host
              </Button>
            </Typography>
          </Container>

          <Container maxWidth='sm'>
            <FormGroup>
              <FormGroup align='left'>
                <FormControlLabel
                  control={
                    <Switch
                      checked={all}
                      onClick={() => {
                        setAll(true);
                        setPublished(false);
                        setUnpublished(false);
                      }}
                    />
                  }
                  label='All Listings'
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={published}
                      onClick={() => {
                        setAll(false);
                        setPublished(true);
                        setUnpublished(false);
                      }}
                    />
                  }
                  label='Published Listings'
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={unpublished}
                      onClick={() => {
                        setAll(false);
                        setPublished(false);
                        setUnpublished(true);
                      }}
                    />
                  }
                  label='Unpublished Listings'
                />
              </FormGroup>
            </FormGroup>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth='md'>
          <Grid container spacing={4}>
            {details.map(listing => {
              if (listing.owner === user) {
                const renderEach = (
                  <Grid item key={listing.id} xs={12} sm={6} md={4}>
                    <HostedListing {...listing} />
                  </Grid>
                );
                if (all) {
                  return renderEach;
                }
                if (published) {
                  if (listing.published) {
                    return renderEach;
                  }
                }
                if (unpublished) {
                  if (!listing.published) {
                    return renderEach;
                  }
                }
              }
              return null;
            })}
          </Grid>
        </Container>
      </main>
    </ThemeProvider>)}
    </>
  );
}
