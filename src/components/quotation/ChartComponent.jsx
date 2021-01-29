import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ArrowDropDownRoundedIcon from '@material-ui/icons/ArrowDropDownRounded';
import OwnPopover from '../popover/OwnPopover';
import { usePopupState, bindHover, bindPopover, bindToggle } from 'material-ui-popup-state/hooks';
import { useSelector, useDispatch } from 'react-redux';
import { actionPeriodUpdate, apiKData } from '../../store/actions/TradeAction';
import { useWeb3React } from '@web3-react/core';
import { getBackLang } from '../../i18n/LangUtil'
import DataFeeds from '../chart/Datafeed';
import ChartUtil from '../chart/ChartUtil';
import './chart.scss';

// /*eslint-disable new-cap,no-undef*/
// let datafeeds = new Datafeeds.UDFCompatibleDatafeed('https://demo_feed.tradingview.com');
let datafeeds = new DataFeeds();
let widget = null;
let chartOption = {
  debug: false,
  autosize: true,
  // symbol: 'AAPL',
  // interval: 'D',
  container_id: 'tvChart',
  datafeed: datafeeds,
  library_path: '/tv/',
  // locale: 'zh',
  theme: 'Dark',
  custom_css_url: '/tv/theme/dark.css', // 自定义样式覆盖
  overrides: {
    // volumePaneSize: 'large', // 成交量高度 (large, medium, small, tiny)
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
    'create_volume_indicator_by_default', // 量和k线图上下分开,防止他们重叠
    // 'volume_force_overlay', // 成交量
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
};

const periodMap = {
  line: { title: '分时', key: 'periodLine', value: '1', api: 1 },
  1: { title: '1分钟', key: 'periodMin1', value: '1', api: 2 },
  5: { title: '5分钟', key: 'periodMin5', value: '5', api: 2 },
  15: { title: '15分钟', key: 'periodMin15', value: '15', api: 2 },
  30: { title: '30分钟', key: 'periodMin30', value: '30', api: 2 },
  60: { title: '1小时', key: 'periodHour1', value: '60', api: 2 },
  240: { title: '4小时', key: 'periodHour2', value: '240', api: 2 },
  '1D': { title: '1天', key: 'periodDay', value: '1', api: 3 },
  '1W': { title: '周线', key: 'periodWeek', value: '7', api: 3 },
  '1M': { title: '月线', key: 'periodMonth', value: '30', api: 3 },
};

const ChartComponent = () => {
  const { t } = useTranslation();
  const { chainId } = useWeb3React();
  const dispatch = useDispatch();
  const popupStateMin = usePopupState({ variant: 'popover', popupId: 'minPopover' });
  const popupStateHour = usePopupState({ variant: 'popover', popupId: 'hourPopover' });
  const { period, productInfo, quote, ticker } = useSelector((state) => {
    return state.trade;
  }); // 当前周期
  // 指标列表
  function indicatorFunc() {
    widget.chart().executeActionById('insertIndicator');
  }

  // 切换产品和周期
  function switchSymbol(symbol, period) {
    if (!widget) return;
    widget.setSymbol(symbol, period, function () {}); // 切换商品和周期
  }

  // 切换周期
  function switchPeriod(p) {
    widget.chart().setResolution(p === 'line' ? '1' : periodMap[p].value); // k线周期
    widget.chart().setChartType(p === 'line' ? 2 : 1); // k线类型
    actionPeriodUpdate(p)(dispatch);
    popupStateMin.close();
  }

  // 更新历史数据
  function updateChartData(historyData) {
    if (!ChartUtil.onDataCallback) {
      setTimeout(() => {
        try {
          updateChartData(historyData);
        } catch (error) {
          console.error('tradingview error', error);
        }
      }, 500);
      return;
    }
    if (historyData.length) {
      if (ChartUtil.to === historyData[0][0]) {
        ChartUtil.onDataCallback && ChartUtil.onDataCallback([], { noData: true });
      } else {
        ChartUtil.to = historyData[0][0];
        ChartUtil.onDataCallback && ChartUtil.onDataCallback(historyData);
      }
    } else {
      ChartUtil.onDataCallback && ChartUtil.onDataCallback([], { noData: true });
    }
  }

  // 查询历史数据
  useEffect(() => {
    if (!productInfo.symbol) return;
    ChartUtil.reset(); // 产品切换后重置
    // 初始化chart
    /*eslint-disable new-cap,no-undef*/
    widget = new TradingView.widget({
      ...chartOption,
      symbol: `${productInfo.symbol}/USDT`,
      interval: period === 'line' ? '1' : period,
      locale: getBackLang(),
    });
    widget.onChartReady(function () {
      widget.chart().setChartType(period === 'line' ? 2 : 1); // k线类型
      // 创建按钮
      // widget.createButton().attr('title', 'Save chart').on('click', function (e) {widget.save(function (data) {alert('Saved');});}).append('<span>save</span>');
    });
    apiKData({ symbol: productInfo.symbol, type: periodMap[period].api, period: periodMap[period].value, count: '1000', fromtime: '0', chainId }).then((res) => {
      updateChartData(res);
    });
  }, [productInfo, period]);

  // ticker更新
  useEffect(() => {
    if (!ChartUtil.onRealTimeCallback) {
      return;
    }
    ChartUtil.onRealTimeCallback(ticker);
  }, [ticker]);

  return (
    <div className="chart">
      <ul className="own-tool-bar">
        <li className={`item ${period === 'line' ? 'active' : ''}`} onClick={() => switchPeriod('line')}>
          {t('periodLine')}
        </li>
        <li className={`item ${['1', '5', '15', '30'].includes(period) ? 'active' : ''}`} {...bindToggle(popupStateMin)} {...bindHover(popupStateMin)}>
          {t(['1', '5', '15', '30'].includes(period) ? periodMap[period].key : 'periodMin')}
          <ArrowDropDownRoundedIcon />
          <OwnPopover {...bindPopover(popupStateMin)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
            <ul className="period-list">
              <li className={`item ${period === '1' ? 'active' : ''}`} onClick={() => switchPeriod('1')}>
                {t('periodMin1')}
              </li>
              <li className={`item ${period === '5' ? 'active' : ''}`} onClick={() => switchPeriod('5')}>
                {t('periodMin5')}
              </li>
              <li className={`item ${period === '15' ? 'active' : ''}`} onClick={() => switchPeriod('15')}>
                {t('periodMin15')}
              </li>
              <li className={`item ${period === '30' ? 'active' : ''}`} onClick={() => switchPeriod('30')}>
                {t('periodMin30')}
              </li>
            </ul>
          </OwnPopover>
        </li>
        <li className={`item ${['60', '240'].includes(period) ? 'active' : ''}`} {...bindToggle(popupStateHour)} {...bindHover(popupStateHour)}>
          {t(['60', '240'].includes(period) ? periodMap[period].key : 'periodHour')}
          <ArrowDropDownRoundedIcon />
          <OwnPopover {...bindPopover(popupStateHour)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
            <ul className="period-list">
              <li className={`item ${period === '60' ? 'active' : ''}`} onClick={() => switchPeriod('60')}>
                {t('periodHour1')}
              </li>
              <li className={`item ${period === '240' ? 'active' : ''}`} onClick={() => switchPeriod('240')}>
                {t('periodHour2')}
              </li>
            </ul>
          </OwnPopover>
        </li>
        <li className={`item ${period === '1D' ? 'active' : ''}`} onClick={() => switchPeriod('1D')}>
          {t('periodDay')}
        </li>
        <li className={`item ${period === '1W' ? 'active' : ''}`} onClick={() => switchPeriod('1W')}>
          {t('periodWeek')}
        </li>
        <li className={`item ${period === '1M' ? 'active' : ''}`} onClick={() => switchPeriod('1M')}>
          {t('periodMonth')}
        </li>
        <li className="item" onClick={() => indicatorFunc()}>
          {t('chartIndicator')}
        </li>
      </ul>
      <div id="tvChart"></div>
    </div>
  );
};

export default ChartComponent;
