import { useEffect, useState } from 'react';
import API from '../api';

export default function Symptoms({ userId }) {
  const [symptoms, setSymptoms] = useState([]);
  const [form, setForm] = useState({ symptom: '', severity: 5 });

  const fetchSymptoms = () => {
    API.get(`/symptoms/${userId}`).then(r => setSymptoms(r.data)).catch(() => {});
  };

  useEffect(() => { fetchSymptoms(); }, []);

  const handleAdd = async () => {
    if (!form.symptom) return;
    await API.post('/symptoms', { ...form, user_id: userId });
    setForm({ symptom: '', severity: 5 });
    fetchSymptoms();
  };

  const handleDelete = async (id) => {
    await API.delete(`/symptoms/${id}`);
    fetchSymptoms();
  };

  const severityColor = (s) => {
    if (s <= 3) return 'bg-emerald-900 text-emerald-100';
    if (s <= 6) return 'bg-amber-900 text-amber-100';
    return 'bg-rose-900 text-rose-100';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#111827', padding: '20px' }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Symptom Log</h2>
      </div>

      {/* Add symptom */}
      <div className="bg-slate-900 rounded-xl shadow-lg p-6 mb-6 border border-slate-700">
        <h3 className="font-semibold text-slate-100 mb-4">Log a Symptom Today</h3>
        <div className="mb-4">
          <label className="text-sm text-slate-300 mb-1 block">What are you feeling?</label>
          <input
            value={form.symptom}
            onChange={e => setForm({...form, symptom: e.target.value})}
            placeholder="e.g. Headache, Fatigue, Nausea"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500"/>
        </div>
        <div className="mb-4">
          <label className="text-sm text-slate-300 mb-2 block">
            Severity: <span className="font-bold text-blue-400">{form.severity}/10</span>
          </label>
          <input
            type="range" min="1" max="10"
            value={form.severity}
            onChange={e => setForm({...form, severity: parseInt(e.target.value)})}
            className="w-full"/>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Mild (1)</span>
            <span>Moderate (5)</span>
            <span>Severe (10)</span>
          </div>
        </div>
        <button onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          Log Symptom
        </button>
      </div>

      {/* Symptom list */}
      <div className="space-y-3">
        {symptoms.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p className="text-3xl mb-2">🩺</p>
            <p className="text-sm text-slate-200">No symptoms logged yet</p>
          </div>
        ) : (
          symptoms.map(s => (
            <div key={s.id}
              className="bg-slate-900 rounded-xl shadow-lg p-4 flex justify-between items-center border border-slate-700">
              <div>
                <p className="font-medium text-slate-100">{s.symptom}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(s.logged_at).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-3 py-1 rounded-full font-medium
                  ${severityColor(s.severity)}`}>
                  Severity {s.severity}/10
                </span>
                <button onClick={() => handleDelete(s.id)}
                  className="text-red-400 hover:text-red-600 text-xs">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}