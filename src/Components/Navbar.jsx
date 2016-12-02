// @flow
import React from 'react';
import { AppBar, Navigation, Button } from 'react-toolbox';
import { Link } from 'react-router';

export default () => (
  <AppBar title="L2S2">
    <Navigation type="horizontal">
      <Link to="/Login">
        <Button>
          Login
        </Button>
      </Link>
      <Link to="/Register">
        <Button>
          Register
        </Button>
      </Link>
    </Navigation>
  </AppBar>
);
