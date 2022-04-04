import React, { useState } from 'react';

const InputPassword = ({ userSignup, setUserSignup }) => {
    const [testPassword, setTestPassword] = useState()
    const [valuePassword, setValuePassword] = useState("")
    // REGEX PASSWORD
    const validPassword = (inputPassword) => {
        let passwordRegExp = new RegExp('^[a-zA-Z-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s-]*$', 'g');
        setTestPassword(passwordRegExp.test(inputPassword.target.value))
        setValuePassword(inputPassword.target.value)
    }
    return (
        <>
            {
                testPassword && valuePassword.length >= 4 ?
                    <input className='valid' onInput={validPassword} onChange={(e) =>
                        setUserSignup({ ...userSignup, password: e.target.value, })}
                        type="password" name='password' id='password' placeholder='Password' required />
                    :
                    testPassword === undefined ?
                        <input onInput={validPassword} onChange={(e) =>
                            setUserSignup({ ...userSignup, password: e.target.value, })}
                            type="password" name='password' id='password' placeholder='Password' required />
                        :
                        <input className='nonValid' onInput={validPassword} onChange={(e) =>
                            setUserSignup({ ...userSignup, password: e.target.value, })}
                            type="password" name='password' id='password' placeholder='Password' required />
            }
        </>
    );
};

export default InputPassword;