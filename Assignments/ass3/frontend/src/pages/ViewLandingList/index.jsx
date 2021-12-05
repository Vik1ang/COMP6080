import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
// import { styled } from '@mui/material/styles';
import {
  Box,
  Container,
  CssBaseline,
  Grid,
  Paper,
  ThemeProvider,
  Typography,
  ButtonBase,
  Button,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  TextField,
  Rating,
} from '@mui/material';
import { DateRangePicker, LocalizationProvider } from '@mui/lab';
import AdapterDayjs from '@mui/lab/AdapterDayjs';
import ReviewsIcon from '@mui/icons-material/Reviews';
import * as dayjs from 'dayjs';
import ReactPlayer from "react-player";
import isBetween from 'dayjs/esm/plugin/isBetween';
import localforage from "localforage";
import { nanoid } from "nanoid";
import theme from '../../theme';
import Header from '../../components/Header';
import msgPopup from '../../utils/msgPopup';
import { requestGetBookings, requestGetOneListing, requestNewBooking } from '../../services/request';
import { isEqual } from '../../utils/lodash';
import UserBooking from '../../components/UserBooking';
import useEffectDeep from '../../hooks/useEffectDeep';
import MyCarousel from '../../components/MyCarousel';


dayjs.extend(isBetween);

// const Img = styled('img')({
//   margin: 'auto',
//   display: 'block',
//   maxWidth: '100%',
//   maxHeight: '100%',
// });

