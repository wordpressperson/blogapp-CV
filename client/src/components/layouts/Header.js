import React from 'react'
import styled from "styled-components";

const MainContainer = styled.header`
    background: url(../../images/thirteen.jpg) center/contain; 
    height: 25rem;

    h1 {
        transform: translate(-50%, -50%);
        color: #fff;
        font-weight: 900;
        position: absolute;
        top: 25%;
        left: 50%
    }
`

const Header = (props) => {
    return (
            <MainContainer>
                <h1>Ayokunle's Blog</h1>
            </MainContainer>
    )
}

export default Header;