import React from "react";
import '../App.css';
import GithubImg from '../images/github.png';

function Nav(){
    return (
        <nav className="nav-wrapper">
            <img style={{ padding : '6px', height : '32px'}} src={GithubImg} />
           <div className="title">Github Profile Analyser</div>
        </nav>
    );
}

export default Nav;