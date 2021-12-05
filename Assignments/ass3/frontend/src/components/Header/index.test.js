import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Header from './index';
import { act } from 'react-dom/test-utils';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';

import {
    AppBar,
    Badge,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
  } from '@mui/material';
import { AccountCircle as AccountCircleIcon, House as HouseIcon, History as HistoryIcon } from '@mui/icons-material';


Enzyme.configure({ adapter: new Adapter() });
describe('Header', () => {
  it('has 2 "listing" icon', () => {
    const menu = shallow(<Header />);
    expect(menu.find(HouseIcon)).toHaveLength(2);
  });

  it('has 1 "history" icon', () => {
    const menu = shallow(<Header />);
    expect(menu.find(HistoryIcon)).toHaveLength(1);
  });

  it('has 1 "profile" icon', () => {
    const menu = shallow(<Header />);
    expect(menu.find(AccountCircleIcon)).toHaveLength(1);
  });

  it('has 1 menu for login/register', () => {
    const menu = shallow(<Header />);
    expect(menu.find(Menu)).toHaveLength(1);
  });

  it('has 1 dialog for logout', () => {
    const menu = shallow(<Header />);
    expect(menu.find(Dialog)).toHaveLength(1);
  });



  it('there is not a logout dialog if the user has not logged in', () => {
    const onDialog = jest.fn();
    shallow(<Header />)
      .find(Button)
      .last()
      .simulate('click',  { preventDefault() {} });

    expect(onDialog).toHaveBeenCalledTimes(0);

  });



  it('close the dialog menu upon clicking the cancel button', () => {
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockImplementation((state) => [state, setState]);

    shallow(<Header />)
      .find(Button)
      .first()
      .simulate('click');

    expect(setState).toHaveBeenCalledTimes(1);
    useStateSpy.mockRestore();
  });


  it('the menu has not been opened yet', () => {
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockImplementation((state) => [state, setState]);
    const menu = shallow(<Header/>);

    menu.find(Menu).props().onClose();

    expect(setState).toHaveBeenCalledTimes(0);
    useStateSpy.mockRestore();
  });

  it('click Landing page', () => {
    const { getByText } = render(
      <Router>
        <Route>
          <Header />
        </Route>
      </Router>,
    );
    act (() => {fireEvent.click(getByText('Landing'))});
    expect(window.location.href).toEqual(`http://localhost/`);
  });

  it('click Hosted page', () => {
    const { getByText } = render(
      <Router>
        <Route>
          <Header />
        </Route>
      </Router>,
    );
    act (() => {fireEvent.click(getByText('Hosted'))});
    expect(window.location.href).toEqual(`http://localhost/host`);
  });
});
