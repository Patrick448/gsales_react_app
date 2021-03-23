import React from 'react'
import './index.css'

class Modal extends React.Component{

    constructor(props){
        super(props)
        this.state={close: false}
    }

    render(){
    return(<div className={"modal" + (this.props.showModal? " show":" hide")} /*style={this.props.showModal? {display: "block"} :{display: "none"}}*/>
                <div className="modal-box">
                    <div className="modal-header">
                        <h3 className="modal-title">{this.props.title}</h3>
                        <span onClick={this.props.closeEvent} className="close-span">×</span>
                    </div>
                    <div className="modal-content">
                        {this.props.children}
                    </div>
                    <div className="modal-footer">
                        <h3 className="modal-footer-text">{this.props.footerText}</h3>
                        <button onClick={this.props.buttonAction}>{this.props.buttonText}</button>
                    </div>
                </div>
                
            </div>)
}}


export default Modal