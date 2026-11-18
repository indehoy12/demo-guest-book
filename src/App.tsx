import {Routes,Route,NavLink,Link,Outlet,useNavigate,useParams,useLocation} from 'react-router-dom'
import {useState,useEffect,ReactNode} from 'react'
import {useStore,useStats,CATS} from './store'
import {EVENT} from './event'
import Sig from './Sig'
const CONSULT='https://sumberrejekitech.web.id'
const fmt=(t:string)=>new Date(t).toLocaleString('id-ID',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})
const B1='rounded-xl bg-ink px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0A2F7A] hover:shadow-lg active:scale-95 disabled:opacity-40 disabled:hover:translate-y-0'
const B2='rounded-xl bg-[#E6EAF4] px-5 py-3 font-semibold text-ink transition hover:bg-[#D9E0F0] active:scale-95 disabled:opacity-40'
const CARD='lift rounded-2xl border border-slate-200 bg-white p-5'
const IN='w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-brass'
const Ok=()=><span className="mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700" aria-label="Ya">✓</span>
const No=()=><span className="mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700" aria-label="Tidak">✕</span>
const Err=({children}:{children:ReactNode})=><span className="mt-1 flex items-center text-sm text-red-700"><No/>{children}</span>
function Confirm({title,text,ok,onOk,onNo}:{title:string;text:string;ok:string;onOk:()=>void;onNo:()=>void}){
useEffect(()=>{const k=(e:KeyboardEvent)=>e.key==='Escape'&&onNo();window.addEventListener('keydown',k);return()=>window.removeEventListener('keydown',k)},[])
return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" role="dialog" aria-modal="true" onClick={onNo}><div className="max-h-[90dvh] w-full max-w-sm space-y-4 overflow-auto rounded-2xl bg-white p-6 shadow-xl" onClick={e=>e.stopPropagation()}><h2 className="text-lg font-bold text-ink">{title}</h2><p className="text-slate-600">{text}</p><div className="flex justify-end gap-2"><button className={B2} onClick={onNo}>Batal</button><button className={B1} onClick={onOk}>{ok}</button></div></div></div>}
const Foot=({dark}:{dark?:boolean})=><footer className={'flex items-center justify-center gap-2 py-3 text-xs '+(dark?'text-slate-300':'text-slate-500')}>Dikembangkan oleh <img src={dark?'/logo-white.png':'/logo.png'} alt="Sumber Rejeki Tech" className="h-5"/></footer>
const STEPS=[{k:'isi',t:'Isi buku tamu',d:'Isi data dan tanda tangan',to:'/isi'},{k:'dash',t:'Lihat dashboard',d:'Angka tamu bertambah',to:'/app'},{k:'tamu',t:'Cek data tamu',d:'Buka detail dan tanda tangan',to:'/app/tamu'},{k:'laporan',t:'Buka laporan',d:'Grafik dan aktivitas',to:'/app/laporan'}]
function Guide(){const{prog}=useStore(),next=STEPS.find(s=>!prog.includes(s.k))
return <section className="rounded-2xl border border-slate-200 bg-white p-4" aria-label="Panduan demo"><div className="mb-3 flex items-center justify-between gap-2"><b className="font-display text-ink">Panduan demo</b><span className="text-sm text-slate-500">{prog.length} dari 4 selesai</span></div>
<ol className="grid grid-cols-2 gap-2 lg:grid-cols-4">{STEPS.map((s,i)=>{const d=prog.includes(s.k),cur=next?.k===s.k;return <li key={s.k}><Link to={s.to} className={'block rounded-xl border p-3 transition hover:-translate-y-0.5 '+(cur?'pulse-soft border-brass bg-orange-50':d?'border-emerald-200 bg-emerald-50':'border-slate-200 bg-slate-50')}><span className="flex items-center text-sm font-semibold text-ink">{d?<Ok/>:<span className="mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-xs">{i+1}</span>}{s.t}</span><span className="mt-1 block text-xs text-slate-500">{cur?'Langkah berikutnya: '+s.d:s.d}</span></Link></li>})}</ol>
{!next&&<p className="mt-3 flex items-center text-sm text-slate-600"><Ok/>Semua langkah selesai. Coba mode Kiosk atau konsultasikan kebutuhan Anda.</p>}</section>}
function Num({v}:{v:number}){const[d,setD]=useState(0);useEffect(()=>{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){setD(v);return}let f=0;const st=performance.now(),from=d,tick=(t:number)=>{const k=Math.min(1,(t-st)/700);setD(Math.round(from+(v-from)*(1-Math.pow(1-k,3))));if(k<1)f=requestAnimationFrame(tick)};f=requestAnimationFrame(tick);return()=>cancelAnimationFrame(f)},[v]);return <>{d}</>}
const Closed=()=><div className="space-y-4 py-6 text-center"><div className="pop mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl font-bold text-red-700" aria-hidden="true">✕</div><h2 className="font-display text-2xl font-bold text-ink">Acara sudah ditutup</h2><p className="text-slate-600">Buku tamu untuk {EVENT.name} tidak dapat diisi lagi. Data hanya bisa dilihat oleh penyelenggara.</p><Link to="/app" className={B1+' inline-block'}>Lihat dashboard</Link></div>
function EventBar(){const{closed,close}=useStore(),[ask,setAsk]=useState(false)
return <><div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-ink p-4 text-white"><div><p className="text-xs text-slate-300">Acara</p><p className="font-display text-lg font-bold">{EVENT.name}</p><p className="text-sm text-slate-200">{EVENT.date} · {EVENT.place}</p></div><div className="flex items-center gap-3"><span className="flex items-center rounded-full bg-white px-3 py-1 text-sm font-semibold text-ink">{closed?<><No/>Acara ditutup</>:<><Ok/>Berlangsung</>}</span>{!closed&&<button className={B2+' !py-2 text-sm'} onClick={()=>setAsk(true)}>Tutup acara</button>}</div></div>
{ask&&<Confirm title="Tutup acara ini?" text="Setelah ditutup, buku tamu tidak bisa diisi lagi dan data tidak bisa diubah atau dihapus. Tindakan ini tidak dapat dibatalkan." ok="Tutup acara" onOk={()=>{close();setAsk(false)}} onNo={()=>setAsk(false)}/>}</>}
const Wm=()=><div className="wm" aria-hidden/>
const Consult=({cls=B1}:{cls?:string})=><a href={CONSULT} target="_blank" rel="noopener noreferrer" className={cls+' inline-block text-center'}>Konsultasikan Kebutuhan Anda</a>
const Warn=()=><p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">Gunakan data contoh, bukan informasi pribadi yang nyata. Data hanya tersimpan di browser Anda selama sesi ini.</p>

