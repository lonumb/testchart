import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

function Index() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state);

  return <div className="App">{JSON.stringify(user)}</div>;
}

export default Index;
