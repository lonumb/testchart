import React, { useState, useEffect } from 'react';
import './style.scss';

const AsyncImportComponent = function (importComp) {
  function AsyncComponent(props) {
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
    return Comp ? <Comp {...props} /> : <div className="loading">加载中...</div>;
  }
  return AsyncComponent;
};

export default AsyncImportComponent;
