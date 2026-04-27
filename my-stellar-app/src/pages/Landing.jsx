import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowRight, Box, Zap, Shield } from 'lucide-react';

gsap.registerPlugin(useGSAP);

export default function Landing() {
  const container = useRef();
  const navigate = useNavigate();

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from('.hero-title', { 
      y: 100, 
      opacity: 0, 
      duration: 1, 
      ease: "power4.out",
      rotationX: -45, 
    })
    .from('.hero-subtitle', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.5")
    .from('.hero-cta', {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      ease: "back.out(1.7)"
    }, "-=0.3")
    .from('.feature-card', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
      rotationY: 15,
    }, "-=0.2");

    const heroBox = document.querySelector('.hero-section');
    if(heroBox) {
      heroBox.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        gsap.to('.hero-title', { rotationY: x, rotationX: -y, ease: 'power2.out', duration: 0.5 });
        gsap.to('.hero-3d-element', { x: x * 2, y: y * 2, rotationY: x * 2, rotationX: -y * 2, ease: 'power2.out', duration: 0.5 });
      });
    }
  }, { scope: container });

  return (
    <div ref={container} className="container" style={{ minHeight: 'calc(100vh - 80px)', perspective: '1000px' }}>
      
      <div className="hero-section" style={{ textAlign: 'center', padding: '6rem 0' }}>
         <div className="hero-3d-element animate-gradient" style={{
           width: '120px', height: '120px', 
           background: 'linear-gradient(135deg, var(--w3-secondary), var(--w3-primary))',
           margin: '0 auto 2rem',
           borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
           boxShadow: '0 0 40px rgba(6, 182, 212, 0.4)',
           display: 'flex', alignItems: 'center', justifyContent: 'center',
           transformStyle: 'preserve-3d'
         }}>
           <Box size={48} color="#fff" style={{ transform: 'translateZ(20px)' }} />
         </div>

         <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: '800', lineHeight: '1.2', marginBottom: '1.5rem', transformStyle: 'preserve-3d' }}>
           The Next Gen <br/>
           <span style={{ background: 'linear-gradient(to right, var(--w3-primary), var(--w3-accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
             Decentralized Knowledge
           </span>
         </h1>
         
         <p className="hero-subtitle" style={{ fontSize: '1.2rem', color: 'var(--w3-text-muted)', maxWidth: '600px', margin: '0 auto 3rem' }}>
           Curate, share, and govern knowledge entirely on-chain with Stellar Soroban smart contracts. Web3 native.
         </p>

         <button className="btn-primary hero-cta" onClick={() => navigate('/app')} style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
           Enter the dApp <ArrowRight size={20} />
         </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', paddingBottom: '4rem' }}>
        
        <div className="glass-card feature-card">
          <Zap size={32} color="var(--w3-primary)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--w3-text-main)' }}>Lightning Fast</h3>
          <p style={{ color: 'var(--w3-text-muted)', lineHeight: '1.5' }}>Built on Stellar, experience near-instant transaction finality for all your knowledge entries.</p>
        </div>

        <div className="glass-card feature-card">
          <Box size={32} color="var(--w3-secondary)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--w3-text-main)' }}>Fully On-Chain</h3>
          <p style={{ color: 'var(--w3-text-muted)', lineHeight: '1.5' }}>No centralized databases. Every edit, article, and vote is recorded immutably via Soroban.</p>
        </div>

        <div className="glass-card feature-card">
          <Shield size={32} color="var(--w3-success)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--w3-text-main)' }}>Community Governed</h3>
          <p style={{ color: 'var(--w3-text-muted)', lineHeight: '1.5' }}>Curate articles natively by upvoting and marking verified answers globally.</p>
        </div>

      </div>
    </div>
  );
}
