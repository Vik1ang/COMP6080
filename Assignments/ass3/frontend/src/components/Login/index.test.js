// eslint-disable-next-line no-unused-vars
import {shallow} from 'enzyme';
// eslint-disable-next-line no-unused-vars
import React from 'react';
import renderer from 'react-test-renderer';
// eslint-disable-next-line no-unused-vars
import toJson from 'enzyme-to-json';
// eslint-disable-next-line no-unused-vars
import { act } from 'react-dom/test-utils';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import Login from './index';
import {
    Typography,
    TextField,
    Button,
    FormControlLabel,
    Grid,
  } from '@mui/material';

const props_one = {
  email: 'selinajiang321@gmail.com',
  password: "123",
};


afterEach(cleanup);

describe('Login', () => {
  const noop = () => {};
  it('render Login correctly', () => {
    const login = shallow(<Login/>);
    expect(toJson(login)).toMatchSnapshot();
  });

  it('render Login Button correctly', () => {
    const wrapper = shallow(<Login />);
    // const { email } = props;
    const logInDom = (
        <Typography component='h1' variant='h5'>
        Log In
      </Typography>
    );
    expect(wrapper.contains(logInDom)).toEqual(true);
  });

  test('TextField component should exists.', () => {
    expect(TextField).toBeDefined();
  });

  it('renders a button with submit button type if nothing is provided', () => {
    const button = renderer
      .create(<Button onClick={noop} type='submit' />)
      .toJSON();
    expect(button).toMatchSnapshot();
  });


  it('has one button component', () => {
    const button = shallow(<Login />);
    expect(button.find(Button)).toHaveLength(1);
  });

  it('has two TextField components', () => {
    const textField = shallow(<Login />);
    expect(textField.find(TextField)).toHaveLength(2);
  });

  it('has a link inside a grid box to register', () => {
    const loginPage = shallow(<Login />);
    expect(loginPage.find(Grid)).toHaveLength(2);
  });

  it('has a checkbox to readme', () => {
    const loginPage = shallow(<Login />);
    expect(loginPage.find(FormControlLabel)).toHaveLength(1);
  });

  it('has a link to register', () => {
    const { getByText } = render(
      <Router>
        <Route>
          <Login />
        </Route>
      </Router>,
    );
    act (() => {fireEvent.click(getByText('Don\'t have an account? Sign Up'))});
    expect(window.location.href).toEqual(`http://localhost/register`);
  });


});
