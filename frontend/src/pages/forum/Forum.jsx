import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'
import EraseBtn from './components/EraseBtn';
import Oups from '../../icons/icon-left-font.png';
import Card from './components/Card'
import ComView from './components/ComView'

import { FaTelegramPlane } from "react-icons/fa";




const Forum = ({ user, setUser, token, setToken }) => {

  const { id } = useParams();
  const [posted, setPosted] = useState(false)
  const [post, setPosts] = useState([])
  // recuperation des commentaires
  const [comments, setComments] = useState([])

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
  const [newPost, setNewPost] = useState()

  const handleClick = async (e, index) => {

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
        setPosted(true)
        console.log(post);
      })
      .catch(err => console.log(err))
  }


  return acces_forum ? (
    <div className="container">

      <form className="formForum">
        <h3>Ajoutez votre message</h3>
        {/* <input onChange={(e) => setNewPost({ ...newPost, title: e.target.value, })} placeholder='Titre' type="text" id='title' /> */}
        <textarea onChange={(e) => setNewPost({ ...newPost, text: e.target.value, })} placeholder='Message' type="text" id='text' required />
        <label className='labelFile' htmlFor="file">
          <input onChange={(e) =>
            setNewPost({ ...newPost, image: e.target.files[0], })} type="file" id='file' />
          <span className='noFile'>Ajoutez une photo</span>
          {/* <span className='fileAdd'>Photo ajouté !</span> */}

        </label>
        <button onClick={handleClick}><FaTelegramPlane /></button>
      </form>
      {post
        .map((post, index) =>
          <div className='postContainer' key={post.id}>
            <Card user={user} post={post} setPosted={setPosted} comments={comments} setComments={setComments} />
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