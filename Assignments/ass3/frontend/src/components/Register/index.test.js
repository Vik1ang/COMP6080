// eslint-disable-next-line no-unused-vars
import {shallow} from 'enzyme';
// eslint-disable-next-line no-unused-vars
import React from 'react';
import renderer from 'react-test-renderer';
// eslint-disable-next-line no-unused-vars
import toJson from 'enzyme-to-json';
// eslint-disable-next-line no-unused-vars
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Register from './index';
import {
    Typography,
    TextField,
    Button,
    FormControlLabel,
    Grid,
  } from '@mui/material';



afterEach(cleanup);

describe('Register', () => {
  const noop = () => {};
  it('render Register correctly', () => {
    const register = shallow(<Register/>);
    expect(toJson(register)).toMatchSnapshot();
  });

  it('render Three Text Fields correctly', () => {
    const wrapper = shallow(<Register />);
    // const { email } = props;
    const nameDom = (
        <TextField required fullWidth name='name' label='Name' autoComplete='name' />
    );

    const emailDom = (  <TextField required fullWidth id='email' label='Email Address' name='email' autoComplete='email' />);
    const pwDom = (   <TextField
        required
        fullWidth
        name='password'
        label='Password'
        type='password'
        id='password'
        autoComplete='new-password'
      />);
    expect(wrapper.contains(nameDom)).toEqual(true);
    expect(wrapper.contains(emailDom)).toEqual(true);
    expect(wrapper.contains(pwDom)).toEqual(true);
  });

  it('There are three textfields', () => {
    const registerPage = shallow(<Register/>);
    expect(registerPage.find(TextField)).toHaveLength(3);
  });

  it('renders a button with submit button type if nothing is provided', () => {
    const button = renderer
      .create(<Button onClick={noop} type='submit' />)
      .toJSON();
    expect(button).toMatchSnapshot();
  });

  it('has a link to login', () => {
    const { getByText } = render(
      <Router>
        <Route>
          <Register />
        </Route>
      </Router>,
    );
    act (() => {fireEvent.click(getByText('Already have an account? Sign in'))});
    expect(window.location.href).toEqual(`http://localhost/login`);
  });

    it('render Register Button', () => {
    const wrapper = shallow(<Register />);
    const registerDom = (
      <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
        Sign Up
      </Button>
    );
    expect(wrapper.contains(registerDom)).toEqual(true);
  });
});
