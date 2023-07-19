import './App.css';
import './ModalStyle.css';
import './Loginpage.css';
import React from 'react'
import Home from './components/Home'
import Librarypage from './pages/Librarypage'
import Loginpage from './pages/Loginpage'
// import Librarypage_homepage from './pages/Librarypage_homepage'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";


function App() {
  return (
    <Router>
      <Routes>
        <Route path='' element={<Home />} />
        <Route path='/login' element={<Loginpage />} />
        <Route path='/library' element={<Librarypage />} />
      </Routes>
    </Router>
  );
}

export default App;
