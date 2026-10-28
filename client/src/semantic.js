// Lightweight offline, deterministic, rights-safe redundancy. No AI and no invented word strings.
// Inferred compounds require the remote semantic engine; offline returns no result for them.
const norm=v=>String(v||'').normalize('NFKC').toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu,' ').replace(/\s+/g,' ');
const risky=new Set(['politician','actor','musician','historical_person','fictional_character']);
export function resolveLocalRedundancy(a,b){
 if(!a||!b)return null;
 if(a.id===b.id)return a.id;
 if(risky.has(a.category)||risky.has(b.category)||a.category!==b.category)return null;
 const na=norm(a.name),nb=norm(b.name);
 if(na&&na===nb)return a.id;
 // Only a strict whole-word specialization may dominate the generic ingredient.
 if(na.length>=4&&nb.startsWith(na+' ')&&!/^(ultra|mega|super|ultimate|god|dark)\b/.test(nb))return b.id;
 if(nb.length>=4&&na.startsWith(nb+' ')&&!/^(ultra|mega|super|ultimate|god|dark)\b/.test(na))return a.id;
 if(na.length>=4&&nb.endsWith(' '+na))return b.id;
 if(nb.length>=4&&na.endsWith(' '+nb))return a.id;
 return null;
}
