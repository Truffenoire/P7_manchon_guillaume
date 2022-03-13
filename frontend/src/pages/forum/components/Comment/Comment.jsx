import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaTelegramPlane } from 'react-icons/fa'


const Comment = ({ post, user, setPosted, setPostComment, comments, setComments }) => {

    const { id } = useParams();
    const [com, setCom] = useState();

    const acces_forum = localStorage.getItem('keyToken')

    const handleclick = async () => {

        // console.log(user);
        const userCom = {
            ...com,
            // userId: user.id,
            // postId: onePost.id,
            username: user.username,
            userImg: user.urlImage
        }
        // console.log('BODY DU FRONT', JSON.stringify(userCom));
        await fetch(`http://localhost:3000/post/${post.id}/comment/add`, {
            method: 'POST',
            headers: {
                'authorization': 'bearer ' + acces_forum,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userCom),
        })
            .then(res => {
                setPosted(true)
                setPostComment(false)
            })
            .catch(err => console.log(err));
    }

    return (
        <>
            <div className="formComment">
                <h4>Votre commentaire</h4>
                <textarea onChange={(e) => setCom({ ...com, text: e.target.value, })} type="text" />
                <button onClick={handleclick} ><FaTelegramPlane /></button>
            </div>
        </>
    );
};

export default Comment;