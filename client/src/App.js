import React, { useState, useEffect } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Header from './components/layouts/Header';
import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; // added Switch
import Articles from './components/Articles';
import axios from 'axios';
import AddArticle from './components/AddArticle';
import EditArticle from './components/EditArticle';
import Article from './components/Article';
import AuthVerify from './pages/AuthVerify';
import LoginModal from './components/LoginModal';        // ← new
import { useAuth } from './context/AuthContext';       // ← new

function App() {
  const { user, isAdmin } = useAuth();                 // ← get auth state
  const [posts, setPosts] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Fetch articles ONLY if user is logged in
  useEffect(() => {
    if (user) {
      axios.get('/articles')
        .then(res => setPosts(res.data))
        .catch(error => console.log(error));
    }
  }, [user]);   // re-fetch when user logs in

  // Show login modal automatically on landing page if not logged in
  useEffect(() => {
    if (!user) {
      setShowLoginModal(true);
    }
  }, [user]);

    // Close login modal automatically once user is logged in
  useEffect(() => {
    if (user && showLoginModal) {
      setShowLoginModal(false);
    }
  }, [user, showLoginModal]);

  const refreshPosts = () => {
    axios.get('/articles')
      .then(res => setPosts(res.data))
      .catch(error => console.log(error));
  };

  return (
    <Router>
      <div className="App">
        <Header />
        <Navbar />

        <Switch>
          {/* Magic link verification route */}
          <Route path="/auth/verify" component={AuthVerify} />

          {/* Protected home page */}
          <Route exact path="/" render={() => (
            user ? (
              <Articles posts={posts} refreshPosts={refreshPosts} isAdmin={isAdmin} />
            ) : (
              <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
            )
          )} />

          {/* Protected routes */}
          <Route path="/add" render={() => user ? <AddArticle onArticleAdded={refreshPosts} /> : null} />
          <Route path="/article/:id" render={(props) => user ? <Article {...props} posts={posts} /> : null} />
          <Route path="/update/:id" render={(props) => user ? <EditArticle {...props} onArticleUpdated={refreshPosts} /> : null} />
        </Switch>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
