import { generateRandomAlphaNum } from './Tools';
import { actionTickerUpdate } from '../store/actions/TradeAction';

export default {
  timer: undefined,
  socket: undefined,
  // 初始化
  init: function (dispatch, callback) {
    // 创建socket链接
    this.socket = new WebSocket('ws://test.trade.idefiex.com:9002');
    // socket = new WebSocket(`${window.location.protocol === 'http:' ? 'ws:' : 'wss:'}//${window.location.host}/websocket`);

    // 默认打开
    this.socket.onopen = () => {
      this.socket.send(JSON.stringify({ cmd: '13012', seq: '1', data: { symbol: 'btc', ktype: '15', count: '600', starttime: '0', endtime: '0', istime: '0' } }));
      console.log('webscket open');
      /** 登录信息 start **/
      let UUID = window.localStorage.getItem('UUID') || '';
      if (!UUID) {
        UUID = generateRandomAlphaNum(32);
        window.localStorage.setItem('UUID', UUID);
      }
      let msg = { deviceid: UUID, clienttype: 3, clientversion: '1.0.0', username: UUID, visit: 1, language: 'en' };
      this.sendMsg('8888', msg);
      /** 登录信息 end **/

      /** 心跳 start **/
      this.timer = setInterval(() => {
        this.sendMsg('3101', {});
      }, 1000 * 30);
      /** 心跳 end **/
      callback();
    };

    // 接口订阅消息并格式化
    this.socket.onmessage = (event) => {
      let data = event.data;
      let reader = new FileReader();
      reader.onload = () => {
        let content = reader.result;
        let result = JSON.parse(content);
        let {
          cmd,
          data: { info },
        } = result;
        this.fmtResult(cmd, info, dispatch);
      };
      reader.readAsText(data);
    };

    // 关闭链接
    this.socket.onclose = (event) => {
      console.info('WS closed:', event);
    };

    // 发生错误处理
    this.socket.onerror = (event) => {
      console.error('WS errored:', event);
    };
  },

  // 发送订阅消息
  sendMsg: function (cmd, msg) {
    let temp = { cmd, seq: '1', data: msg };
    if (this.socket) {
      try {
        this.socket.send(JSON.stringify(temp));
      } catch (error) {
        console.error('======error', error);
        setTimeout(() => {
          this.sendMsg(cmd, msg);
        }, 500);
      }
    }
  },

  // 关闭
  close: function () {
    clearInterval(this.timer);
    this.socket.close();
  },

  fmtMap: {
    snap: 13501,
    depth: 13502,
    trade: 13503,
    price: 13504,
    '1mink': 13505,
    '5mink': 13505,
    '15mink': 13505,
    '30mink': 13505,
    '60mink': 13505,
    '240mink': 13505,
    dayk: 13506,
    weekk: 13506,
    monthk: 13506,
  },

  fmtResult: function (cmd, msg, dispatch) {
    console.log(cmd, JSON.stringify(msg));
    switch (cmd) {
      case 8888: // 登录成功, 方可发送订阅消息, 逻辑太神奇.....(需要登录的带着token不可?)
        // that.props.updateWsState(); // 更新ws连接表识
        break;

      case 13501: // ticker数据
        // that.props.updateTicker(msg);
        break;

      case 13502: // 委托列表
        // that.props.updateHandicaps(msg);
        break;

      case 13503: // 最新成交
        // that.props.updateTrades(msg.datas);
        break;

      case 13504: // 最新价
        break;

      case 13505: // 分钟级k线
        actionTickerUpdate(msg)(dispatch);
        break;

      case 13506: // 日以上级k线
        actionTickerUpdate(msg)(dispatch);
        break;

      case 13007: // 订阅的所有数据, 提取处理函数
        let { datas } = msg;
        let temp = datas[0];
        for (const key in temp) {
          if (temp.hasOwnProperty(key)) {
            const ele = temp[key];
            let cmd = this.fmtMap[key];
            if (cmd) {
              // this.fmtResult(cmd, ele, that);
            }
          }
        }
        break;

      default:
        break;
    }
  },
};
