var H=[["🏊","swimming","berenang"],["💃","dancing","menari"],["⚽","playing football","bermain sepak bola"],["🎤","singing","bernyanyi"],["🍳","cooking","memasak"]];
var COL=["#BDE8FF","#FFC2D6","#FFE08A","#D3C7FF","#B8F2D6"];
var $=function(s){return document.querySelector(s)};
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
var voices=[],VO=null,vx=0;
function vlab(){var b=$("#vbtn");if(!voices.length){b.textContent="🔊 Voice";return}
  b.textContent=vx>=voices.length?"🔇 Off":"🔊 "+voices[vx].name.replace(/Microsoft |Google | Online \(Natural\)|\(.*?\)| - .*$/g,"").slice(0,16)}
function pickVoices(){if(!window.speechSynthesis)return;
  var sc=function(v){var n=v.name,k=0;if(/Natural/i.test(n))k+=10;if(/Google/i.test(n))k+=6;if(/Samantha|Ava|Allison|Karen|Daniel|Moira|Serena/i.test(n))k+=5;if(/Aria|Jenny|Ana|Libby|Sonia|Guy/i.test(n))k+=3;if(/eSpeak|Compact|David|Zira|Mark/i.test(n))k-=5;if(/en[-_]US/i.test(v.lang))k+=1;return k};
  voices=speechSynthesis.getVoices().filter(function(v){return /^en/i.test(v.lang)}).sort(function(a,b){return sc(b)-sc(a)});
  if(vx>voices.length)vx=0;VO=voices[vx]||null;vlab()}
if(window.speechSynthesis){speechSynthesis.onvoiceschanged=pickVoices}
function say(t){try{if(voices.length&&vx>=voices.length)return;speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(t);if(VO)u.voice=VO;u.lang=VO?VO.lang:"en-US";u.rate=.85;speechSynthesis.speak(u)}catch(e){}}
function bump(el,c){el.classList.remove(c);void el.offsetWidth;el.classList.add(c)}

/* stage fit + navigation */
function fit(){var s=Math.min(innerWidth/1280,innerHeight/720);$("#stage").style.transform="translate(-50%,-50%) scale("+s+")"}
addEventListener("resize",fit);fit();
var S=document.querySelectorAll(".slide"),cur=0,dots=$("#dots");
S.forEach(function(_,i){var d=document.createElement("i");d.onclick=function(){go(i)};dots.appendChild(d)});
function go(n){n=Math.max(0,Math.min(S.length-1,n));cur=n;
  S.forEach(function(s,i){s.classList.toggle("on",i===n);s.classList.toggle("past",i<n)});
  [].forEach.call(dots.children,function(d,i){d.classList.toggle("on",i===n)});
  vids();
  $("#prev").style.visibility=n?"visible":"hidden";$("#next").style.visibility=n<S.length-1?"visible":"hidden"}
$("#prev").onclick=function(){go(cur-1)};$("#next").onclick=function(){go(cur+1)};
function updateFullscreenButton(){
  var active=!!document.fullscreenElement,b=$("#fsbtn");
  b.textContent=active?"⛶ Exit full screen":"⛶ Full screen";
  b.title=active?"Exit full screen":"Enter full screen";
  fit()
}
function toggleFullscreen(){
  var action=document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();
  if(action&&action.catch)action.catch(function(){$("#fsbtn").title="Full screen is unavailable in this browser."})
}
$("#fsbtn").onclick=toggleFullscreen;
document.addEventListener("fullscreenchange",updateFullscreenButton);
addEventListener("keydown",function(e){
  if(e.key==="ArrowRight"||e.key==="PageDown")go(cur+1);
  else if(e.key==="ArrowLeft"||e.key==="PageUp")go(cur-1);
  else if(e.key==="f"||e.key==="F")toggleFullscreen()});
var tx=0;addEventListener("touchstart",function(e){tx=e.touches[0].clientX});
addEventListener("touchend",function(e){var d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>70)go(cur+(d<0?1:-1))});

/* audio */
var ac=null;
function ctx(){if(!ac)ac=new (window.AudioContext||window.webkitAudioContext)();return ac}
function tone(m,t,d,type,v){var c=ctx(),o=c.createOscillator(),g=c.createGain();o.type=type||"triangle";o.frequency.value=440*Math.pow(2,(m-69)/12);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v||.25,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+d+.05)}
function ding(ok){try{var t=ctx().currentTime;if(ok){tone(76,t,.25,"sine",.3);tone(83,t+.12,.35,"sine",.3)}else tone(55,t,.3,"square",.12)}catch(e){}}
function conf(){var st=$("#stage"),c=["#FFC83D","#FF6B57","#4CC3FF","#3DDC97","#8A6BFF","#FF8FB8"];
  for(var i=0;i<44;i++){var d=document.createElement("div");d.className="cf";d.style.left=Math.random()*1280+"px";d.style.background=c[i%6];d.style.animationDelay=Math.random()*.6+"s";st.appendChild(d);setTimeout(function(x){x.remove()},3000,d)}
  try{var t=ctx().currentTime;[72,76,79,84].forEach(function(n,i){tone(n,t+i*.15,.4,"triangle",.3)})}catch(e){}}

