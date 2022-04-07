import React from 'react';
import notFoundImg from '../icons/icon-above-font.svg'

const NotFound = ({user}) => {
    return (
        <div className='notFound'>
            <h3 className='notTxt'>Rien du tout à cette adresse, ah si, une Erreur 404 !</h3>
            <div className="notImg">
                <img src={notFoundImg} alt="Erreur 404" />
            </div>            
        </div>
    );
};

export default NotFound;