import React, { useEffect, useState } from 'react';
import * as Lang from '../../i18n/LangUtil'
import './UserIntegral.scss';
import { useTranslation } from 'react-i18next';
import { useWeb3React } from '@web3-react/core';
import BonusRecordContract from '../../common/contract/BonusRecordContract';
import { fromWei } from 'web3-utils';

let bonusRecordContract;

const UserIntegral = ()=>{
    const { t } = useTranslation();
    const { active, library, account, chainId } = useWeb3React();
    const [ bonus, setBonus ] = useState({});

    function isAvailable() {
        return active && account;
    }

    async function getData() {
        console.log('UserIntegral getData available: ', isAvailable());
        if (!isAvailable()) {
            return Promise.error('not available');
        }
        return bonusRecordContract.getBonus().then((res) => {
            console.log('UserIntegral setBonus: ', res);
            setBonus(res);
            return res;
        }).catch((e) => {
            console.log(e);
        });
    }

    const getDataFunc = async () => {
        var retryCount = 0;
        while (retryCount < 5) {
            try {
                await getData();
                return
            } catch (e) {
                retryCount++;
            }
        }
    };

    useEffect(async () => {
        if (active && account) {
            bonusRecordContract = new BonusRecordContract(library, chainId, account);
            getDataFunc();
        } else {
            bonusRecordContract = null;
        }
    }, [active, library, account]);

    const Langs = Lang.getLang()

    return(
        <div className='userIntegral'>
            <div className='userIntegral-top'>
                <div className='TextHeader'>
                    <div className='TextHeaderLeft'>
                        <span className="text-one">{t('Teemo_test_title1')}</span>
                        <span className="text-two">{ bonus.userLBonus ? fromWei(bonus.userLBonus) : '--' }</span>
                        <span className="text-three">{t('Teemo_test_calculate_rule3')} 2021-02-06 </span>
                    </div>
                    <div className='TextHeaderRight'>
                        <span className="text-one">{t('Teemo_test_title2')}</span>
                        <span className="text-two">{ bonus.userSBonus ? fromWei(bonus.userSBonus) : '--' }</span>
                        <span className="text-three">{t('Teemo_test_calculate_rule3')} 2021-02-06 </span>
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
                    <img src={Langs === 'en-US' ? "/imgs/img_chart_en.png" : "/imgs/img_chart_zh_CN.png"} alt=""/>
                </div>
                <span className='userIntegral-bottom-four'>{t('Teemo_test_title1')}</span>
                <span className='userIntegral-bottom-five'>{t('Teemo_test_calculate_rule1')}</span>
            </div>
        </div>
    )
}
export default UserIntegral;
