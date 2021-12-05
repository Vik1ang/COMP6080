import React from 'react';
import { useHistory } from 'react-router-dom';
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import { ThemeProvider } from '@mui/styles';
import ReactPlayer from "react-player";
import PropTypes from 'prop-types';
import localforage from "localforage";
import theme from '../../theme';
import {isEqual, uniq, get} from "../../utils/lodash";

export default function LandingList(props) {


  // eslint-disable-next-line no-unused-vars
  const { address, id, owner, price, reviews, thumbnail, title } = props;
  const history = useHistory();
  const handleViewListingPage = async () => {
    const user = await localforage.getItem('user');
    if (!isEqual(user, null)) {
      const footPrint = await localforage.getItem('footPrint');
      if (isEqual(footPrint, null)) {
        const temp = {};
        temp[user] = [id];
        await localforage.setItem('footPrint', temp);
      } else {
        const list = get(footPrint, `${user}`, []);
        list.push(id);
        const after = { ...footPrint };
        after[user] = uniq(list);
        await localforage.setItem('footPrint', after);
      }
    }
    history.push(`/listing/${id}`);
  };
  return (
    <>
      <ThemeProvider theme={theme}>
        <Card sx={{ maxWidth: 345, maxHeight: 500}}>
          <CardHeader avatar={<Avatar sx={{ bgcolor: red[500] }}>L</Avatar>} title='Listing' />
          {thumbnail.startsWith("data:image") && (<CardMedia component='img' image={thumbnail} alt='thumbnail' sx={{ maxHeight: 120 }} />)}
          {thumbnail.startsWith("https") && (<ReactPlayer url={thumbnail}  alt='thumbnail'   origin= 'http://localhost:3000' width="100%"
      height="100%" autoPlay controls/>)}
          <CardContent>
            <Typography gutterBottom variant='h4' component='div'>
              {/* {props.title} */}
            </Typography>
            <Typography gutterBottom variant='h8' component='div'>
              Property title: {title}
            </Typography>
            <Typography gutterBottom variant='h8' component='div'>
              Number of reviews: {reviews.length}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size='small' onClick = {handleViewListingPage}>View</Button>
          </CardActions>
        </Card>
      </ThemeProvider>
    </>
  );
}

LandingList.propTypes = {
  address: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  owner: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  reviews: PropTypes.instanceOf(Array).isRequired,
  thumbnail: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
