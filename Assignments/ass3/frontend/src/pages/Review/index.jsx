import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
  Rating,
} from '@mui/material';
import { useParams, useHistory } from 'react-router-dom';
import theme from '../../theme';

import Header from '../../components/Header';
import { requestPublishReview } from '../../services/request';
import msgPopup from '../../utils/msgPopup';
import { sleep } from '../../utils/utils';



export default function Review() {
  const history = useHistory();
  const [value, setValue] = useState(2);
  const { listingid, bookingid } = useParams();
  // eslint-disable-next-line no-unused-vars

  console.log(listingid, bookingid);
  
  const handleAddNewReview = async event => {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);

    const payload = {
      rating: value,
      comment: formData.get('review'),
    };

    const data = {
        review: payload,
    }

    requestPublishReview(listingid,bookingid, data)
        .then(async response => {
        msgPopup('Leave the review successfully', 'success');
        await sleep(1000);
        history.push('/');
        return { ...response };
        })
        .catch(error => ({ ...error }));

  };



  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <Container component='main' maxWidth='sm' sx={{ mb: 4 }}>
          <Paper variant='outlined' sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
            <Typography variant='h6' gutterBottom>
              Leave a review
            </Typography>
            <Rating
                name="simple-controlled"
                value={value}
                onChange={(event, newValue) => {
                setValue(newValue);
                }}
            />
            <Box component='form' variant='h5' onSubmit={handleAddNewReview}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    margin='normal'
                    required
                    id='review'
                    name='review'
                    label='Host review'
                    fullWidth
                    autoComplete='Review'
                    variant='standard'
                    autoFocus
                  />
                </Grid>
               
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant='contained' sx={{ mt: 3, ml: 1 }}>
                  Cancel
                </Button>
                <Button type='submit' variant='contained' sx={{ mt: 3, ml: 1 }}>
                  Post
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </ThemeProvider>
    </>
  );
}
