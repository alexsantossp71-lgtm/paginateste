/** Minimal dependency-free server. The CGU key stays on the server in CGU_API_KEY. */
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
const DATA_FILE = process.env.DATA_FILE || path.join(ROOT, 'data', 'emendas.json');
const MUNICIPIOS = ['Bertioga','Cubatão','Guarujá','Itanhaém','Mongaguá','Peruíbe','Praia Grande','Santos','São Vicente'];
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@baixada.local';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'troque-esta-senha';
const sessions = new Map();
const contentTypes = {'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};
function readData(){ try { return JSON.parse(fs.readFileSync(DATA_FILE,'utf8')); } catch { return []; } }
function writeData(data){ fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true }); fs.writeFileSync(DATA_FILE, JSON.stringify(data,null,2)); }
function json(res,status,payload){ res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}); res.end(JSON.stringify(payload)); }
function body(req){ return new Promise((ok, bad)=>{let out=''; req.on('data',p=>{out+=p;if(out.length>1e6)req.destroy()}); req.on('end',()=>{try{ok(out?JSON.parse(out):{})}catch{bad(new Error('JSON inválido'))}});}); }
function getSession(req){ const id=(req.headers.cookie||'').match(/(?:^|; )bs_session=([^;]+)/)?.[1]; return id && sessions.get(id); }
function requireAdmin(req,res){ if(!getSession(req)){json(res,401,{error:'Autenticação necessária'});return false} return true; }
function safeText(v){return String(v??'').trim();}
function normalize(record, current={}){
 const areaRaw=safeText(record.area||record.nomeFuncao||record.funcao||'Outros').toLowerCase();
 const area=areaRaw.normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes('saude')?'saude':areaRaw.normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes('educa')?'educacao':areaRaw.includes('infra')?'infraestrutura':areaRaw.includes('cultur')?'cultura':'outros';
 return {...current, id: current.id||crypto.randomUUID(), numeroEmenda:safeText(record.numeroEmenda||record.codigoEmenda||record.codigo||'Não informado'), deputado:safeText(record.deputado||record.nomeAutor||record.autor||'Não informado'), partido:safeText(record.partido||record.siglaPartido||'—'), valor:Number(record.valor??record.valorEmpenhado??0), valorEmpenhado:Number(record.valorEmpenhado??record.valor??0), valorLiquidado:Number(record.valorLiquidado??0), valorPago:Number(record.valorPago??0), area, projeto:safeText(record.projeto||record.nomeAcao||record.acao||record.descricao||'Sem descrição'), descricaoCompleta:safeText(record.descricaoCompleta||record.descricao||record.projeto||record.nomeAcao||'Sem descrição'), beneficiarios:safeText(record.beneficiarios||record.favorecido||'Não informado'), municipio:safeText(record.municipio||record.localidadeDoGasto||current.municipio||''), ano:Number(record.ano||new Date().getFullYear()), status:safeText(record.status||'planejamento'), dataAprovacao:safeText(record.dataAprovacao||''), fonte:safeText(record.fonte||current.fonte||'Cadastro administrativo'), atualizadoEm:new Date().toISOString()};
}
function filtered(url){ let list=readData(); const q=(url.searchParams.get('busca')||'').toLowerCase(); const municipio=url.searchParams.get('municipio')||''; const area=url.searchParams.get('area')||''; const ano=url.searchParams.get('ano')||''; if(municipio)list=list.filter(x=>x.municipio===municipio); if(area&&area!=='all')list=list.filter(x=>x.area===area); if(ano)list=list.filter(x=>String(x.ano)===ano); if(q)list=list.filter(x=>Object.values(x).join(' ').toLowerCase().includes(q)); return list; }
async function syncCGU(years){
 if(!process.env.CGU_API_KEY) throw new Error('Defina CGU_API_KEY no ambiente do servidor antes de sincronizar.');
 let imported=0, data=readData();
 for(const ano of years){
  const url=`https://api.portaldatransparencia.gov.br/api-de-dados/emendas?pagina=1&ano=${encodeURIComponent(ano)}`;
  const response=await fetch(url,{headers:{'chave-api-dados':process.env.CGU_API_KEY,accept:'application/json'}});
  if(!response.ok) throw new Error(`Portal da Transparência respondeu ${response.status} para ${ano}.`);
  const rows=await response.json();
  for(const row of rows){ const location=safeText(row.localidadeDoGasto||row.municipio||''); const municipio=MUNICIPIOS.find(m=>location.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(m.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase())); if(!municipio)continue; const candidate=normalize({...row,municipio,fonte:'Portal da Transparência / CGU'}); const i=data.findIndex(x=>x.numeroEmenda===candidate.numeroEmenda&&x.municipio===municipio); if(i>=0)data[i]=candidate;else data.push(candidate); imported++; }
 }
 writeData(data); return imported;
}
const server=http.createServer(async(req,res)=>{
 const url=new URL(req.url,`http://${req.headers.host}`);
 try {
  if(req.method==='GET'&&url.pathname==='/api/config') return json(res,200,{municipios:MUNICIPIOS,adminConfigured:ADMIN_PASSWORD!=='troque-esta-senha'});
  if(req.method==='GET'&&url.pathname==='/api/emendas') return json(res,200,{items:filtered(url),total:filtered(url).length});
  if(req.method==='GET'&&url.pathname==='/api/estatisticas'){ const x=filtered(url), total=x.reduce((a,e)=>a+(e.valorEmpenhado||e.valor||0),0); return json(res,200,{totalEmendas:x.length,totalDeputados:new Set(x.map(e=>e.deputado)).size,valorEmpenhado:total,valorPago:x.reduce((a,e)=>a+(e.valorPago||0),0),emExecucao:x.filter(e=>e.status==='em-execucao').length,ultimaAtualizacao:x.map(e=>e.atualizadoEm).sort().at(-1)||null}); }
  if(req.method==='GET'&&url.pathname==='/api/auth/me') return json(res,200,{authenticated:!!getSession(req),email:getSession(req)?.email||null});
  if(req.method==='POST'&&url.pathname==='/api/auth/login'){const p=await body(req); if(p.email===ADMIN_EMAIL&&p.password===ADMIN_PASSWORD){const id=crypto.randomUUID();sessions.set(id,{email:ADMIN_EMAIL,expires:Date.now()+86400000});res.writeHead(204,{'Set-Cookie':`bs_session=${id}; HttpOnly; SameSite=Lax; Path=/; Max-Age=86400`});return res.end()}return json(res,401,{error:'E-mail ou senha inválidos'});}
  if(req.method==='POST'&&url.pathname==='/api/auth/logout'){const id=(req.headers.cookie||'').match(/bs_session=([^;]+)/)?.[1];sessions.delete(id);res.writeHead(204,{'Set-Cookie':'bs_session=; HttpOnly; Path=/; Max-Age=0'});return res.end()}
  if(url.pathname.startsWith('/api/admin/')){ if(!requireAdmin(req,res))return; if(req.method==='POST'&&url.pathname==='/api/admin/emendas'){const p=await body(req), d=readData(), e=normalize(p); if(!MUNICIPIOS.includes(e.municipio))return json(res,422,{error:'Selecione um município da Baixada Santista.'});d.push(e);writeData(d);return json(res,201,e)} if(req.method==='PUT'&&url.pathname.startsWith('/api/admin/emendas/')){const id=decodeURIComponent(url.pathname.split('/').pop()),p=await body(req),d=readData(),i=d.findIndex(e=>String(e.id)===id);if(i<0)return json(res,404,{error:'Emenda não encontrada'});d[i]=normalize(p,d[i]);writeData(d);return json(res,200,d[i])} if(req.method==='DELETE'&&url.pathname.startsWith('/api/admin/emendas/')){const id=decodeURIComponent(url.pathname.split('/').pop()),d=readData().filter(e=>String(e.id)!==id);writeData(d);return json(res,204,{})} if(req.method==='POST'&&url.pathname==='/api/admin/sincronizar'){const p=await body(req);const count=await syncCGU((p.anos||[new Date().getFullYear()]).map(Number));return json(res,200,{importadas:count});}}
  if(req.method==='GET') { let file=url.pathname==='/'?'/index.html':url.pathname; file=path.normalize(file).replace(/^[/\\]+/,''); const full=path.join(ROOT,file); if(!full.startsWith(ROOT)||!fs.existsSync(full)||fs.statSync(full).isDirectory())return json(res,404,{error:'Não encontrado'});res.writeHead(200,{'Content-Type':contentTypes[path.extname(full)]||'application/octet-stream'});return fs.createReadStream(full).pipe(res); }
  return json(res,404,{error:'Não encontrado'});
 }catch(error){console.error(error);return json(res,500,{error:error.message||'Erro interno'});}
});
server.listen(PORT,'0.0.0.0',()=>console.log(`Observatório disponível em http://0.0.0.0:${PORT}`));
