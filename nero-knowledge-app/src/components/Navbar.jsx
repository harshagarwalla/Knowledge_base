import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Library, Rocket } from 'lucide-react';
import gsap from 'gsap';

export default function Navbar() {
  const navRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(navRef.current, 
      { y: -100, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
  }, []);

  return (
    <nav className="navbar" ref={navRef}>
      <div className="nav-content">
        <Link to="/" className="nav-logo">
          <img src="/favicon.svg" alt="Nero KB Logo" width="28" height="28" />
          <span>Nero KB</span>
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-item" style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
            <Rocket size={18} /> Home
          </Link>
          <Link to="/app" className="nav-item" style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
            <Library size={18} /> Launch App
          </Link>
        </div>
      </div>
    </nav>
  );
}
