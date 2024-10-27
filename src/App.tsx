import React from 'react';
import logo from './logo.svg';
import './App.css';
import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import PDFViewer from './components/pdf-viewer';

function App() {
  return (
    <div className="App">
    
    <main>
      <PDFViewer />
    </main>
  </div>
  );
}

export default App;
