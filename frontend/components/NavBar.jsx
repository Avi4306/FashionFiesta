import React,{useState} from 'react';
import '/src/index.css';
import '/src/App.css';
import { CiHome } from "react-icons/ci";
import { PiShoppingCartThin } from "react-icons/pi";
import { CiUser } from "react-icons/ci";
// import { MDBInput } from 'mdb-react-ui-kit';
import { CiSearch } from "react-icons/ci";

export default function NavBar() {
    const[isactive, setActive] = useState(false);
    function HandleClick() {
        setActive(!isactive);
    }
    return (
        <div className="NavBar ">
            <div className="nav-links">
                <a href="#index" className="text-3lg font-bold" >Home</a>
                <a href="#index" className="text-3lg font-bold">Trending Styles</a>
                <a href="#index" className="text-3lg font-bold">Featured Designers</a>
            </div>  
           <div className="nav-icons">
            <div className={`${isactive?"search-container active":"search-container"}`} onClick= {HandleClick} >
            <CiSearch/>
            <input type ="text" name="search-query" className='search-bar' placeholder=' Search....?'/>
           </div>
            <div className="Icons">
                <CiHome />
                <PiShoppingCartThin />
                <CiUser /></div>
           </div>
        </div>
    )
};