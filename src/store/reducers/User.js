const user = (state, action) => {
  let nextState = {};
  switch (action.type) {
    case 'USERINFO':
      nextState = { ...action.payload };
      break;
    default:
      nextState = { ...state };
      break;
  }
  return nextState;
};

export default user;
