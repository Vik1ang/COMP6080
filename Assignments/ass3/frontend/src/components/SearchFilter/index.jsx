import React, { useContext, useReducer, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import AdapterDayjs from '@mui/lab/AdapterDayjs';
import { DateRangePicker, LocalizationProvider } from '@mui/lab';
import * as dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/esm/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/esm/plugin/isSameOrBefore';
import VerEx from 'verbal-expressions';
import { nanoid } from 'nanoid';
import localforage from 'localforage';
import { parseInt, isNaN, trim, isEqual, uniq, toLower, includes } from '../../utils/lodash';
import ListingsContext from '../../context/listingsContext';
import { requestGetBookings, requestGetListings, requestGetOneListing } from '../../services/request';
import msgPopup from '../../utils/msgPopup';
import useEffectDeep from '../../hooks/useEffectDeep';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const initialState = {
  text: '',
  dateRange: [null, null],
  minPrice: '',
  isMinPriceWrong: false,
  maxPrice: '',
  isMaxPriceWrong: false,
  minBedroom: '',
  isMinBedroomWrong: false,
  maxBedroom: '',
  isMaxBedroomWrong: false,
  reviewOrder: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'text':
      return { ...state, text: action.payload };
    case 'dateRange':
      return { ...state, dateRange: action.payload };
    case 'minPrice':
      return { ...state, isMinPriceWrong: false, minPrice: action.payload };
    case 'minPriceWrong':
      return { ...state, isMinPriceWrong: true, minPrice: action.payload };
    case 'maxPrice':
      return { ...state, isMaxPriceWrong: false, maxPrice: action.payload };
    case 'maxPriceWrong':
      return { ...state, isMaxPriceWrong: true, maxPrice: action.payload };
    case 'minBedroom':
      return { ...state, isMinBedroomWrong: false, minBedroom: action.payload };
    case 'minBedroomWrong':
      return { ...state, isMinBedroomWrong: true, minBedroom: action.payload };
    case 'maxBedroom':
      return { ...state, isMaxBedroomWrong: false, maxBedroom: action.payload };
    case 'maxBedroomWrong':
      return { ...state, isMaxBedroomWrong: true, maxBedroom: action.payload };
    case 'reviewOrder':
      return { ...state, reviewOrder: action.payload };
    case 'reset':
      return { ...initialState };
    default:
      return { ...initialState };
  }
}

function init() {
  return initialState;
}

