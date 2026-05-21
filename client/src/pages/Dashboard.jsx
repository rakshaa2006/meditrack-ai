import { useEffect, useState } from 'react';
import API from '../api';

export default function Dashboard({ userId }) {
  const [visits,  setVisits]  = useState([]);
  const [meds,    setMeds]    = useState([]);
  const [labs,    setLabs]    = useState([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    API.get(`/visits/${userId}`).then(r      => setVisits(r.data)).catch(()=>{});
    API.get(`/medications/${userId}`).then(r => setMeds(r.data)).catch(()=>{});
    API.get(`/labs/${userId}`).then(r        => setLabs(r.data)).catch(()=>{});
  }, [userId]);

  const getAISummary = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/ai/summary/${userId}`);
      setSummary(res.data.summary);
    } catch { setSummary('Could not load summary. Try again.'); }
    setLoading(false);
  };

  const s = {
    page:      { minHeight:'100vh', background:'#111827', padding:'20px' },
    header:    { display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'18px' },
    title:     { fontSize:'18px', fontWeight:'500', color:'#fff' },
    sub:       { fontSize:'11px', color:'rgba(255,255,255,0.35)', marginTop:'2px' },
    btnBlue:   { padding:'7px 14px', background:'#2563eb', border:'none', borderRadius:'7px', color:'#fff', fontSize:'11px', cursor:'pointer', display:'flex', alignItems:'center', gap:'5px' },
    statGrid:  { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px', marginBottom:'14px' },
    stat:      { background:'#1e2d45', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'10px', padding:'12px' },
    statTop:   { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'8px' },
    statV:     { fontSize:'20px', fontWeight:'500', color:'#fff' },
    statL:     { fontSize:'10px', color:'rgba(255,255,255,0.35)', marginTop:'2px' },
    twoCol:    { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'12px' },
    card:      { background:'#1a2234', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'10px', padding:'14px' },
    cardTitle: { fontSize:'12px', fontWeight:'500', color:'rgba(255,255,255,0.6)', marginBottom:'10px' },
    row:       { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' },
    rn:        { fontSize:'12px', color:'#e2e8f0' },
    rs:        { fontSize:'10px', color:'rgba(255,255,255,0.3)', marginTop:'1px' },
    aiCard:    { background:'#1e2d45', border:'1px solid rgba(37,99,235,0.2)', borderRadius:'10px', padding:'14px' },
    aiLabel:   { fontSize:'11px', fontWeight:'500', color:'#60a5fa' },
    aiSec:     { fontSize:'11px', fontWeight:'500', color:'#93c5fd', marginTop:'8px', marginBottom:'3px' },
    aiBody:    { fontSize:'11px', color:'rgba(255,255,255,0.55)', lineHeight:'1.65' },
    empty:     { textAlign:'center', padding:'24px', color:'rgba(255,255,255,0.25)', fontSize:'12px' },
  };

  const badge = (type) => {
    const styles = {
      green:  { background:'rgba(34,197,94,0.12)',  color:'#4ade80' },
      red:    { background:'rgba(239,68,68,0.12)',  color:'#f87171' },
      amber:  { background:'rgba(251,191,36,0.12)', color:'#fbbf24' },
      blue:   { background:'rgba(37,99,235,0.15)',  color:'#60a5fa' },
      gray:   { background:'rgba(255,255,255,0.06)',color:'rgba(255,255,255,0.3)' },
    };
    return { ...styles[type], fontSize:'9px', padding:'2px 8px', borderRadius:'20px', fontWeight:'500' };
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <div style={s.title}>Welcome back 👋</div>
          <div style={s.sub}>Here is your health overview</div>
        </div>
        <button style={s.btnBlue} onClick={getAISummary}>
          🤖 {loading ? 'Analyzing...' : 'Get AI Summary'}
        </button>
      </div>

      {/* Stat cards */}
      <div style={s.statGrid}>
        <div style={s.stat}>
          <div style={s.statTop}>
            <div style={{width:'30px',height:'30px',borderRadius:'8px',background:'rgba(37,99,235,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'15px'}}>🏥</div>
            <span style={badge('blue')}>visits</span>
          </div>
          <div style={s.statV}>{visits.length}</div>
          <div style={s.statL}>{visits.length === 0 ? 'No visits yet' : `Last: ${visits[0]?.visit_date?.slice(0,10)}`}</div>
        </div>
        <div style={s.stat}>
          <div style={s.statTop}>
            <div style={{width:'30px',height:'30px',borderRadius:'8px',background:'rgba(139,92,246,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'15px'}}>💊</div>
            <span style={badge('green')}>active</span>
          </div>
          <div style={s.statV}>{meds.filter(m=>m.is_active).length}</div>
          <div style={s.statL}>{meds.length} total recorded</div>
        </div>
        <div style={s.stat}>
          <div style={s.statTop}>
            <div style={{width:'30px',height:'30px',borderRadius:'8px',background:'rgba(251,191,36,0.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'15px'}}>🧪</div>
            <span style={badge('amber')}>labs</span>
          </div>
          <div style={s.statV}>{labs.length}</div>
          <div style={s.statL}>{labs.length === 0 ? 'No labs yet' : `Last: ${labs[0]?.test_date?.slice(0,10)}`}</div>
        </div>
        <div style={s.stat}>
          <div style={s.statTop}>
            <div style={{width:'30px',height:'30px',borderRadius:'8px',background:'rgba(239,68,68,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'15px'}}>🤖</div>
            <span style={badge('blue')}>AI</span>
          </div>
          <div style={s.statV}>1</div>
          <div style={s.statL}>Summary available</div>
        </div>
      </div>

      {/* AI Summary */}
      <div style={{...s.aiCard, marginBottom:'12px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'8px'}}>
          <div style={s.aiLabel}>🤖 AI health summary</div>
          {loading && <span style={{fontSize:'11px',color:'rgba(255,255,255,0.35)'}}>Analyzing your records...</span>}
        </div>
        {summary ? (
          <div style={{fontSize:'12px',color:'rgba(255,255,255,0.6)',lineHeight:'1.7',whiteSpace:'pre-line'}}>{summary}</div>
        ) : (
          <div style={s.aiBody}>Click Get AI Summary to analyze your visits, medications and lab results. The AI will explain your health in plain English.</div>
        )}
      </div>

      {/* Two col */}
      <div style={s.twoCol}>
        <div style={s.card}>
          <div style={s.cardTitle}>Recent visits</div>
          {visits.length === 0 ? (
            <div style={s.empty}>No visits yet — add your first visit</div>
          ) : visits.slice(0,3).map(v => (
            <div key={v.id} style={{...s.row, flexDirection:'column', alignItems:'flex-start', gap:'4px'}}>
              <div style={{display:'flex',justifyContent:'space-between',width:'100%',alignItems:'center'}}>
                <div>
                  <div style={s.rn}>{v.doctor_name}</div>
                  <div style={s.rs}>{v.specialty} · {v.visit_date?.slice(0,10)}</div>
                </div>
                {v.diagnosis && <span style={badge('amber')}>{v.diagnosis.slice(0,16)}</span>}
              </div>
            </div>
          ))}
        </div>
        <div style={s.card}>
          <div style={s.cardTitle}>Active medications</div>
          {meds.filter(m=>m.is_active).length === 0 ? (
            <div style={s.empty}>No active medications</div>
          ) : meds.filter(m=>m.is_active).map(m => (
            <div key={m.id} style={s.row}>
              <div>
                <div style={s.rn}>{m.name} {m.dosage}</div>
                <div style={s.rs}>{m.frequency}</div>
              </div>
              <span style={badge('green')}>Active</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lab results */}
      <div style={s.card}>
        <div style={s.cardTitle}>Recent lab results</div>
        {labs.length === 0 ? (
          <div style={s.empty}>No lab results yet</div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
            {labs.slice(0,4).map(l => {
              const high = l.reference_max && Number(l.value) > Number(l.reference_max);
              const low  = l.reference_min && Number(l.value) < Number(l.reference_min);
              return (
                <div key={l.id} style={{padding:'10px',background:'#111827',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.05)'}}>
                  <div style={{fontSize:'11px',color:'rgba(255,255,255,0.5)',marginBottom:'4px'}}>{l.test_name}</div>
                  <div style={{fontSize:'18px',fontWeight:'500',color: high ? '#f87171' : low ? '#fbbf24' : '#4ade80'}}>
                    {l.value} <span style={{fontSize:'11px',fontWeight:'400',color:'rgba(255,255,255,0.3)'}}>{l.unit}</span>
                  </div>
                  <div style={{fontSize:'10px',color:'rgba(255,255,255,0.25)',marginTop:'2px'}}>Normal: {l.reference_min}–{l.reference_max}</div>
                  <span style={{...badge(high ? 'red' : low ? 'amber' : 'green'),marginTop:'4px',display:'inline-block'}}>
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