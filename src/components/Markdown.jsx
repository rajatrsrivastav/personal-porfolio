'use client';

// React text nodes escape HTML; authored markup never enters innerHTML.
function Code({ text }) {
  return <pre><code>{text.split(/(\b(?:const|let|return|function|import|export|if|else|async|await|class|def|package|func)\b|"[^"\n]*"|'[^'\n]*'|\b\d+\b)/g).map((s,i)=><span key={i} className={/^(const|let|return|function|import|export|if|else|async|await|class|def|package|func)$/.test(s)?'syntax-keyword':/^['"]/.test(s)?'syntax-string':/^\d+$/.test(s)?'syntax-number':undefined}>{s}</span>)}</code></pre>;
}
function Inline({text}) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|\[[^\]]+\]\(https?:\/\/[^)]+\))/g).map((part,i)=>{
    if(part.startsWith('**')) return <strong key={i}>{part.slice(2,-2)}</strong>;
    if(part.startsWith('`')) return <code key={i}>{part.slice(1,-1)}</code>;
    if(part.startsWith('*')) return <em key={i}>{part.slice(1,-1)}</em>;
    const link=part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if(link) return <a key={i} href={link[2]} rel="noopener noreferrer">{link[1]}</a>;
    return part;
  });
}
export default function Markdown({ content }) {
  return <div className="blog-prose">{content.split(/(```[\s\S]*?```)/g).map((block,i)=>{
    if(block.startsWith('```')) return <Code key={i} text={block.replace(/^```[^\n]*\n?/,'').replace(/```$/,'')} />;
    return block.split(/\n\s*\n/).filter(Boolean).map((p,j)=>{
      const match=p.match(/^(#{1,6})\s+(.+)$/);
      if(match){ const H=`h${match[1].length}`;return <H key={`${i}-${j}`}><Inline text={match[2]}/></H>; }
      if(p.split('\n').every(l=>/^[-*] /.test(l))) return <ul key={`${i}-${j}`}>{p.split('\n').map((l,k)=><li key={k}><Inline text={l.slice(2)}/></li>)}</ul>;
      if(p.split('\n').every(l=>/^> ?/.test(l))) return <blockquote key={`${i}-${j}`}>{p.split('\n').map(l=>l.replace(/^> ?/,'')).join('\n')}</blockquote>;
      return <p style={{whiteSpace:'pre-wrap'}} key={`${i}-${j}`}><Inline text={p}/></p>;
    });
  })}</div>;
}
