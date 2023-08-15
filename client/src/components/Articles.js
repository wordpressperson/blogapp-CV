import React, {useState} from 'react'
import styled from "styled-components";
import spinner from '../assets/spinner.gif'
import {Link} from 'react-router-dom'
import axios from 'axios';

const MainContainer = styled.div`
    margin: 7rem 0;

    img {
        margin: auto;
        display: block;
        
    }
`

const Articles = (props) => {
    const [post, setPost] = useState([]);
    
    const handleDelete = (id) => {
        axios.delete(`/articles/delete/${id}`)
            .then(res => alert(res.data))
            setPost(props.posts.filter(p => p._id !== id))
        }

    return (
        <MainContainer>
            {(!props.posts.length) ? (<img src={spinner} alt="spinner" />) : 
            (props.posts.map((post, key) => (
                <div className="container">
                    <Link to={{
                        pathname: `/article/${post._id}`
                    }}>
                    <h2 key={post._id}>{post.title}</h2></Link> 
                    <p>{post.article}</p>
                    <span className="badge badge-secondary p-2">{post.authorname}</span>
                    <div className="row my-5">
                        <div className="col-sm-2">
                            <Link to=
                                {{
                                    pathname: `/update/${post._id}`
                                 }}
                                 className="btn btn-outline-success">
                                    Edit Article
                                </Link>
                        </div>
                        <div className="col-sm-2">
                            <button onClick={() => -handleDelete(post._id)} className="btn btn-outline-danger">Delete Article</button>
                        </div>
                    </div>
                </div>  
            )))
            }
        </MainContainer>
    )
}

export default Articles;