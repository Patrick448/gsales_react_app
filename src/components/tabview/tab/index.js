import React from 'react'
import './index.css'

function Tab(props){


    return(
        <div className={"tab" + (props.activeTab == props.tab ? " active" : "")} 
            onClick={() => props.onClick(props.tab)}>

            {props.children}

        </div>
    )
}

export default Tab