export default function ViewLandingList() {
  const history = useHistory();

  const { id } = useParams();

  const [host, setHost] = useState({});
  const [loading, setLoading] = useState(true);
  const [isGoLiveDialog, setGoLiveDialog] = useState(false);
  const [details, setDetails] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [dateRange, setDateRange] = useState([[null, null]]);
  const [isReviewsDialog, setReviewsDialog] = useState(false);
  const handleGoBack = () => {
    history.goBack();
  };

  const handleNewBooking = () => {
    setGoLiveDialog(true);
  };

  const handleReviews = () => {
    setReviewsDialog(true);
    console.log(host.reviews);
  }

  const getBookings = async () => {
    try {
      const response = await requestGetBookings();
      const userEmail = await localforage.getItem('user');
      // setListings(response.listings);
      const temp = [];
      console.log(response);

      // eslint-disable-next-line no-restricted-syntax
      for (const booking of response.bookings) {
        // eslint-disable-next-line no-await-in-loop
        if (booking.listingId === id && userEmail === booking.owner ) {
            console.log(booking);
            temp.push({ ...booking });
        }
        
      }
      setDetails(temp);
    } catch (error) {
      msgPopup(error.message);
    }
    
  };

  useEffectDeep(() => {
    getBookings();
  }, [details]);

  const reviewsDialog = (
    <Dialog
      open={isReviewsDialog}
      onClose={() => setReviewsDialog(false)}
      aria-labelledby='go-live-dialog'
      aria-describedby='go-live-dialog-description'>
      <DialogTitle>Reviews</DialogTitle>
      <DialogContent>
        <List sx={{ pt: 0 }}>
          {host.reviews !==  undefined && host.reviews.map((review)=> (
            <ListItem key={nanoid()} >
            <ListItemAvatar>
              <ReviewsIcon/>
            </ListItemAvatar>
              <Typography>{review.comment}</Typography>
            </ListItem>
            
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setReviewsDialog(false);
          }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );


  const handleConfirmBooking = () => {
    let availability;
    const { price } = host;
    console.log(price);
    try {
      availability = dateRange.map(value => {
        if (isEqual(value[0], null) || isEqual(value[1], null)) {
          throw Error('You have to fill check-in day and check-out day');
        }
        const start = dayjs(value[0]).toISOString();
        const end = dayjs(value[1]).toISOString();

        return { start, end };
      });
      console.log(availability[0]);
      const durationDays = Math.floor(
        Math.abs(new Date(availability[0].end) - new Date(availability[0].start)) / (1000 * 60 * 60 * 24),
      );
      const payload = {
        dateRange: availability[0],
        totalPrice: durationDays * price,
      };
      requestNewBooking(id, payload)
        .then(async response => {
          msgPopup('You have sent the request of the booking successfully', 'success');
          setGoLiveDialog(false);
          history.push(`/`);
          const userId = localforage.getItem('user');
          const bookings = await localforage.getItem(`${userId}/booking`)
          bookings.push(response.bookingId);
          await localforage.setItem(`${userId}/booking`,bookings);
          return { ...response };
        })
        .catch(error => ({ ...error }));
    } catch (error) {
      msgPopup(error.message);
    }
  };
  useEffect(() => {
    // eslint-disable-next-line promise/catch-or-return
    requestGetOneListing(id)
      .then(({ listing }) => {
        setHost(listing);
        return undefined;
      })
      .catch(error => msgPopup(error.message))
      .finally(() => setLoading(false));
  }, [id]);







  const handleRenderAvailabilityDate = date => {
    const { availability } = host;

    // eslint-disable-next-line no-restricted-syntax
    for (const val of availability) {
      const { start, end } = val;
      if (dayjs(date).isBetween(dayjs(start), dayjs(end), 'day', '[]')) {
        return false;
      }
    }

    return true;
  };


  const bookDialog = (
    <Dialog
      open={isGoLiveDialog}
      onClose={() => setGoLiveDialog(false)}
      aria-labelledby='go-live-dialog'
      aria-describedby='go-live-dialog-description'>
      <DialogTitle>Choose the availability</DialogTitle>
      <DialogContent>
        <List sx={{ pt: 0 }}>
          {dateRange.map((data, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <ListItem key={index}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateRangePicker
                  shouldDisableDate={handleRenderAvailabilityDate}
                  showToolbar
                  showTodayButton
                  clearable
                  startText='Check-in'
                  endText='Check-out'
                  value={dateRange[index]}
                  onChange={newValue => {
                    const temp = [...dateRange];
                    temp[index] = newValue;
                    setDateRange([...temp]);
                  }}
                  renderInput={(startProps, endProps) => (
                    <>
                      <TextField {...startProps} />
                      <Box sx={{ mx: 2 }}>to</Box>
                      <TextField {...endProps} />
                    </>
                  )}
                />
              </LocalizationProvider>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setGoLiveDialog(false);
            setDateRange([[null, null]]);
          }}>
          Cancel
        </Button>
        <Button onClick={handleConfirmBooking}>Confirm Booking</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      {!loading && (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header />
          <Container component='main' maxWidth='sm' sx={{ mb: 8 }}>
            <Paper sx={{ p: 2, margin: 'auto', flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item>
                  <ButtonBase sx={{ width: 128, height: 128 }}>
                    {/* <Img alt='complex' src={host.thumbnail} /> */}
                    {host.thumbnail.startsWith("data:image") && (<CardMedia component='img' image={host.thumbnail} alt='thumbnail' sx={{ maxHeight: 120 }} />)}
          {host.thumbnail.startsWith("https") && (<ReactPlayer url={host.thumbnail}  alt='thumbnail'   origin= 'http://localhost:3000' width="100%"
      height="100%" autoPlay controls/>)}
                  </ButtonBase>
                </Grid>
                <Grid item xs={12} sm container>
                  <Grid item xs container direction='column' spacing={2}>
                    <Grid item xs>
                      <Typography gutterBottom variant='body2'>
                        Title : {host.title}
                      </Typography>
                      <Typography variant='body2' gutterBottom>
                        Address : {host.address}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        Type : {host.metadata.propertyType}
                      </Typography>
                      {/* loop through the reviews  */}
                      <Typography variant='body2' color='text.secondary'>
                        Beds : {host.metadata.beds}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        Bathrooms : {host.metadata.bathrooms}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        Bedrooms : {host.metadata.bedrooms}
                      </Typography>
                      <Typography gutterBottom variant='h8' component='div'>
                         Number of reviews: {host.reviews.length}
                        </Typography>
                        <Rating
                        name="simple-controlled"
                        // eslint-disable-next-line
                        value={host.reviews.reduce((total, currentValue) => total = total + currentValue.rating,0)/ host.reviews.length}
                        readOnly 
                      />
                      {host.metadata.images !==  null && <MyCarousel images={host.metadata.images} />}
                    </Grid>
                    <Grid item>
                    <Typography variant='subtitle1' component='div'>
                      {host.price} AUD
                    </Typography>
                  </Grid>
                    {bookDialog}
                    <Grid item>
                      <Button onClick={handleNewBooking}> Make a new booking
                    </Button>
                    </Grid>
                    {reviewsDialog}
                    <Grid item>
                      <Button onClick={handleReviews}> View Reviews
                    </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
            <Button onClick={handleGoBack}> Go Back
        </Button>
          </Container>
          <Box>
      <Container maxWidth='sm'>
        <Typography component='h1' variant='h2' align='center' gutterBottom>
          All Your Bookings
        </Typography>
      </Container>
    </Box>
    <Container sx={{ py: 8 }} maxWidth='md'>
      {details.length !== 0 && (<Grid container spacing={4}>
      {details.map(booking => {
          const renderEach = (
            <Grid item key={booking.id} xs={12} sm={6} md={4}>
              <UserBooking {...booking} />
            </Grid>
          );
          return renderEach;
          })}
      </Grid>)}
    </Container>
        </ThemeProvider>
      )}
    </>
  );
}
