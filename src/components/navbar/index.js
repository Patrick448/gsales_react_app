import React from 'react'
import './index.css'

function Navbar(props){

    function logout(){
        fetch("/logout").then(response =>{
            if(response.status == 200){
                window.location.replace("/login")
            }
        })
    }

    return(
        <nav class="nav">
            <div class="nav-left">
                <h1>{props.title}</h1>
                {props.children}
            </div>
            <div class="nav-right">
                <p class="user">Usuário</p>
                <a onClick={logout}>Sair</a>
            </div>
        </nav>
    )
}

export default Navbar