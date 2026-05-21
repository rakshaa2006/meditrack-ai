import { useEffect, useState } from 'react';
import API from '../api';

export default function Visits({ userId }) {
  const [visits,  setVisits]  = useState([]);
  const [showing, setShowing] = useState(false);
  const [form,    setForm]    = useState({ doctor_name:'', specialty:'', visit_date:'', notes:'', diagnosis:'' });

  const fetchVisits = () => API.get(`/visits/${userId}`).then(r => setVisits(r.data)).catch(()=>{});
  useEffect(() => { fetchVisits(); }, [userId]);

  const handleAdd = async () => {
    await API.post('/visits', { ...form, user_id: userId });
    setShowing(false);
    setForm({ doctor_name:'', specialty:'', visit_date:'', notes:'', diagnosis:'' });
    fetchVisits();
  };

  const handleDelete = async (id) => { await API.delete(`/visits/${id}`); fetchVisits(); };

  const s = {
    page:    { minHeight:'100vh', background:'#111827', padding:'20px' },
    header:  { display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'18px' },
    title:   { fontSize:'18px', fontWeight:'500', color:'#fff' },
    sub:     { fontSize:'11px', color:'rgba(255,255,255,0.35)', marginTop:'2px' },
    btnBlue: { padding:'7px 14px', background:'#2563eb', border:'none', borderRadius:'7px', color:'#fff', fontSize:'11px', cursor:'pointer' },
    card:    { background:'#1a2234', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'10px', padding:'14px', marginBottom:'8px', display:'flex', gap:'10px', alignItems:'flex-start' },
    av:      { width:'36px', height:'36px', borderRadius:'50%', background:'#1e2d45', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'500', color:'#60a5fa', flexShrink:0, border:'1px solid rgba(96,165,250,0.2)' },
    formBox: { background:'#1a2234', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'10px', padding:'16px', marginBottom:'16px' },
    label:   { fontSize:'11px', color:'rgba(255,255,255,0.4)', marginBottom:'5px', display:'block' },
    input:   { width:'100%', padding:'8px 11px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'7px', color:'#fff', fontSize:'12px', marginBottom:'10px', outline:'none' },
    row2:    { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' },
    btnSm:   { padding:'4px 10px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'5px', color:'rgba(255,255,255,0.45)', fontSize:'10px', cursor:'pointer' },
    btnDel:  { padding:'4px 10px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.18)', borderRadius:'5px', color:'#f87171', fontSize:'10px', cursor:'pointer' },
  };

  const initials = (name) => name?.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() || '?';

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div><div style={s.title}>Doctor visits</div><div style={s.sub}>{visits.length} visits recorded</div></div>
        <button style={s.btnBlue} onClick={() => setShowing(!showing)}>+ Add visit</button>
      </div>

      {showing && (
        <div style={s.formBox}>
          <div style={{fontSize:'13px',fontWeight:'500',color:'#fff',marginBottom:'14px'}}>New visit</div>
          <div style={s.row2}>
            <div><label style={s.label}>Doctor name</label><input style={s.input} value={form.doctor_name} onChange={e=>setForm({...form,doctor_name:e.target.value})} placeholder="Dr. Sharma"/></div>
            <div><label style={s.label}>Specialty</label><input style={s.input} value={form.specialty} onChange={e=>setForm({...form,specialty:e.target.value})} placeholder="General Physician"/></div>
          </div>
          <label style={s.label}>Visit date</label>
          <input style={s.input} type="date" value={form.visit_date} onChange={e=>setForm({...form,visit_date:e.target.value})}/>
          <label style={s.label}>Notes</label>
          <textarea style={{...s.input,minHeight:'60px',resize:'vertical'}} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="What did the doctor say?"/>
          <label style={s.label}>Diagnosis</label>
          <input style={s.input} value={form.diagnosis} onChange={e=>setForm({...form,diagnosis:e.target.value})} placeholder="e.g. Hypertension mild"/>
          <div style={{display:'flex',gap:'8px'}}>
            <button style={s.btnBlue} onClick={handleAdd}>Save visit</button>
            <button style={s.btnSm} onClick={()=>setShowing(false)}>Cancel</button>
          </div>
        </div>
      )}

      {visits.length === 0 ? (
        <div style={{textAlign:'center',padding:'40px',color:'rgba(255,255,255,0.25)',fontSize:'13px'}}>No visits yet. Add your first visit above.</div>
      ) : visits.map(v => (
        <div key={v.id} style={s.card}>
          <div style={s.av}>{initials(v.doctor_name)}</div>
          <div style={{flex:1}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div>
                <div style={{fontSize:'13px',fontWeight:'500',color:'#e2e8f0'}}>{v.doctor_name}</div>
                <div style={{fontSize:'10px',color:'rgba(255,255,255,0.3)',marginTop:'2px'}}>{v.specialty} · {v.visit_date?.slice(0,10)}</div>
              </div>
              <div style={{display:'flex',gap:'5px'}}>
                <button style={s.btnSm}>Edit</button>
                <button style={s.btnDel} onClick={()=>handleDelete(v.id)}>Delete</button>
              </div>
            </div>
            {v.notes && <div style={{fontSize:'11px',color:'rgba(255,255,255,0.5)',marginTop:'6px',lineHeight:'1.5'}}>{v.notes}</div>}
            {v.diagnosis && <span style={{display:'inline-block',marginTop:'6px',fontSize:'9px',padding:'2px 8px',borderRadius:'20px',fontWeight:'500',background:'rgba(251,191,36,0.12)',color:'#fbbf24'}}>{v.diagnosis}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}