import React, { useEffect, useState } from 'react'

function Protected(props){

    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() =>{
        fetch('/check-logged-in')
        .then(response => {return response.json()})
        .then(data =>{ 
            if(data.logged_in === false){
                window.location.replace("/login")
            }
            setLoggedIn(data.logged_in)});
        
    })

    return(<div>
        {loggedIn? props.children : ""}
    </div>)
}

export default Protected