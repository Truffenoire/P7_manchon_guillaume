import { Link } from 'react-router-dom'
import logo from '../icons/icon-left-font-monochrome-black.png'
import { FaHome, FaFeatherAlt, FaDoorOpen } from "react-icons/fa";




function Header({ user }) {

    const localLogin = localStorage.getItem("keyToken")
    const userId = localStorage.getItem('userId')
    const   id   = userId;
    // const { id } = useParams()
    // console.log( 'user dans le header', user ); 
    return localLogin ?(
        <div className="header">
            <div className="imgLogoHeader"><img src={logo} alt="logo Groupomania" /></div>
            {/* <h1>Groupomania</h1> */}
            <nav>
                <Link to={'/compte/'+ id }><img className='imgToProfile' src={user.urlImage} alt='profil'/></Link>
                <Link to={"/forum/" + id }><FaFeatherAlt /></Link>
            </nav>
        </div>
    ) : (
        <div className="header">
            <div className="imgLogoHeader"><img src={logo} alt="logo Groupomania" /></div>
            {/* <h1>Groupomania</h1> */}
            <nav>
                <Link to="/"><FaHome /></Link>
                <Link to="/login"><FaDoorOpen /></Link>
                {/* <Link to={"/forum/" + id }>forum</Link> */}
            </nav>
        </div>
    )
}

export default Header