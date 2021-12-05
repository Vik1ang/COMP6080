// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  Rating,
  TextField,
  Typography,
} from '@mui/material';
import { red } from '@mui/material/colors';
import { ThemeProvider } from '@mui/styles';
import PropTypes from 'prop-types';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { DateRangePicker, LocalizationProvider } from '@mui/lab';
import AdapterDayjs from '@mui/lab/AdapterDayjs';
import ReactPlayer from "react-player";
import * as dayjs from 'dayjs';
import msgPopup from '../../utils/msgPopup';
import {requestDeleteListing, requestPublishListing, requestUnpublishListing} from '../../services/request';
import theme from '../../theme';

import { isEqual, pullAt } from '../../utils/lodash';

export default function HostedListing(props) {
  // eslint-disable-next-line no-unused-vars
  const { address, id, owner, price, reviews, thumbnail, title, metadata, published } = props;
  const history = useHistory();

  const [isGoLiveDialog, setGoLiveDialog] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [dateRange, setDateRange] = useState([[null, null]]);
  // const [rating, setRating] = React.useState(0);
  // eslint-disable-next-line
  // const result = reviews.reduce((total, currentValue) => total = total + currentValue.rating,0);

  const handleEditPage = () => {
    history.push(`/host/edit/${id}`);
  };

  const handleViewBookings = () => {
    history.push(`/host/bookings/${id}`);
  };

  const handleAddAvailabilityList = () => setDateRange([...dateRange, [null, null]]);

  const handleGoLive = () => {
    let availability;

    try {
      availability = dateRange.map(value => {
        if (isEqual(value[0], null) || isEqual(value[1], null)) {
          throw Error('You have to fill check-in day and check-out day');
        }
        const start = dayjs(value[0]).toISOString();
        const end = dayjs(value[1]).toISOString();
        return { start, end };
      });
      requestPublishListing(id, {availability}).then(response => {
        msgPopup('Publish Successfully', 'success');
        setGoLiveDialog(false);
        history.push(`/`);
        return {...response};
      }).catch(error=>({...error}))
    } catch (error) {
      msgPopup(error.message);
    }
  };

  const goLiveDialog = (
    <Dialog
      open={isGoLiveDialog}
      onClose={() => setGoLiveDialog(false)}
      aria-labelledby='go-live-dialog'
      aria-describedby='go-live-dialog-description'>
      <DialogTitle>Choose the availability</DialogTitle>
      <DialogContent>
        <List sx={{ pt: 0 }}>
          <ListItem autoFocus button onClick={handleAddAvailabilityList}>
            <ListItemAvatar>
              <Avatar>
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
          </ListItem>
          {dateRange.map((data, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <ListItem key={index}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateRangePicker
                  minDate={dayjs()}
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
                      <TextField {...startProps} name = "checkIn"/>
                      <Box sx={{ mx: 2 }}>to</Box>
                      <TextField {...endProps} name = "checkOut"/>
                      <Button name = "confirmDate"
                        onClick={() => {
                          const temp = [...dateRange];
                          pullAt(temp, [index]);
                          setDateRange([...temp]);

                        }}>
                        <RemoveIcon />
                      </Button>
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
        <Button onClick={handleGoLive} name="goLive">Confirm Go live</Button>
      </DialogActions>
    </Dialog>
  );

  const handleDeleteListing = () => {
    requestDeleteListing(id)
      .then(async response => {
        msgPopup('Delete Host Successfully', 'success');
        history.goBack();
        return { ...response };
      })
      .catch(error => ({ ...error }));
  };

  const handleUnpublishListing = () => {
    requestUnpublishListing(id)
      .then(async response => {
        msgPopup('Unpublish Listing Successfully', 'success');
        history.goBack();
        return { ...response };
      })
      .catch(error => ({ ...error }));
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <Card sx={{ maxWidth: 5000, maxHeight: 10000 }}>
          <CardHeader avatar={<Avatar sx={{ bgcolor: red[500] }}>A</Avatar>} title='Listing' />
          {thumbnail.startsWith("data:image") && (<CardMedia component='img' image={thumbnail} alt='thumbnail' sx={{ maxHeight: 120, maxWidth:400 }} />)}
          {thumbnail.startsWith("https") && (<ReactPlayer url={thumbnail}  alt='thumbnail'   origin= 'http://localhost:3000' width="100%"
      height="100%" autoPlay controls/>)}
          <CardContent>
            <Typography gutterBottom variant='h8' component='div'>
              Property title: {title}
            </Typography>
            <Typography gutterBottom variant='h8' component='div'>
              Property Type: {metadata.propertyType}
            </Typography>
            <Typography gutterBottom variant='h8' component='div'>
             Price per night: {price} AUD
            </Typography>
            <Typography gutterBottom variant='h8' component='div'>
              Bedrooms: {metadata.bedrooms}
            </Typography>
            <Typography gutterBottom variant='h8' component='div'>
              Beds: {metadata.beds}
            </Typography>
            <Typography gutterBottom variant='h8' component='div'>
              Bathrooms: {metadata.bathrooms}
            </Typography>
            <Typography gutterBottom variant='h8' component='div'>
              Amenities: {metadata.amenities}
            </Typography>
            <Typography gutterBottom variant='h8' component='div'>
              Number of reviews: {reviews.length}
            </Typography>
            <Rating
            name="simple-controlled"
            // eslint-disable-next-line
            value={reviews.reduce((total, currentValue) => total = total + currentValue.rating,0)}
            readOnly 
          />
          </CardContent>
          <CardActions>
            <Button size='small' onClick={handleEditPage}>
              Edit
            </Button>
            {!published && (
              <Button size='small' name="Publish"onClick={() => setGoLiveDialog(true)}>
                
                Publish{' '}
              </Button>
            )}
            {published && (
              <Button size='small' name="unpublish"onClick={handleUnpublishListing}>
                {' '}
                Unpublish{' '}
              </Button>
            )}

          </CardActions>
          <CardActions>
          <Button size='small' name = "deleteListing" onClick={handleDeleteListing}>
              {' '}
              Delete{' '}
            </Button>

            <Button size='small' name = "bookings" onClick={handleViewBookings}>
              {' '}
              Bookings{' '}
            </Button>
          </CardActions>
        </Card>
        {goLiveDialog}
      </ThemeProvider>
    </>
  );
}

HostedListing.propTypes = {
  address: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  owner: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  reviews: PropTypes.instanceOf(Array).isRequired,
  thumbnail: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  metadata: PropTypes.instanceOf(Object).isRequired,
  published: PropTypes.bool.isRequired,
};
