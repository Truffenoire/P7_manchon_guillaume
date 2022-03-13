import { Link, useParams } from 'react-router-dom'
import logo from '../icons/icon.png'
import { FaHome, FaUserAlt, FaFeatherAlt, FaDoorOpen } from "react-icons/fa";




function Header({ user }) {

    const localLogin = localStorage.getItem("keyToken")
    const userId = localStorage.getItem('userId')
    const   id   = userId;
    // const { id } = useParams()
    // console.log( 'user dans le header', user ); 
    return localLogin ?(
        <div className="header">
            <img src={logo} alt="logo Groupomania" />
            <h1>Groupomania</h1>
            <nav>
                <Link to={'/compte/'+ id }><FaUserAlt /></Link>
                <Link to={"/forum/" + id }><FaFeatherAlt /></Link>
            </nav>
        </div>
    ) : (
        <div className="header">
            <img src={logo} alt="logo Groupomania" />
            <h1>Groupomania</h1>
            <nav>
                <Link to="/"><FaHome /></Link>
                <Link to="/login"><FaDoorOpen /></Link>
                {/* <Link to={"/forum/" + id }>forum</Link> */}
            </nav>
        </div>
    )
}

export default Header