export default function App(){return <><Wm/><Routes>
<Route path="/" element={<Welcome/>}/>
<Route path="/pad" element={<Pad/>}/>
<Route path="/isi" element={<Flow/>}/>
<Route path="/kiosk" element={<Kiosk/>}/>
<Route path="/app" element={<Admin/>}>
<Route index element={<Dash/>}/><Route path="tamu" element={<Records/>}/><Route path="tamu/:id" element={<Detail/>}/><Route path="laporan" element={<Reports/>}/><Route path="tentang" element={<About/>}/></Route>
<Route path="*" element={<Welcome/>}/></Routes></>}

function Welcome(){return <div className="relative flex min-h-[100dvh] flex-col overflow-hidden"><div className="blob -left-20 top-10 h-72 w-72 bg-[#FD7A00]"/><div className="blob -right-16 bottom-24 h-80 w-80 bg-[#011F59]" style={{animationDelay:'-4s'}}/><main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-6 px-6 py-10"><img src="/logo.png" alt="Sumber Rejeki Tech" className="h-10 w-fit"/>
<p className="text-sm font-semibold text-[#B45309]">Demo interaktif · Sumber Rejeki Tech</p>
<h1 className="font-display text-4xl font-bold leading-tight text-ink sm:text-6xl">Digital Guestbook &amp; <span className="whitespace-nowrap">E-Signature</span></h1>
<p className="max-w-xl text-lg text-slate-600">Rasakan pengalaman buku tamu digital modern dengan pencatatan otomatis dan tanda tangan langsung melalui perangkat Anda.</p>
<p className="text-sm font-semibold text-ink">{EVENT.name} · {EVENT.date} · {EVENT.place}</p><ol className="grid gap-3 text-sm sm:grid-cols-4">{[['Isi buku tamu','Data diri contoh'],['Tanda tangan','Di layar sentuh'],['Lihat dashboard','Angka bertambah'],['Buka laporan','Grafik dan aktivitas']].map(([t,d],i)=><li key={t} className="lift rounded-2xl border border-slate-200 bg-white/90 p-4" style={{animation:'fadeUp .5s both',animationDelay:(i*90+150)+'ms'}}><span className="mb-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">{i+1}</span><b className="block text-ink">{t}</b><span className="text-slate-500">{d}</span></li>)}</ol>
<div className="flex flex-col gap-3 sm:flex-row"><Link to="/isi" className={B1+' text-center'}>Coba Isi Buku Tamu</Link><Link to="/app" className={B2+' text-center'}>Jelajahi Dashboard</Link><Link to="/pad" className={B2+' text-center'}>Coba Signature Pad</Link></div>
<p className="text-sm text-slate-500">Seluruh data pada demo ini hanya untuk simulasi.</p></main><Foot/></div>}

