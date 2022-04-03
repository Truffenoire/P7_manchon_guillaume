import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DayJS from 'react-dayjs';
import { FaCommentDots, FaMarker, FaTelegramPlane, FaHandPeace, FaHandRock } from 'react-icons/fa'

import Comment from './Comment/Comment'


const Card = ({ post, setPosts, user, posted, setPosted, comments, setComments }) => {

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

        fetch(`http://localhost:3000/post/update/${post.id}`, {
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
                toast.success('Message mis à jour !', {
                    position: "bottom-center",
                    autoClose: 500,
                    transition: Zoom,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            })
            .catch(err => console.log(err.message))
    }
    const [like, setLike] = useState(post.userLiked)
    const [userLike, setUserLike] = useState(like.includes(user.id))
    const [liked, setLiked] = useState(post.userLiked.length)

    const handleLike = async (e) => {

        setUserLike(!userLike)
        // console.log(!userLike);
        let data;
        if (userLike) {
            toast.info('UnLike !', {
                position: "bottom-center",
                autoClose: 500,
                transition: Zoom,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            data = {
                like: 0
            }
        } else if (!userLike) {
            toast.success('Like !', {
                position: "bottom-center",
                autoClose: 500,
                transition: Zoom,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            data = {
                like: 1
            }
        }
        const dataLike = JSON.stringify(data)
        console.log(dataLike);
        // Pour liker un post
        if (!userLike) {
            await fetch(`http://localhost:3000/post/${post.id}/like`, {
                method: 'POST',
                headers: {
                    'authorization': 'bearer ' + acces_forum,
                    'Content-Type': 'application/json',
                },
                body: dataLike,
            })
                .then(res => {
                    console.log(post);
                })
                .catch(err => console.log(err))
        }
        // Pour unLike un post
        else {
            await fetch(`http://localhost:3000/post/${post.id}/like`, {
                method: 'POST',
                headers: {
                    'authorization': 'bearer ' + acces_forum,
                    'Content-Type': 'application/json',
                },
                body: dataLike,
            })
                .then(res => {
                    // let indexUser = post.userLiked.indexOf(user.id)
                    // setPosts(post.userLiked.splice(indexUser, 1))
                    console.log(post);
                })
                .catch(err => console.log(err))
        }
        // met a jour le state sur le forum
        setPosted(true)
    }


    return updateState ? (

        <div className='card'>
            {isMyPost ?
                <div className='userId'>
                    <div>
                        <img className='imgProfilCard' src={
                            usersSignup.map((usersSignup, index) => {
                                if (post.userId === usersSignup.id) { return usersSignup.urlImage }
                                else { return null }
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
                                if (post.userId === usersSignup.id) { return usersSignup.urlImage }
                                else { return null }
                            }).join('')
                        } alt="pic-profil" />
                    </div>

                    <div className='userNameProfil'>{post.userName}</div>
                    <div></div>
                </div>
            }
            {/* <div className='titlePost'>{post.title}</div> */}
            <div className='textPost'>{post.text}</div>
            <div className='imgPost'>
                <img src={post.urlImage} alt={post.urlImage} />
            </div>
            <div className='footerCard'>
                <div onClick={handleComment} className="comment"> <FaCommentDots /> {post.comments.length}</div>
                <DayJS className='postDate' element='div' format='DD-MM-YYYY à HH:mm:ss'>{post.createdAt}</DayJS>
                {userLike ? (
                    <div onClick={handleLike} className='likeUnLike'><FaHandPeace /> <span>{post.userLiked.length}</span></div>
                )
                    :
                    (
                        <div onClick={handleLike} className='likeUnLike'><FaHandRock /> <span>{post.userLiked.length}</span>
                            <ToastContainer /></div>
                    )}
            </div>
            {postComment ? (
                <Comment comments={comments} setComments={setComments} user={user} post={post} setPosted={setPosted} setPostComment={setPostComment} />
            ) : (
                null
            )}
        </div>
    ) : (
        <div className='card'>
            <div className='userId'>
                <div>
                    <img className='imgProfilCard' src={
                        usersSignup.map((usersSignup, index) => {
                            if (post.userId === usersSignup.id) { return usersSignup.urlImage }
                            else { return null }
                        }).join('')
                    } alt="pic-profil" />
                </div>
                <div className='userNameProfil'>{post.userName}</div>
                <span onClick={handleToggle} className='upDatePost'><FaMarker /></span>
            </div>
            <form id='myForm' name='myForm'>
                <textarea defaultValue={post.text} onChange={(e) => setPostUpdate({ ...postUpdate, text: e.target.value, })} name='text' type="text" id='text' />
                <input defaultValue={post.image} onChange={(e) =>
                    setPostUpdate({ ...postUpdate, image: e.target.files[0], })} name='image' type="file" id='file' />
                <button onClick={handleClick}><FaTelegramPlane /></button>
            </form>
        </div>
    );
};

export default Card;