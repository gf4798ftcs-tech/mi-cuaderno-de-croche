const $=id=>document.getElementById(id);
const COLORS=["Otros","Amarillo claro","Amarillo oscuro","Azul claro","Azul oscuro","Beige claro","Beige oscuro","Blanco claro","Blanco oscuro","Gris claro","Gris oscuro","Marrón claro","Marrón oscuro","Negro claro","Negro oscuro","Naranja claro","Naranja oscuro","Rosa claro","Rosa oscuro","Rojo claro","Rojo oscuro","Verde claro","Verde oscuro","Violeta claro","Violeta oscuro"];
const KEY="mi-cuaderno-croche-projects-v2", OLDKEY="mi-cuaderno-croche-v1";
const SYMBOLS=[
["Anillo mágico (MR)","am","ring"],["Punto bajo (pb)","pb","x"],["Medio punto alto (mpa)","mpa","t"],["Punto alto (pa)","pa","t1"],["Punto deslizado (pd)","pd","dot"],["Aumento","aum","plus"],["Disminución","dism","join"],["Cadeneta","cad","oval"],
["Doble punto alto","dpa","t2"],["Triple punto alto","tpa","t3"],["Punto alto triple","tpa triple","t4"],["Punto alto doble","tpa doble","t5"],["Punto alto triple doble","tpa triple doble","t6"],["Anillo deslizado","ad","ring2"],["Anillo de inicio","ai","ring3"],
["Punto bajo en relieve adelante","pb rel. ad.","rel1"],["Punto bajo en relieve atrás","pb rel. at.","rel2"],["Medio punto alto en relieve adelante","mpa rel. ad.","rel3"],["Medio punto alto en relieve atrás","mpa rel. at.","rel4"],["Punto alto en relieve adelante","pa rel. ad.","rel5"],["Punto alto en relieve atrás","pa rel. at.","rel6"],["Punto cangrejo","pc","crab"],
["2 puntos altos juntos","2 pa juntos","join2"],["3 puntos altos juntos","3 pa juntos","join3"],["Punto alto doble cruzado","pa doble cruzado","cross"],["2 puntos altos dobles juntos","2 pa dobles juntos","join4"],["3 puntos altos dobles juntos","3 pa dobles juntos","join5"],["Punto alto triple cruzado","pa triple cruzado","cross2"],["2 puntos altos triples juntos","2 pa triples juntos","join6"],
["V de puntos altos","V pa","v"],["V de puntos altos con cadeneta","V pa con cad","vc"],["W de puntos altos","W pa","w"],["W de puntos altos con cadeneta","W pa con cad","wc"],["Punto popcorn","pop","pop"],["Punto piña","piña","pine"],["Punto abanico","abanico","fan"],
["Punto picot","picot","picot"],["Punto picot con cadeneta","picot con cad","picot2"],["Punto bajo con cadeneta","pb con cad","chainx"],["Cruz de cadenetas","cruz de cad","chaincross"],["Arco de cadenetas","arco de cad","arc"],["Dirección del tejido","dirección","arrow"],["Repetir de * a *","repetir","repeat"],["Inicio del trabajo","inicio","start"],["Final del trabajo","final","end"],["Unir con punto deslizado","unir","joinmark"],["Tomar solo hebra delantera","hd","front"],["Tomar solo hebra trasera","ht","back"],["Tomar ambas hebras","ambas","both"],["2 cadenetas","2 cad","2oval"]
];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function fresh(name="Mi primer amigurumi"){return {project:name,round:1,initial:0,stitch:"Anillo mágico (MR)",operation:"Aumentos",quantity:6,counter:0,color:"Otros",customColor:"",history:[],tabCounter:0}}
let projects={},activeId="p1";
try{let d=JSON.parse(localStorage.getItem(KEY));if(d&&d.projects){projects=d.projects;activeId=d.activeId||Object.keys(projects)[0]}}catch(e){}
if(!Object.keys(projects).length){let old;try{old=JSON.parse(localStorage.getItem(OLDKEY))}catch(e){};projects={p1:old||fresh()};activeId="p1";saveAll()}
let state=projects[activeId]||fresh();
let activeTab="Vueltas";
function saveAll(){if(state&&activeId)projects[activeId]=state;localStorage.setItem(KEY,JSON.stringify({projects,activeId}))}
function calc(){let p=Number(state.initial)||0,q=Math.max(0,Math.floor(Number(state.quantity)||0)),op=state.operation,first=state.round===1,valid=true,total=0,dist="";
 if(first){valid=q>0;total=q;dist=`Anillo mágico: ${q} pb`}
 else if(op==="Mantener"){total=p;dist=`Mantener ${p} pb`}
 else if(op==="Cadenetas"){valid=q>0;total=p+q;dist=`${q} cadenetas`}
 else if(op==="Aumentos"){valid=q>0&&p%q===0;total=p+q;dist=valid?`(${p/q-1} pb + 1 aumento) × ${q}`:""}
 else{valid=q>0&&p%q===0&&p/q>=2;total=p-q;dist=valid?`(${p/q-2} pb + 1 disminución) × ${q}`:""}
 return{valid,total,dist,first}}
