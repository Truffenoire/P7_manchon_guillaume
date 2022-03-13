import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiDotsHorizontal } from "react-icons/bi";


const Account = ({ user, setUser }) => {

    const navigate = useNavigate()
    const acces_forum = localStorage.getItem('keyToken')

    const handleLogout = async (e) => {
        e.preventDefault()
        localStorage.clear()
        await setUser("")
        navigate('/')
    }
    const [updateUser, setUpdateUser] = useState(true)

    const handleToggle = async (e) => {
        setUpdateUser(!updateUser)
        console.log(!updateUser);
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

    const handleUpdate = async (e) => {
        e.preventDefault()
        const myForm = document.getElementById('myForm')
        let formData = new FormData(myForm);

        await fetch(`http://localhost:3000/user/update/${user.id}`, {
            method: 'PATCH',
            headers: {
                'authorization': 'bearer ' + acces_forum,
            },
            body: formData,
        })
            .then(response => {
                response.json()
            })
            .then((data) => {
                for (var value of formData.values()) {
                    console.log(value);
                };
                setUpdateUser(!updateUser)
                console.log(user);
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
        if(confirmErase === "OUI" ){
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
            })
            .catch(err => alert("utilisateur introuvable !"));
            
        }else{
            // renvoi au profil
            setDeteleAccound(!deleteAccount)
        }
        
    }

    return updateUser ? (
        <div className='account'>
            <div className='titleProfil'><h1>Mon profil</h1><span onClick={handleToggle}><BiDotsHorizontal /></span></div>
            <div className="cardProfile">
                <div className="name">
                    <img className='imgProfil' src={user.urlImage} alt="" />
                    {user.username}
                </div>
                <div className="email">
                    {user.email}
                </div>
            </div>
            <button onClick={handleLogout}>Déconnexion</button>
        </div>
    ) : (
        <div className='account'>
            <div className='titleProfil'><h1>Mon profil</h1><span onClick={handleToggle}><BiDotsHorizontal /></span></div>
            <div className="cardProfile">
                <form id='myForm' name='myForm'>
                    <input defaultValue={user.username} onChange={(e) => setUser({ ...user, username: e.target.value, })} name='username' type="text" />
                    {/* <input placeholder='votre mdp' onChange={(e) =>
                        setUser({ ...user, password: e.target.value, })}
                        type="password" name='password' id='password' /> */}
                    <input name='image' onChange={(e) =>
                        setUser({ ...user, image: e.target.files[0], })} type="file" />
                    <textarea defaultValue={user.email} onChange={(e) => setUser({ ...user, email: e.target.value, })} name="email" id="" cols="30" rows="10"></textarea>
                    <button onClick={handleUpdate}>Validez les changement</button>
                    <button onClick={handleDelete}>Supprimer votre compte</button>
                    {deleteAccount ? (
                        <div className='opaque'>
                            <div className='deleteAccount'>
                                <h4>Cette action est irreverssible</h4>
                                <h5>êtes vous sur de vouloir supprimer votre compte ?</h5>
                                <form className='formDeleteAccount'>
                                    <input placeholder='confirmer par Oui' onChange={(e) =>  e.target.value } type="text" />
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