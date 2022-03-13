import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { FaCommentDots, FaMarker, FaTelegramPlane } from 'react-icons/fa'

import Comment from './Comment/Comment'


const Card = ({ post, user, posted, setPosted, comments, setComments }) => {

    const acces_forum = localStorage.getItem('keyToken')
    // const userId = user.id
    const [updateState, setUpdateState] = useState(true)
    const [usersSignup, setUsersSignup] = useState([])
    //appel API pour recuperer les utilisateurs
    useEffect(() => {

        fetch("http://localhost:3000/user")
            .then(response => response.json())
            .then(data => {
                setUsersSignup(data)
                // console.log("DATA", data)
            })
            .catch(err => {
                console.log(err)
            })
    }, []);


    const handleToggle = () => {
        console.log('USER', usersSignup);
        console.log('POST', post);
        setUpdateState(!updateState)
    }
    const [postComment, setPostComment] = useState(false)
    const handleComment = () => {

        setPostComment(!postComment)
        console.log(!postComment);
        console.log(user);
    }
    const [postUpdate, setPostUpdate] = useState()
    const isMyPost = post.userId === user.id

    const handleClick = async (e) => {
        e.preventDefault()
        const myForm = document.getElementById('myForm')
        let formData = new FormData(myForm);

        await fetch(`http://localhost:3000/post/update/${post.id}`, {
            method: 'PATCH',
            headers: {
                'authorization': 'bearer ' + acces_forum,
            },
            body: formData,
        })
            // setposted pour declanger le useEffect et actualiser la page
            .then((res) => {
                for (var value of formData.values()) {
                    console.log(value);
                };
                setPosted(true)
                setUpdateState(true)
            })
            .catch(err => console.log(err))
    }

    return updateState ? (

        <div className='card'>
            {isMyPost ?
                <div className='userId'>
                    <div>
                        <img className='imgProfilCard' src={
                            usersSignup.map((usersSignup, index) => {
                                if (post.userId === usersSignup.id) return usersSignup.urlImage
                            }).join('')
                        } alt="pic-profil" />
                    </div>

                    <div className='userNameProfil'>{post.userName}</div>
                    <span onClick={handleToggle} className='upDatePost'><FaMarker /></span>
                </div>
                :
                <div className='userId'>
                    <div>
                        <img className='imgProfilCard' src={
                            usersSignup.map((usersSignup, index) => {
                                if (post.userId === usersSignup.id) return usersSignup.urlImage
                            }).join('')
                        } alt="pic-profil" />
                    </div>

                    <div className='userNameProfil'>{post.userName}</div>
                    <div></div>
                </div>
            }
            <div className='titlePost'>{post.title}</div>
            <div className='textPost'>{post.text}</div>
            <div className='imgPost'>
                <img src={post.urlImage} alt={post.urlImage} />
                </div>
            <div onClick={handleComment} className="comment"> <FaCommentDots /> {post.comments.length}</div>
            {postComment ? (
                <Comment comments={comments} setComments={setComments} user={user} post={post} setPosted={setPosted} setPostComment={setPostComment} />
            ) : (
                null
            )}
        </div>
    ) : (
        <div className='card'>
            <div className='userId'>post n° {post.id} poster par {post.userName} <span onClick={handleToggle} className='upDatePost'><FaMarker /></span></div>
            <form id='myForm' name='myForm'>
                <input defaultValue={post.title} onChange={(e) => setPostUpdate({ ...postUpdate, title: e.target.value, })} name='title' type="text" id='title' />
                <textarea defaultValue={post.text} onChange={(e) => setPostUpdate({ ...postUpdate, text: e.target.value, })} name='text' type="text" id='text' />
                <input defaultValue={post.image} onChange={(e) =>
                    setPostUpdate({ ...postUpdate, image: e.target.files[0], })} name='image' type="file" id='file' />
                <button onClick={handleClick}><FaTelegramPlane /></button>
            </form>
        </div>
    );
};

export default Card;