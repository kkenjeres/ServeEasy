import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase.js';
import Table from '../src/Table';
import TableDetails from '../src/TableDetails';
import LoginPage from '../src/LoginPage'
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);
  return (
    // <Router>
    //   <Routes>
    //     {user ? (
    //       <Route path="/" element={<TodoApp />} />
    //     ) : (
    //       <Route path="/" element={<Navigate to="/login" />} />
    //     )}
    //     <Route path="/login" element={<LoginPage />} />
    //   </Routes>
    // </Router>
    <Router>
      <Routes>
      {user ? (
          <Route path="/" element={<Table />} />
        ) : (
          <Route path="/" element={<Navigate to="/login" />} />
        )}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/table/:id" element={<TableDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
