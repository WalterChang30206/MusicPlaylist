import './App.css';
import './ModalStyle.css';
import './Loginpage.css';
import React from 'react'
import Header from './components/Header'
import Librarypage from './pages/Librarypage'
import Loginpage from './pages/Loginpage'
// import Librarypage_homepage from './pages/Librarypage_homepage'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";



function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Loginpage />} />
        <Route path='/' element={<Header />} />
        <Route path='/library/' element={<Librarypage />} />
        {/* <Route path='/library/homepage' element={<Librarypage_homepage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
