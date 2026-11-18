import {createContext,useContext,useEffect,useState,ReactNode} from 'react'
export type Guest={id:string;name:string;org:string;category:string;purpose:string;time:string;sig?:string;phone?:string;note?:string}
export type Act={id:string;text:string;time:string}
export const CATS=['Tamu Undangan','VIP','Mitra','Media','Umum']
const mkSig=(i:number)=>{const a=8+(i%5)*5;return 'data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"><path d="M10 ${55-a} C40 ${a} 60 ${95-a} 90 45 S140 ${15+a} 190 60" fill="none" stroke="#011F59" stroke-width="3" stroke-linecap="round"/></svg>`)}
const N=['Andi Pratama','Siti Maharani','Budi Santoso','Nadia Putri','Raka Wijaya','Dewi Lestari','Fajar Nugroho','Maya Anggraini','Rizky Ramadhan','Putri Amelia','Hendra Gunawan','Lina Marlina']
const O=['PT Contoh Abadi','CV Maju Bersama','Instansi Demo','Komunitas Sampel','Media Contoh']
const P=['Menghadiri acara','Kunjungan kerja','Pertemuan bisnis','Meliput acara']
const mk=(i:number):Guest=>{const d=new Date();d.setHours(8,0,0,0);if(i<10)d.setMinutes(i*12);else d.setDate(d.getDate()-1-Math.floor((i-10)/6));
return{id:'s'+i,name:N[i%12],org:O[i%5],category:CATS[i%5],purpose:P[i%4],time:d.toISOString(),sig:i%8===7?undefined:mkSig(i)}}
export const SEED:Guest[]=Array.from({length:24},(_,i)=>mk(i))
const isToday=(t:string)=>new Date(t).toDateString()===new Date().toDateString()
type S={guests:Guest[];acts:Act[];prog?:string[];closed?:boolean}
const init=():S=>({guests:SEED,acts:[{id:'a0',text:'Demo dimulai dengan data contoh',time:new Date().toISOString()}],prog:[],closed:false})
type C=S&{closed:boolean;close:()=>void;prog:string[];mark:(k:string)=>void;add:(g:Omit<Guest,'id'|'time'>)=>Guest;update:(id:string,p:Partial<Guest>)=>void;remove:(id:string)=>void}
const Ctx=createContext<C>(null as any)
export const useStore=()=>useContext(Ctx)
export function useStats(){const{guests}=useStore();const sig=guests.filter(g=>g.sig).length,today=guests.filter(g=>isToday(g.time)).length
const s0=SEED.filter(g=>g.sig).length,t0=SEED.filter(g=>isToday(g.time)).length
return{total:180-SEED.length+guests.length,today:45-t0+today,sig:170-s0+sig,nosig:(180-SEED.length+guests.length)-(170-s0+sig)}}
export function Store({children}:{children:ReactNode}){
const[s,setS]=useState<S>(()=>{try{const r=sessionStorage.getItem('srt-guestbook-demo-v2');if(r)return JSON.parse(r)}catch{}return init()})
useEffect(()=>{try{sessionStorage.setItem('srt-guestbook-demo-v2',JSON.stringify(s))}catch{}},[s])
const act=(a:Act[],t:string)=>[{id:crypto.randomUUID(),text:t,time:new Date().toISOString()},...a].slice(0,30)
const v:C={...s,closed:!!s.closed,close:()=>setS(p=>({...p,closed:true,acts:act(p.acts,'Acara ditutup, buku tamu terkunci')})),prog:s.prog||[],mark:k=>setS(p=>(p.prog||[]).includes(k)?p:{...p,prog:[...(p.prog||[]),k]}),
add:g=>{const n={...g,id:crypto.randomUUID(),time:new Date().toISOString()};setS(p=>({...p,guests:[n,...p.guests],prog:(p.prog||[]).includes('isi')?p.prog:[...(p.prog||[]),'isi'],acts:act(p.acts,`${n.name} mengisi buku tamu`)}));return n},
update:(id,u)=>setS(p=>({...p,guests:p.guests.map(g=>g.id===id?{...g,...u}:g)})),
remove:id=>setS(p=>({...p,guests:p.guests.filter(g=>g.id!==id),acts:act(p.acts,'Data tamu dihapus (simulasi)')}))}
return <Ctx.Provider value={v}>{children}</Ctx.Provider>}
