export const langList = {
  'en-US': { v: 'en_US', vb: 'en', t: 'English' },
  'zh-CN': { v: 'zh_CN', vb: 'zh_CN', t: '简体中文' },
};

export const getLang = () => {
  let lang = window.localStorage.getItem('LANGUAGE') || 'en-US';
  return lang;
};

export const switchLang = (lang) => {
  window.localStorage.setItem('LANGUAGE', lang);
  window.location.reload();
};

export const getBackLang = () => {
  let lang = getLang();
  return langList[lang].vb;
};
