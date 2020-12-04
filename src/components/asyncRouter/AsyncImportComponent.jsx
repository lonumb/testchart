import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import './style.scss';

const AsyncImportComponent = function (importComp) {
  function AsyncComponent(props) {
    const { t } = useTranslation();

    const [Comp, setComp] = useState(null);
    useEffect(() => {
      let isUnmounted = false;
      const fetchComponent = async () => {
        try {
          const { default: importComponent } = await importComp();
          if (!isUnmounted) {
            setComp(() => importComponent);
          }
        } catch (e) {
          console.error('component error:', e);
          throw new Error('加载组件出错');
        }
      };

      fetchComponent();
      return () => {
        isUnmounted = true;
      };
    }, []);
    return Comp ? (
      <Comp {...props} />
    ) : (
      <div className="loading">
        <CircularProgress />
        <span>加载中...</span>
      </div>
    );
  }
  return AsyncComponent;
};

export default AsyncImportComponent;
