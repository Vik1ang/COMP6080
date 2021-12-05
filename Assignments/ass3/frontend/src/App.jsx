import React from 'react';
import { Switch, Route, BrowserRouter as Router, Redirect } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import HotelListing from './pages/HostedListing';
import Host from './pages/Host';
import NotFound from './pages/NotFound';
import NewHost from './components/NewHost/index';
import EditListing from './pages/EditHost';
import ViewLandingListing from './pages/ViewLandingList';
import ViewBookings from './pages/ViewBookings';
import Review from './pages/Review';
import Test from './pages/Test';
import MyHistory from './pages/MyHistory';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' component={Home} exact />
        <Route path='/login' component={Login} exact />
        <Route path='/register' component={Register} exact />
        <Route path='/host' component={Host} exact />
        <Route path='/host/new' component={NewHost} exact />
        <Route path='/host/edit/:id' component={EditListing} />
        <Route path='/host/bookings/:id' component={ViewBookings} />
        <Route path='/hotel' component={HotelListing} exact />
        <Route path='/404' component={NotFound} exact />
        <Route path='/listing/:listingid/review/:bookingid' component={Review} exact />
        <Route path='/listing/:id' component={ViewLandingListing} />
        <Route path='/test' component={Test} />
        <Route path='/history' component={MyHistory} exact />
        <Redirect from='*' to='/404' />
      </Switch>
    </Router>
  );
}

export default App;