function svg(kind){let s='<svg viewBox="0 0 48 48" fill="none" stroke="#f4dfc4" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">';
 const line=(x1,y1,x2,y2)=>`<path d="M${x1} ${y1}L${x2} ${y2}"/>`;
 if(kind==="oval"||kind==="2oval")s+=kind==="2oval"?'<ellipse cx="15" cy="24" rx="10" ry="5"/><ellipse cx="34" cy="24" rx="10" ry="5"/>':'<ellipse cx="24" cy="24" rx="15" ry="7"/>';
 else if(kind==="dot")s+='<circle cx="24" cy="24" r="5" fill="#f4dfc4"/>';
 else if(kind==="plus")s+=line(24,10,24,38)+line(10,24,38,24);
 else if(kind==="x")s+=line(14,14,34,34)+line(34,14,14,34);
 else if(kind.startsWith("t")){s+=line(24,12,24,39)+line(12,12,36,12);let n=kind==="t"?0:kind==="t1"?1:kind==="t2"?2:kind==="t3"?3:4;for(let i=0;i<n;i++)s+=line(18,19+i*5,30,19+i*5)}
 else if(kind==="ring"||kind==="ring2"||kind==="ring3")s+='<ellipse cx="24" cy="24" rx="10" ry="14"/>'+line(14,24,34,24)+(kind==="ring2"?line(24,10,24,38):'');
 else if(kind==="v"||kind==="vc"||kind==="w"||kind==="wc"||kind==="fan") {let n=kind.startsWith("w")?3:kind==="fan"?5:2;for(let i=0;i<n;i++){let x=24+(i-(n-1)/2)*9;s+=line(24,36,x,13)}if(kind.endsWith("c"))s+='<ellipse cx="24" cy="8" rx="5" ry="2"/>'; }
 else if(kind.startsWith("join")){let n=kind==="join2"?2:kind==="join3"?3:4;for(let i=0;i<n;i++){let x=24+(i-(n-1)/2)*9;s+=line(x,10,24,36)}s+=line(17,36,31,36)}
 else if(kind.startsWith("rel"))s+='<path d="M13 14 Q24 2 35 14 Q24 26 13 14Z"/>'+line(24,14,24,40);
 else if(kind==="cross"||kind==="cross2")s+=line(12,12,36,38)+line(36,12,12,38)+line(24,8,24,40);
 else if(kind==="crab")s+=line(24,8,24,39)+line(14,12,34,12)+line(16,22,32,22)+line(18,32,30,32);
 else if(kind==="pop"||kind==="pine")s+='<ellipse cx="24" cy="24" rx="10" ry="16"/><path d="M16 18 Q24 8 32 18 M16 25 Q24 15 32 25 M16 32 Q24 22 32 32"/>';
 else if(kind==="picot"||kind==="picot2")s+='<path d="M12 34 L24 12 L36 34 Z"/>'+(kind==="picot2"?'<ellipse cx="37" cy="12" rx="7" ry="3"/>':'');
 else if(kind==="chainx")s+=line(10,24,38,24)+'<ellipse cx="24" cy="12" rx="6" ry="3"/>';
 else if(kind==="chaincross")s+='<path d="M24 8 C9 8 9 20 24 24 C39 28 39 40 24 40 C9 40 9 28 24 24 C39 20 39 8 24 8Z"/>';
 else if(kind==="arc")s+='<path d="M7 30 Q24 4 41 30"/>';
 else if(kind==="arrow")s+=line(7,24,40,24)+line(31,15,40,24)+line(31,33,40,24);
 else if(kind==="repeat")s+='<text x="24" y="31" text-anchor="middle" fill="#f4dfc4" stroke="none" font-size="25">*</text>';
 else if(kind==="start")s+='<path d="M12 10 L38 24 L12 38 Z" fill="#f4dfc4"/>';
 else if(kind==="end")s+='<rect x="15" y="15" width="18" height="18" fill="#f4dfc4"/>';
 else if(kind==="front"||kind==="back"||kind==="both")s+='<path d="M7 27 Q24 5 41 27"/>'+(kind!=="back"?line(7,34,41,34):'')+(kind!=="front"?line(7,39,41,39):'');
 else if(kind==="joinmark")s+='<path d="M10 24 Q24 5 38 24" />'+line(24,24,32,32);
 else s+='<path d="M10 34 Q24 8 38 34"/>'+line(12,34,36,34);
 return s+'</svg>'}
