import React, { useState } from 'react';
import styled from "styled-components";
import axios from 'axios';
import { useAuth } from '../context/AuthContext';   // ← your import is correct

const AddArticleContainer = styled.div`
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

const AddArticle = ({ onArticleAdded }) => {
  const { isAdmin } = useAuth();           // ← get isAdmin from context

  // If user is not admin, don't render the whole component
  if (!isAdmin) return null;

  const [title, setTitle] = useState("");
  const [article, setArticle] = useState("");
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newArticle = { title, article, author };

    axios
      .post('/articles/add', newArticle)
      .then((res) => {
        setMessage(res.data);           // show success message
        setTitle("");
        setArticle("");
        setAuthor("");

        // Refresh the article list in the parent component
        if (onArticleAdded) onArticleAdded();
      })
      .catch((err) => {
        console.error(err);
        setMessage("Something went wrong. Please try again.");
      });
  };

  return (
    <AddArticleContainer>
      <div className="container">
        <h1>Add New Article</h1>
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
            Post Article
          </button>
        </form>
      </div>
    </AddArticleContainer>
  );
};

export default AddArticle;
