import React from 'react';
import styled from "styled-components";
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MainContainer = styled.div`
  margin: 7rem 0;

  img {
    margin: auto;
    display: block;
  }
`;

const Articles = ({ posts, refreshPosts }) => {
  const { isAdmin } = useAuth();

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;

    axios.delete(`/articles/delete/${id}`)
      .then((res) => {
        alert(res.data);
        refreshPosts();        // refresh the list after delete
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to delete article");
      });
  };

  if (!posts || posts.length === 0) {
    return (
      <MainContainer>
        <h2>No articles found</h2>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      {posts.map((post) => (
        <div key={post._id} className="card mb-4">
          <div className="card-body">
            <h3 className="card-title">{post.title}</h3>
            <p className="card-text">{post.article}</p>
            <p className="text-muted">By: {post.authorname}</p>

            {isAdmin && (
              <div className="mt-3">
                <Link
                  to={`/update/${post._id}`}
                  className="btn btn-primary mr-2"
                >
                  Edit Article
                </Link>

                <button
                  onClick={() => handleDelete(post._id)}
                  className="btn btn-outline-danger"
                >
                  Delete Article
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </MainContainer>
  );
};

export default Articles;
