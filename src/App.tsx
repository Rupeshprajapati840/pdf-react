import React, { useEffect } from 'react';
import logo from './logo.svg';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes as appRoutes } from "./routes"; 
import Header from './components/Header';
import Login from './components/Login';
import Footer from './components/Footer';


function App() { 
  const [isAuthenticated, setIsAuthenticated] = React.useState(true);
  const [name, setName] = React.useState(''); 

  useEffect(() => {
    setName("John Deo")
  }, [isAuthenticated])

  return (
    <div className="d-flex flex-column min-vh-100">

      <Router>
        <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} name={name} />
        <main className="flex-grow-1">
          <Routes>
            {isAuthenticated ? (
              appRoutes.map((route) => (
                <Route
                  key={route.key}
                  path={route.path}
                  element={<route.component />}
                />
              ))
            ) : (
              <Route path="/*" element={<Login />} />
            )}
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}
 
export default App;
