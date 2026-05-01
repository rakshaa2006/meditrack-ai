import { useEffect, useState } from 'react';
import API from '../api';

export default function Labs({ userId }) {
  const [labs,    setLabs]    = useState([]);
  const [showing, setShowing] = useState(false);
  const [form,    setForm]    = useState({
    test_name: '', value: '', unit: '',
    reference_min: '', reference_max: '', test_date: ''
  });

  const fetchLabs = () => {
    API.get(`/labs/${userId}`).then(res => setLabs(res.data));
  };

  useEffect(() => { fetchLabs(); }, []);

  const handleAdd = async () => {
    await API.post('/labs', { ...form, user_id: userId, visit_id: null });
    setShowing(false);
    setForm({ test_name: '', value: '', unit: '', reference_min: '', reference_max: '', test_date: '' });
    fetchLabs();
  };

  const getStatus = (value, min, max) => {
    if (!min || !max) return 'normal';
    if (value < min)  return 'low';
    if (value > max)  return 'high';
    return 'normal';
  };

  const statusStyle = {
    normal: 'bg-green-50 text-green-700',
    high:   'bg-red-50 text-red-600',
    low:    'bg-yellow-50 text-yellow-600',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Lab Results</h2>
        <button onClick={() => setShowing(!showing)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          + Add Result
        </button>
      </div>

      {showing && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h3 className="font-semibold text-gray-700 mb-4">New Lab Result</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Test Name</label>
              <input value={form.test_name}
                onChange={e => setForm({...form, test_name: e.target.value})}
                placeholder="Fasting Glucose"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"/>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Value</label>
              <input type="number" value={form.value}
                onChange={e => setForm({...form, value: e.target.value})}
                placeholder="118"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"/>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Unit</label>
              <input value={form.unit}
                onChange={e => setForm({...form, unit: e.target.value})}
                placeholder="mg/dL"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"/>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Normal Min</label>
              <input type="number" value={form.reference_min}
                onChange={e => setForm({...form, reference_min: e.target.value})}
                placeholder="70"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"/>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Normal Max</label>
              <input type="number" value={form.reference_max}
                onChange={e => setForm({...form, reference_max: e.target.value})}
                placeholder="100"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"/>
            </div>
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-600 mb-1 block">Test Date</label>
            <input type="date" value={form.test_date}
              onChange={e => setForm({...form, test_date: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"/>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
              Save Result
            </button>
            <button onClick={() => setShowing(false)}
              className="border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {labs.length === 0 ? (
          <p className="text-gray-400 text-sm">No lab results added yet.</p>
        ) : (
          labs.map(l => {
            const status = getStatus(l.value, l.reference_min, l.reference_max);
            return (
              <div key={l.id} className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-800">{l.test_name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {l.value} {l.unit} · Normal: {l.reference_min}–{l.reference_max} {l.unit}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{l.test_date?.slice(0,10)}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusStyle[status]}`}>
                  {status.toUpperCase()}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}