export default {
  onDataCallback: null,
  onRealTimeCallback: null,
  to: null,
  reset() {
    this.onDataCallback = null;
    this.onRealTimeCallback = null;
    this.to = null;
  },
};
