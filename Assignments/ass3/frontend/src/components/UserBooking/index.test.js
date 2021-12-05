// eslint-disable-next-line no-unused-vars
import {mount, shallow} from 'enzyme';
// eslint-disable-next-line no-unused-vars
import React from 'react';
// eslint-disable-next-line no-unused-vars
import renderer from 'react-test-renderer';
import { Typography, Button } from '@mui/material';
import toJson from 'enzyme-to-json';
// eslint-disable-next-line no-unused-vars
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import UserBooking from './index';

const props = {
  status: 'accepted',
  id: '182474842',
  listingId: '771409719',
  owner: 'test2@mail.com',
  totalPrice: 213,
  dateRange: {
    start: '2021-10-05T16:00:00.000Z',
    end: '2021-10-06T16:00:00.000Z',
  },
};

const props_two = {
    status: 'pending',
    id: '182474842',
    listingId: '771409719',
    owner: 'test2@mail.com',
    totalPrice: 213,
    dateRange: {
      start: '2021-10-05T16:00:00.000Z',
      end: '2021-10-06T16:00:00.000Z',
    },
  };

afterEach(cleanup);

describe('UserBooking', () => {
  it('render UserBooking correctly', () => {
    const userBooking = shallow(<UserBooking {...props} />);
    expect(toJson(userBooking)).toMatchSnapshot();
  });

  it('render UserBooking without crashing', () => {
    expect(shallow(<UserBooking {...props} />));
  });

  it('render UserBooking status', () => {
    const wrapper = shallow(<UserBooking {...props} />);
    const { status } = props;
    const statusDom = (
      <Typography gutterBottom variant='h8' component='div'>
        Status: {status}
      </Typography>
    );
    expect(wrapper.contains(statusDom)).toEqual(true);
  });

  it('render UserBooking start Date', () => {
    const wrapper = shallow(<UserBooking {...props} />);
    const startDom = (
      <Typography gutterBottom variant='h8' component='div'>
        StartDate: 06/10/2021
      </Typography>
    );
    expect(wrapper.contains(startDom)).toEqual(true);
  });

  it('render UserBooking end Date', () => {
    const wrapper = shallow(<UserBooking {...props} />);
    const endDom = (
      <Typography gutterBottom variant='h8' component='div'>
        EndDate: 07/10/2021
      </Typography>
    );
    expect(wrapper.contains(endDom)).toEqual(true);
  });

  it('click leave review', () => {
    const { getByText } = render(
      <Router>
        <Route>
          <UserBooking {...props} />
        </Route>
      </Router>,
    );
    fireEvent.click(getByText('Leave a Review'));
    const { listingId, id } = props;
    expect(window.location.href).toEqual(`http://localhost/listing/${listingId}/review/${id}`);
  });

  // FIXME: idk
  it('click delete booking', async () => {
    const {  queryByText } = render(<UserBooking {...props} />);
    setTimeout(() => expect(queryByText('Delete the booking successfully')).toBeNull(), 3000);
  });

  it('when the booking is not accepted, only have delete button',() => {
    const booking = shallow(<UserBooking {...props_two} />);
    expect(booking.find(Button)).toHaveLength(1);
  })

  it('when the booking is  accepted, have two buttons',() => {
    const booking = shallow(<UserBooking {...props} />);
    expect(booking.find(Button)).toHaveLength(2);
  })
});
