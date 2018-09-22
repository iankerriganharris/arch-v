import React from 'react';
import {
  Navbar,
  NavbarBrand } from 'reactstrap';

export default class NavHeader extends React.Component {
  render() {
    return (
      <div>
        <Navbar light expand="md">
          <NavbarBrand href="">arch-v</NavbarBrand>
        </Navbar>
      </div>
    );
  }
}