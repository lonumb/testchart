import React, { useState ,useEffect} from 'react';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
const TabType = (props) =>{
    const [launch , setLaunch] = useState(false);

    useEffect(() => {
        window.addEventListener('click', function(){setLaunch(false)})
      },[])
    function switchOption(index,value,e) {
        e.nativeEvent.stopImmediatePropagation()
        if(index === props.index){
            setLaunch(!launch)
            return
        }
        setLaunch(!launch)
        console.log(value,12312937512935710278)
        props.onChange(index,value)
    }
    function openTab(e){
        e.nativeEvent.stopImmediatePropagation()
        setLaunch(!launch)
    }

    const obj = props.list.filter((val,i)=>{
        if(props.index === i){
            return val;
        }
    })

    return(
        <div className="tabs">
            <div className = "tab-box" onClick={(e)=>openTab(e)}>
                <div>
                    {obj[0].symbol ? obj[0].symbol : obj[0].name}
                </div>
                <div className="icones">
                    <ExpandMoreRoundedIcon/>
                </div>
            </div>
            <ul className= {launch ? "list":"lists"} >
                {props.list.map((v,i)=>{
                    return (
                        <li className={props.index === i ? 'active' : ''} onClick={(e) => switchOption(i,v.symbol,e)} key={'dy'+i}>
                            {v.symbol ? v.symbol : v.name}
                        </li>
                    )}
                )}
            </ul>
        </div>
    )
}
export default TabType
