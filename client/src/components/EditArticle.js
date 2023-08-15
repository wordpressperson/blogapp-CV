import React, { useState, useEffect } from 'react'
import styled from "styled-components";
import axios from 'axios';

const EditArticleContainer = styled.div`
margin: 3rem auto;
padding: 4rem;
width: 31.25rem;

h1 {
    font-weight: 900;
    color: var(--pink);
}

.btn-primary {
    margin-top: 2rem;
    background: var(--blue);
    border: none;

    &:hover {
        background: var(--pink)
    }
}

.message {
    font-weight: 900;
    color: tomato;
    padding: 1rem 1rem 1rem 0;
}
`

const EditArticle = (props) => {

    const [title, setTitle] = useState("")
    const [article, setArticle] = useState("")
    const [author, setAuthor] = useState("")
    const [message, setMessage] = useState("")



    useEffect(() => {
        axios
        .get(`/articles/${props.match.params.id}`)
        .then(res => [
            setTitle(res.data.title),
            setAuthor(res.data.authorname),
            setArticle(res.data.article)        
        ])

        .catch(error => console.log(error))
    }, [])


const handleSubmit = (e) => {
    e.preventDefault();
 
    const articles = {
        title, 
        article,
        author
    }

    axios
        .put(`/articles/update/${props.match.params.id}`, articles)
        .then(res => setMessage(res.data))
        .catch(err => {
            console.log(err)
        })

    setTitle('')
    setArticle('')
    setAuthor('')
}

    return (
        <EditArticleContainer>
            <div className="container">
            <h1>Edit Article</h1>
            <span className="message">{message}</span>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="form-group">
                        <label htmlFor="author">Author Name </label>
                        <input 
                            type="text" 
                            className="htmlFm-control ml-3" 
                            id="author" 
                            placeholder="name"
                            onChange={(e) => setAuthor(e.target.value)} 
                            value={author}
                        />
                    </div>
                    <div className="htmlFm-group">
                        <label htmlFor="title">Article Title</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="title" 
                            placeholder="Title"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title} 
                        />
                    </div>
                    <br />
                    <div className="form-group">
                        <label htmlFor="article">Article Contents</label>
                        <textarea 
                            className="form-control" 
                            id="article" 
                            value={article}
                            rows="3"
                                onChange={(e) => setArticle(e.target.value)} 
                            >
                        </textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                </form>
            </div>
        </EditArticleContainer>
    )
}

export default EditArticle;