export default function SearchFilter() {
  // eslint-disable-next-line no-unused-vars
  const { listings, setListings } = useContext(ListingsContext);

  const [all, setAll] = useState(null);

  const [state, dispatch] = useReducer(reducer, initialState, init);

  const [suggestions, setSuggestions] = useState([]);

  const [uuid, setUUID] = useState(nanoid());

  const {
    text,
    dateRange,
    minPrice,
    isMinPriceWrong,
    maxPrice,
    isMaxPriceWrong,
    minBedroom,
    isMinBedroomWrong,
    maxBedroom,
    isMaxBedroomWrong,
    reviewOrder,
  } = state;

  const getLists = async () => {
    try {
      const response = await requestGetListings();
      let temp = [];
      const suggestTemp = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const listing of response.listings) {
        const { title, address } = listing;
        // eslint-disable-next-line no-await-in-loop
        const res = await requestGetOneListing(listing.id);
        temp.push({ ...res.listing, id: listing.id });
        suggestTemp.push(title);
        suggestTemp.push(address);
      }
      const user = await localforage.getItem('user');
      if (isEqual(user, null)) {
        temp = temp.sort((a, b) => {
          if (a.title > b.title) {
            return 1;
          }
          if (a.title < b.title ) {
            return -1;
          }
          return 0;
        });
      } else {
        const { bookings } = await requestGetBookings();
        const tempBookings = [];
        bookings.forEach(booking => {
          if (isEqual(booking.owner, user)) {
            tempBookings.push(booking.listingId);
          }
        });
        temp = temp.sort((a, b) => {
          if (includes(tempBookings, a.id.toString())) {
            return -1;
          }
          if (includes(tempBookings, b.id.toString())) {
            return 1;
          }
          if (a.title > b.title) {
            return 1;
          }
          if (a.title < b.title ) {
            return -1;
          }
          return 0;
        });
      }
      setAll(temp);
      setListings(temp);
      suggestTemp.push('');
      setSuggestions(uniq(suggestTemp));
    } catch (error) {
      msgPopup(error.message);
    }
  };

  useEffectDeep(() => {
    getLists();
  }, [all]);

  const handleSearchInput = event => {
    let { value } = event.target;
    value = trim(value);
    dispatch({ type: 'text', payload: value });
  };

  const handleDateRangeChange = newValue => {
    dispatch({ type: 'dateRange', payload: newValue });
  };

  const handleMinPrice = event => {
    let { value } = event.target;
    value = trim(value);
    if (!isEqual(value, '')) {
      const result = parseInt(value);
      if (isNaN(result)) {
        dispatch({ type: 'minPriceWrong', payload: value });
      } else {
        dispatch({ type: 'minPrice', payload: result });
      }
    } else {
      dispatch({ type: 'minPrice', payload: '' });
    }
  };

  const handleMaxPrice = event => {
    let { value } = event.target;
    value = trim(value);
    if (!isEqual(value, '')) {
      const result = parseInt(value);
      if (isNaN(result)) {
        dispatch({ type: 'maxPriceWrong', payload: value });
      } else {
        dispatch({ type: 'maxPrice', payload: result });
      }
    } else {
      dispatch({ type: 'maxPrice', payload: '' });
    }
  };

  const handleMinBedroom = event => {
    let { value } = event.target;
    value = trim(value);
    if (!isEqual(value, '')) {
      const result = parseInt(value);
      if (isNaN(result)) {
        dispatch({ type: 'minBedroomWrong', payload: value });
      } else {
        dispatch({ type: 'minBedroom', payload: result });
      }
    } else {
      dispatch({ type: 'minBedroom', payload: '' });
    }
  };

  const handleMaxBedroom = event => {
    let { value } = event.target;
    value = trim(value);
    if (!isEqual(value, '')) {
      const result = parseInt(value);
      if (isNaN(result)) {
        dispatch({ type: 'maxBedroomWrong', payload: value });
      } else {
        dispatch({ type: 'maxBedroom', payload: result });
      }
    } else {
      dispatch({ type: 'maxBedroom', payload: '' });
    }
  };

  const handleSearchEvent = () => {
    let copyListings = [...all];

    // input
    if (!isEqual(text, '')) {
      // eslint-disable-next-line array-callback-return,consistent-return
      copyListings = copyListings.filter(listing => {
        const { title, address } = listing;
        const regExp = VerEx().find(toLower(text));
        if (regExp.test(toLower(title)) || regExp.test(toLower(address))) {
          return listing;
        }
      });
    }

    // check-in check-out
    if (!isEqual(dateRange[0], null) && !isEqual(dateRange[1], null)) {
      // eslint-disable-next-line array-callback-return,consistent-return
      copyListings = copyListings.filter(listing => {
        const { availability } = listing;
        // eslint-disable-next-line no-restricted-syntax
        for (const timeRange of availability) {
          const { start, end } = timeRange;
          if (dayjs(dateRange[0]).isSameOrAfter(start, 'day') && dayjs(dateRange[1]).isSameOrBefore(end, 'day')) {
            return listing;
          }
        }
      });
    }

    // min price
    if (!isEqual(minPrice, '')) {
      // eslint-disable-next-line array-callback-return
      copyListings = copyListings.filter(listing => {
        const { price } = listing;
        return minPrice <= parseInt(price);
      });
    }

    // max price
    if (!isEqual(maxPrice, '')) {
      // eslint-disable-next-line array-callback-return
      copyListings = copyListings.filter(listing => {
        const { price } = listing;
        return maxPrice >= parseInt(price);
      });
    }

    // min bedrooms
    if (!isEqual(minBedroom, '')) {
      // eslint-disable-next-line array-callback-return
      copyListings = copyListings.filter(listing => {
        const { bedrooms } = listing.metadata;
        return minBedroom <= parseInt(bedrooms);
      });
    }

    // max bedrooms
    if (!isEqual(maxBedroom, '')) {
      // eslint-disable-next-line array-callback-return
      copyListings = copyListings.filter(listing => {
        const { bedrooms } = listing.metadata;
        return maxBedroom >= parseInt(bedrooms);
      });
    }

    if (isEqual(parseInt(reviewOrder), 1)) {
      copyListings = copyListings.sort((a, b) => {
        const aReviews = a.reviews;
        const bReviews = b.reviews;
        const aRating = aReviews.reduce((prev, curr) => prev + curr.rating, 0);
        const bRating = bReviews.reduce((prev, curr) => prev + curr.rating, 0);
        return bRating - aRating;
      });
    } else if (isEqual(parseInt(reviewOrder), 2)) {
      copyListings = copyListings.sort((a, b) => {
        const aReviews = a.reviews;
        const bReviews = b.reviews;
        const aRating = aReviews.reduce((prev, curr) => prev + curr.rating, 0);
        const bRating = bReviews.reduce((prev, curr) => prev + curr.rating, 0);
        return aRating - bRating;
      });
    }
    console.log(copyListings);
    setListings([...copyListings]);
  };

  const resetAll = () => {
    dispatch({ type: 'reset' });
    setUUID(nanoid());
    setListings([...all]);
  };

  return (
    <>
      <Container maxWidth='sm'>
        <Box>
          <Autocomplete
            key={uuid}
            freeSolo
            disableClearable
            clearOnBlur
            handleHomeEndKeys
            selectOnFocus
            options={suggestions}
            getOptionLabel={option => option}
            onChange={(_, value) => {
              dispatch({ type: 'text', payload: value });
            }}
            renderInput={params => (
              <TextField
                {...params}
                label='Please enter a destination, city or attraction'
                margin='normal'
                fullWidth
                type='text'
                onChange={handleSearchInput}
                onKeyDown={event => {
                  if (isEqual(event.key, 'Enter')) {
                    handleSearchEvent();
                  }
                }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <InputAdornment position='end' onClick={handleSearchEvent}>
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangePicker
              minDate={dayjs()}
              showToolbar
              showTodayButton
              clearable
              startText='Check-in'
              endText='Check-out'
              value={dateRange}
              onChange={handleDateRangeChange}
              renderInput={(startProps, endProps) => (
                <>
                  <TextField {...startProps} />
                  <Box sx={{ mx: 2 }}> to </Box>
                  <TextField {...endProps} />
                </>
              )}
            />
          </LocalizationProvider>
          <Box>
            <Typography gutterBottom>Price</Typography>
            <TextField
              label='Minimum price'
              value={minPrice}
              error={isMinPriceWrong}
              helperText={isMinPriceWrong ? 'Please type a number' : ''}
              onChange={handleMinPrice}
              InputProps={{
                endAdornment: <InputAdornment position='end'>$</InputAdornment>,
              }}
            />
            To
            <TextField
              label='Maximum price'
              value={maxPrice}
              error={isMaxPriceWrong}
              helperText={isMaxPriceWrong ? 'Please type a number' : ''}
              onChange={handleMaxPrice}
              InputProps={{
                endAdornment: <InputAdornment position='end'>$</InputAdornment>,
              }}
            />
          </Box>

          <Box>
            <Typography gutterBottom>Bedrooms</Typography>
            <TextField
              label='Minimum bedrooms'
              value={minBedroom}
              error={isMinBedroomWrong}
              helperText={isMinBedroomWrong ? 'Please type a number' : ''}
              onChange={handleMinBedroom}
              InputProps={{
                endAdornment: <InputAdornment position='end'>$</InputAdornment>,
              }}
            />
            To
            <TextField
              label='Maximum bedrooms'
              value={maxBedroom}
              error={isMaxBedroomWrong}
              helperText={isMaxBedroomWrong ? 'Please type a number' : ''}
              onChange={handleMaxBedroom}
              InputProps={{
                endAdornment: <InputAdornment position='end'>$</InputAdornment>,
              }}
            />
          </Box>
          <Box>
            <FormControl>
              <FormLabel>reviews order</FormLabel>
              <RadioGroup
                value={reviewOrder}
                aria-label='reviews order'
                onChange={event => {
                  const { value } = event.target;
                  dispatch({ type: 'reviewOrder', payload: value });
                }}>
                <FormControlLabel value={0} control={<Radio />} label='Normal' />
                <FormControlLabel value={1} control={<Radio />} label='Highest' />
                <FormControlLabel value={2} control={<Radio />} label='Lowest' />
              </RadioGroup>
            </FormControl>
          </Box>
          <Button onClick={resetAll}>Reset</Button>
        </Box>
      </Container>
    </>
  );
}
