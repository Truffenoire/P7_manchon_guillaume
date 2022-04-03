import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { Flip } from 'react-toastify';
// import axios from 'axios'



const Login = ({ user, setUser, token, setToken }) => {

    const [userLogin, setUserLogin] = useState({
        username: "",
        email: "",
        password: ""
    });

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        console.log("USERLOGIN DANS FRONT", userLogin);
        e.preventDefault()
        
        const requet = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userLogin)
        };
        console.log(requet);
        await fetch("http://localhost:3000/user/login", requet)
            .then(response => response.json())
            .then(token => {
                JSON.stringify(localStorage.setItem('keyToken', token.token));
                // JSON.stringify(localStorage.setItem('user', JSON.stringify(token.user)));
                JSON.stringify(localStorage.setItem('userId', token.user.id));
                setUser(token.user)
                setToken(token.token)

                if (token.user.id) {
                    const id = token.user.id
                    // console.log('USER DANS LE HANDLESubmit', user, token.user.id);
                    navigate(`/forum/${id}`)
                    setTimeout(() => {
                        toast.success('Bienvenue !', {
                          theme: "colored",
                          position: "bottom-center",
                          autoClose: 1000,
                          transition: Flip,
                          hideProgressBar: false,
                          closeOnClick: false,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                        });
                      }, 500)

                } else {
                    alert('Vous ne pouvez pas faire ça !');
                }
            })
            .catch(err => console.log(err))
    }

    

    return (
        <div className='homePage'>
            <div className="home">
                <div className="accueil">
                    {/* <h1>Bienvenue chez Groupomania</h1> */}
                    <p>Rejoignez votre réseau d'entreprise.</p>
                </div>
                <div className="form">
                    <form onSubmit={handleSubmit} action="" method='post'>
                        {/* <label htmlFor="name">Nom</label> */}
                        <input placeholder='Nom' onChange={(e) => setUserLogin({ ...userLogin, username: e.target.value, })} className='username' type="text" name='name' id='name' required />
                        {/* <label htmlFor="email">Email</label> */}
                        <input placeholder='Email' onChange={(e) => setUserLogin({ ...userLogin, email: e.target.value, })} className='email' type="text" name='email' id='email' required />
                        {/* <label htmlFor="password">Password</label> */}
                        <input placeholder='Password' onChange={(e) => setUserLogin({ ...userLogin, password: e.target.value, })} className='password' type="password" name='password' id='password' required />
                        <br></br>
                        <button type='submit'>Connection</button>
                    </form>
                    <Link to="/">Pas encore inscrit ?</Link>
                </div>
            </div>
            <div className="bgHome"></div>
        </div>
    );
};

export default Login;