import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import SideMenu from '../Menu/SideMenu';
import Title from './Title';

const Header = () => (
  <AppBar position="sticky">
    <Toolbar>
      <SideMenu titleElement={<Title />} />
      <Title />
    </Toolbar>
  </AppBar>
);

export default Header;
