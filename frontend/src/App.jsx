import { Routes, Route } from "react-router-dom"

//import des routes
import Header from './components/Header'
import Home from "./pages/Home/Home"
import Forum from "./pages/forum/Forum"
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import Account from "./pages/Account"
import Comment from "./pages/forum/components/Comment/Comment"

import { useState } from "react"

function App() {

  const [user, setUser] = useState({});
  const [token, setToken] = useState({});
  const [post, setPosts] = useState({});
  const [comments, setComments] = useState([])

  return (
    <div className="App">
        <Header user={user} /> 
    
        <Routes>
          <Route path="/" element={<Home setUser={setUser} />} />
          <Route path="/login" element={<Login user={user} setUser={setUser} token={token} setToken={setToken} />} />
          <Route path="/forum/:id" element={<Forum comments={comments} setComments={setComments} user={user} setUser={setUser} token={token} setToken={setToken} />} />
          <Route path="/compte/:id" element={<Account comments={comments} setComments={setComments} user={user} setUser={setUser} />} />
          <Route path="/comment/:id" element={<Comment comments={comments} setComments={setComments} post={post} setPosts={setPosts} user={user} token={token} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
  )
}

export default App