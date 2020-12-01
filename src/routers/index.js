import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AsyncImportComponent from '../components/asyncRouter/AsyncImportComponent';

// import HeaderComponent from '../components/quotation/HeaderComponent';
import User from '../pages/User';

const Home = AsyncImportComponent(() => import('../pages/Home'));
const Quotation = AsyncImportComponent(() => import('../pages/Quotation'));
// const User = AsyncImportComponent(() => import('../pages/User'));
const UserAccount = AsyncImportComponent(() => import('../pages/UserAccount'));
const UserSetting = AsyncImportComponent(() => import('../pages/UserSetting'));
const UserCapticalRecord = AsyncImportComponent(() => import('../pages/UserCapticalRecord'));
const NotFound = AsyncImportComponent(() => import('../pages/error/NotFound'));

const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Quotation} />
        <Route path="/trade" exact component={Quotation} />
        <User>
          <Route path="/user/center" exact component={UserAccount} />
          <Route path="/user/setting" exact component={UserSetting} />
          <Route path="/user/rw-record" exact component={UserCapticalRecord} />
        </User>
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};

export default AppRouter;
