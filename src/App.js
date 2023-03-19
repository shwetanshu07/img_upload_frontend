import './App.css';
import {Route, BrowserRouter as Router, Routes, Navigate} from 'react-router-dom';
import { Navbar } from './Navbar';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';
import { HomePage } from './HomePage';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';

function App() {
  const [logged_in_status, setLoggedInStatus] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setLoggedInStatus(true);
    } else {
      setLoggedInStatus(false);
    }
  });

  return (
    <div className="App">
      <Router >
        <Navbar logged_in_status={logged_in_status}/>
        <Routes>
          <Route path="/" element={logged_in_status ? <Navigate replace to='/home' /> : <LoginPage />} />
          <Route path="/register" element={logged_in_status ? <Navigate replace to='/home' /> : <RegisterPage />} />
          <Route path="/home" element={logged_in_status ? <HomePage /> : <Navigate replace to='/' />} />
          <Route path="*" element={<h1>404</h1>} />
        </Routes>
        <Toaster />
      </Router>
    </div>
  );
}

export default App;