function Pad(){const[d,setD]=useState('');return <div className="flex min-h-[100dvh] flex-col"><main className="mx-auto w-full max-w-2xl flex-1 space-y-4 px-4 py-8">
<Link to="/" className="text-sm text-slate-500">Kembali</Link><h1 className="font-display text-3xl font-bold text-ink">Signature Pad</h1>
<p className="text-slate-600">Gambar tanda tangan dengan mouse atau sentuhan. Tidak ada yang dikirim ke server.</p>
<Sig onChange={setD}/>{d&&<div className={CARD}><p className="mb-2 text-sm text-slate-500">Pratinjau</p><img src={d} alt="Pratinjau tanda tangan" className="h-24"/></div>}
<Link to="/isi" className={B1+' block text-center'}>Lanjut isi buku tamu</Link></main><Foot/></div>}

const Steps=({i}:{i:number})=><ol className="flex gap-2 text-sm">{['Data diri','Tanda tangan','Review','Selesai'].map((s,n)=><li key={s} className={'flex-1 rounded-full px-3 py-1 text-center '+(n===i?'bg-ink text-white':n<i?'bg-brass/20 text-ink':'bg-slate-200 text-slate-500')}>{s}</li>)}</ol>

function Flow({kiosk,onDone}:{kiosk?:boolean;onDone?:()=>void}){
const{add,closed}=useStore()
const[step,setStep]=useState(0),[f,setF]=useState({name:'',org:'',category:'',purpose:'',phone:'',note:''}),[sig,setSig]=useState(''),[err,setErr]=useState<Record<string,string>>({})
const set=(k:string,v:string)=>setF(p=>({...p,[k]:v}))
const check=()=>{const e:Record<string,string>={};const n=f.name.trim()
if(n.length<2||n.length>60)e.name='Nama wajib diisi (2–60 karakter).'
if(!f.org.trim())e.org='Instansi wajib diisi.'
if(!f.category)e.category='Pilih kategori.'
if(f.purpose.trim().length<3)e.purpose='Tujuan kedatangan wajib diisi.'
if(f.phone&&!/^[0-9+\-\s]{6,16}$/.test(f.phone.trim()))e.phone='Gunakan nomor contoh (angka, 6–16 karakter).'
setErr(e);return!Object.keys(e).length}
const sz=kiosk?'text-xl py-4':''
const fld=(k:'name'|'org'|'purpose'|'phone'|'note',l:string,ph:string)=><label className="block"><span className="mb-1 block font-medium">{l}</span><input className={IN+' '+sz} value={f[k]} maxLength={80} placeholder={ph} onChange={e=>set(k,e.target.value)}/>{err[k]&&<Err>{err[k]}</Err>}</label>
const body=()=>{
if(step===0)return <div className="space-y-4"><Warn/>
{fld('name','Nama','Contoh: Andi Pratama')}{fld('org','Instansi','Contoh: PT Contoh Abadi')}
<label className="block"><span className="mb-1 block font-medium">Kategori</span><select className={IN+' '+sz} value={f.category} onChange={e=>set('category',e.target.value)}><option value="">Pilih kategori</option>{CATS.map(c=><option key={c}>{c}</option>)}</select>{err.category&&<Err>{err.category}</Err>}</label>
{fld('purpose','Tujuan kedatangan','Contoh: Menghadiri acara')}{fld('phone','Nomor telepon contoh (opsional)','Contoh: 0812 0000 0000')}{fld('note','Catatan (opsional)','Contoh: Datang bersama 2 rekan')}
<button className={B1+' w-full '+sz} onClick={()=>{if(check()){setSig('');setStep(1)}}}>Lanjut ke tanda tangan</button></div>
if(step===1)return <div className="space-y-4"><p className="text-slate-600 [@media(max-height:500px)]:hidden">Tanda tangan di area bawah ini.</p><Sig onChange={setSig} tall={kiosk}/><p className="flex items-center text-sm">{sig?<><Ok/>Tanda tangan sudah terisi</>:<><No/>Tanda tangan belum diisi</>}</p>
<div className="flex gap-3"><button className={B2} onClick={()=>setStep(0)}>Kembali</button><button className={B1+' flex-1 '+sz} disabled={!sig} onClick={()=>setStep(2)}>Lanjut ke review</button></div></div>
if(step===2)return <div className="space-y-4"><div className={CARD+' space-y-1'}><p className="text-sm text-slate-500">{EVENT.name}</p><p className="text-xl font-semibold">{f.name}</p><p>{f.org} · {f.category}</p><p className="text-slate-600">{f.purpose}</p>{f.phone&&<p className="text-sm">Telp: {f.phone}</p>}{f.note&&<p className="text-sm text-slate-500">Catatan: {f.note}</p>}<img src={sig} alt="Tanda tangan Anda" className="mt-2 h-20"/></div>
<div className="flex gap-3"><button className={B2} onClick={()=>{setSig('');setStep(1)}}>Ubah tanda tangan</button><button className={B1+' flex-1 '+sz} onClick={()=>{add({name:f.name.trim(),org:f.org.trim(),category:f.category,purpose:f.purpose.trim(),sig,phone:f.phone.trim()||undefined,note:f.note.trim()||undefined});setStep(3)}}>Kirim</button></div></div>
return <div className="space-y-5 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center pop rounded-full bg-emerald-100 text-3xl text-emerald-700">✓</div>
<h2 className="font-display text-3xl font-bold text-ink">Terima kasih, {f.name.trim()}</h2><p className="text-slate-600">Data Anda masuk ke daftar tamu simulasi dan statistik dashboard sudah bertambah.</p>
<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">{kiosk?<button className={B1+' '+sz} onClick={()=>onDone?.()}>Kembali ke awal</button>:<><Link to="/app" className={B1}>Lihat dashboard</Link><Link to="/app/tamu" className={B2}>Lihat data tamu</Link><Link to="/app/laporan" className={B2}>Lihat laporan</Link></>}</div></div>}
return <div className="flex min-h-[100dvh] flex-col"><main className={'mx-auto w-full flex-1 px-4 py-8 [@media(max-height:500px)]:py-3 '+(kiosk?'max-w-4xl':'max-w-xl')}>
<div className="mb-5 flex items-center justify-between">{kiosk?<Link to="/app" className="rounded-lg bg-slate-800 px-3 py-1 text-sm text-white">Keluar demo</Link>:<Link to="/" className="text-sm text-slate-500">Kembali</Link>}<span className="text-sm text-slate-500">{EVENT.name}</span></div>
<h1 className="mb-4 font-display text-2xl font-bold text-ink [@media(max-height:500px)]:hidden">Buku Tamu Digital</h1><div className="mb-6 [@media(max-height:500px)]:mb-2"><Steps i={step}/></div><div key={step} className="page-in">{closed&&step<3?<Closed/>:body()}</div></main><Foot/></div>}

function Kiosk(){const[go,setGo]=useState(false),{closed}=useStore()
if(!go)return <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-8 bg-ink p-8 text-center text-white">
<h1 className="font-display text-5xl font-bold">Selamat Datang</h1><p className="max-w-xl text-2xl text-slate-200">Sentuh tombol untuk mengisi buku tamu dan menandatangani.</p>
{closed?<p className="rounded-2xl bg-white/10 px-8 py-5 text-2xl">Acara sudah ditutup</p>:<button className="pulse-soft rounded-2xl bg-brass px-12 py-6 text-3xl font-bold text-ink" onClick={()=>setGo(true)}>Mulai</button>}
<Link to="/app" className="rounded-lg border border-white/40 px-4 py-2 text-sm">Keluar demo</Link><Foot dark/></main>
return <Flow kiosk onDone={()=>setGo(false)}/>}

const NAV=[['/app','Dashboard'],['/app/tamu','Data Tamu'],['/app/laporan','Laporan'],['/kiosk','Kiosk Preview'],['/app/tentang','Tentang Demo']]
function Admin(){const loc=useLocation();return <div className="min-h-[100dvh] lg:flex">
<aside className="bg-ink p-4 text-white lg:w-60 lg:shrink-0"><Link to="/" className="mb-1 block"><img src="/logo-white.png" alt="Sumber Rejeki Tech" className="h-8"/></Link><p className="mb-4 text-[11px] text-slate-300">Demo Digital Guestbook</p>
<nav className="flex gap-1 overflow-x-auto lg:flex-col">{NAV.map(([to,l])=><NavLink key={to} to={to} end={to==='/app'} className={({isActive})=>'whitespace-nowrap rounded-lg border-l-[3px] px-3 py-2 text-sm transition '+(isActive?'border-brass bg-white/15 font-semibold text-white':'border-transparent text-slate-300 hover:bg-white/10 hover:text-white')}>{l}</NavLink>)}</nav></aside>
<div className="flex min-w-0 flex-1 flex-col"><header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-5 py-3"><span className="text-sm text-slate-500">Mode demo · data simulasi</span>
<Consult cls={B1+' !py-2 text-sm'}/></header>
<main className="flex-1 space-y-5 p-5"><Guide/><div key={loc.pathname} className="page-in space-y-5"><Outlet/></div></main><div className="border-t border-slate-200 bg-white"><Foot/></div></div>
</div>}

const H=({children}:{children:ReactNode})=><h1 className="font-display text-3xl font-bold text-ink">{children}</h1>
const Acts=()=>{const{acts}=useStore();return <div className={CARD}><h2 className="mb-3 font-semibold">Aktivitas terbaru</h2><ul className="space-y-2 text-sm">{acts.slice(0,6).map(a=><li key={a.id} className="flex justify-between gap-3"><span>{a.text}</span><span className="shrink-0 text-slate-400">{fmt(a.time)}</span></li>)}</ul></div>}

function Dash(){const s=useStats(),{guests,prog,mark,closed}=useStore();useEffect(()=>{if(prog.includes('isi'))mark('dash')},[prog.length]);return <>
<H>Dashboard</H><EventBar/><p className="text-sm text-slate-500">Angka awal adalah contoh dan akan berubah saat Anda menambah data.</p>
<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[['Total tamu',s.total],['Tamu hari ini',s.today],['Tanda tangan terkumpul',s.sig],['Belum tanda tangan',s.nosig]].map(([l,v])=><div key={l as string} className={CARD}><p className="text-sm text-slate-500">{l}</p><p className="mt-1 text-4xl font-bold text-ink"><Num v={v as number}/></p></div>)}</div>
<div className="grid gap-4 lg:grid-cols-2"><Acts/><div className={CARD}><h2 className="mb-3 font-semibold">Tamu terbaru</h2><ul className="divide-y divide-slate-100 text-sm">{guests.slice(0,5).map(g=><li key={g.id} className="flex justify-between py-2"><Link to={'/app/tamu/'+g.id} className="font-medium text-ink hover:underline">{g.name}</Link><span className="text-slate-400">{g.category}</span></li>)}</ul></div></div>
{closed?<span className="flex items-center text-sm text-slate-600"><No/>Acara sudah ditutup</span>:<Link to="/isi" className={B1+' inline-block'}>Isi buku tamu baru</Link>}</>}

