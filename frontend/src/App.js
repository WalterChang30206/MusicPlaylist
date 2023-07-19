import './App.css';
import './ModalStyle.css';
import './Loginpage.css';
import './PrivacyPolicy.css'
import React from 'react'
import Home from './components/Home'
import Librarypage from './pages/Librarypage'
import Loginpage from './pages/Loginpage'
import PrivacyPolicy from './pages/PrivacyPolicy'
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
        <Route path='/privacy_policy' element={<PrivacyPolicy />} />
      </Routes>
    </Router>
  );
}

export default App;
