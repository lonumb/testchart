import React , { useState } from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import { isMobile } from 'react-device-detect';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { SnackbarProvider, useSnackbar } from 'notistack';
import './index.scss'
const CardBox = (props)=>{
    const POSITION = {
        vertical: 'top',
        horizontal: 'right'
    }
    // const AUTO_HIDE_DURATION = 7000000000
    const cardType = ()=>{
        const style = ['cardBox'];
        if(props.className){
            style.push(props.className);
        }
        return style.join(" ");
    }
    const notistackRef = React.createRef();
    const onClickDismiss = key => () => {
        notistackRef.current.closeSnackbar(key);
    }
    return (
        <div className={cardType()} style={props.style}>
            <SnackbarProvider maxSnack={7}
            className="SnackbarProvider_title"
            autoHideDuration={10000000000}
            anchorOrigin={POSITION}
            dense={isMobile}
            ref={notistackRef}
            action={(key) => (
                <IconButton key="close" aria-label="Close" color="inherit" onClick={onClickDismiss(key)}>
                    <CloseIcon style={{fontSize:"20px"}}/>
                </IconButton>
            )}
            >
                <MyApp content={props.content}/>
            </SnackbarProvider>
        </div>
    )

}
function MyApp(props) {
    const { enqueueSnackbar } = useSnackbar();
    const handleClick = () => {
      enqueueSnackbar(
          <div>
              <p className="title_first">您的订单已被止盈</p>
              <p>盈亏：1231231</p>
              <a href="">在浏览器中查看&nbsp;<img src="/imgs/icon_scan.png" alt=""/></a>
          </div>
      );
    };
    return (
      <React.Fragment>
        <div onClick={handleClick}>
            <span>
                {props.content}
            </span>
        </div>
      </React.Fragment>
    );
  }
export default CardBox;

