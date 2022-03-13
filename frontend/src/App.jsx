import { Routes, Route, useParams } from "react-router-dom"

//import des routes
import Header from './components/Header'
import Home from "./pages/Home"
import Forum from "./pages/forum/Forum"
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import Account from "./pages/Account"
import Comment from "./pages/forum/components/Comment/Comment"

import { useState } from "react"

function App() {

  const [ user, setUser] = useState({});
  const [ token, setToken] = useState({});
  const [ post, setPosts] = useState({});

  return (
    <div className="App">
      <Header user={user}/>
      
      <Routes>
        <Route path="/" element={<Home setUser={setUser} />} />
        <Route path="/login" element={ <Login user={user} setUser={setUser} token={token} setToken={setToken} />} />
        <Route path="/forum/:id" element={<Forum user={user} setUser={setUser} token={token} setToken={setToken}/>} />
        <Route path="/compte/:id" element={<Account user={user} setUser={setUser} />} />
        <Route path="/comment/:id" element={<Comment post={post} user={user} token={token}/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App