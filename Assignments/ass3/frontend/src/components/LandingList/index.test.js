// eslint-disable-next-line no-unused-vars
import {mount, shallow} from 'enzyme';
// eslint-disable-next-line no-unused-vars
import React from 'react';
// eslint-disable-next-line no-unused-vars
import renderer from 'react-test-renderer';
import { Typography, Button, CardMedia } from '@mui/material';
import toJson from 'enzyme-to-json';
// eslint-disable-next-line no-unused-vars
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import LandingList from './index';
import ReactPlayer from 'react-player';

const props = {
  address: '1 Lorne Avenue, Kensington',
  id: '182474842',
  owner: 'test2@mail.com',
  price: 213,
  reviews: [{
    comment: 'This is a great place to live in',
    rating: '3',
  }],
  title: "The most valuable estate",
  thumbnail: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
};

const props_two = {
    address: '1 Lorne Avenue, Kensington',
    id: '182474842',
    listingId: '771409719',
    owner: 'test2@mail.com',
    price: 213,
    reviews: [{
      comment: 'This is a great place to live in',
      rating: '3',
    }],
    title: "The most valuable estate",
    thumbnail: "https://www.youtube.com/watch?v=V6d4bc7d58c",
  };

afterEach(cleanup);

describe('LandingList', () => {
  it('render LandingList correctly', () => {
    const landingList = shallow(<LandingList {...props} />);
    expect(toJson(landingList)).toMatchSnapshot();
  });

  it('render LandingList without crashing', () => {
    expect(shallow(<LandingList {...props} />));
  });

  it('render LandingList Property Title', () => {
    const wrapper = shallow(<LandingList{...props} />);
    const { title } = props;
    const titleDom = (
      <Typography gutterBottom variant='h8' component='div'>
        Property title: {title}
      </Typography>
    );
    expect(wrapper.contains(titleDom)).toEqual(true);
  });

  it('render LandingList Number of Reviews', () => {
    const wrapper = shallow(<LandingList{...props} />);
    const { reviews } = props;
    const reviewsDom = (
        <Typography gutterBottom variant='h8' component='div'>
        Number of reviews: {reviews.length}
      </Typography>
    );
    expect(wrapper.contains(reviewsDom)).toEqual(true);
  });

  it('render LandingList image thumbnail', () => {
    const wrapper = shallow(<LandingList {...props} />);
    setTimeout(() => expect(wrapper.find(CardMedia)).toHaveLength(1), 3000);
  });

  it('render LandingList video thumbnail', () => {
    const wrapper = shallow(<LandingList {...props_two} />);
    setTimeout(() => expect(wrapper.find(ReactPlayer)).toHaveLength(1), 3000);
  });

});
