import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import KnowledgeBase from './pages/KnowledgeBase';
import './App.css';

export default function App() {
  return (
    <div className="web3-bg">
      <Navbar />
      <div style={{ paddingTop: '80px' }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<KnowledgeBase />} />
        </Routes>
      </div>
    </div>
  );
}