import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import { Zoom } from 'react-toastify';
import EraseBtn from './components/EraseBtn';
import Oups from '../../icons/icon-left-font.png';
import Card from './components/Card'
import ComView from './components/ComView'

import { FaTelegramPlane } from "react-icons/fa";

const Forum = ({ user, setUser, token, setToken, comments, setComments }) => {

  const { id } = useParams();
  const [posted, setPosted] = useState(false)
  const [post, setPosts] = useState([])
  const ref = useRef();

  const acces_forum = localStorage.getItem('keyToken')
  // Maintient de la session
  useEffect(() => {
    const userId = localStorage.getItem('userId')
    fetch(`http://localhost:3000/user/${userId}`)
      .then(response => response.json())
      .then(data => {
        setUser(data)
        // console.log(data);
      })
      .catch(err => console.log(err))
  }, [])
  // APPEL A L'API
  useEffect(() => {
    // reinitialise le setposted pour actualiser la page
    setPosted(null)
    fetch("http://localhost:3000/post")
      .then(response => response.json())
      .then(data => {
        setPosts(data)
        // console.log("DATA", data)
      })
      .catch(err => console.log(err))
  }, [posted, setPosted, comments, setComments]);

  // Pour poster un message 
  const [newPost, setNewPost] = useState({})

  const handleSubmit = async (e, index) => {

    e.preventDefault()
    let formData = new FormData();
    formData.append("userName", user.username)
    formData.append("text", newPost.text)
    formData.append("title", newPost.title)
    formData.append("image", newPost.image)

    for (let value of formData.values()) {
      console.log(value);
      console.log([value][0]);
    };

    await fetch("http://localhost:3000/post/add", {
      method: 'POST',
      headers: {
        'authorization': 'bearer ' + acces_forum,
      },
      body: formData,
    })
      // setposted pour declanger le useEffect et actualiser la page
      .then((res) => {
        toast.success('Message partagé !' , {
          theme: "colored",
          position: "bottom-center",
          autoClose: 1000,
          transition: Zoom,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          })
        setPosted(true)
        setNewPost({ ...newPost, text:"", image: "" })   
        console.log(newPost);
      })
      .catch(err => console.log(err))
      
      ref.current.value = null;
      // const formReset = document.getElementsByClassName('formForum')
      // console.log(formReset);
      formData.append("image", null)
  }
  const formFile = Boolean(document.getElementById('file'))
  const file = document.getElementById('file')

  return acces_forum ? (
    <div className="container">

      <form onSubmit={handleSubmit} className="formForum">
        <h2>Ajoutez votre message</h2>
        {/* <input onChange={(e) => setNewPost({ ...newPost, title: e.target.value, })} placeholder='Titre' type="text" id='title' /> */}
        <textarea onChange={(e) => setNewPost({ ...newPost, text: e.target.value })} placeholder='Message' type="text" id='text' value={newPost.text} required />
        <label className='labelFile' htmlFor="file">
          <input onChange={(e) =>
            setNewPost({ ...newPost, image: e.target.files[0] })} type="file" id='file' ref={ref}/>
          
          <span className='noFile'>Ajoutez une photo</span>
          <div className='docUser'>
              {
                formFile === false? "choisir un fichier" : file.value.split(`\\`)[2] 
              }
            </div>
         

        </label>
        <button type='submit'><FaTelegramPlane /></button>
        <ToastContainer />
      </form>
      {post
        .map((post, index) =>
          <div className='postContainer' key={post.id}>
            <Card user={user} setPosts={setPosts} post={post} setPosted={setPosted} comments={comments} setComments={setComments} />
            <EraseBtn user={user} post={post} setPosted={setPosted} />
            <ComView user={user} post={post} posted={posted} setPosted={setPosted} comments={comments} setComments={setComments} />

          </div>
        )}
    </div>
  ) : (
    <div className='nonAuth'>
      <p>Veuillez vous identifier pour accéder au publication</p>
      <img src={Oups} alt="Erreur Authentification" />
    </div>
  )
};

export default Forum;