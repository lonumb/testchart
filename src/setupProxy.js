const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // socket有问题,不能做代理转发,只能直连
  app.use(
    createProxyMiddleware('/websocket', {
      target: 'ws://test.trade.idefiex.com:9002', // 目标
      ws: true, // 代理websocket
      pathRewrite: { '^/websocket': '' },
      changeOrigin: true, // 虚拟站点必须
      secure: false,
      disablereuse: 'On',
    })
  );
  app.use(createProxyMiddleware('/api', { target: 'http://47.90.62.21:9003', changeOrigin: true }));
};
