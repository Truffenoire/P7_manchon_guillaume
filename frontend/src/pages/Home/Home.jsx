import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import { Zoom } from 'react-toastify';
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

  // REGEX EMAIL
  // let formEmail = document.getElementById('email')
  // const validMail = (inputMail) => {
  //   let emailRegExp = new RegExp('^[a-zA-Z0-9ôöáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s-]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g');
  //   // let testMail = formEmail.value != null? emailRegExp.test(formEmail.value) : true
  //   let testMail = emailRegExp.test(inputMail.target.value)
  //   console.log(testMail);

  //   if (testMail) {
  //     formEmail.classList.add('testMailValid')
  //   } else {
  //     formEmail.classList.add('testMailError')
  //   }
  // }
  // REGEX NOM
  // let formName = document.getElementById('name')
  // const validName = (inputName) => {
  //   let emailRegExp = new RegExp('^[a-zA-Z-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s-]*$', 'g');
  //   let testMail = formName.value != null ? emailRegExp.test(formName.value) : true
  //   console.log(formName.value.length);
  //   console.log(testMail);
  //   if (testMail && formName.value.length >= 4 && formName.value.length <= 15) {
  //     formName.style.backgroundColor = '#0080003b'
  //     formName.style.color = 'white'
  //   } else {
  //     formName.style.backgroundColor = '#ff00006b'
  //     formName.style.color = 'white'
  //   }
  // }
  // REGEX MDP
  // let formPassword = document.getElementById('password')
  // const validPassword = (inputPassword) => {
  //   let passwordRegExp = new RegExp('^[a-zA-Z-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s-]*$', 'g');
  //   let testPassword = formPassword.value != null ? passwordRegExp.test(formPassword.value) : true
  //   console.log(formPassword.value.length);
  //   console.log(testPassword);
  //   if (testPassword && formPassword.value.length >= 4) {
  //     formPassword.style.backgroundColor = '#0080003b'
  //     formPassword.style.color = 'white'
  //   } else {
  //     formPassword.style.backgroundColor = '#ff00006b'
  //     formPassword.style.color = 'white'
  //   }
  // }


  return (
    <div className='homePage'>
      <div className='home'>

        <div className="accueil">
          {/* <h1>Bienvenue chez Groupomania</h1> */}
          <p>Participez au réseau d'entreprise en remplissant ce formulaire.</p>
        </div>
        <div className="form">
          <form onSubmit={handleSubmit} name="myForm" id="myForm" action="/uploadmultiple" method='post'>

            <InputName setUserSignup={setUserSignup} userSignup={userSignup} />
            <InputMail setUserSignup={setUserSignup} userSignup={userSignup} />
            <InputPassword setUserSignup={setUserSignup} userSignup={userSignup} />

            <label className='photoProfilHome' htmlFor="file">photo de profil</label>
            <input onChange={(e) =>
              setUserSignup({ ...userSignup, image: e.target.files[0]/*.name*/, })}
              type="file" name='file' id='file' required />

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
