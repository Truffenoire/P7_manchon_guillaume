import React, { useEffect, useState } from 'react';
import { FaTrashAlt, FaPencilAlt, FaTelegramPlane } from "react-icons/fa";


const ComView = ({ post, user, posted, setPosted, comments, setComments }) => {

    const acces_forum = localStorage.getItem('keyToken')
    const commentaire = post.comments
    // setComments(post.comments)

    const handleDelete = async (e, index) => {
        const userId = JSON.stringify(user.id)
        // console.log(userId);
        const spanVisé = e.target.closest('span')
        const indexCom = spanVisé.getAttribute('data-index')
        // console.log(indexCom);
        // console.log(commentaire[indexCom].id);

        await fetch(`http://localhost:3000/post/${commentaire[indexCom].postId}/comment/${commentaire[indexCom].id}/deleteOne`, {
            // mode: 'no-cors',
            method: 'DELETE',
            headers: {
                'authorization': 'bearer ' + acces_forum,
                'Content-Type': 'application/json',
            },
            //   body: {userId: userId},
        })
            // setposted pour declanger le useEffect et actualiser la page
            .then(res => setPosted(true))
            .catch(err => alert("commentaire non trouvé !"));
    }
    // State pour update
    const [updateState, setUpdateState] = useState(true)
    const handleToggle = () => {
        setUpdateState(!updateState)
        // console.log(updateState);
    }
    // Pour update les commentaires
    const handleUpdate = async (e) => {
        const btnVisé = e.target.closest('button')
        const indexCom = btnVisé.getAttribute('data-index')
        // console.log(commentaire[indexCom].id);
        // console.log(JSON.stringify(comments));
        await fetch(`http://localhost:3000/post/${commentaire[indexCom].postId}/comment/${commentaire[indexCom].id}/update`, {
            method: 'PATCH',
            headers: {
                'authorization': 'bearer ' + acces_forum,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(comments),
        })
            // set pour declanger le useEffect et actualiser la page
            .then((res) => {
                setUpdateState(!updateState)
                setComments(null)
            })
            .catch(err => alert("commentaire non trouvé !"));

    }

    return commentaire.length > 0 ? (
        <div className='apercuCom'>
            {commentaire.sort(function compare(a, b) {
                if (a.id < b.id)
                    return -1;
                if (a.id > b.id)
                    return 1;
                return 0
            }).map((com, e, index) => {
                return commentaire[e].userId === user.id ?
                    <div className='flexCom' key={com.id}>
                        <div className='titleComment'><img src={com.userImg} alt="pic" /><span className='userCom'>{com.username}</span></div>
                        <div className='commentCard'>
                            {updateState ?
                                <span className='userText'>{com.text}</span>
                                :
                                <input defaultValue={com.text} onChange={(e) => setComments({ ...comments, text: e.target.value, })} type="text" />
                            }
                            <div className='updateDelete'>
                                {updateState ?
                                    <span onClick={handleToggle} data-index={e}><FaPencilAlt /></span>
                                    :
                                    <button onClick={handleUpdate} data-index={e}><FaTelegramPlane /></button>
                                }

                                <span onClick={handleDelete} data-index={e}><FaTrashAlt /></span>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='flexCom' key={com.id}>
                        <div className='titleComment'><img src={com.userImg} alt="pic" /><span className='userCom'>{com.username}</span></div>
                        <span className='userText'>{com.text}</span>
                        <span></span>
                    </div>
            }
            )}
        </div>
    ) : (
        null
    );
};

export default ComView;