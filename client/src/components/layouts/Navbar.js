import React from 'react'
import styled from "styled-components";
import logo from '../../assets/three.jpg'
import {Link} from 'react-router-dom'

const NavbarContainer = styled.div`
    background: var(--pink);
    .nav-link {
        color: #fff !important;
        &:hover {
            background: var (--light-green);
        }
    }
`;

const Navbar = (props) => {
    return (
        <NavbarContainer>
            <nav className="navbar navbar-expand-lg navbar-light px-5 py-0">
                <Link className="navbar-brand" to="/">
                    <img src={logo} alt="bisi" style={{width: '50px'}} />
                </Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item active">
                            <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/add">Add Article</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </NavbarContainer>
    )
}

export default Navbar;