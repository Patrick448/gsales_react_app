import React from 'react'
import TableRow from './table-row'
import './index.css'

function Table(props){

    
    return(
        <table>
            <thead>
                <tr>
                    {Object.keys(props.titles).map(title => <th key={title}>{title}</th>)}
                    {props.actions ? <th></th> : ""}
                </tr>
            </thead>
            <tbody>
                {props.contents.map( item =>  <TableRow rowContent={item} 
                                                        keyOrder={Object.values(props.titles)} 
                                                        actions={props.actions}
                                                        preDisplay={props.preDisplay }/>)}
            </tbody>
        </table>

    )
}

export default Table