import React, { useEffect, useRef } from 'react';
import './chart.scss';

const ChartComponent = () => {
  const chartRef = useRef();
  useEffect(() => {
    /*eslint-disable new-cap,no-undef*/
    let datafeeds = new Datafeeds.UDFCompatibleDatafeed('https://demo_feed.tradingview.com');
    /*eslint-disable new-cap,no-undef*/
    var widget = new TradingView.widget({
      autosize: true,
      symbol: 'AAPL',
      interval: 'D',
      container_id: 'tvChart',
      datafeed: datafeeds,
      library_path: '/tv/',
      locale: 'en',
      drawings_access: { type: 'black', tools: [{ name: 'Regression Trend' }] },
      disabled_features: ['use_localstorage_for_settings'],
      enabled_features: ['study_templates'],
      charts_storage_url: 'http://saveload.tradingview.com',
      charts_storage_api_version: '1.1',
      client_id: 'tradingview.com',
      user_id: 'public_user_id',
      theme: 'Dark',
      custom_css_url: '/tv/theme/dark.css', // 自定义样式覆盖
      overrides: {
        'paneProperties.background': '#12161c', // 图表背景
      },
    });

    console.log('aa,', chartRef.current.clientHeight);

    // widget.set(chartRef.current.clientHeight||0)
  }, []);

  return (
    <div className="chart" ref={chartRef}>
      <div className="" id="tvChart"></div>
    </div>
  );
};

export default ChartComponent;
