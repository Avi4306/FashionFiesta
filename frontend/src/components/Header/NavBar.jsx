import React,{useState, useEffect} from 'react';
import '/src/index.css';
import '/src/App.css';
import { CiHome } from "react-icons/ci";
import { PiShoppingCartThin } from "react-icons/pi";
import { CiUser } from "react-icons/ci";
// import { MDBInput } from 'mdb-react-ui-kit';
import { CiSearch } from "react-icons/ci";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import {Menu, MenuItem, Typography, Divider} from '@mui/material';

export default function NavBar() {
    const[isactive, setActive] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    function HandleClick() {
        setActive(!isactive);
    }
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    console.log(user);
    useEffect(() => {
        const profile = JSON.parse(localStorage.getItem('profile'));
        setUser(profile);
    }, [location]);
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('profile');
        dispatch({ type: 'LOGOUT' });
        navigate('/');
    };
    return (
        <nav className="NavBar ">
            <div className="nav-links">
            <Link to="/" className="text-3lg font-bold">Home</Link>
            <Link to="/trending" className="text-3lg font-bold">Trending Styles</Link>
            <Link to="/designers" className="text-3lg font-bold">Featured Designers</Link>
            <Link to="/style-diaries" className="text-3lg font-bold">Style Diaries</Link>
            </div>
 
           <div className="nav-icons">
            <div className={`${isactive?"search-container active":"search-container"}`} onClick= {HandleClick} >
            <CiSearch/>
            <input type ="text" name="search-query" className='search-bar' placeholder=' Search....?'/>
           </div>
            <div className="Icons">
                <CiHome />
                <PiShoppingCartThin />
                {user?.result ? ( // user !== null && user !== undefined ? user.result : undefined
                        <Avatar
                            alt={user.result.name}
                            src={user.result.imageUrl}
                            onClick={handleLogout}
                            sx={{ cursor: 'pointer', width: 40, height: 40 }}
                        >
                            {!user.result.imageUrl && user.result.name.charAt(0)}
                        </Avatar>
                    ) : (
                    <Link to="/auth">Login</Link>
                    )}
                </div>
           </div>
        </nav>
    )
};