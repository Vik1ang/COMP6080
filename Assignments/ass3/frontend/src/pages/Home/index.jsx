import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../../components/Header';
import Landing from '../Landing';
import SearchFilter from '../../components/SearchFilter';
import ListingsContext from '../../context/listingsContext';

export default function Home() {
  // eslint-disable-next-line no-unused-vars
  const history = useHistory();

  const [listings, setListings] = useState(null);

  return (
    <>
      <ListingsContext.Provider value={{listings, setListings}}>
        <Header />
        <SearchFilter />
        <Landing />
      </ListingsContext.Provider>
    </>
  );
}