function Records(){const{guests,prog,mark}=useStore();useEffect(()=>{if(prog.includes('isi'))mark('tamu')},[prog.length]);const[q,setQ]=useState(''),[c,setC]=useState(''),[p,setP]=useState(0)
const L=guests.filter(g=>(!c||g.category===c)&&(g.name+g.org).toLowerCase().includes(q.toLowerCase())),pages=Math.max(1,Math.ceil(L.length/8)),pg=Math.min(p,pages-1)
return <><H>Data Tamu</H><div className="flex flex-wrap gap-2"><input className={IN+' !w-60'} placeholder="Cari nama atau instansi" value={q} onChange={e=>{setQ(e.target.value);setP(0)}}/>
<select className={IN+' !w-48'} value={c} onChange={e=>{setC(e.target.value);setP(0)}}><option value="">Semua kategori</option>{CATS.map(x=><option key={x}>{x}</option>)}</select>
</div>
<div className={CARD+' overflow-x-auto !p-0'}><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr>{['Nama','Instansi','Kategori','Waktu','TTD'].map(h=><th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">
{L.slice(pg*8,pg*8+8).map(g=><tr key={g.id}><td className="px-4 py-3"><Link to={g.id} className="font-medium text-ink hover:underline">{g.name}</Link></td><td className="px-4 py-3">{g.org}</td><td className="px-4 py-3">{g.category}</td><td className="px-4 py-3 text-slate-500">{fmt(g.time)}</td><td className="px-4 py-3">{g.sig?<Ok/>:<No/>}</td></tr>)}
{!L.length&&<tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">Tidak ada tamu yang cocok. Ubah kata kunci atau filter.</td></tr>}</tbody></table></div>
<div className="flex items-center justify-between text-sm"><span className="text-slate-500">{L.length} tamu</span><div className="flex items-center gap-2"><button className={B2+' !px-3 !py-1'} disabled={pg===0} onClick={()=>setP(pg-1)}>Sebelumnya</button><span>{pg+1} / {pages}</span><button className={B2+' !px-3 !py-1'} disabled={pg>=pages-1} onClick={()=>setP(pg+1)}>Berikutnya</button></div></div></>}

function Detail(){const{id}=useParams(),{guests,update,remove,closed}=useStore(),nav=useNavigate(),g=guests.find(x=>x.id===id),[ed,setEd]=useState(false),[del,setDel]=useState(false)
if(!g)return <><H>Tamu tidak ditemukan</H><Link to="/app/tamu" className={B2+' inline-block'}>Kembali ke data tamu</Link></>
return <><Link to="/app/tamu" className="text-sm text-slate-500">Kembali ke data tamu</Link><H>{g.name}</H><div className={CARD+' max-w-xl space-y-3'}>
{ed?<><input className={IN} value={g.name} maxLength={80} onChange={e=>update(g.id,{name:e.target.value})}/><input className={IN} value={g.org} maxLength={80} onChange={e=>update(g.id,{org:e.target.value})}/><button className={B2+' !py-2'} onClick={()=>setEd(false)}>Selesai</button></>:
<><p>{g.org} · {g.category}</p><p className="text-slate-600">{g.purpose}</p>{g.phone&&<p className="text-sm">Telp: {g.phone}</p>}{g.note&&<p className="text-sm text-slate-500">Catatan: {g.note}</p>}<p className="text-sm text-slate-500">{fmt(g.time)}</p></>}
<div><p className="mb-1 text-sm text-slate-500">Tanda tangan</p>{g.sig?<img src={g.sig} alt={'Tanda tangan '+g.name} className="h-24 rounded-lg border border-slate-200 bg-white p-2"/>:<p className="flex items-center text-slate-500"><No/>Belum ada tanda tangan</p>}</div>
<div className="flex gap-2"><button className={B2+' !py-2'} disabled={closed} onClick={()=>setEd(!ed)}>Edit (simulasi)</button><button className={B2+' !py-2 !text-red-600'} disabled={closed} onClick={()=>setDel(true)}>Hapus (simulasi)</button></div>{closed&&<p className="flex items-center text-sm text-slate-500"><No/>Acara sudah ditutup, data tidak bisa diubah.</p>}</div>{del&&<Confirm title="Hapus tamu ini?" text={'Data '+g.name+' akan dihapus dari daftar. Tindakan ini tidak dapat dibatalkan.'} ok="Hapus" onOk={()=>{remove(g.id);nav('/app/tamu')}} onNo={()=>setDel(false)}/>}</>}

function Reports(){const s=useStats(),{guests,prog,mark}=useStore();useEffect(()=>{if(prog.includes('isi'))mark('laporan')},[prog.length]);const day=[18,26,31,22,38,28,s.today],lb=['-6','-5','-4','-3','-2','-1','Hari ini'],mx=Math.max(...day)
const cat=CATS.map(c=>[c,guests.filter(g=>g.category===c).length] as [string,number])
const safe=(v:string)=>'"'+(/^[=+\-@\t\r]/.test(v)?"'"+v:v).replace(/"/g,'""')+'"'
const dl=()=>{const t='DEMO — SUMBER REJEKI TECH (file contoh)\nNama,Instansi,Kategori,Tujuan\n'+guests.map(g=>[g.name,g.org,g.category,g.purpose].map(safe).join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/csv'}));a.download='demo-laporan.csv';a.click()}
return <><H>Laporan</H><div className="grid gap-4 sm:grid-cols-3">{[['Total tamu',s.total],['Tanda tangan',s.sig],['Tamu hari ini',s.today]].map(([l,v])=><div key={l as string} className={CARD}><p className="text-sm text-slate-500">{l}</p><p className="text-3xl font-bold text-ink"><Num v={v as number}/></p></div>)}</div>
<div className={CARD}><h2 className="mb-4 font-semibold">Kedatangan 7 hari terakhir</h2><div className="flex h-40 items-end gap-3">{day.map((v,i)=><div key={i} className="flex flex-1 flex-col items-center justify-end gap-1"><span className="text-xs text-slate-500">{v}</span><div className="bar-g w-full rounded-t bg-ink" style={{height:Math.max(2,Math.round(v/mx*100))+'px',animationDelay:i*80+'ms'}}/><span className="text-xs text-slate-400">{lb[i]}</span></div>)}</div></div>
<div className="grid gap-4 lg:grid-cols-2"><div className={CARD}><h2 className="mb-3 font-semibold">Kategori tamu</h2>{cat.map(([c,n])=><div key={c} className="mb-2"><div className="flex justify-between text-sm"><span>{c}</span><span>{n}</span></div><div className="h-2 rounded bg-slate-100"><div className="h-2 rounded bg-brass" style={{width:(n/Math.max(1,...cat.map(x=>x[1]))*100)+'%'}}/></div></div>)}</div><Acts/></div>
<button className={B2} onClick={dl}>Unduh file contoh (CSV)</button></>}

function About(){return <><H>Tentang Demo</H><div className={CARD+' max-w-2xl space-y-3 text-slate-600'}><p>Ini demo publik Digital Guestbook & E-Signature dari Sumber Rejeki Tech. Semua data adalah contoh dan hanya tersimpan di browser Anda (sessionStorage).</p>
<ul className="list-disc space-y-1 pl-5"><li>Tidak ada login dan tidak ada data klien.</li><li>Sekali pakai: setelah acara ditutup, buku tamu terkunci dan data hanya bisa dilihat.</li><li>Aplikasi ini untuk satu acara saja ({EVENT.name}); tidak ada fitur menambah acara lain.</li><li>Tidak ada email, WhatsApp, atau database yang terhubung.</li><li>Tanda tangan tidak diunggah ke server.</li><li>Data Anda tidak terlihat oleh pengunjung lain.</li></ul><Consult/></div></>}

