import React from 'react';
import {
  Navbar,
  NavbarBrand } from 'reactstrap';

export default class NavHeader extends React.Component {
  render() {
    return (
      <div id='navHeader'>
        <Navbar light expand="md">
          <NavbarBrand href="">arch-v</NavbarBrand>
        </Navbar>
      </div>
    );
  }
}