function renderSymbols(){$("symbolsList").innerHTML=SYMBOLS.map(([name,abbr,kind])=>`<div class="symbol-card">${svg(kind)}<b>${esc(name)}</b><small>(${esc(abbr)})</small></div>`).join("")}
function render(){let c=calc();$("project").value=state.project;$("projectPicker").innerHTML=Object.entries(projects).map(([id,p])=>`<option value="${esc(id)}">${esc(p.project||"Proyecto sin nombre")}</option>`).join("");$("projectPicker").value=activeId;
 $("roundTitle").textContent=`Vuelta ${state.round}`;$("initialValue").textContent=state.initial;$("totalValue").textContent=c.valid?c.total:"—";$("firstRoundNote").classList.toggle("hidden",!c.first);$("operationArea").classList.toggle("hidden",c.first);$("quantityLabel").textContent=c.first?"Puntos en el anillo mágico":"Cantidad de operaciones";$("quantity").value=state.quantity;document.querySelectorAll('input[name="operation"]').forEach(r=>r.checked=r.value===state.operation);$("stitch").value=state.stitch;$("distributionText").textContent=c.valid?c.dist:"";$("errorText").textContent=c.valid?"":"No se puede repartir esta operación uniformemente. Revisa la cantidad y los puntos iniciales.";$("errorText").classList.toggle("hidden",c.valid);$("counterValue").textContent=state.counter;$("counterFraction").textContent=`${state.counter} / ${c.valid?c.total:"—"}`;$("minus").disabled=state.counter<=0;$("plus").disabled=!c.valid||state.counter>=c.total;$("completeRound").checked=false;$("yarnColor").value=state.color;$("customColorWrap").classList.toggle("hidden",state.color!=="Otros");$("customColor").value=state.customColor;$("tabCounter").textContent=state.tabCounter;
 let done=state.history.length,pts=state.history.reduce((n,h)=>n+h.total,0),prog=done?Math.round(done/(done+1)*100):0;$("finishedMetric").textContent=done;$("pointsMetric").textContent=pts;$("progressMetric").textContent=prog+"%";$("progressBar").style.width=prog+"%";$("historyPanel").hidden=!done;$("historyList").innerHTML=state.history.slice().reverse().map(h=>`<div class="history-item"><div><b>Vuelta ${h.n}</b><div class="muted" style="font-size:12px">${esc(h.dist)} · ${esc(h.colorLabel)} · ${esc(h.operation)}</div></div><strong>${h.total}</strong></div>`).join("");
 $("tabCounter").textContent=state.tabCounter;renderSymbols();["roundsView","counterView","symbolsView"].forEach((id,i)=>$(id).classList.toggle("hidden",["Vueltas","Contador de puntos","Símbolos"][i]!==activeTab));document.querySelectorAll("[data-tab]").forEach(b=>b.classList.toggle("active",b.dataset.tab===activeTab));saveAll()}
function complete(){let c=calc();if(!c.valid)return;let colorLabel=state.color==="Otros"?(state.customColor||"Otros"):state.color;state.history.push({n:state.round,total:c.total,dist:c.dist,colorLabel,operation:state.round===1?"Anillo mágico":state.operation,stitch:state.stitch});state.initial=c.total;state.round++;state.counter=0;if(state.round>1&&state.stitch==="Anillo mágico (MR)")state.stitch="Punto bajo (pb)";saveAll();render()}
$("project").addEventListener("input",e=>{state.project=e.target.value;saveAll();$("projectPicker").querySelector(`option[value="${CSS.escape(activeId)}"]`).textContent=state.project||"Proyecto sin nombre"});
$("projectPicker").addEventListener("change",e=>{saveAll();activeId=e.target.value;state=projects[activeId];render()});
$("newProject").addEventListener("click",()=>{saveAll();let name=prompt("Nombre del nuevo proyecto:");if(!name||!name.trim())return;let id="p"+Date.now();projects[id]=fresh(name.trim());activeId=id;state=projects[id];activeTab="Vueltas";render()});
$("deleteProject").addEventListener("click",()=>{if(Object.keys(projects).length<2){alert("Necesitas conservar al menos un proyecto.");return}if(!confirm(`¿Eliminar el proyecto «${state.project}» y todas sus vueltas?`))return;delete projects[activeId];activeId=Object.keys(projects)[0];state=projects[activeId];render()});
$("quantity").addEventListener("input",e=>{state.quantity=e.target.value;state.counter=0;render()});$("stitch").addEventListener("change",e=>{state.stitch=e.target.value;render()});document.querySelectorAll('input[name="operation"]').forEach(r=>r.addEventListener("change",e=>{state.operation=e.target.value;state.counter=0;render()}));$("yarnColor").innerHTML=COLORS.map(x=>`<option>${esc(x)}</option>`).join("");$("yarnColor").addEventListener("change",e=>{state.color=e.target.value;render()});$("customColor").addEventListener("input",e=>{state.customColor=e.target.value;saveAll()});$("minus").addEventListener("click",()=>{state.counter=Math.max(0,state.counter-1);render()});$("plus").addEventListener("click",()=>{let c=calc();if(c.valid)state.counter=Math.min(c.total,state.counter+1);render()});$("completeRound").addEventListener("change",e=>{if(e.target.checked)complete()});$("tabMinus").addEventListener("click",()=>{state.tabCounter=Math.max(0,state.tabCounter-1);render()});$("tabPlus").addEventListener("click",()=>{state.tabCounter++;render()});document.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>{activeTab=b.dataset.tab;render()}));render();
