import { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Visits from './pages/Visits';
import Medications from './pages/Medications';
import Labs from './pages/Labs';
import Symptoms from './pages/Symptoms';
import Profile from './pages/Profile';
import Timeline from './pages/Timeline';

export default function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);
  const [active, setActive] = useState('dashboard');

  const handleLogin = (u) => {
    if (u === 'register') {
      setPage('register');
      return;
    }
    setUser(u);
    setPage('app');
  };

  const handleLogout = () => {
    setUser(null);
    setPage('login');
    localStorage.clear();
  };

  if (page === 'login') return <Login onLogin={handleLogin} />;
  if (page === 'register') return <Register onRegister={() => setPage('login')} />;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'visits', label: 'Visits' },
    { id: 'medications', label: 'Medications' },
    { id: 'labs', label: 'Lab Results' },
    { id: 'symptoms', label: 'Symptoms' },
    { id: 'profile', label: 'Profile' },
    { id: 'timeline', label: 'Timeline' },
  ];

  return (
    <div style={{minHeight:'100vh', background:'#111827', display:'flex'}}>
      <div style={{width:'180px', minWidth:'180px', background:'#1a2234', borderRight:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column'}}>
      
        <div
          style={{
            padding: '16px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div style={{padding:'16px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:'8px'}}>
            🏥
          </div>
          <div style={{fontSize:'14px', fontWeight:'500', color:'#fff'}}>
            Medi<span style={{color:'#2563eb'}}>Track</span> AI
          </div>
        </div>

        <nav style={{ flex: 1, padding: '8px' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '8px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '2px',
                background: active === item.id ? 'rgba(37,99,235,0.18)' : 'transparent',
                color: active === item.id ? '#60a5fa' : 'rgba(255,255,255,0.45)',
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#00b4a0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: '500',
              color: '#0f1117',
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '500', color: 'rgba(255,255,255,0.8)' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>Patient</div>
          </div>
        </div>

        <div style={{padding:'10px', borderTop:'1px solid rgba(255,255,255,0.06)'}}>
  <div style={{display:'flex', alignItems:'center', gap:'8px', padding:'6px 8px', marginBottom:'4px'}}>
    <div style={{width:'26px', height:'26px', borderRadius:'50%', background:'#2563eb', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'500', color:'#fff', flexShrink:0}}>
      {user?.name?.charAt(0).toUpperCase()}
    </div>
    <div>
      <div style={{fontSize:'11px', color:'rgba(255,255,255,0.75)', fontWeight:'500'}}>{user?.name}</div>
      <div style={{fontSize:'10px', color:'rgba(255,255,255,0.3)'}}>Patient</div>
    </div>
  </div>
  <button
    onClick={handleLogout}
    style={{width:'100%', textAlign:'left', padding:'7px 10px', borderRadius:'7px', fontSize:'11px', border:'none', cursor:'pointer', background:'transparent', color:'rgba(239,68,68,0.7)'}}>
    Sign out
  </button>
</div>
      </div>

      <div style={{flex:1, overflowY:'auto'}}>
        {active === 'dashboard' && <Dashboard userId={user?.id} />}
        {active === 'visits' && <Visits userId={user?.id} />}
        {active === 'medications' && <Medications userId={user?.id} />}
        {active === 'labs' && <Labs userId={user?.id} />}
        {active === 'symptoms' && <Symptoms userId={user?.id} />}
        {active === 'profile' && <Profile user={user} />}
        {active === 'timeline' && <Timeline />}
      </div>
    </div>
  );
}
