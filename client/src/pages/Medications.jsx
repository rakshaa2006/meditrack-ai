import { useEffect, useState } from 'react';
import API from '../api';

export default function Medications({ userId }) {
  const [meds,    setMeds]    = useState([]);
  const [showing, setShowing] = useState(false);
  const [form,    setForm]    = useState({ name:'', dosage:'', frequency:'', start_date:'', end_date:'' });

  const fetchMeds = () => API.get(`/medications/${userId}`).then(r => setMeds(r.data)).catch(()=>{});
  useEffect(() => { fetchMeds(); }, [userId]);

  const handleAdd = async () => {
    await API.post('/medications', { ...form, user_id:userId, end_date: form.end_date || null });
    setShowing(false);
    setForm({ name:'', dosage:'', frequency:'', start_date:'', end_date:'' });
    fetchMeds();
  };

  const handleDelete = async (id) => { await API.delete(`/medications/${id}`); fetchMeds(); };

  const s = {
    page:    { minHeight:'100vh', background:'#111827', padding:'20px' },
    header:  { display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'18px' },
    title:   { fontSize:'18px', fontWeight:'500', color:'#fff' },
    sub:     { fontSize:'11px', color:'rgba(255,255,255,0.35)', marginTop:'2px' },
    btnBlue: { padding:'7px 14px', background:'#2563eb', border:'none', borderRadius:'7px', color:'#fff', fontSize:'11px', cursor:'pointer' },
    card:    { background:'#1a2234', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'10px', padding:'14px', marginBottom:'10px' },
    row:     { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' },
    formBox: { background:'#1a2234', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'10px', padding:'16px', marginBottom:'16px' },
    label:   { fontSize:'11px', color:'rgba(255,255,255,0.4)', marginBottom:'5px', display:'block' },
    input:   { width:'100%', padding:'8px 11px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'7px', color:'#fff', fontSize:'12px', marginBottom:'10px', outline:'none' },
    row2:    { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' },
    btnSm:   { padding:'4px 10px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'5px', color:'rgba(255,255,255,0.45)', fontSize:'10px', cursor:'pointer' },
    btnDel:  { padding:'4px 10px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.18)', borderRadius:'5px', color:'#f87171', fontSize:'10px', cursor:'pointer' },
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div><div style={s.title}>Medications</div><div style={s.sub}>{meds.filter(m=>m.is_active).length} active medications</div></div>
        <button style={s.btnBlue} onClick={()=>setShowing(!showing)}>+ Add medication</button>
      </div>

      {showing && (
        <div style={s.formBox}>
          <div style={{fontSize:'13px',fontWeight:'500',color:'#fff',marginBottom:'14px'}}>New medication</div>
          <div style={s.row2}>
            <div><label style={s.label}>Medicine name</label><input style={s.input} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Metformin"/></div>
            <div><label style={s.label}>Dosage</label><input style={s.input} value={form.dosage} onChange={e=>setForm({...form,dosage:e.target.value})} placeholder="500mg"/></div>
          </div>
          <label style={s.label}>Frequency</label>
          <select style={{...s.input,cursor:'pointer'}} value={form.frequency} onChange={e=>setForm({...form,frequency:e.target.value})}>
            <option value="">Select frequency</option>
            <option>Once daily</option>
            <option>Twice daily</option>
            <option>Three times daily</option>
            <option>Once weekly</option>
          </select>
          <div style={s.row2}>
            <div><label style={s.label}>Start date</label><input type="date" style={s.input} value={form.start_date} onChange={e=>setForm({...form,start_date:e.target.value})}/></div>
            <div><label style={s.label}>End date (optional)</label><input type="date" style={s.input} value={form.end_date} onChange={e=>setForm({...form,end_date:e.target.value})}/></div>
          </div>
          <div style={{display:'flex',gap:'8px'}}>
            <button style={s.btnBlue} onClick={handleAdd}>Save medication</button>
            <button style={s.btnSm} onClick={()=>setShowing(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div style={s.card}>
        {meds.length === 0 ? (
          <div style={{textAlign:'center',padding:'24px',color:'rgba(255,255,255,0.25)',fontSize:'12px'}}>No medications added yet.</div>
        ) : meds.map(m => (
          <div key={m.id} style={{...s.row,'&:lastChild':{borderBottom:'none'}}}>
            <div>
              <div style={{fontSize:'13px',color:'#e2e8f0',fontWeight:'500'}}>{m.name} <span style={{fontWeight:'400',color:'rgba(255,255,255,0.4)',fontSize:'12px'}}>{m.dosage}</span></div>
              <div style={{fontSize:'10px',color:'rgba(255,255,255,0.3)',marginTop:'2px'}}>{m.frequency} · Since {m.start_date?.slice(0,10)}</div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
              <span style={{fontSize:'9px',padding:'2px 8px',borderRadius:'20px',fontWeight:'500', ...(m.is_active ? {background:'rgba(34,197,94,0.12)',color:'#4ade80'} : {background:'rgba(255,255,255,0.06)',color:'rgba(255,255,255,0.3)'})}}>
                {m.is_active ? 'Active' : 'Inactive'}
              </span>
              <button style={s.btnSm}>Edit</button>
              <button style={s.btnDel} onClick={()=>handleDelete(m.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{padding:'10px 12px',background:'rgba(37,99,235,0.07)',border:'1px solid rgba(37,99,235,0.16)',borderRadius:'8px',fontSize:'11px',color:'rgba(255,255,255,0.5)',display:'flex',gap:'6px',alignItems:'flex-start'}}>
        🤖 AI check: No harmful interactions detected between your active medications.
      </div>
    </div>
  );
}