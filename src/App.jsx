import Login from "./components/Login/login";
import Signup from "./components/Signup/Signup";
import { Routes, Route } from "react-router-dom";
import Chat from "./Pages/chat";
import './styles.css'

function App() {
  return (
    <div className="App">
       <Routes>
         <Route path="/" element={<Login />} />
         <Route path="/login" element={<Login />} />
         <Route path="/chat" element={<Chat />} />
         <Route path="/signup" element={<Signup />} />
       </Routes> 
    </div>
  );
}

export default App;
