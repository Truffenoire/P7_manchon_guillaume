import React, { useState } from 'react';

const InputName = ({ setUserSignup, userSignup }) => {
    const [testName, setTestName] = useState()
    const [value, setValue] = useState("")
    // REGEX NOM
    const validName = (inputName) => {
        let nameRegExp = new RegExp('^[a-zA-Z-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s-]*$', 'g');
        setTestName(nameRegExp.test(inputName.target.value))
        setValue(inputName.target.value)
    }
    return (
        <>
            {
                testName && value.length >= 4 && value.length <= 15 ?
                    <input className='valid' onInput={validName} onChange={(e) =>
                        setUserSignup({ ...userSignup, username: e.target.value, })}
                        type="text" name='username' id='name' placeholder='Nom' required />
                    :
                    testName === undefined ?
                        <input onInput={validName} onChange={(e) =>
                            setUserSignup({ ...userSignup, username: e.target.value, })}
                            type="text" name='username' id='name' placeholder='Nom' required />
                        :
                        <input className='nonValid' onInput={validName} onChange={(e) =>
                            setUserSignup({ ...userSignup, username: e.target.value, })}
                            type="text" name='username' id='name' placeholder='Nom' required />
            }
        </>
    );
};

export default InputName;