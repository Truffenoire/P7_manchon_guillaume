import React, { useState } from 'react';

const ImputMail = ({ setUserSignup, userSignup }) => {
    const [testMail, setTestMail] = useState()
    // REGEX EMAIL
    const validMail = (inputMail) => {
        let emailRegExp = new RegExp('^[a-zA-Z0-9ôöáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s-]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g');
        setTestMail(emailRegExp.test(inputMail.target.value))

    }

    return (

        <>
            {
                testMail ?
                    <input className='valid' onInput={validMail} onChange={(e) =>
                        setUserSignup({ ...userSignup, email: e.target.value, })}
                        type="text" name='email' id='email' placeholder='Email' required />
                    :
                    testMail === undefined ?
                        <input onInput={validMail} onChange={(e) =>
                            setUserSignup({ ...userSignup, email: e.target.value, })}
                            type="text" name='email' id='email' placeholder='Email' required />
                        :
                        <input className='nonValid' onInput={validMail} onChange={(e) =>
                            setUserSignup({ ...userSignup, email: e.target.value, })}
                            type="text" name='email' id='email' placeholder='Email' required />
            }
        </>

    );
};

export default ImputMail;