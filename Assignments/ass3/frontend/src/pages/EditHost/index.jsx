import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  CardMedia,
  Container,
  CssBaseline,
  Grid,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material';
import ReactPlayer from "react-player";
import theme from '../../theme';
import Header from '../../components/Header';
import msgPopup from '../../utils/msgPopup';
import { fileToDataUrl} from "../../utils/utils";
import { requestGetOneListing, requestEditListing } from '../../services/request';
import { isEqual } from '../../utils/lodash';
import MyCarousel from '../../components/MyCarousel';

export default function EditListing() {
  const history = useHistory();

  const { id } = useParams();

  const [host, setHost] = useState({});
  const [loading, setLoading] = useState(true);
  const [thumbnail_, setThumbnail_] = useState('');
  const [images, setImages] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line promise/catch-or-return
    requestGetOneListing(id)
      .then(({ listing }) => {
        setHost(listing);
        setThumbnail_(listing.thumbnail);
        return undefined;
      })
      .catch(error => console.log(error))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdateThumbnail = async event => {
    try {
      const response = await fileToDataUrl(event.target.files[0]);
      setThumbnail_(response);
    } catch (error) {
      msgPopup(error.message);
    }
  };

  const handleCancel = () => history.goBack();
  const handleImagesUpdate = async event => {
    /* const response = await fileToDataUrl(event.target.files);
                             console.log(response); */
    try {
      const temp = [];
      // event.target.files.keys.map(async file => {
      //   temp.push(await fileToDataUrl(file));
      // });
      // console.log(temp);
      // eslint-disable-next-line no-restricted-syntax
      for (const file of Array.from(event.target.files)) {
        // eslint-disable-next-line no-await-in-loop
        temp.push(await fileToDataUrl(file));
      }
      console.log(temp);
      setImages(temp);
    } catch (error) {
      msgPopup(error.message);
      event.stopPropagation();
    }
  };

  const handleEditListing = async event => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const file = formData.get('thumbnail');
    let thumbnail ;
    try {
      if (file.size > 0) {
        console.log(file);
        thumbnail = await fileToDataUrl(file);
      }
      else {
        thumbnail = formData.get('video');
      }
      
    } catch (error) {
      msgPopup(error.message);
      event.stopPropagation();
    }

    const payload = {
      title: formData.get('title'),
      address: formData.get('address'),
      price: formData.get('price'),
      thumbnail,
      metadata: {
        propertyType: formData.get('propertyType'),
        bathrooms: formData.get('bathrooms'),
        bedrooms: formData.get('bedrooms'),
        amenities: formData.get('amenities'),
        images,
      },
    };

    const { reviews, availability, published, postedOn, owner, ...compare } = host;

    if (isEqual(payload, compare)) {
      msgPopup('You have not changed any information', 'warn');
      event.stopPropagation();
    } else {
      requestEditListing(payload, id)
        .then(async response => {
          msgPopup('Edit Host Successfully', 'success');
          history.goBack();
          return { ...response };
        })
        .catch(error => ({ ...error }));
    }
  };

  return (
    <>
      {!loading && (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header />
          <Container component='main' maxWidth='sm' sx={{ mb: 4 }}>
            <Paper variant='outlined' sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
              <Typography variant='h6' gutterBottom>
                Edit listing
              </Typography>
              <Box component='form' variant='h5' onSubmit={handleEditListing}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      margin='normal'
                      id='title'
                      name='title'
                      label='Host title'
                      fullWidth
                      autoComplete='Title'
                      variant='standard'
                      defaultValue={host.title}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      margin='normal'
                      id='address'
                      name='address'
                      label='Host address'
                      fullWidth
                      autoComplete='Address'
                      variant='standard'
                      defaultValue={host.address}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      margin='normal'
                      id='price'
                      name='price'
                      label='Host price'
                      fullWidth
                      autoComplete='Price'
                      variant='standard'
                      defaultValue={host.price}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      margin='normal'
                      id='propertyType'
                      name='propertyType'
                      label='Property Type'
                      fullWidth
                      autoComplete='Property Type'
                      variant='standard'
                      defaultValue={host.metadata.propertyType}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      margin='normal'
                      id='amenities'
                      name='amenities'
                      label='Amenities'
                      fullWidth
                      autoComplete='Amenities'
                      variant='standard'
                      defaultValue={host.metadata.amenities}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      margin='normal'
                      id='bathrooms'
                      name='bathrooms'
                      label='Bathrooms'
                      fullWidth
                      autoComplete='Bathrooms'
                      variant='standard'
                      defaultValue={host.metadata.bathrooms}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      margin='normal'
                      id='bedrooms'
                      name='bedrooms'
                      label='Bedrooms'
                      fullWidth
                      autoComplete='Bedrooms'
                      variant='standard'
                      defaultValue={host.metadata.bedrooms}
                    />
                  </Grid>
                  <Grid item xs={12}>
                  {host.thumbnail.startsWith("data:image") && (<CardMedia component='img' image={thumbnail_} alt='thumbnail' sx={{ maxHeight: 120 }} />)}
                  {host.thumbnail.startsWith("https") && (<ReactPlayer url={host.thumbnail}  alt='thumbnail'   origin= 'http://localhost:3000' width="100%"
              height="100%" autoPlay controls/>)}
                  </Grid>
                  <Grid item xs={12}>
                  <Typography variant='h6' gutterBottom>
                      Change the thumbnail by either upload file or fill in video url
                    </Typography>
                    <TextField
                      margin='normal'
                      id='thumbnail'
                      name='thumbnail'
                      fullWidth
                      autoComplete='Thumbnail'
                      variant='standard'
                      type='file'
                      onChange={handleUpdateThumbnail}
                    />
                     <TextField
                    margin='normal'
                    id='video'
                    name='video'
                    label='video'
                    fullWidth
                    autoComplete='Video'
                    variant='standard'
                  />
                  </Grid>
                 
                 
                <Grid item xs={12}>
                <Typography variant='h6' gutterBottom>
                    {" "} New list of images
                    </Typography>
                  {images && <MyCarousel images={images} />}
                  <TextField
                    margin='normal'
                    id='images'
                    name='images'
                    fullWidth
                    autoComplete='Thumbnail'
                    variant='standard'
                    type='file'
                    inputProps={{ multiple: true }}
                    onChange={handleImagesUpdate}
                  />
                </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant='contained' sx={{ mt: 3, ml: 1 }} onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type='submit' variant='contained' sx={{ mt: 3, ml: 1 }}>
                    Save the updates
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Container>
        </ThemeProvider>
      )}
    </>
  );
}
