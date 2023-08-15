import React, { useState, useEffect } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import Header from './components/layouts/Header';
import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';
import {BrowserRouter as Router, Route} from 'react-router-dom' 
import Articles from './components/Articles';
import axios from 'axios';
import AddArticle from './components/AddArticle';
import EditArticle from './components/EditArticle';
import Article from './components/Article';

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('/articles')
      .then(res => setPosts(res.data))
      .catch(error => console.log(error))
  })
  return (
    <Router>
      <div className="App">
        <Header />
        <Navbar />
        <Route exact path='/' render={() => <Articles posts={posts} />} />
        <Route path='/add' component={AddArticle} />
        <Route path='/article/:id' render={(props) => <Article {...props} posts={posts}/>} />
        <Route path='/update/:id' render={(props) => <EditArticle {...props} posts={posts}/>} />
        <Footer />
       </div>
    </Router>
  );
}

export default App;
