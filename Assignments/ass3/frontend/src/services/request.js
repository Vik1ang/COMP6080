import { GET, POST, PUT, DELETE } from './api';

export const requestLogin = data =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line promise/catch-or-return
    POST('/user/auth/login', data).then(
      res => resolve(res),
      error => reject(error),
    );
  });

export const requestRegister = data =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line promise/catch-or-return
    POST('/user/auth/register', data).then(
      res => resolve(res),
      error => reject(error),
    );
  });

export const requestLogout = () =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line promise/catch-or-return
    POST('/user/auth/logout').then(
      res => resolve(res),
      error => reject(error),
    );
  });

export const requestNewHost = data =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line promise/catch-or-return
    POST('/listings/new', data).then(
      res => resolve(res),
      error => reject(error),
    );
  });

  export const requestNewBooking = (listingId,data) =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line promise/catch-or-return
    POST(`/bookings/new/${listingId}`, data).then(
      res => resolve(res),
      error => reject(error),
    );
  });

export const requestGetListings = () =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line promise/catch-or-return
    GET('/listings').then(
      res => resolve(res),
      error => reject(error),
    );
  });

export const requestGetOneListing = listingId =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line promise/catch-or-return
    GET(`/listings/${listingId}`).then(
      res => resolve(res),
      error => reject(error),
    );
  });

  export const requestGetBookings = () =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line promise/catch-or-return
    GET(`/bookings`).then(
      res => resolve(res),
      error => reject(error),
    );
  });

export const requestEditListing = (data, listingId) =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line promise/catch-or-return
    PUT(`/listings/${listingId}`, data).then(
      res => resolve(res),
      error => reject(error),
    );
  });

export const requestDeleteListing = listingId =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line promise/catch-or-return
    DELETE(`/listings/${listingId}`).then(
      res => resolve(res),
      error => reject(error),
    );
  });

export const requestDeleteBooking = bookingId =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line promise/catch-or-return
    DELETE(`/bookings/${bookingId}`).then(
      res => resolve(res),
      error => reject(error),
    );
  });

export const requestPublishListing = (listingId, data) =>
    new Promise((resolve, reject) => {
        // eslint-disable-next-line promise/catch-or-return
        PUT(`/listings/publish/${listingId}`, data).then(
            res => resolve(res),
            error => reject(error),
        );
    });

export const requestPublishReview = (listingId,bookingId, data) =>
    new Promise((resolve, reject) => {
        // eslint-disable-next-line promise/catch-or-return
        PUT(`/listings/${listingId}/review/${bookingId}`, data).then(
            res => resolve(res),
            error => reject(error),
        );
    });


export const requestUnpublishListing = (listingId) =>
    new Promise((resolve, reject) => {
        // eslint-disable-next-line promise/catch-or-return
        PUT(`/listings/unpublish/${listingId}`).then(
            res => resolve(res),
            error => reject(error),
        );
    });

export const requestAcceptBooking = (bookingId) =>
    new Promise((resolve, reject) => {
      // eslint-disable-next-line promise/catch-or-return
      PUT(`/bookings/accept/${bookingId}`).then(
        res => resolve(res),
        error => reject(error),
      );
    });

export const requestDeclineBooking = (bookingId) =>
    new Promise((resolve, reject) => {
      // eslint-disable-next-line promise/catch-or-return
      PUT(`/bookings/decline/${bookingId}`).then(
        res => resolve(res),
        error => reject(error),
      );
    });
  
