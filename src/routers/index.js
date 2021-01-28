import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import AsyncImportComponent from '../components/asyncRouter/AsyncImportComponent';

import HeaderComponent from '../components/head/HeaderComponent';
import User from '../pages/user/User';

const Home = AsyncImportComponent(() => import('../pages/Home'));
const Quotation = AsyncImportComponent(() => import('../pages/Quotation'));
const PoolInfo = AsyncImportComponent(() => import('../pages/pool/PoolInfo'));
// const User = AsyncImportComponent(() => import('../pages/user/User'));
const UserAccount = AsyncImportComponent(() => import('../pages/user/UserAccount'));
const UserSetting = AsyncImportComponent(() => import('../pages/user/UserSetting'));
const UserCapticalRecord = AsyncImportComponent(() => import('../pages/user/UserCapticalRecord'));
const NotFound = AsyncImportComponent(() => import('../pages/error/NotFound'));
const UserIntegral = AsyncImportComponent(() => import('../pages/user/UserIntegral'));
const AppRouter = () => {
  return (
    <Router>
      <HeaderComponent></HeaderComponent>
      <Switch>
        <Route path="/" exact>
          <Redirect to="/trade" />
        </Route>
        <Route path="/trade" exact component={Quotation} />
        <Route path="/pool/info" exact component={PoolInfo} />
        <User>
          <Route path="/user/center" exact component={UserAccount} />
          <Route path="/user/setting" exact component={UserSetting} />
          <Route path="/user/rw-record" exact component={UserCapticalRecord} />
          <Route path="/user/integral" exact component={UserIntegral} />
        </User>
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};

export default AppRouter;
