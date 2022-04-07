import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Zoom, Flip } from 'react-toastify';
import { BiDotsHorizontal } from "react-icons/bi";

const Account = ({ user, setUser, comments, setComments }) => {

    const navigate = useNavigate()
    const acces_forum = localStorage.getItem('keyToken')

    const handleLogout = async (e) => {
        e.preventDefault()
        localStorage.clear()
        await setUser("")
        navigate('/')
        setTimeout(() => {
            toast.warn('Déconnection !', {
                theme: "colored",
                position: "bottom-center",
                autoClose: 1000,
                transition: Flip,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }, 500)
    }
    const [updateUser, setUpdateUser] = useState(true)
    const handleToggle = async (e) => {
        setUpdateUser(!updateUser)
    }

    // Maintient de la session avec mise a jour du state
    useEffect(() => {
        const userId = localStorage.getItem('userId')
        fetch(`http://localhost:3000/user/${userId}`)
            .then(response => response.json())
            .then(data => {
                setUser(data)
            })
            .catch(err => console.log(err))
    }, [setUser])

    // Modification du profil
    const handleUpdate = async (e) => {

        e.preventDefault()
        let formData = new FormData();
        // On contruit le formulaire avant l'envoi
        formData.append("username", user.username)
        formData.append("email", user.email)
        formData.append("image", user.image)

        await fetch(`http://localhost:3000/user/update/${user.id}`, {
            method: 'PATCH',
            headers: {
                'authorization': 'bearer ' + acces_forum,
            },
            body: formData,
        })
            .then(response => response.json())
            .then(async (data) => {
                // On recupère l'user dans la base de donnée pour le mettre à jour.
                await fetch(`http://localhost:3000/user/${user.id}`, {
                    method: 'GET',
                    headers: {
                        'authorization': 'bearer ' + acces_forum,
                    },
                })
                    .then(response => response.json())
                    .then(async (data) => {
                        setUser(data)
                        // On met à jour les commentaires de l'utilisateur pour la photo de profil
                        await fetch(`http://localhost:3000/post/${user.id}/comment`, {
                            method: 'PATCH',
                        })
                            .then(res => res.json())
                            .then((data) => {
                                setComments(data)
                            })
                            .catch(err => console.log(err))
                    })
                    .catch(err => console.log(err))
                setUpdateUser(!updateUser)
            })
            .catch(err => console.log(err))
    }

    const [deleteAccount, setDeteleAccound] = useState(false)
    const handleDelete = async (e) => {
        e.preventDefault()
        setDeteleAccound(!deleteAccount)
        console.log(!deleteAccount);
    }
    const handleEraseCount = async (e) => {
        e.preventDefault()
        const formDelete = e.target.closest('form');
        const inputDelete = formDelete.childNodes[0]
        let valueInput = inputDelete.value
        const confirmErase = valueInput.toUpperCase()
        if (confirmErase === "OUI") {
            // supprime le compte
            fetch(`http://localhost:3000/user/deleteOne/${user.id}`, {
                method: 'DELETE',
                headers: {
                    'authorization': 'bearer ' + acces_forum,
                    'Content-Type': 'application/json',
                },
            })
                // setposted pour declanger le useEffect et actualiser la page
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    localStorage.clear()
                    setUser("")
                    navigate('/')
                    setTimeout(() => {
                        toast.error('Compte supprimé !', {
                            theme: "colored",
                            position: "bottom-center",
                            autoClose: 1000,
                            transition: Zoom,
                            hideProgressBar: false,
                            closeOnClick: false,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    }, 1000)
                })
                .catch(err => alert("utilisateur introuvable !"));

        } else {
            // renvoi au profil
            setDeteleAccound(!deleteAccount)
        }

    }

    return updateUser ? (
        <div className='account'>
            <div className='titleProfil'><h1>Mon profil</h1><span onClick={handleToggle}><BiDotsHorizontal /></span></div>
            <div className="cardProfile">
                <div className="photoProfil">
                    <img className='imgProfil' src={user.urlImage} alt="img de Profil" />
                </div>
                <div className='infoUser'>
                    <div className="userName">
                        {user.username}
                    </div>
                    <div className="email">
                        {user.email}
                    </div>
                </div>
            </div>
            <div className='btnDeco'><button onClick={handleLogout}>Déconnexion</button></div>

        </div>
    ) : (
        <div className='account'>
            <div className='titleProfil'><h1>Mon profil</h1><span onClick={handleToggle}><BiDotsHorizontal /></span></div>
            <div className="cardProfile">
                <form id='myForm' name='myForm'>
                    <input defaultValue={user.username} onChange={(e) => setUser({ ...user, username: e.target.value, })} name='username' type="text" />
                    <input name='image' onChange={(e) =>
                        setUser({ ...user, image: e.target.files[0], })} type="file" />
                    <textarea defaultValue={user.email} onChange={(e) => setUser({ ...user, email: e.target.value, })} name="email" id="" cols="30" rows="10"></textarea>
                    <button onClick={handleUpdate}>Validez les changement</button>
                    <ToastContainer />
                    <button onClick={handleDelete}>Supprimer votre compte</button>
                    {deleteAccount ? (
                        <div className='opaque'>
                            <div className='deleteAccount'>
                                <h4>Cette action est irreverssible</h4>
                                <h5>êtes vous sur de vouloir supprimer votre compte ?</h5>
                                <form className='formDeleteAccount'>
                                    <input placeholder='confirmer par Oui' onChange={(e) => e.target.value} type="text" />
                                    <button onClick={handleEraseCount}>Supprimer</button>
                                    <button onClick={handleDelete}>Annuler</button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        null
                    )}

                </form>
            </div>
        </div>
    );
};

export default Account;