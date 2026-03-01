import{useState,useEffect}from'react';


const storage={
  get:(k,d)=>{if(typeof window==='undefined')return d;try{return JSON.parse(localStorage.getItem('gz:'+k))||d}catch(e){return d}},
  set:(k,v)=>{if(typeof window==='undefined')return;try{localStorage.setItem('gz:'+k,JSON.stringify(v))}catch(e){}}
};

const BASE='https://gen.pollinations.ai/image';


const MODELS={FLUX:'flux',ZIMAGE:'zimage-turbo'};


const RATIOS=[
  {v:'1024x1024',w:1024,h:1024,l:'1:1'},
  {v:'1280x720',w:1280,h:720,l:'16:9'},
  {v:'720x1280',w:720,h:1280,l:'9:16'},
  {v:'1024x768',w:1024,h:768,l:'4:3'},    
  {v:'768x1024',w:768,h:1024,l:'3:4'},     
];

export default function Home(){
  const[prompt,setP]=useState('');
  const[model,setM]=useState(MODELS.FLUX);
  const[ratio,setR]=useState(RATIOS[0].v);
  const[img,setImg]=useState('');
  const[load,setL]=useState(false);
  const[err,setE]=useState('');
  
 
  const API_KEY=process.env.NEXT_PUBLIC_POLLINATIONS_KEY||'';
  const isRegistered=!!API_KEY;
  
  const selR=RATIOS.find(r=>r.v===ratio)||RATIOS[0];
  
  const generate=async()=>{
    if(!prompt.trim())return setE('Enter a prompt');
    
    setL(true);setE('');setImg('');
    
    try{
      const seed=Math.floor(Math.random()*999999);
      const url=`${BASE}/${encodeURIComponent(prompt)}?width=${selR.w}&height=${selR.h}&seed=${seed}&model=${model}&nologo=true${API_KEY?'&key='+API_KEY:''}`;
      
      const res=await fetch(url);
      if(!res.ok){
        const txt=await res.text().catch(()=> '');
        throw new Error(`API ${res.status}: ${txt.slice(0,100)}`);
      }
      
      const buf=await res.arrayBuffer();
      const blob=new Blob([buf],{type:'image/jpeg'});
      const objUrl=URL.createObjectURL(blob);
      setImg(objUrl);
      
      // Simpan ke history
      const hist=storage.get('hist',[]);
      hist.unshift({url:objUrl,prompt,model,ratio,date:Date.now()});
      storage.set('hist',hist.slice(0,100));
      
    }catch(e){
      console.error('Generate error:',e);
      setE(e.message||'Failed to generate');
      if(e.message?.includes('401'))setE('Invalid API key - check Vercel env vars');
      if(e.message?.includes('402'))setE('Insufficient pollen - top up at enter.pollinations.ai');
    }finally{
      setL(false);
    }
  };
  
  const download=()=>{
    if(!img)return;
    const a=document.createElement('a');
    a.href=img;a.download=`dcoba-${Date.now()}.jpg`;
    document.body.appendChild(a);a.click();document.body.removeChild(a);
  };
  
  // ✅ Load theme dari localStorage (hanya di client)
  useEffect(()=>{
    const theme=storage.get('theme','dark');
    document.documentElement.setAttribute('data-theme',theme);
  },[]);
  
  const toggleTheme=()=>{
    const cur=document.documentElement.getAttribute('data-theme');
    const next=cur==='dark'?'light':'dark';
    document.documentElement.setAttribute('data-theme',next);
    storage.set('theme',next);
  };
  
  return(
    <div style={{fontFamily:'system-ui',background:'var(--bg-primary)',color:'var(--text-primary)',minHeight:'100vh'}}>
      {/* Header */}
      <header style={{position:'sticky',top:0,zIndex:50,background:'var(--bg-secondary)',padding:'12px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid var(--border)'}}>
        <div style={{fontWeight:'bold',fontSize:'20px',color:'var(--accent)'}}>DCoba</div>
        <button onClick={toggleTheme} style={{background:'transparent',border:'none',fontSize:'20px',color:'var(--text-primary)'}}>{typeof window!=='undefined'&&document.documentElement.getAttribute('data-theme')==='dark'?'☀️':'🌙'}</button>
      </header>
      
      <main className="container" style={{maxWidth:'500px',margin:'0 auto',padding:'20px'}}>
        {/* Prompt Input */}
        <textarea value={prompt}onChange={e=>setP(e.target.value)}placeholder="Describe your image... "style={{width:'100%',padding:'14px',borderRadius:'12px',border:'2px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)',margin:'15px 0',resize:'vertical',minHeight:'80px'}}/>
        
        {/* Controls */}
        <div style={{display:'flex',gap:'8px',margin:'10px 0'}}>
          <button onClick={()=>setP(['cute cat in space','cyberpunk city at night','magical forest sunrise'][Math.floor(Math.random()*3)])}style={{flex:1,padding:'10px',background:'var(--bg-tertiary)',border:'none',borderRadius:'8px',color:'var(--text-primary)'}}>🎲 Random</button>
          <button onClick={generate}disabled={load||!prompt.trim()}style={{flex:2,padding:'12px',borderRadius:'12px',border:'none',background:load?'#555':'var(--accent)',color:'white',fontWeight:'bold'}}>{load?'⏳ Generating...':'🚀 Generate'}</button>
        </div>
        
       
        <div style={{display:'flex',flexWrap:'wrap',gap:'6px',margin:'10px 0'}}>
          {Object.entries(MODELS).map(([key,val])=>(
            <button key={val}onClick={()=>setM(val)}style={{padding:'8px 14px',borderRadius:'8px',border:'none',background:model===val?'var(--accent)':'var(--bg-tertiary)',color:model===val?'white':'var(--text-primary)',fontSize:'13px'}}>{key.toLowerCase()}</button>
          ))}
        </div>
        
        
        <div style={{display:'flex',gap:'6px',margin:'10px 0',flexWrap:'wrap'}}>
          {RATIOS.map(r=>(<button key={r.v}onClick={()=>setR(r.v)}style={{padding:'6px 12px',borderRadius:'6px',border:'none',background:ratio===r.v?'var(--accent)':'var(--bg-tertiary)',color:ratio===r.v?'white':'var(--text-primary)',fontSize:'12px'}}>{r.l}</button>))}
        </div>
        
        {/* Image Preview */}
        {img&&<div style={{marginTop:'20px',background:'var(--bg-secondary)',borderRadius:'16px',overflow:'hidden'}}><img src={img}alt="Generated"style={{width:'100%',height:'auto',display:'block'}}/><button onClick={download}style={{width:'100%',padding:'14px',background:'transparent',border:'none',borderTop:'1px solid var(--border)',color:'var(--accent)',fontWeight:'bold'}}>📥 Download Image</button></div>}
        
        {/* Error Message */}
        {err&&<p style={{color:'var(--error)',marginTop:'10px',padding:'10px',background:'var(--bg-tertiary)',borderRadius:'8px'}}>❌ {err}</p>}
      </main>
      
      {/* CSS Variables */}
      <style>{`
        :root{--bg-primary:#0f0f1a;--bg-secondary:#1a1a2e;--bg-tertiary:#252540;--text-primary:#fff;--text-secondary:#888;--accent:#00d4ff;--border:#2a2a4a;--error:#ff6b6b}
        [data-theme="light"]{--bg-primary:#f8f9fa;--bg-secondary:#fff;--bg-tertiary:#e9ecef;--text-primary:#1a1a2e;--text-secondary:#666;--accent:#0077cc;--border:#dee2e6;--error:#dc3545}
      `}</style>
    </div>
  )
}
