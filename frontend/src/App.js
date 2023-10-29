import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Login';

function App() {
  const isLoggedIn = !!localStorage.getItem('adminToken');

  return (
    <Router>
      <Routes>
        <Route exact path="/">
          {isLoggedIn ? <Home /> : <Navigate to="/login" />}
        </Route>
        <Route path="/login">
          {!isLoggedIn ? <Login /> : <Navigate to="/" />}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
