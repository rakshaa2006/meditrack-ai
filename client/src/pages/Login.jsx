import { useState } from 'react';
import API from '../api';
import FlowField from '../components/ui/FlowField';

export default function Login({ onLogin }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');

  const handleLogin = async () => {
    try {
      const res  = await API.get('/users');
      const user = res.data.find(u => u.email === email && u.password === password);
      if (user) { onLogin(user); }
      else { setError('Wrong email or password'); }
    } catch {
      setError('Server not running. Start your backend first.');
    }
  };

  return (
    <div style={{ position:'relative', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>

      {/* Flow field background */}
      <FlowField
        color="#6366f1"
        trailOpacity={0.12}
        particleCount={600}
        speed={0.9}
      />

      {/* Login card */}
      <div style={{
        position:'relative', zIndex:10,
        width:'100%', maxWidth:'320px', margin:'0 20px',
        background:'rgba(10,15,30,0.78)',
        border:'1px solid rgba(99,102,241,0.25)',
        borderRadius:'14px', padding:'30px',
        backdropFilter:'blur(14px)',
      }}>

        {/* Brand */}
        <div style={{ textAlign:'center', marginBottom:'24px' }}>
          <div style={{
            width:'52px', height:'52px', borderRadius:'14px',
            background:'#4f46e5', display:'flex', alignItems:'center',
            justifyContent:'center', fontSize:'24px', margin:'0 auto 12px'
          }}>🏥</div>
          <div style={{ fontSize:'17px', fontWeight:'500', color:'#fff' }}>
            Medi<span style={{ color:'#818cf8' }}>Track</span> AI
          </div>
          <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.3)', marginTop:'4px' }}>
            Personal health records manager
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)',
            borderRadius:'8px', padding:'9px 12px',
            fontSize:'12px', color:'#f87171', marginBottom:'14px'
          }}>
            {error}
          </div>
        )}

        {/* Email */}
        <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.4)', marginBottom:'5px' }}>Email</div>
        <input
          type="email" value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@email.com"
          style={{
            width:'100%', padding:'9px 12px',
            background:'rgba(99,102,241,0.07)',
            border:'1px solid rgba(99,102,241,0.18)',
            borderRadius:'8px', color:'#fff',
            fontSize:'13px', marginBottom:'12px', outline:'none'
          }}
        />

        {/* Password */}
        <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.4)', marginBottom:'5px' }}>Password</div>
        <input
          type="password" value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter your password"
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          style={{
            width:'100%', padding:'9px 12px',
            background:'rgba(99,102,241,0.07)',
            border:'1px solid rgba(99,102,241,0.18)',
            borderRadius:'8px', color:'#fff',
            fontSize:'13px', marginBottom:'18px', outline:'none'
          }}
        />

        {/* Button */}
        <button
          onClick={handleLogin}
          style={{
            width:'100%', padding:'11px',
            background:'#4f46e5', border:'none',
            borderRadius:'8px', color:'#fff',
            fontSize:'13px', fontWeight:'500', cursor:'pointer'
          }}
        >
          Sign in to MediTrack
        </button>

        {/* Demo credentials */}
        <div style={{
          marginTop:'14px', padding:'10px 12px',
          background:'rgba(99,102,241,0.07)',
          border:'1px solid rgba(99,102,241,0.15)',
          borderRadius:'8px'
        }}>
          <div style={{ fontSize:'10px', color:'#818cf8', fontWeight:'500', marginBottom:'5px' }}>
            Demo credentials
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:'11px', color:'rgba(255,255,255,0.35)', padding:'2px 0' }}>
            <span>Email</span><span style={{ color:'rgba(255,255,255,0.7)' }}>raksha@gmail.com</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:'11px', color:'rgba(255,255,255,0.35)', padding:'2px 0' }}>
            <span>Password</span><span style={{ color:'rgba(255,255,255,0.7)' }}>test123</span>
          </div>
        </div>

        {/* Register */}
        <p style={{ textAlign:'center', fontSize:'11px', color:'rgba(255,255,255,0.25)', marginTop:'14px' }}>
          No account?{' '}
          <span onClick={() => onLogin('register')} style={{ color:'#818cf8', cursor:'pointer' }}>
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}