/* title */
function letters(el,w,cs){w.split("").forEach(function(ch,i){var d=document.createElement("div");d.className="let";d.textContent=ch;d.style.background=cs[i%cs.length];d.style.transform="rotate("+[-5,4,-3,5,-4,3,-5][i%7]+"deg)";el.appendChild(d)})}
letters($("#r1"),"My",["#fff","#FF8FB8"]);letters($("#r2"),"Hobby",["#4CC3FF","#fff","#3DDC97","#FF6B57","#8A6BFF"]);
[["⚽",70,380,86],["🏊",1100,70,80],["💃",1090,400,90],["🎤",90,90,78],["🍳",300,560,80],["⚽",980,560,84],["🎤",1010,230,76],["💃",180,250,76]].forEach(function(f,i){
  var s=document.createElement("span");s.className="fl";s.textContent=f[0];s.style.cssText="left:"+f[1]+"px;top:"+f[2]+"px;font-size:"+f[3]+"px;animation-delay:"+i*.4+"s";$("#s0").appendChild(s)});

/* words */
H.forEach(function(h,i){var b=document.createElement("button");b.className="st tile";b.style.background=COL[i];
  b.innerHTML='<div class="e">'+h[0]+'</div><div class="w">'+h[1]+'</div><div class="i">'+h[2]+'</div>';
  b.onclick=function(){bump(b,"pop");$("#say").textContent="My hobby is "+h[1]+".";say("My hobby is "+h[1]+". I like "+h[1]+".")};
  $("#grid").appendChild(b)});

/* sentences */
var bi=0;function setB(){var h=H[bi%H.length];$("#bl").textContent=h[0]+" "+h[1]+"."}setB();
$("#chg").onclick=function(){bi++;setB();bump($("#ans"),"pop");say("My hobby is "+H[bi%H.length][1]+".")};
$("#ask").onclick=function(){say("What’s your hobby?")};
$("#ans").onclick=function(){say("My hobby is "+H[bi%H.length][1]+".")};

/* video (YouTube embeds) */
var YT="https://www.youtube-nocookie.com/embed/";
function loadVid(s,id){s.querySelector("iframe").src=YT+id+"?rel=0&modestbranding=1&playsinline=1";s.dataset.cur=id}
function vids(){S.forEach(function(s){var f=s.querySelector("iframe");if(!f)return;
  if(s.classList.contains("on")){if(!f.getAttribute("src"))loadVid(s,s.dataset.cur||s.dataset.yt)}else f.removeAttribute("src")})}
document.querySelectorAll(".song").forEach(function(b){b.onclick=function(){
  document.querySelectorAll(".song").forEach(function(x){x.classList.toggle("on",x===b)});loadVid(b.closest(".slide"),b.dataset.id)}});

/* games */
var U={};
function uStart(){U.order=shuffle(H.slice());U.i=0;uLoad()}
function uLoad(){var h=U.order[U.i],L=[];U.h=h;U.lock=false;U.slots=[];
  $("#ue").textContent=h[0];$("#us").textContent=(U.i+1)+" / "+H.length;$("#unext").style.display="none";
  var sl=$("#uslots");sl.innerHTML="";
  h[1].split(" ").forEach(function(w){var r=document.createElement("div");r.className="uw";
    w.split("").forEach(function(c){var d=document.createElement("button");d.className="sl";d.onclick=function(){uBack(d)};r.appendChild(d);U.slots.push(d);L.push(c)});sl.appendChild(r)});
  var t;do{t=shuffle(L.slice())}while(t.join("")===L.join(""));
  var tb=$("#utiles");tb.innerHTML="";
  t.forEach(function(c){var b=document.createElement("button");b.className="tl";b.textContent=c;b.onclick=function(){uPut(b)};tb.appendChild(b)})}
function uPut(b){if(U.lock||b.disabled)return;
  var d=U.slots.filter(function(x){return !x._t})[0];if(!d)return;
  d.textContent=b.textContent;d._t=b;b.disabled=true;
  if(U.slots.every(function(x){return x._t}))uCheck()}
