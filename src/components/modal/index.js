import React from 'react'
import './index.css'

class Modal extends React.Component{

    constructor(props){
        super(props)
        this.state={close: false}
    }

    render(){
    return(<div className={"modal"} style={this.props.showModal? {display: "block"} :{display: "none"}}>
                <div className="modal-box">
                    <div className="modal-header">
                        <h2 className="modal-title">Título</h2>
                        <span onClick={this.props.closeEvent} className="close-span">×</span>
                    </div>
                    <div className="modal-content">
                        {this.props.children}
                    </div>
                    <div className="modal-footer">
                        <h2 className="modal-footer-text"></h2>
                        <button>Enviar</button>
                    </div>
                </div>
            </div>)
}}


export default Modal