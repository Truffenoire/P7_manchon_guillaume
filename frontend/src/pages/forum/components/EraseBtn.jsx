import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Flip } from 'react-toastify';
import { FaTrash } from "react-icons/fa";



const EraseBtn = ({ user, post, setPosted }) => {

  const isMyPost = user.id === post.userId;
  const acces_forum = localStorage.getItem('keyToken')
  const isAdmin = user.isAdmin


  const handleDelete = async (e) => {
    // e.preventDefault()
    console.log(post.id);
    // supprime les commentaires pour pouvoir supprimer le post
    for (let i = 0; i < post.comments.length; i++) {
      console.log(post.comments[i].id);
      await fetch(`http://localhost:3000/post/${post.id}/comment/${post.comments[i].id}/deleteOne`, {
        // mode: 'no-cors',
        method: 'DELETE',
        headers: {
          'authorization': 'bearer ' + acces_forum,
          'Content-Type': 'application/json',
        },
      })
        // setposted pour declanger le useEffect et actualiser la page
        .then(res => {
          setPosted(true)
        })
        .catch(err => alert("commentaire non trouvé !"));
    }
    // supprime le post
    fetch(`http://localhost:3000/post/deleteOne/${post.id}`, {
      method: 'DELETE',
      headers: {
        'authorization': 'bearer ' + acces_forum,
        'Content-Type': 'application/json',
      },
    })
      // setposted pour declanger le useEffect et actualiser la page
      .then(res => {
        toast.error('Message supprimé !' , {
          theme: "colored",
          transition: Flip,
          position: "bottom-center",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          })
        setPosted(true)
      })
      .catch(err => alert("post non trouvé !"));
  }

  return isMyPost ? (
    <div className="deletePost">
      <button onClick={
        handleDelete
      }><FaTrash /></button>
      <ToastContainer />
    </div>
  ) : isAdmin  ? (
    <div className="deletePost">
      <button onClick={
        handleDelete
      }><FaTrash /></button>
      {/* <ToastContainer /> */}
    </div>
  ) : (
    null
  );
};

export default EraseBtn;