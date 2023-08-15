import React from 'react'
import styled from "styled-components";


const FooterContainer = styled.footer`
    background: #344;
    height: 4rem;
    position: relative;
    left: 0;
    bottom: 0;
    width: 100%;
    `;

const Footer = (props) => {
    return (
        <FooterContainer>
            <span style={{
                color: '#fff',
                top: '1.5rem',
                position: 'relative',
                left: '1.0rem',
              
            }}>
                &copy; {new Date().getFullYear()}. All Rights Reserved. Ayokunle.
            </span>
        </FooterContainer>
    )
}

export default Footer;