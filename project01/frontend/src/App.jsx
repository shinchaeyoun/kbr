import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./components/Login";
import Signup from './components/Signup';
import Main from './pages/Main';



function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/main' element={<Main />}></Route>
      </Routes>
    </Router>
  )
}

export default App;