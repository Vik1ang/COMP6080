import React, { useState } from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import localforage from 'localforage';
import LandingList from '../../components/LandingList';
import Header from '../../components/Header';
import useEffectDeep from '../../hooks/useEffectDeep';
import { requestGetOneListing } from '../../services/request';
import { isEqual } from '../../utils/lodash';
import msgPopup from '../../utils/msgPopup';

export default function MyHistory() {
  const [listings, setListings] = useState(null);

  const getList = async () => {
    const user = await localforage.getItem('user');
    if (isEqual(user, null)) {
      msgPopup('You need login first');
      return;
    }
    let footPrint = await localforage.getItem('footPrint');
    if (isEqual(footPrint, null)) {
      await localforage.setItem('footPrint', {});
      footPrint = {}
    }
    const myFootPrint = footPrint[user];
    if (isEqual(myFootPrint, undefined) || isEqual(myFootPrint, null)) {
      return;
    }
    const temp = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const id of myFootPrint) {
      // eslint-disable-next-line no-await-in-loop
      const tempListing = await requestGetOneListing(id);
      temp.push({ ...tempListing.listing, id });
    }
    setListings([...temp]);
  };

  useEffectDeep(() => {
    getList();
  }, []);

  return (
    <>
      <Header />
      <main>
        <Box>
          <Container maxWidth='sm'>
            <Typography component='h1' variant='h2' align='center' gutterBottom>
              History
            </Typography>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth='md'>
          <Grid container spacing={4}>
            {listings &&
              listings.map(listing => {
                const renderEach = (
                  <Grid item key={listing.id} xs={12} sm={6} md={4}>
                    <LandingList {...listing} />
                  </Grid>
                );
                if (listing.published) {
                  return renderEach;
                }
                return null;
              })}
          </Grid>
        </Container>
      </main>
    </>
  );
}
