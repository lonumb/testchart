import zhCN from 'antd/lib/locale-provider/zh_CN';
import enUS from 'antd/lib/locale-provider/en_US';
import koKR from 'antd/lib/locale-provider/ko_KR';
import viVN from 'antd/lib/locale-provider/vi_VN';

import { getLang } from './LangUtil';

export const messageList = {
  antd: {
    'en-US': enUS,
    'zh-CN': zhCN,
    'ko-KR': koKR,
    'vi-VN': viVN,
  },
};

export const I18nMessage = messageList.antd[getLang()];
