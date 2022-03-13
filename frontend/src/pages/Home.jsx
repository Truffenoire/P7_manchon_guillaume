import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'



function Home({ setUser }) {

  const [userSignup, setUserSignup] = useState({
    username: "",
    email: "",
    password: "",
    // image: null
  });
const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    let formData = new FormData();
    // On contruit le formulaire avant l'envoi
    formData.append("username", userSignup.username)
    formData.append("email", userSignup.email)
    formData.append("password", userSignup.password)

    formData.append("image", userSignup.image)


    await fetch("http://localhost:3000/user/signup", {
      method: 'POST',
      body: formData,
    })
      .then(res => {
        console.log(res);
        if (res.status === 201) {

          const requet = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userSignup)
          };
          console.log(requet);
          fetch("http://localhost:3000/user/login", requet)
            .then(response => response.json())
            .then(token => {
              console.log("TOKEN", token);
              JSON.stringify(localStorage.setItem('keyToken', token.token));
              JSON.stringify(localStorage.setItem('userId', token.user.id));
              setUser(token.user)
              alert("Compte créé avec succès, redirection vers le forum.");
              if(token) { 
                const id = token.user.id;
                navigate(`/forum/${id}`)
              }
            })
            .catch(err => console.log(err))

        }
      })
      .catch(err => console.log(err))
    }


  return (
    <div className='home'>

      <div className="accueil">
        <h1>Bienvenue chez Groupomania</h1>
        <p>Participez au réseau d'entreprise en remplissant ce formulaire.</p>
      </div>
      <div className="form">
        <form onSubmit={handleSubmit} name="myForm" id="myForm" action="/uploadmultiple" method='post'>
          <label htmlFor="name">Nom</label>
          <input onChange={(e) =>
            setUserSignup({ ...userSignup, username: e.target.value, })}
            type="text" name='username' id='name' required />
          <label htmlFor="email">Email</label>
          <input onChange={(e) =>
            setUserSignup({ ...userSignup, email: e.target.value, })}
            type="text" name='email' id='email' required />
          <label htmlFor="password">Password</label>
          <input onChange={(e) =>
            setUserSignup({ ...userSignup, password: e.target.value, })}
            type="password" name='password' id='password' required />
          <label htmlFor="file">photo de profil</label>
          <input onChange={(e) =>
            setUserSignup({ ...userSignup, image: e.target.files[0]/*.name*/, })}
            type="file" name='file' id='file' required />

          <br></br>
          <button type='submit' /*onClick={handleClick}*/>Connection</button>
        </form>
        <Link to="/login">Déjà inscrit, connectez vous</Link>
      </div>

    </div>
  );
}

export default Home;
