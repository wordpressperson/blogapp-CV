import React from 'react';
import styled from "styled-components";
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';   // ← new

const NavbarContainer = styled.div`
  background: var(--pink);

  .nav-link {
    color: #fff !important;
    &:hover {
      background: var(--light-green);
    }
  }

  .navbar-text {
    color: #fff;
    font-weight: 500;
    margin-right: 15px;
  }
`;

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <NavbarContainer>
      <nav className="navbar navbar-expand-lg navbar-light px-5 py-0">
        <Link className="navbar-brand" to="/">
          <img src={require('../../assets/three.jpg')} alt="logo" style={{ width: '50px' }} />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item active">
              <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
            </li>

            {/* Add Article - only visible to admins */}
            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link" to="/add">Add Article</Link>
              </li>
            )}

            {/* Show email + Logout when logged in */}
            {user ? (
              <>
                <li className="nav-item">
                  <span className="navbar-text">
                    {user.email}
                  </span>
                </li>
                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="nav-link btn btn-link"
                    style={{ background: 'none', border: 'none', padding: '0.5rem 1rem', color: '#fff' }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : null}
          </ul>
        </div>
      </nav>
    </NavbarContainer>
  );
};

export default Navbar;
