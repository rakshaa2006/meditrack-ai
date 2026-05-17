import { useState } from 'react';
import Login       from './pages/Login';
import Register    from './pages/Register';
import Dashboard   from './pages/Dashboard';
import Visits      from './pages/Visits';
import Medications from './pages/Medications';
import Labs        from './pages/Labs';
import Symptoms from './pages/Symptoms';
import Profile from './pages/Profile';
import Timeline from './pages/Timeline';

export default function App() {
  const [page,   setPage]   = useState('login');
  const [user,   setUser]   = useState(null);
  const [active, setActive] = useState('dashboard');

  const handleLogin = (u) => {
    if (u === 'register') { setPage('register'); return; }
    setUser(u);
    setPage('app');
  };

  const handleLogout = () => {
    setUser(null);
    setPage('login');
    localStorage.clear();
  };

  if (page === 'login')    return <Login    onLogin={handleLogin} />;
  if (page === 'register') return <Register onRegister={() => setPage('login')} />;

  const navItems = [
    { id: 'dashboard',   label: 'Dashboard'   },
    { id: 'visits',      label: 'Visits'       },
    { id: 'medications', label: 'Medications'  },
    { id: 'labs',        label: 'Lab Results'  },
    { id: 'symptoms',    label: 'Symptoms'     },
    { id: 'profile',     label: 'Profile'      },
    { id: 'timeline',    label: 'Timeline'     },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-56 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <h1 className="text-blue-700 font-bold text-lg">MediTrack AI</h1>
          <p className="text-gray-400 text-xs mt-1">Hello, {user?.name} 👋</p>
        </div>
        <nav className="flex-1 p-3">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm mb-1 transition-all
                ${active === item.id
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50">
            Sign Out
          </button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        {active === 'dashboard'   && <Dashboard   userId={user?.id} />}
        {active === 'visits'      && <Visits      userId={user?.id} />}
        {active === 'medications' && <Medications userId={user?.id} />}
        {active === 'labs'        && <Labs        userId={user?.id} />}
        {active === 'symptoms' && <Symptoms userId={user?.id} />}
        {active === 'profile' && <Profile user={user} />}
        {active === 'timeline' && <Timeline />}
      </div>
    </div>
  );
}