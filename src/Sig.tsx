import {useRef,useState,PointerEvent} from 'react'
type P={x:number;y:number}
export default function Sig({onChange,tall}:{onChange?:(d:string)=>void;tall?:boolean}){
const ref=useRef<HTMLCanvasElement>(null),cur=useRef<P[]|null>(null),[s,setS]=useState<P[][]>([])
const draw=(st:P[][])=>{const c=ref.current!,x=c.getContext('2d')!;x.clearRect(0,0,c.width,c.height);x.lineWidth=3.5;x.lineCap='round';x.lineJoin='round';x.strokeStyle='#011F59'
st.forEach(l=>{x.beginPath();l.forEach((p,i)=>i?x.lineTo(p.x,p.y):x.moveTo(p.x,p.y));if(l.length===1)x.lineTo(l[0].x+.1,l[0].y);x.stroke()})}
const pos=(e:PointerEvent):P=>{const c=ref.current!,r=c.getBoundingClientRect();return{x:(e.clientX-r.left)*c.width/r.width,y:(e.clientY-r.top)*c.height/r.height}}
const commit=(st:P[][])=>{setS(st);draw(st);onChange?.(st.length?ref.current!.toDataURL('image/png'):'')}
return <div>
<canvas ref={ref} width={900} height={tall?420:320} aria-label="Area tanda tangan" style={{touchAction:'none',maxHeight:'min(55dvh,420px)'}}
className="mx-auto block max-w-full cursor-crosshair rounded-2xl border-2 border-dashed border-slate-300 bg-white"
onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);cur.current=[pos(e)];draw([...s,cur.current])}}
onPointerMove={e=>{if(!cur.current)return;cur.current.push(pos(e));draw([...s,cur.current])}}
onPointerUp={()=>{if(!cur.current)return;const st=[...s,cur.current];cur.current=null;commit(st)}}
onPointerCancel={()=>{cur.current=null;draw(s)}}/>
<div className="mt-3 flex gap-2">
<button type="button" disabled={!s.length} onClick={()=>commit(s.slice(0,-1))} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium disabled:opacity-40">Urungkan</button>
<button type="button" disabled={!s.length} onClick={()=>commit([])} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium disabled:opacity-40">Hapus tanda tangan</button></div></div>}
