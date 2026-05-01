import { useEffect, useState } from 'react';
import API from '../api';

export default function Medications({ userId }) {
  const [meds,    setMeds]    = useState([]);
  const [showing, setShowing] = useState(false);
  const [form,    setForm]    = useState({
    name: '', dosage: '', frequency: '', start_date: '', end_date: ''
  });

  const fetchMeds = () => {
    API.get(`/medications/${userId}`).then(res => setMeds(res.data));
  };

  useEffect(() => { fetchMeds(); }, []);

  const handleAdd = async () => {
    await API.post('/medications', { ...form, user_id: userId });
    setShowing(false);
    setForm({ name: '', dosage: '', frequency: '', start_date: '', end_date: '' });
    fetchMeds();
  };

  const handleDelete = async (id) => {
    await API.delete(`/medications/${id}`);
    fetchMeds();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Medications</h2>
        <button onClick={() => setShowing(!showing)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          + Add Medication
        </button>
      </div>

      {showing && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h3 className="font-semibold text-gray-700 mb-4">New Medication</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Medicine Name</label>
              <input value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                placeholder="Metformin"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"/>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Dosage</label>
              <input value={form.dosage}
                onChange={e => setForm({...form, dosage: e.target.value})}
                placeholder="500mg"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"/>
            </div>
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-600 mb-1 block">Frequency</label>
            <select value={form.frequency}
              onChange={e => setForm({...form, frequency: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option value="">Select frequency</option>
              <option>Once daily</option>
              <option>Twice daily</option>
              <option>Three times daily</option>
              <option>Once weekly</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Start Date</label>
              <input type="date" value={form.start_date}
                onChange={e => setForm({...form, start_date: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"/>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">End Date (optional)</label>
              <input type="date" value={form.end_date}
                onChange={e => setForm({...form, end_date: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"/>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
              Save Medication
            </button>
            <button onClick={() => setShowing(false)}
              className="border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {meds.length === 0 ? (
          <p className="text-gray-400 text-sm">No medications added yet.</p>
        ) : (
          meds.map(m => (
            <div key={m.id} className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-800">{m.name}</h3>
                <p className="text-sm text-gray-500">{m.dosage} · {m.frequency}</p>
                <p className="text-xs text-gray-400 mt-1">
                  From {m.start_date?.slice(0,10)} {m.end_date ? `to ${m.end_date?.slice(0,10)}` : '(ongoing)'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                  {m.is_active ? 'Active' : 'Inactive'}
                </span>
                <button onClick={() => handleDelete(m.id)}
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