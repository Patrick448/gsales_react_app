import React from 'react'
import './index.css'

function TabRow(props){

    function x(){
        alert("aaaa")
    }

    return(
        <div className="tab-row">
            {props.children}
        </div>
    )
}

export default TabRow