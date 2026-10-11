'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createDraftSaver } from '../utils/draftSaver';
import Link from 'next/link';
import Markdown from '../components/Markdown';
import AutoGrowTextarea from '../components/AutoGrowTextarea';
const slugify=s=>s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const recoveryKey = 'portfolio-editor-draft';
const blank=()=>({title:'',slug:'',category:'',readTime:'5 min read',excerpt:'',content:'',status:'draft',publishedAt:null});
export default function AdminPage(){
  const [session,setSession]=useState('checking'),[key,setKey]=useState(''),[posts,setPosts]=useState([]),[message,setMessage]=useState(''),[busy,setBusy]=useState(false),[filter,setFilter]=useState('all');
  const [editor,setEditor]=useState(false),[form,setForm]=useState(blank),[id,setId]=useState(null),[preview,setPreview]=useState(false),[manualSlug,setManualSlug]=useState(false),[dirty,setDirty]=useState(false);
  const saverRef = useRef(null), formRef = useRef(null), timerRef = useRef(null);
  const [saveState, setSaveState] = useState('Drafts save automatically as you write.');
  const request=useCallback(async(path,options={})=>{const r=await fetch(path,{credentials:'same-origin',...options});const data=await r.json();if(!r.ok){if(r.status===401)setSession('login');throw new Error(data.error || 'Request failed');}return data;}, []);
  const load=async()=>setPosts(await request('/api/posts?all=true'));
  useEffect(()=>{let active=true;fetch('/api/admin/verify').then(async r=>{if(!r.ok){if(active)setSession('login');return;}const response=await fetch('/api/posts?all=true');const data=await response.json();if(!response.ok)throw new Error(data.error);if(active){setPosts(data);setSession('authenticated');}}).catch(()=>{if(active){setSession('login');setMessage('Unable to connect to the blog server.');}});return()=>{active=false;};},[]);
  useEffect(()=>{if(!dirty)return;const warn=e=>{e.preventDefault();e.returnValue='';};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[dirty]);
  const run=async action=>{setBusy(true);setMessage('');try{await action();}catch(e){setMessage(e.message);}finally{setBusy(false);}};
  const login=e=>{e.preventDefault();run(async()=>{await request('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({passkey:key})});setKey('');await load();setSession('authenticated');});};
  const open = useCallback((post, recovered = false) => {
    clearTimeout(timerRef.current);
    const initial = post ? {...blank(), ...post, ...post.draft, category:post.draft?.category ?? post.category ?? post.topic ?? '', excerpt:post.draft?.excerpt ?? post.excerpt ?? post.description ?? ''} : blank();
    setId(post?.id || null); setForm(initial); setManualSlug(Boolean(post?.slug));
    setPreview(false); setDirty(recovered); setEditor(true); setMessage('');
    setSaveState(recovered ? 'Recovered draft. Saving…' : 'Drafts save automatically as you write.');
    formRef.current = initial;
    saverRef.current = createDraftSaver({
      id: post?.id, published: post?.status === 'published', request,
      onSaved(record, snapshot, publish) {
        setId(record.id);
        setPosts(items => [record, ...items.filter(item => item.id !== record.id)]);
        // Keep edits typed during the request pending for the next autosave.
        if (JSON.stringify(formRef.current) === JSON.stringify(snapshot)) {
          const current = {...snapshot, status: record.status};
          formRef.current = current;
          setForm(current); setDirty(false);
          setSaveState(publish ? 'Post published.' : 'Draft saved automatically.');
          try { localStorage.removeItem(recoveryKey); } catch { /* Server copy is saved. */ }
        } else {
          try { localStorage.setItem(recoveryKey, JSON.stringify({id: record.id, form: formRef.current})); } catch { /* Keep server saving active. */ }
        }
      },
    });
  }, [request]);
  useEffect(() => {
    if (session !== 'authenticated') return;
    try {
      const stored = JSON.parse(localStorage.getItem(recoveryKey) || 'null');
      if (stored?.form) open({...stored.form, id:stored.id}, true);
    } catch { /* Invalid or unavailable recovery storage must not block editing. */ }
  }, [session, open]);
  const change = (field, value) => {
    setDirty(true); setSaveState('Changes pending…');
    if (field === 'slug') setManualSlug(true);
    const next = {...formRef.current, [field]:value, ...(field === 'title' && !manualSlug ? {slug:slugify(value)} : {})};
    formRef.current = next; setForm(next);
  };
  const persist = useCallback(async (snapshot, publish = false) => {
    if (!saverRef.current) return;
    setSaveState(publish ? 'Publishing…' : 'Saving draft…');
    try { return await saverRef.current.save(snapshot, publish); }
    catch (error) { setSaveState('Draft could not be saved. Your changes are kept in this browser.'); setMessage(error.message); throw error; }
  }, []);
  useEffect(() => {
    if (!editor || !dirty || session !== 'authenticated' || busy) return;
    try { localStorage.setItem(recoveryKey, JSON.stringify({id, form})); } catch { /* Autosave still writes to the server. */ }
    timerRef.current = setTimeout(() => { persist(form).catch(() => {}); }, 800);
    return () => clearTimeout(timerRef.current);
  }, [form, id, editor, dirty, session, busy, persist]);
  const leave = () => run(async () => {
    clearTimeout(timerRef.current);
    if (dirty) await persist(form);
    setEditor(false);
  });
  const save = () => run(async () => {
    clearTimeout(timerRef.current);
    await persist(form, true);
    setDirty(false); setEditor(false); setMessage('Post published.');
  });
  const toggle=post=>run(async()=>{await request(`/api/posts/${encodeURIComponent(post.id)}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({...(post.status==='draft'?post.draft:{}),status:post.status==='published'?'draft':'published',...(post.status==='draft'?{publishedAt:new Date().toISOString()}:{})})});await load();setMessage('Post status updated.');});
  const remove=post=>{if(window.confirm(`Permanently delete “${post.title}”? This cannot be undone.`))run(async()=>{await request(`/api/posts/${encodeURIComponent(post.id)}`,{method:'DELETE'});await load();setMessage('Post deleted.');});};
  const logout=()=>run(async()=>{clearTimeout(timerRef.current);if(dirty)await persist(form);await request('/api/admin/logout',{method:'POST'});setSession('login');setPosts([]);setEditor(false);setDirty(false);setForm(blank());});
  const published=posts.filter(p=>p.status==='published').length;
  return <main className="blog-page cms-page"><div className="blog-shell admin-shell"><Link className="blog-back" href="/">← Portfolio</Link><header className="cms-header"><div><span className="cms-label">EDITORIAL STUDIO</span><h1 className="font-serif">Dispatches CMS</h1></div>{session==='authenticated'&&<button disabled={busy} onClick={logout}>Log out</button>}</header>
    {session==='checking'?<p role="status">Checking session…</p>:session==='login'?<form className="cms-card cms-login" onSubmit={login}><h2>Welcome back</h2><p>Sign in to manage your dispatches.</p><label>Admin passkey<input type="password" autoComplete="current-password" required value={key} onChange={e=>setKey(e.target.value)}/></label><button className="cms-primary" disabled={busy}>{busy?'Signing in…':'Sign in'}</button></form>:<><div className="cms-stats"><span>{posts.length} total</span><span>{published} published</span><span>{posts.length-published} drafts</span></div>
    {editor?<section className="cms-card"><div className="cms-toolbar"><h2>{id?'Edit post':'New post'}</h2><button disabled={busy} onClick={leave}>← Back to posts</button></div><p className="cms-hint" role="status" aria-live="polite">{saveState}</p><form onSubmit={e=>{e.preventDefault();save();}}><div className="cms-fields">{['title','slug','category','readTime','excerpt'].map(field=><label key={field}>{({title:'Title',slug:'URL slug',category:'Category',readTime:'Read time',excerpt:'Excerpt'})[field]}<input disabled={busy} required maxLength={field==='excerpt'?1000:200} value={form[field]} onChange={e=>change(field,e.target.value)}/></label>)}</div><button disabled={busy} type="button" onClick={()=>{setManualSlug(false);change('slug',slugify(form.title));setManualSlug(false);}}>Generate slug from title</button><div className="cms-toolbar"><div><button type="button" aria-pressed={!preview} onClick={()=>setPreview(false)}>Write</button> <button type="button" aria-pressed={preview} onClick={()=>setPreview(true)}>Preview</button></div><span className="cms-label">MARKDOWN</span></div>{preview?<div className="cms-preview"><Markdown content={form.content || 'Your preview will appear here.'}/></div>:<label>Content<AutoGrowTextarea disabled={busy} required rows={12} value={form.content} onChange={e=>change('content',e.target.value)}/></label>}<div className="cms-actions"><button className="cms-primary" disabled={busy} type="submit">{busy?'Publishing…':form.status==='published'?'Publish Changes':'Publish Post'}</button><button disabled={busy} type="button" onClick={leave}>Back to posts</button></div></form></section>:<><div className="cms-toolbar"><nav aria-label="Filter posts">{['all','published','draft'].map(value=><button key={value} aria-pressed={filter===value} onClick={()=>setFilter(value)}>{value==='all'?'All':value==='draft'?'Drafts':'Published'}</button>)}</nav><div>{dirty&&<button onClick={()=>setEditor(true)}>Resume unsaved post</button>} <button className="cms-primary" disabled={busy} onClick={()=>run(async()=>{clearTimeout(timerRef.current);if(dirty)await persist(form);open();})}>New Post</button></div></div><div className="cms-card cms-list">{posts.filter(p=>filter==='all'||p.status===filter).map(post=><article className="cms-row" key={post.id}><div className="cms-post-title"><h2>{post.draft?.title || post.title || "Untitled draft"}</h2><code>/blog/{post.slug}</code><div className="cms-meta"><span>{post.category || post.topic || 'Uncategorized'}</span><span>{post.readTime}</span></div></div><div><span className={`cms-status ${post.status}`}>{post.status==='published'?'Published':'Draft'}</span><p className="cms-date">Updated {(post.updatedAt || post.createdAt) || 'Date unavailable'}</p></div><div className="cms-actions"><button disabled={busy} onClick={()=>run(async()=>{clearTimeout(timerRef.current);if(dirty)await persist(form);open(post);})}>Edit</button><button disabled={busy} onClick={()=>toggle(post)}>{post.status==='published'?'Unpublish':'Publish'}</button><button className="cms-delete" disabled={busy} onClick={()=>remove(post)}>Delete</button>{post.status==='published'&&<Link href={`/blog/${post.slug}`}>View ↗</Link>}</div></article>)}{!posts.some(p=>filter==='all'||p.status===filter)&&<div className="cms-empty"><h2>No posts here yet.</h2><p>Create a dispatch to get started.</p></div>}</div></> }</>}
    <p role="status" aria-live="polite" className="cms-message">{message}</p></div></main>;
}
