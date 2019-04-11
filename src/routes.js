import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Box from './pages/Box';
import Main from './pages/Main';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route component={Main} exact path='/' />
      <Route component={Box} path='/box/:id' />
    </Switch>
  </BrowserRouter>
);

export default Routes;