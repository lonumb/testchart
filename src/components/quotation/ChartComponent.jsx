import React, { useEffect, useRef } from 'react';
import ArrowDropDownRoundedIcon from '@material-ui/icons/ArrowDropDownRounded';
import './chart.scss';

const ChartComponent = () => {
  const chartRef = useRef();
  useEffect(() => {
    /*eslint-disable new-cap,no-undef*/
    let datafeeds = new Datafeeds.UDFCompatibleDatafeed('https://demo_feed.tradingview.com');
    /*eslint-disable new-cap,no-undef*/
    var widget = new TradingView.widget({
      debug: false,
      autosize: true,
      symbol: 'AAPL',
      interval: 'D',
      container_id: 'tvChart',
      datafeed: datafeeds,
      library_path: '/tv/',
      locale: 'zh',
      theme: 'Dark',
      custom_css_url: '/tv/theme/dark.css', // 自定义样式覆盖
      overrides: {
        volumePaneSize: 'large', // 成交量高度 (large, medium, small, tiny)
        'paneProperties.background': '#141826', // 图表背景
        'paneProperties.vertGridProperties.color': '#141826', // 图表网格颜色 252b44
        'paneProperties.horzGridProperties.color': '#141826', // 图表网格颜色
        'symbolWatermarkProperties.transparency': 90, // 水印透明度
        'scalesProperties.textColor': '#f4f9ff', // 坐标轴等字体颜色
        'scalesProperties.lineColor': '#2D3940', // 坐标轴线颜色
        'mainSeriesProperties.candleStyle.upColor': '#02c076', // 柱图颜色
        'mainSeriesProperties.candleStyle.downColor': '#f84960', // 柱图颜色
        'mainSeriesProperties.candleStyle.borderUpColor': '#02c076', // 柱图边框颜色
        'mainSeriesProperties.candleStyle.borderDownColor': '#f84960', // 柱图边框颜色
        'mainSeriesProperties.candleStyle.wickUpColor': '#02c076', // 柱图上引线颜色
        'mainSeriesProperties.candleStyle.wickDownColor': '#f84960', // 柱图下引线颜色
      },
      disabled_features: [
        'use_localstorage_for_settings', // 本地配置
        'header_symbol_search', // 搜索
        'header_saveload',
        'header_screenshot', // 拍照
        'header_compare', // 商品比较
        'header_undo_redo',
        'header_chart_type',
        'compare_symbol', // 禁用
        'symbol_info', // 商品信息
        'property_pages', //禁用所有属性页
        'header_resolutions', // 周期
        'edit_buttons_in_legend', // 指标设置、删除等操作
        'border_around_the_chart', // 移除边距
        'header_widget', // 头部工具栏
        'legend_context_menu', // 商品名称点击显示功能菜单
        // 'create_volume_indicator_by_default', // 量和k线图上下分开,防止他们重叠
        'volume_force_overlay', // 成交量
        'timeframes_toolbar', // 底部工具栏
        'pane_context_menu', // 右键菜单
        'legend_context_menu', // 商品名称点击显示功能菜单
      ],
      enabled_features: [
        'move_logo_to_main_pane', // logo 放到主图
        'hide_left_toolbar_by_default', // 默认隐藏绘图工具栏
      ],
      drawings_access: { type: 'black', tools: [{ name: 'Regression Trend' }] },
      supports_marks: false, // 不显示标记
    });

    widget.onChartReady(function () {
      // 创建按钮
      // widget
      //   .createButton()
      //   .attr('title', 'Save chart')
      //   .on('click', function (e) {widget.save(function (data) {alert('Saved');});})
      //   .append('<span>save</span>');
    });

    // widget.setSymbol("商品名","商品周期",callback); // 切换商品和周期
    console.log('aa,', chartRef.current.clientHeight);

    // widget.set(chartRef.current.clientHeight||0)
  }, []);

  return (
    <div className="chart" ref={chartRef}>
      <ul className="own-tool-bar">
        <li className="item active">分时</li>
        <li className="item">
          分钟
          <ArrowDropDownRoundedIcon />
        </li>
        <li className="item">
          小时
          <ArrowDropDownRoundedIcon />
        </li>
        <li className="item">
          天<ArrowDropDownRoundedIcon />
        </li>
        <li className="item">周线</li>
        <li className="item">月线</li>
        <li className="item">指标</li>
      </ul>
      <div className="" id="tvChart"></div>
    </div>
  );
};

export default ChartComponent;
