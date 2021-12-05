import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardMedia,
  Container,
  Checkbox,
  CssBaseline,
  Grid,
  FormGroup,
  FormControlLabel,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { Input, InputNumber } from 'antd';
import 'antd/es/input-number/style/index.css';
import { useHistory } from 'react-router-dom';
import { parseInt } from 'lodash';
import theme from '../../theme';
import Header from '../Header';
// eslint-disable-next-line no-unused-vars
import { requestNewHost } from '../../services/request';
import msgPopup from '../../utils/msgPopup';
import { fileToDataUrl } from '../../utils/utils';
import MyCarousel from '../MyCarousel';
import { get, last } from '../../utils/lodash';

export default function NewHost() {
  const history = useHistory();

  const [thumbnail_, setThumbnail_] = useState(null);

  const [images, setImages] = useState(null);
  const [checked, setChecked] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [json, setJson] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [bedroomNumbers, setBedroomNumbers] = useState(1);
  const [types, setTypes] = useState([0]);

  const handleChange = event => {
    setChecked(event.target.checked);
  };

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

  const handleUpdateThumbnail = async event => {
    try {
      const response = await fileToDataUrl(event.target.files[0]);
      setThumbnail_(response);
    } catch (error) {
      msgPopup(error.message);
    }
  };

  const handleGoBack = () => {
    history.push('/host');
  };

  const handleAddNewHost = async event => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const bedsTypes = {};

    types.forEach(value => {
      const bedName = `beds${value}`;
      const typeName = `types${value}`;

      const bedsCount = parseInt(formData.get(bedName));

      const type = formData.get(typeName);

      bedsTypes[type] = get(bedsTypes, bedsTypes[type], 0) + bedsCount;
    });

    const file = formData.get('thumbnail');
    let payload;
    let thumbnail = null;
    if (!checked) {
      try {
        if (file.size > 0) {
          console.log(file);
          thumbnail = await fileToDataUrl(file);
        } else {
          thumbnail = formData.get('video');
        }
      } catch (error) {
        msgPopup(error.message);
        event.stopPropagation();
      }
      payload = {
        title: formData.get('title'),
        address: formData.get('address'),
        price: formData.get('price'),
        thumbnail,
        metadata: {
          propertyType: formData.get('propertyType'),
          bathrooms: formData.get('bathrooms'),
          bedrooms: formData.get('bedrooms'),
          amenities: formData.get('amenities'),
          beds: bedroomNumbers,
          images,
          types: bedsTypes,
        },
      };
      if (thumbnail !== null) {
        requestNewHost(payload)
          .then(async response => {
            msgPopup('Successfully', 'success');
            localStorage("listingId",response.listingId);

           
            return { ...response };
          })
          .catch(error => ({ ...error }));
      }
    } else {
      payload = formData.get('listJson');
      const fileReader = new FileReader();
      fileReader.readAsText(payload, 'UTF-8');
      fileReader.onload = e => {
        console.log('e.target.result', JSON.parse(e.target.result));
        setJson(JSON.parse(e.target.result));
        payload = json;
      };

      requestNewHost(payload)
        .then(async response => {
          msgPopup('Successfully', 'success');
          history.push("/host");
          return { ...response };
        })
        .catch(error => ({ ...error }));
    }
    history.push("/host");
  };

  const handleBedroomsChange = value => {
    setBedroomNumbers(value);
    setTypes([...types, last(types) + 1]);
  };

  const handleBedroomsBlur = event => {
    const currentValue = parseInt(event.target.value);
    if (currentValue > bedroomNumbers) {
      const temp = currentValue - bedroomNumbers;
      const appendArr = [];
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < temp; i++) {
        appendArr.push(last(types) + 1 + i);
      }
      setBedroomNumbers(currentValue);
      setTypes([...types, ...appendArr]);
    }
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <Container component='main' maxWidth='sm' sx={{ mb: 4 }}>
          <Paper variant='outlined' sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
            <Typography variant='h6' gutterBottom>
              Add new Host
            </Typography>
            <Box component='form' variant='h5' onSubmit={handleAddNewHost}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox checked={checked} onChange={handleChange} inputProps={{ 'aria-label': 'controlled' }} />
                  }
                  label='upload your own json file'
                />
              </FormGroup>
              {checked && (
                <TextField
                  margin='normal'
                  id='listJson'
                  name='listJson'
                  fullWidth
                  autoComplete='ListJson'
                  variant='standard'
                  type='file'
                />
              )}
              {!checked && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      margin='normal'
                      required={!checked}
                      id='title'
                      name='title'
                      label='Host title'
                      fullWidth
                      autoComplete='Title'
                      variant='standard'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      margin='normal'
                      required={!checked}
                      id='address'
                      name='address'
                      label='Host address'
                      fullWidth
                      autoComplete='Address'
                      variant='standard'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      margin='normal'
                      required={!checked}
                      id='price'
                      name='price'
                      label='Host price'
                      fullWidth
                      autoComplete='Price'
                      variant='standard'
                      min = {1}
                    />
                  </Grid>
                  {/* metadata field */}
                  <Grid item xs={12}>
                    <TextField
                      margin='normal'
                      required={!checked}
                      id='propertyType'
                      name='propertyType'
                      label='propertyType'
                      fullWidth
                      autoComplete='Property Type'
                      variant='standard'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      margin='normal'
                      required={!checked}
                      id='amenities'
                      name='amenities'
                      label='amenities'
                      fullWidth
                      autoComplete='Amenities'
                      variant='standard'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    Bathrooms: <InputNumber required id='bathrooms' name='bathrooms' defaultValue={1} min = {0}/>
                  </Grid>
                  <Grid item xs={12}>
                    Bedrooms:{' '}
                    <InputNumber
                      required={!checked}
                      id='bedrooms'
                      name='bedrooms'
                      min={bedroomNumbers}
                      value={bedroomNumbers}
                      onStep={handleBedroomsChange}
                      onBlur={handleBedroomsBlur}
                    />
                  </Grid>
                  <Grid item xs={12}>
                  <Box sx={{ border: '1px dashed grey' }}>
                    {types.map(value => {
                      const bedName = `beds${value}`;
                      const typeName = `types${value}`;
                      return (
                        // eslint-disable-next-line react/no-array-index-key
                        <Grid item xs={12} key={value}>
                          Beds: <InputNumber id={bedName} name={bedName} min={1} defaultValue={1} />
                          Types: <Input id={typeName} name={typeName} placeholder='type' />
                          <Button
                            variant='contained'
                            onClick={() => {
                              if (bedroomNumbers > 1) {
                                const temp = [...types];
                                temp.splice(value, 1);
                                setTypes([...temp]);
                                setBedroomNumbers(bedroomNumbers - 1);
                              }
                            }}>
                            Remove
                          </Button>

                        </Grid>
                      );
                    })}
                  </Box>
                  </Grid>
                  {/* <Grid item xs={12}>
                    Beds: <InputNumber required={!checked} id='beds' name='beds' min={1} max={10} defaultValue={1} />
                  </Grid> */}
                  <Grid item xs={12}>
                    <Card>
                      <CardHeader title='thumbnail' />
                      <CardMedia component='img' image={thumbnail_} />
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
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
                  {images && <MyCarousel images={images} />}
                  <Grid item xs={12}>
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
              )}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant='contained' sx={{ mt: 3, ml: 1 }} onClick={handleGoBack}>
                  Cancel
                </Button>
                <Button type='submit' variant='contained' sx={{ mt: 3, ml: 1 }}>
                  Add
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </ThemeProvider>
    </>
  );
}
