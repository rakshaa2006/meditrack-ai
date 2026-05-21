import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ReferenceLine, ResponsiveContainer, CartesianGrid
} from 'recharts';
import API from '../api';

const darkCard = {background:'#1a2234',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'10px',padding:'14px',marginBottom:'10px'};
const darkInput = {width:'100%',padding:'8px 11px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'7px',color:'#fff',fontSize:'12px',marginBottom:'10px',outline:'none'};
const darkLabel = {fontSize:'11px',color:'rgba(255,255,255,0.4)',marginBottom:'5px',display:'block'};
const btnBlue = {padding:'7px 14px',background:'#2563eb',border:'none',borderRadius:'7px',color:'#fff',fontSize:'11px',cursor:'pointer'};
const pageStyle = {minHeight:'100vh', background:'#111827', padding:'20px'};
const headerStyle = {display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px'};
const headerTitle = {fontSize:'1.25rem', fontWeight:700, color:'#f8fafc'};
const addButton = {...btnBlue, fontSize:'0.875rem'};
const formCard = {...darkCard, borderRadius:'16px', padding:'24px', boxShadow:'0 10px 30px rgba(0,0,0,0.15)'};
const formTitle = {fontWeight:600, color:'#e5e7eb', marginBottom:'16px'};
const formGrid2 = {display:'grid', gridTemplateColumns:'repeat(2, minmax(0, 1fr))', gap:'16px', marginBottom:'16px'};
const formGrid3 = {display:'grid', gridTemplateColumns:'repeat(3, minmax(0, 1fr))', gap:'16px', marginBottom:'16px'};
const formField = {marginBottom:'16px'};
const buttonRow = {display:'flex', gap:'12px'};
const cancelButton = {padding:'10px 16px', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'12px', color:'rgba(255,255,255,0.75)', background:'transparent', cursor:'pointer', fontSize:'0.875rem'};
const emptyState = {textAlign:'center', padding:'32px 0', color:'rgba(255,255,255,0.6)'};
const emptyEmoji = {fontSize:'2rem', marginBottom:'8px'};
const emptyText = {fontSize:'0.875rem'};
const emptySmall = {fontSize:'0.75rem', marginTop:'4px'};
const labCard = {...darkCard, display:'flex', justifyContent:'space-between', alignItems:'center'};
const labCardTitle = {fontWeight:600, color:'#f8fafc'};
const labValue = {fontSize:'1.125rem', fontWeight:700, color:'#f8fafc', marginTop:'4px'};
const labUnit = {fontSize:'0.875rem', fontWeight:400, color:'rgba(255,255,255,0.7)', marginLeft:'6px'};
const labMeta = {fontSize:'0.75rem', color:'rgba(255,255,255,0.6)', marginTop:'4px'};
const labActionRow = {display:'flex', alignItems:'center', gap:'12px'};
const deleteButton = {background:'transparent', border:'none', color:'#fb7185', cursor:'pointer', fontSize:'0.75rem'};
const chartCard = {...darkCard, borderRadius:'16px', padding:'24px'};
const chartHeaderRow = {display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px'};
const chartTitle = {fontWeight:600, color:'#e5e7eb'};
const selectStyle = {width:'100%', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'12px', padding:'10px 12px', fontSize:'0.875rem', background:'#111827', color:'#fff', outline:'none'};
const chartNote = {textAlign:'center', padding:'32px 0', color:'rgba(255,255,255,0.6)', fontSize:'0.875rem'};
const legendRow = {display:'flex', gap:'16px', marginBottom:'16px', fontSize:'0.75rem', color:'rgba(255,255,255,0.7)'};
const legendBlock = {display:'flex', alignItems:'center', gap:'8px'};
const legendDot = {width:'12px', height:'12px', borderRadius:'9999px', background:'#3b82f6', display:'inline-block'};
const legendLineGreen = {width:'24px', borderTop:'2px dashed #22c55e', display:'inline-block'};
const legendLineOrange = {width:'24px', borderTop:'2px dashed #f97316', display:'inline-block'};
const trendMessage = {marginTop:'16px', padding:'12px', borderRadius:'12px', background:'#0f172a', fontSize:'0.875rem'};
const trendTextGreen = {color:'#4ade80'};
const trendTextRed = {color:'#f87171'};
const trendTextYellow = {color:'#fbbf24'};
const tooltipStyle = {background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:'16px', padding:'12px', boxShadow:'0 10px 15px rgba(0,0,0,0.08)', fontSize:'0.875rem'};
const tooltipLabelStyle = {color:'#6b7280', marginBottom:'4px'};
const tooltipValueStyle = {fontWeight:700, color:'#111827'};
const statusPillBase = {fontSize:'0.75rem', padding:'4px 10px', borderRadius:'9999px', fontWeight:600, display:'inline-block'};
const statusStyle = {
  normal: {background:'#ecfdf5', color:'#166534'},
  high: {background:'#fee2e2', color:'#b91c1c'},
  low: {background:'#fef3c7', color:'#92400e'},
};

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const val    = payload[0].value;
      const min    = chartData[0]?.normalMin;
      const max    = chartData[0]?.normalMax;
      const status = getStatus(val, min, max);
      return (
        <div style={tooltipStyle}>
          <p style={tooltipLabelStyle}>{label}</p>
          <p style={tooltipValueStyle}>{val}</p>
          <span style={{...statusPillBase, ...statusStyle[status]}}>
            {status.toUpperCase()}
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={pageStyle}>

      {/* Header */}
      <div style={headerStyle}>
        <h2 style={headerTitle}>Lab Results</h2>
        <button
          onClick={() => setShowing(!showing)}
          style={addButton}>
          + Add Result
        </button>
      </div>

      {/* Add form */}
      {showing && (
        <div style={formCard}>
          <h3 style={formTitle}>New Lab Result</h3>
          <div style={formGrid2}>
            <div style={formField}>
              <label style={darkLabel}>Test Name</label>
              <input
                value={form.test_name}
                onChange={e => setForm({...form, test_name: e.target.value})}
                placeholder="Fasting Glucose"
                style={darkInput}/>
            </div>
            <div style={formField}>
              <label style={darkLabel}>Value</label>
              <input
                type="number"
                value={form.value}
                onChange={e => setForm({...form, value: e.target.value})}
                placeholder="118"
                style={darkInput}/>
            </div>
          </div>
          <div style={formGrid3}>
            <div style={formField}>
              <label style={darkLabel}>Unit</label>
              <input
                value={form.unit}
                onChange={e => setForm({...form, unit: e.target.value})}
                placeholder="mg/dL"
                style={darkInput}/>
            </div>
            <div style={formField}>
              <label style={darkLabel}>Normal Min</label>
              <input
                type="number"
                value={form.reference_min}
                onChange={e => setForm({...form, reference_min: e.target.value})}
                placeholder="70"
                style={darkInput}/>
            </div>
            <div style={formField}>
              <label style={darkLabel}>Normal Max</label>
              <input
                type="number"
                value={form.reference_max}
                onChange={e => setForm({...form, reference_max: e.target.value})}
                placeholder="100"
                style={darkInput}/>
            </div>
          </div>
          <div style={formField}>
            <label style={darkLabel}>Test Date</label>
            <input
              type="date"
              value={form.test_date}
              onChange={e => setForm({...form, test_date: e.target.value})}
              style={darkInput}/>
          </div>
          <div style={buttonRow}>
            <button
              onClick={handleAdd}
              style={addButton}>
              Save Result
            </button>
            <button
              onClick={() => setShowing(false)}
              style={cancelButton}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Lab results list */}
      <div style={{marginBottom:'24px'}}>
        {labs.length === 0 ? (
          <div style={emptyState}>
            <p style={emptyEmoji}>🧪</p>
            <p style={emptyText}>No lab results added yet</p>
            <p style={emptySmall}>Click Add Result to record your first test</p>
          </div>
        ) : (
          labs.map(l => {
            const status = getStatus(l.value, l.reference_min, l.reference_max);
            return (
              <div key={l.id} style={labCard}>
                <div>
                  <h3 style={labCardTitle}>{l.test_name}</h3>
                  <p style={labValue}>
                    {l.value}
                    <span style={labUnit}>{l.unit}</span>
                  </p>
                  <p style={labMeta}>
                    Normal: {l.reference_min}–{l.reference_max} {l.unit}
                    · {l.test_date?.slice(0,10)}
                  </p>
                </div>
                <div style={labActionRow}>
                  <span style={{...statusPillBase, ...statusStyle[status]}}>
                    {status.toUpperCase()}
                  </span>
                  <button
                    onClick={() => handleDelete(l.id)}
                    style={deleteButton}>
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
        <div style={chartCard}>
          <div style={chartHeaderRow}>
            <h3 style={chartTitle}>Trend Chart</h3>
            <select
              value={selectedTest}
              onChange={e => setSelectedTest(e.target.value)}
              style={selectStyle}>
              <option value="">Select a test to view trend</option>
              {testNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {!selectedTest && (
            <div style={chartNote}>
              <p style={emptyEmoji}>📊</p>
              <p style={emptyText}>Select a test from the dropdown to see its trend</p>
            </div>
          )}

          {selectedTest && chartData.length === 1 && (
            <div style={chartNote}>
              Add at least 2 results for {selectedTest} to see the trend chart
            </div>
          )}

          {selectedTest && chartData.length > 1 && (
            <>
              <div style={legendRow}>
                <span style={legendBlock}>
                  <span style={legendDot}></span>
                  Your values
                </span>
                <span style={legendBlock}>
                  <span style={legendLineGreen}></span>
                  Normal max ({chartData[0]?.normalMax})
                </span>
                <span style={legendBlock}>
                  <span style={legendLineOrange}></span>
                  Normal min ({chartData[0]?.normalMin})
                </span>
              </div>

              <ResponsiveContainer width="100%" height={250}>
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155"/>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#cbd5e1' }}
                    tickLine={false}
                    axisLine={false}/>
                  <YAxis
                    tick={{ fontSize: 11, fill: '#cbd5e1' }}
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
                    dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#111827' }}
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
                const colorStyle = last > chartData[0]?.normalMax
                            ? trendTextRed
                            : last < chartData[0]?.normalMin
                            ? trendTextYellow
                            : trendTextGreen;
                return (
                  <div style={{...trendMessage, ...colorStyle}}>
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