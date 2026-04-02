import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

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
      background: var(--pink);
    }
  }

  .message {
    font-weight: 900;
    color: tomato;
    padding: 1rem 1rem 1rem 0;
  }
`;

const EditArticle = (props) => {
  const { isAdmin } = useAuth();   // ← Hook 1: always called first

  // All hooks must be called BEFORE any early return
  const [title, setTitle] = useState("");
  const [article, setArticle] = useState("");
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");

  // Fetch current article data
  useEffect(() => {
    axios
      .get(`/articles/${props.match.params.id}`)
      .then((res) => {
        setTitle(res.data.title);
        setAuthor(res.data.authorname || res.data.author);
        setArticle(res.data.article);
      })
      .catch((error) => console.error(error));
  }, [props.match.params.id]);

  // Now it's safe to early-return for non-admins
  if (!isAdmin) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedArticle = { title, article, author };

    axios
      .put(`/articles/update/${props.match.params.id}`, updatedArticle)
      .then((res) => {
        setMessage(res.data);
        if (props.onArticleUpdated) props.onArticleUpdated();
      })
      .catch((err) => {
        console.error(err);
        setMessage("Something went wrong. Please try again.");
      });
  };

  return (
    <EditArticleContainer>
      <div className="container">
        <h1>Edit Article</h1>
        <span className="message">{message}</span>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="author">Author Name</label>
            <input
              type="text"
              className="form-control ml-3"
              id="author"
              placeholder="Enter Author Name"
              onChange={(e) => setAuthor(e.target.value)}
              value={author}
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">Article Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              placeholder="Enter Article Title"
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
              rows="3"
              value={article}
              onChange={(e) => setArticle(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </form>
      </div>
    </EditArticleContainer>
  );
};

export default EditArticle;
