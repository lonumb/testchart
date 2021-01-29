import React, { useState } from 'react';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
const TabType = (props) =>{
    const [launch , setLaunch] = useState(false);


    function switchOption(index,value) {
        if(index === props.index){
            return
        }
        setLaunch(!launch)
        props.onChange(index,value)
    }

    function openTab(){
        setLaunch(!launch)
    }

    const obj = props.list.filter((val,i)=>{
        if(props.index === i){
            return val;
        }
    })

    return(
        <div className="tabs">
            <div className = "tab-box" onClick={()=>openTab()}>
                <div>
                    {obj[0].name}
                </div>
                <div className="icones">
                    <ExpandMoreRoundedIcon/>
                </div>
            </div>
            <ul className= {launch ? "list":"lists"}>
                {props.list.map((v,i)=>{
                    return (
                        <li className={props.index === i ? 'active' : ''} onClick={() => switchOption(i,v.value)} key={'dy'+i}>
                            {v.name}
                        </li>
                    )}
                )}
            </ul>
        </div>
    )
}
export default TabType
