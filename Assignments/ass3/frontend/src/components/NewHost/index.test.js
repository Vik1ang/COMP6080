//eslint-disable-next-line no-unused-vars
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
import NewHost from './index';
import {
    Typography,
    TextField,
    Button,
    FormControlLabel,
    Grid,
  } from '@mui/material';



afterEach(cleanup);

describe('New Host', () => {
  const noop = () => {};
  it('render New Host correctly', () => {
    const newHost = shallow(<NewHost  />);
    expect(toJson(newHost)).toMatchSnapshot();
  });

  it('render new host without crashing', () => {
    expect(shallow(<NewHost />));
  });

  it('render add button', () => {
    const wrapper = shallow(<NewHost/>);
    const addButton = (
        <Button type='submit' variant='contained' sx={{ mt: 3, ml: 1 }}>
        Add
      </Button>
    );
    expect(wrapper.contains(addButton)).toEqual(true);
  });

  test('TextField component should exists.', () => {
    expect(TextField).toBeDefined();
  });

//   it('renders a button with submit button type if nothing is provided', () => {
//     const button = renderer
//       .create(<Button onClick={noop} type='submit' />)
//       .toJSON();
//     expect(button).toMatchSnapshot();
//   });


//   it('has one button component', () => {
//     const button = shallow(<Login />);
//     expect(button.find(Button)).toHaveLength(1);
//   });

  it('has eight TextField components', () => {
    const textField = shallow(<NewHost />);
    expect(textField.find(TextField)).toHaveLength(8);
  });

//   it('has a link inside a grid box to register', () => {
//     const loginPage = shallow(<Login />);
//     expect(loginPage.find(Grid)).toHaveLength(2);
//   });

//   it('has a checkbox to readme', () => {
//     const loginPage = shallow(<Login />);
//     expect(loginPage.find(FormControlLabel)).toHaveLength(1);
//   });

  it('has cancel button to go back', () => {
    const { getByText } = render(
      <Router>
        <Route>
          <NewHost />
        </Route>
      </Router>,
    );
    act (() => {fireEvent.click(getByText('Cancel'))});
    expect(window.location.href).toEqual(`http://localhost/host`);
  });

  it('will stay on the same page if no input has been provided', () => {
    const { getByText } = render(
      <Router>
        <Route>
          <NewHost />
        </Route>
      </Router>,
    );
    act (() => {fireEvent.click(getByText('Add'))});
    expect(window.location.href).toEqual(`http://localhost/host`);
  });


});
