import { useEffect, useState } from 'react';
import API from '../api';

export default function Dashboard({ userId }) {
  const [visits,   setVisits]   = useState([]);
  const [meds,     setMeds]     = useState([]);
  const [labs,     setLabs]     = useState([]);
  const [summary,  setSummary]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (!userId) return;
    API.get(`/visits/${userId}`).then(r      => setVisits(r.data)).catch(() => {});
    API.get(`/medications/${userId}`).then(r => setMeds(r.data)).catch(() => {});
    API.get(`/labs/${userId}`).then(r        => setLabs(r.data)).catch(() => {});
  }, [userId]);

  const getAISummary = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/ai/summary/${userId}`);
      setSummary(res.data.summary);
    } catch { setSummary('Could not load summary. Try again.'); }
    setLoading(false);
  };

  const bg    = darkMode ? 'bg-gray-900 text-white'      : 'bg-gray-50 text-gray-800';
  const card  = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';
  const muted = darkMode ? 'text-gray-400'               : 'text-gray-500';
  const badge = darkMode ? 'bg-gray-700 text-gray-200'   : 'bg-blue-50 text-blue-700';

  return (
    <div className={`min-h-screen p-6 transition-all ${bg}`}>

      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">My Health Dashboard</h1>
          <p className={`text-sm mt-1 ${muted}`}>Welcome back — here is your health overview</p>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-4 py-2 rounded-lg text-sm border transition-all
            ${darkMode
              ? 'bg-gray-700 text-white border-gray-600'
              : 'bg-white text-gray-600 border-gray-200'}`}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={`rounded-xl border p-5 ${card}`}>
          <p className={`text-xs uppercase tracking-wide mb-2 ${muted}`}>Total Visits</p>
          <p className="text-3xl font-bold text-blue-600">{visits.length}</p>
          <p className={`text-xs mt-2 ${muted}`}>
            {visits.length === 0 ? 'No visits yet' : `Last: ${visits[0]?.visit_date?.slice(0,10)}`}
          </p>
        </div>
        <div className={`rounded-xl border p-5 ${card}`}>
          <p className={`text-xs uppercase tracking-wide mb-2 ${muted}`}>Active Medications</p>
          <p className="text-3xl font-bold text-green-500">{meds.filter(m => m.is_active).length}</p>
          <p className={`text-xs mt-2 ${muted}`}>
            {meds.length === 0 ? 'No medications yet' : `${meds.length} total recorded`}
          </p>
        </div>
        <div className={`rounded-xl border p-5 ${card}`}>
          <p className={`text-xs uppercase tracking-wide mb-2 ${muted}`}>Lab Tests</p>
          <p className="text-3xl font-bold text-purple-500">{labs.length}</p>
          <p className={`text-xs mt-2 ${muted}`}>
            {labs.length === 0 ? 'No lab results yet' : `Last: ${labs[0]?.test_date?.slice(0,10)}`}
          </p>
        </div>
      </div>

      {/* AI Summary */}
      <div className={`rounded-xl border p-5 mb-6 ${card}`}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">AI Health Summary</h2>
          <button
            onClick={getAISummary}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
            {loading ? 'Analyzing...' : 'Get AI Summary'}
          </button>
        </div>
        {summary ? (
          <div className={`text-sm leading-relaxed whitespace-pre-line p-4 rounded-lg
            ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-blue-50 text-gray-700'}`}>
            {summary}
          </div>
        ) : (
          <p className={`text-sm ${muted}`}>
            Click the button above to get an AI-powered summary of your health records.
            The AI will analyze your visits, medications, and lab results.
          </p>
        )}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-2 gap-4 mb-4">

        {/* Recent Visits */}
        <div className={`rounded-xl border p-5 ${card}`}>
          <h2 className="font-semibold mb-4">Recent Visits</h2>
          {visits.length === 0 ? (
            <div className={`text-center py-6 ${muted}`}>
              <p className="text-2xl mb-2">🏥</p>
              <p className="text-sm">No visits recorded yet</p>
              <p className="text-xs mt-1">Go to Visits page to add your first visit</p>
            </div>
          ) : (
            visits.slice(0,3).map(v => (
              <div key={v.id} className={`py-3 border-b last:border-0
                ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <p className={`text-xs ${muted}`}>{v.visit_date?.slice(0,10)}</p>
                <p className="font-medium text-sm mt-0.5">{v.doctor_name}</p>
                <p className={`text-xs ${muted}`}>{v.specialty}</p>
                {v.diagnosis && (
                  <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${badge}`}>
                    {v.diagnosis}
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        {/* Active Medications */}
        <div className={`rounded-xl border p-5 ${card}`}>
          <h2 className="font-semibold mb-4">Active Medications</h2>
          {meds.length === 0 ? (
            <div className={`text-center py-6 ${muted}`}>
              <p className="text-2xl mb-2">💊</p>
              <p className="text-sm">No medications added yet</p>
              <p className="text-xs mt-1">Go to Medications page to add yours</p>
            </div>
          ) : (
            meds.filter(m => m.is_active).slice(0,4).map(m => (
              <div key={m.id} className={`py-3 border-b last:border-0 flex justify-between items-center
                ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <div>
                  <p className="font-medium text-sm">{m.name}</p>
                  <p className={`text-xs ${muted}`}>{m.dosage} · {m.frequency}</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Lab Results */}
      <div className={`rounded-xl border p-5 ${card}`}>
        <h2 className="font-semibold mb-4">Recent Lab Results</h2>
        {labs.length === 0 ? (
          <div className={`text-center py-6 ${muted}`}>
            <p className="text-2xl mb-2">🧪</p>
            <p className="text-sm">No lab results recorded yet</p>
            <p className="text-xs mt-1">Go to Lab Results page to add your test results</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {labs.slice(0,4).map(l => {
              const high = l.reference_max && Number(l.value) > Number(l.reference_max);
              const low  = l.reference_min && Number(l.value) < Number(l.reference_min);
              return (
                <div key={l.id} className={`p-3 rounded-lg border
                  ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-100 bg-gray-50'}`}>
                  <p className="font-medium text-sm">{l.test_name}</p>
                  <p className="text-lg font-bold mt-1">
                    {l.value}
                    <span className={`text-xs font-normal ml-1 ${muted}`}>{l.unit}</span>
                  </p>
                  <p className={`text-xs ${muted}`}>
                    Normal: {l.reference_min}–{l.reference_max} {l.unit}
                  </p>
                  <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium
                    ${high ? 'bg-red-100 text-red-600' :
                      low  ? 'bg-yellow-100 text-yellow-600' :
                             'bg-green-100 text-green-700'}`}>
                    {high ? 'HIGH' : low ? 'LOW' : 'NORMAL'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}