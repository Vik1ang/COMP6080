import React, { useContext } from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import LandingList from '../../components/LandingList/index';
import ListingsContext from '../../context/listingsContext';

export default function Landing() {
  const { listings } = useContext(ListingsContext);

  return (
    <main>
      <Box>
        <Container maxWidth='sm'>
          <Typography component='h1' variant='h2' align='center' gutterBottom>
            All Listing
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
  );
}
