import React from 'react';
import { useHistory } from 'react-router-dom';
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import { ThemeProvider } from '@mui/styles';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import theme from '../../theme';
import { requestDeleteBooking } from '../../services/request';
import msgPopup from '../../utils/msgPopup';

export default function UserBooking(props) {
  const history = useHistory();
  // eslint-disable-next-line no-unused-vars
  const { dateRange, id, owner, totalPrice, listingId, status } = props;

  const handleDeleteBooking = () => {
    requestDeleteBooking(id)
      .then(async response => {
        msgPopup('Delete the booking successfully', 'success');
        history.goBack();
        return { ...response };
      })
      .catch(error => ({ ...error }));
  };

  const handleLeaveReview = () => {
    history.push(`/listing/${listingId}/review/${id}`);
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Card sx={{ maxWidth: 345, maxHeight: 360 }}>
          <CardHeader avatar={<Avatar sx={{ bgcolor: red[500] }}>B</Avatar>} title='Booking' />
          <CardContent>
            <Typography gutterBottom variant='h4' component='div'>
              {/* {props.title} */}
            </Typography>
            <Typography gutterBottom variant='h8' component='div'>
              Status: {status}
            </Typography>
            <Typography gutterBottom variant='h8' component='div'>
              StartDate: {dayjs(dateRange.start).format('DD/MM/YYYY')}
            </Typography>
            <Typography gutterBottom variant='h8' component='div'>
              EndDate: {dayjs(dateRange.end).format('DD/MM/YYYY')}
            </Typography>
          </CardContent>
          <CardActions>
            {status === 'accepted' && (
              <Button size='small' onClick={handleLeaveReview}>
                Leave a Review
              </Button>
            )}
            <Button size='small' onClick={handleDeleteBooking}>
              Delete
            </Button>
          </CardActions>
        </Card>
      </ThemeProvider>
    </>
  );
}

UserBooking.propTypes = {
  status: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  listingId: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
  totalPrice: PropTypes.number.isRequired,
  dateRange: PropTypes.instanceOf(Object).isRequired,
};