function uBack(d){if(U.lock||!d._t)return;d._t.disabled=false;d._t=null;d.textContent=""}
function uCheck(){var w=U.slots.map(function(d){return d.textContent}).join(""),t=U.h[1].replace(/ /g,"");
  if(w===t){U.lock=true;U.slots.forEach(function(d){d.classList.add("ok")});ding(true);say(U.h[1]);
    var last=U.i>=H.length-1,n=$("#unext");n.style.display="";n.textContent=last?"↻ Play again":"Next ▶";if(last)conf()}
  else{ding(false);U.slots.forEach(function(d){d.classList.add("bad")});setTimeout(function(){U.slots.forEach(function(d){d.classList.remove("bad")})},500)}}
$("#ush").onclick=function(){uLoad()};
$("#unext").onclick=function(){if(U.i>=H.length-1)uStart();else{U.i++;uLoad()}};
uStart();

var C={n:0},drag=null;
function mk(h,side,t,txt,x,y){var d=document.createElement("div");d.className="st cn "+side+" "+t;d.textContent=txt;d.style.left=x+"px";d.style.top=y+"px";d._k=h[1];d._s=side;
  d.onpointerdown=function(e){cStart(d,e)};$("#s6").appendChild(d)}
function cLoad(){var L=shuffle(H.slice()),R=shuffle(H.slice());
  document.querySelectorAll("#s6 .cn,#s6 .kept").forEach(function(x){x.remove()});C.n=0;$("#cs").textContent="0 / "+H.length;
  L.forEach(function(h,i){mk(h,"L","e",h[0],150,130+i*98)});R.forEach(function(h,i){mk(h,"R","w",h[1],830,130+i*98)})}
function pt(e){var r=$("#stage").getBoundingClientRect(),k=r.width/1280;return[(e.clientX-r.left)/k,(e.clientY-r.top)/k]}
function anchor(d){var r=$("#stage").getBoundingClientRect(),k=r.width/1280,b=d.getBoundingClientRect();return[((d._s==="L"?b.right:b.left)-r.left)/k,((b.top+b.bottom)/2-r.top)/k]}
function cStart(d,e){if(d.classList.contains("ok"))return;e.preventDefault();var a=anchor(d),l=$("#rope");drag=d;
  l.setAttribute("x1",a[0]);l.setAttribute("y1",a[1]);l.setAttribute("x2",a[0]);l.setAttribute("y2",a[1]);l.style.display="block"}
document.addEventListener("pointermove",function(e){if(!drag)return;var p=pt(e),l=$("#rope");l.setAttribute("x2",p[0]);l.setAttribute("y2",p[1])});
document.addEventListener("pointerup",function(e){if(!drag)return;var d=drag;drag=null;$("#rope").style.display="none";
  var el=document.elementFromPoint(e.clientX,e.clientY),t=el&&el.closest(".cn");
  if(!t||t===d||t._s===d._s||t.classList.contains("ok"))return;
  if(t._k===d._k){var a=anchor(d),b=anchor(t),l=document.createElementNS("http://www.w3.org/2000/svg","line");
    l.setAttribute("class","kept");l.setAttribute("x1",a[0]);l.setAttribute("y1",a[1]);l.setAttribute("x2",b[0]);l.setAttribute("y2",b[1]);
    l.setAttribute("stroke","#12a594");l.setAttribute("stroke-width","8");l.setAttribute("stroke-linecap","round");$("#ropes").appendChild(l);
    d.classList.add("ok");t.classList.add("ok");ding(true);C.n++;$("#cs").textContent=C.n+" / "+H.length;if(C.n===H.length)conf()}
  else{ding(false);[d,t].forEach(function(x){x.classList.add("bad");setTimeout(function(){x.classList.remove("bad")},450)})}});
$("#cnew").onclick=cLoad;cLoad();


/* finish: choose your hobby */
H.forEach(function(h,i){var b=document.createElement("button");b.className="st qc";b.style.background=COL[i];
  b.innerHTML='<span class="qn">0</span><div class="e">'+h[0]+'</div><div class="w">'+h[1]+'</div>';
  b.onclick=function(){var n=b.querySelector(".qn");n.textContent=+n.textContent+1;bump(b,"pop");
    $("#pickmsg").textContent="My hobby is "+h[1]+".";say("My hobby is "+h[1]+".")};
  $("#qgrid").appendChild(b)});
$("#vbtn").onclick=function(){if(!voices.length){say("My hobby is swimming.");return}
  vx=(vx+1)%(voices.length+1);VO=voices[vx]||null;vlab();say("My hobby is swimming.")};
pickVoices();
go(0);