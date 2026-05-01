import { useEffect, useState } from 'react';
import API from '../api';

export default function Visits({ userId }) {
  const [visits,  setVisits]  = useState([]);
  const [showing, setShowing] = useState(false);
  const [form,    setForm]    = useState({
    doctor_name: '', specialty: '', visit_date: '', notes: '', diagnosis: ''
  });

  const fetchVisits = () => {
    API.get(`/visits/${userId}`).then(res => setVisits(res.data));
  };

  useEffect(() => { fetchVisits(); }, []);

  const handleAdd = async () => {
    await API.post('/visits', { ...form, user_id: userId });
    setShowing(false);
    setForm({ doctor_name: '', specialty: '', visit_date: '', notes: '', diagnosis: '' });
    fetchVisits();
  };

  const handleDelete = async (id) => {
    await API.delete(`/visits/${id}`);
    fetchVisits();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Doctor Visits</h2>
        <button onClick={() => setShowing(!showing)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          + Add Visit
        </button>
      </div>

      {showing && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h3 className="font-semibold text-gray-700 mb-4">New Visit</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Doctor Name</label>
              <input value={form.doctor_name}
                onChange={e => setForm({...form, doctor_name: e.target.value})}
                placeholder="Dr. Sharma"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"/>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Specialty</label>
              <input value={form.specialty}
                onChange={e => setForm({...form, specialty: e.target.value})}
                placeholder="General Physician"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"/>
            </div>
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-600 mb-1 block">Visit Date</label>
            <input type="date" value={form.visit_date}
              onChange={e => setForm({...form, visit_date: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"/>
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-600 mb-1 block">Notes</label>
            <textarea value={form.notes}
              onChange={e => setForm({...form, notes: e.target.value})}
              placeholder="What did the doctor say?"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm h-20"/>
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-600 mb-1 block">Diagnosis</label>
            <input value={form.diagnosis}
              onChange={e => setForm({...form, diagnosis: e.target.value})}
              placeholder="e.g. Hypertension mild"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"/>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
              Save Visit
            </button>
            <button onClick={() => setShowing(false)}
              className="border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visits.length === 0 ? (
          <p className="text-gray-400 text-sm">No visits recorded yet. Add your first visit!</p>
        ) : (
          visits.map(v => (
            <div key={v.id} className="bg-white rounded-xl shadow p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-400 mb-1">{v.visit_date?.slice(0,10)}</p>
                  <h3 className="font-semibold text-gray-800">{v.doctor_name}</h3>
                  <p className="text-sm text-gray-500">{v.specialty}</p>
                  <p className="text-sm text-gray-600 mt-2">{v.notes}</p>
                  {v.diagnosis && (
                    <span className="inline-block mt-2 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                      {v.diagnosis}
                    </span>
                  )}
                </div>
                <button onClick={() => handleDelete(v.id)}
                  className="text-red-400 hover:text-red-600 text-xs ml-4">
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