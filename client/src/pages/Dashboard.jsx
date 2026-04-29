import { useEffect, useState } from 'react';
import API from '../api';

export default function Dashboard() {
  const [visits, setVisits]   = useState([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const userId = 1;

  useEffect(() => {
    API.get(`/visits/${userId}`)
      .then(res => setVisits(res.data))
      .catch(err => console.log(err));
  }, []);

  const getAISummary = () => {
    setLoading(true);
    API.get(`/ai/summary/${userId}`)
      .then(res => {
        setSummary(res.data.summary);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        My Health Dashboard
      </h1>

      {/* AI Summary Button */}
      <button
        onClick={getAISummary}
        className="mb-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
      >
        {loading ? 'Loading...' : 'Get AI Health Summary'}
      </button>

      {/* AI Summary Result */}
      {summary && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-6 whitespace-pre-line">
          {summary}
        </div>
      )}

      {/* Visit Cards */}
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Visits</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visits.length === 0 ? (
          <p className="text-gray-400">No visits recorded yet.</p>
        ) : (
          visits.map(visit => (
            <div key={visit.id} className="bg-white rounded-xl shadow p-5">
              <p className="text-sm text-gray-400">{visit.visit_date}</p>
              <h2 className="text-lg font-semibold text-gray-800">
                {visit.doctor_name}
              </h2>
              <p className="text-gray-500">{visit.specialty}</p>
              <p className="mt-2 text-gray-700">{visit.notes}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}