import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import { Zoom } from 'react-toastify';
// Import de composant pour le formulaire
import InputMail from './components/ImputMail'
import InputName from './components/InputName'
import InputPassword from './components/InputPassword'


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
        res.json()
        console.log(res);
        if(res.status === 401){
        setTimeout(() => {
          toast.info(`formulaire non valide  !`, {
            theme: "colored",
            position: "bottom-center",
            autoClose: 1000,
            transition: Zoom,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }, 500)
      }
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
              setTimeout(() => {
                toast.success('Bienvenue !', {
                  theme: "colored",
                  position: "bottom-center",
                  autoClose: 1000,
                  transition: Zoom,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              }, 500)

              if (token) {
                const id = token.user.id;
                navigate(`/forum/${id}`)
              }
            })
            .catch(error => console.log("error"))
        }
      })
      .catch(error => {
        error.json()
        console.log(error);
      })
  }

  const formFile = Boolean(document.getElementById('file'))
  const file = document.getElementById('file')
  

  return (
    <div className='homePage'>
      <div className='home'>

        <div className="accueil">
          <p>Participez au réseau d'entreprise en remplissant ce formulaire.</p>
        </div>
        <div className="form">
          <form onSubmit={handleSubmit} name="myForm" id="myForm" action="/uploadmultiple" method='post'>

            <InputName setUserSignup={setUserSignup} userSignup={userSignup} />
            <InputMail setUserSignup={setUserSignup} userSignup={userSignup} />
            <InputPassword setUserSignup={setUserSignup} userSignup={userSignup} />

            <label className='photoProfilHome' htmlFor="file">photo de profil</label>
            <input  onChange={(e) =>
              setUserSignup({ ...userSignup, image: e.target.files[0]/*.name*/, })}
              type="file" name='file' id='file' />
            <div className='docUser'>
              {
                formFile === false? "choisir un fichier" : file.value.split(`\\`)[2] 
              }
            </div>
            <br></br>
            <button type='submit'>Connection</button>
          </form>

          <Link to="/login">Déjà inscrit, connectez vous</Link>
        </div>

      </div>
      <ToastContainer />
      <div className="bgHome"></div>
    </div>
  );
}

export default Home;
