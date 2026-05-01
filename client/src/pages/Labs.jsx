import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ReferenceLine, ResponsiveContainer, CartesianGrid
} from 'recharts';
import API from '../api';

export default function Labs({ userId }) {
  const [labs,         setLabs]         = useState([]);
  const [showing,      setShowing]      = useState(false);
  const [selectedTest, setSelectedTest] = useState('');
  const [form,         setForm]         = useState({
    test_name: '', value: '', unit: '',
    reference_min: '', reference_max: '', test_date: ''
  });

  const fetchLabs = () => {
    API.get(`/labs/${userId}`).then(res => setLabs(res.data)).catch(() => {});
  };

  useEffect(() => { fetchLabs(); }, []);

  const testNames = [...new Set(labs.map(l => l.test_name))];

  const chartData = labs
    .filter(l => l.test_name === selectedTest)
    .sort((a, b) => new Date(a.test_date) - new Date(b.test_date))
    .map(l => ({
      date:      l.test_date?.slice(0, 10),
      value:     parseFloat(l.value),
      normalMin: parseFloat(l.reference_min),
      normalMax: parseFloat(l.reference_max),
    }));

  const handleAdd = async () => {
    await API.post('/labs', { ...form, user_id: userId, visit_id: null });
    setShowing(false);
    setForm({
      test_name: '', value: '', unit: '',
      reference_min: '', reference_max: '', test_date: ''
    });
    fetchLabs();
  };

  const handleDelete = async (id) => {
    await API.delete(`/labs/${id}`);
    fetchLabs();
  };

  const getStatus = (value, min, max) => {
    if (!min || !max)        return 'normal';
    if (value < Number(min)) return 'low';
    if (value > Number(max)) return 'high';
    return 'normal';
  };

  const statusStyle = {
    normal: 'bg-green-50 text-green-700',
    high:   'bg-red-50 text-red-600',
    low:    'bg-yellow-50 text-yellow-600',
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const val    = payload[0].value;
      const min    = chartData[0]?.normalMin;
      const max    = chartData[0]?.normalMax;
      const status = getStatus(val, min, max);
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow text-sm">
          <p className="text-gray-500 mb-1">{label}</p>
          <p className="font-bold text-gray-800">{val}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyle[status]}`}>
            {status.toUpperCase()}
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Lab Results</h2>
        <button
          onClick={() => setShowing(!showing)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          + Add Result
        </button>
      </div>

      {/* Add form */}
      {showing && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h3 className="font-semibold text-gray-700 mb-4">New Lab Result</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Test Name</label>
              <input
                value={form.test_name}
                onChange={e => setForm({...form, test_name: e.target.value})}
                placeholder="Fasting Glucose"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"/>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Value</label>
              <input
                type="number"
                value={form.value}
                onChange={e => setForm({...form, value: e.target.value})}
                placeholder="118"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"/>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Unit</label>
              <input
                value={form.unit}
                onChange={e => setForm({...form, unit: e.target.value})}
                placeholder="mg/dL"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"/>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Normal Min</label>
              <input
                type="number"
                value={form.reference_min}
                onChange={e => setForm({...form, reference_min: e.target.value})}
                placeholder="70"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"/>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Normal Max</label>
              <input
                type="number"
                value={form.reference_max}
                onChange={e => setForm({...form, reference_max: e.target.value})}
                placeholder="100"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"/>
            </div>
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-600 mb-1 block">Test Date</label>
            <input
              type="date"
              value={form.test_date}
              onChange={e => setForm({...form, test_date: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"/>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
              Save Result
            </button>
            <button
              onClick={() => setShowing(false)}
              className="border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Lab results list */}
      <div className="space-y-3 mb-6">
        {labs.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-3xl mb-2">🧪</p>
            <p className="text-sm">No lab results added yet</p>
            <p className="text-xs mt-1">Click Add Result to record your first test</p>
          </div>
        ) : (
          labs.map(l => {
            const status = getStatus(l.value, l.reference_min, l.reference_max);
            return (
              <div key={l.id}
                className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-800">{l.test_name}</h3>
                  <p className="text-lg font-bold text-gray-800 mt-1">
                    {l.value}
                    <span className="text-sm font-normal text-gray-400 ml-1">{l.unit}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Normal: {l.reference_min}–{l.reference_max} {l.unit}
                    · {l.test_date?.slice(0,10)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium
                    ${statusStyle[status]}`}>
                    {status.toUpperCase()}
                  </span>
                  <button
                    onClick={() => handleDelete(l.id)}
                    className="text-red-400 hover:text-red-600 text-xs">
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Chart section */}
      {labs.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Trend Chart</h3>
            <select
              value={selectedTest}
              onChange={e => setSelectedTest(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm
                focus:outline-none focus:border-blue-400">
              <option value="">Select a test to view trend</option>
              {testNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {!selectedTest && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-3xl mb-2">📊</p>
              <p className="text-sm">Select a test from the dropdown to see its trend</p>
            </div>
          )}

          {selectedTest && chartData.length === 1 && (
            <div className="text-center py-6 text-gray-400 text-sm">
              Add at least 2 results for {selectedTest} to see the trend chart
            </div>
          )}

          {selectedTest && chartData.length > 1 && (
            <>
              <div className="flex gap-4 mb-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
                  Your values
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-6 border-t-2 border-dashed border-green-500 inline-block"></span>
                  Normal max ({chartData[0]?.normalMax})
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-6 border-t-2 border-dashed border-orange-400 inline-block"></span>
                  Normal min ({chartData[0]?.normalMin})
                </span>
              </div>

              <ResponsiveContainer width="100%" height={250}>
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    tickLine={false}/>
                  <YAxis
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    tickLine={false}
                    axisLine={false}/>
                  <Tooltip content={<CustomTooltip />}/>
                  <ReferenceLine
                    y={chartData[0]?.normalMax}
                    stroke="#22c55e"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}/>
                  <ReferenceLine
                    y={chartData[0]?.normalMin}
                    stroke="#f97316"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}/>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 7 }}/>
                </LineChart>
              </ResponsiveContainer>

              {(() => {
                const first = chartData[0].value;
                const last  = chartData[chartData.length - 1].value;
                const diff  = (last - first).toFixed(1);
                const going = last > first ? '📈 Rising'
                            : last < first ? '📉 Falling'
                            : '➡️ Stable';
                const color = last > chartData[0]?.normalMax
                            ? 'text-red-500'
                            : last < chartData[0]?.normalMin
                            ? 'text-yellow-500'
                            : 'text-green-600';
                return (
                  <div className={`mt-4 p-3 rounded-lg bg-gray-50 text-sm ${color}`}>
                    {going} — changed by {diff > 0 ? '+' : ''}{diff} since first recorded.
                    {last > chartData[0]?.normalMax && ' Currently above normal range.'}
                    {last < chartData[0]?.normalMin && ' Currently below normal range.'}
                    {last <= chartData[0]?.normalMax &&
                     last >= chartData[0]?.normalMin && ' Currently within normal range.'}
                  </div>
                );
              })()}
            </>
          )}
        </div>
      )}

    </div>
  );
}