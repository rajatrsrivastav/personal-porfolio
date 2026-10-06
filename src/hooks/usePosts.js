import { useEffect, useState } from 'react';
export default function usePosts() {
  const [state,setState]=useState({posts:[],loading:true,error:''});
  useEffect(()=>{
    const controller=new AbortController();
    const refresh=()=>fetch('/api/posts',{signal:controller.signal}).then(r=>{if(!r.ok) throw new Error('Unable to load posts'); return r.json();}).then(posts=>setState({posts:posts.filter(p=>p.status==='published' && (!p.publishedAt || Date.parse(p.publishedAt)<=Date.now())),loading:false,error:''})).catch(e=>{if(e.name!=='AbortError') setState({posts:[],loading:false,error:'Unable to load posts. Please try again later.'});});
    refresh();
    window.addEventListener('focus',refresh);
    const timer=setInterval(refresh,15000);
    return ()=>{controller.abort();window.removeEventListener('focus',refresh);clearInterval(timer);};
  },[]);
  return state;
}
