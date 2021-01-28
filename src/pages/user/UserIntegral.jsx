import React, { useEffect, useState } from 'react';
import * as Lang from '../../i18n/LangUtil'
import './UserIntegral.scss';
import { useTranslation } from 'react-i18next';
import SureModal from '../../components/modal/sureModal'
const UserIntegral = ()=>{
    const { t } = useTranslation();
    const Langs = Lang.getLang()
    return(
        <div className='userIntegral'>
            <div className='userIntegral-top'>
                <div className='TextHeader'>
                    <div className='TextHeaderLeft'>
                        <span className="text-one">{t('Teemo_test_title1')}</span>
                        <span className="text-two">97261.34468130000900</span>
                        <span className="text-three">{t('Teemo_test_calculate_rule3')} XXXXXXXXXX</span>
                    </div>
                    <div className='TextHeaderRight'>
                        <span className="text-one">{t('Teemo_test_title2')}</span>
                        <span className="text-two">97261.344681213234234234</span>
                        <span className="text-three">{t('Teemo_test_calculate_rule3')} 2021年X月X日 XXXX</span>
                    </div>
                </div>
                <div className='text-content'>
                    <span className='text-content-first'>{t('Teemo_test_subtitle1')}</span>
                    <span className='text-content-second'>{t('Teemo_test_rule1')}</span>
                    <span className='text-content-third'>{t('Teemo_test_rule2')}</span>
                    <span className='text-content-fourth'>{t('Teemo_test_rule3')}</span>
                    <span className='text-content-fifth'>{t('Teemo_test_rule4')}</span>
                    <span className='text-content-sixth'>{t('Teemo_test_rule5')}</span>
                    <span className='text-content-seventh'>{t('Teemo_test_rule6')}</span>
                </div>
            </div>
            <div className='userIntegral-bottom'>
                <span className='userIntegral-bottom-one'>{t('Teemo_test_subtitle2')}</span>
                <span className='userIntegral-bottom-two'>{t('Teemo_test_title2')}</span>
                <span className='userIntegral-bottom-three'>{t('Teemo_test_calculate_rule1')}</span>
                <div className='userIntegral-bottom-img'>
                    <img src={Langs==='en-US'?"/imgs/img_chart_en.png":"/imgs/img_chart_zh_CN.png"} alt=""/>
                </div>
                <span className='userIntegral-bottom-four'>{t('Teemo_test_title1')}</span>
                <span className='userIntegral-bottom-five'>{t('Teemo_test_calculate_rule1')}</span>
            </div>
            <SureModal/>   
        </div>
    )
}
export default UserIntegral;
