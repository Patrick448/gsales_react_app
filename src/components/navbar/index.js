import React from 'react'
import './index.css'

function Navbar(){
    return(
        <nav class="nav">
            <div class="nav-left">
                <h1>Título</h1>
                <button>Botão 1</button>
                <button>Botão 2</button>
                <button>Botão 3</button>
            </div>
            <div class="nav-right">
                <p class="user">Usuário</p>
            </div>
        </nav>
    )
}

export default Navbar