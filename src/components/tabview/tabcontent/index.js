import React from 'react'
import './index.css'

function TabContent(props){

    return(
        <div className="tab-content" style={{display: (props.activeTab == props.tab) ? "block" : "none"}}>
            {props.children}
        </div>

    )

}

export default TabContent