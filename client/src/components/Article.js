import React, { useEffect, useState } from 'react'
import spinner from '../assets/spinner.gif'
import axios from 'axios'
import styled from "styled-components";
import {Link} from 'react-router-dom'

const MainContainer = styled.div `
margin: 6rem auto;
padding: 3rem 14rem;

h2 {
    text-align: center;
    font-weight: 900;
    color: var(--pink);
}

img {
    display: block;
    margin: auto;
}

.btn-primary {
    margin-top: 2rem;
    background: var(--blue);
    border: none;

    &:hover {
        background: var(--pink)
    }
}
`


const Article = (props) => {

    const [title, setTitle] = useState("")
    const [article, setArticle] = useState("")
    const [author, setAuthor] = useState("")

    useEffect(() => {
        axios
        .get(`/articles/${props.match.params.id}`)
        .then(res => [
            setTitle(res.data.title),
            setAuthor(res.data.author),
            setArticle(res.data.article)        
        ])

        .catch(error => console.log(error))
    }, [props])

    return (
        
        <MainContainer>
            {
                !title && !article && !author ? <img src={spinner} alt="spinner" /> : 
                <div>
                    <h2>{title}</h2>
                    <p>{article}</p>
                    <span className="badge badge-secondary">{author}</span>
                    < br />

                    <Link to='/' type="submit" className="btn btn-primary">Go back</Link>
                </div>
            }
        </MainContainer>
    )
}

export default Article;