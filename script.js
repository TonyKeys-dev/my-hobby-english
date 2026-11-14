var H=[["⚽","playing football","bermain sepak bola"],["🏊","swimming","berenang"],["📚","reading","membaca"],["🎨","drawing","menggambar"],["🎤","singing","bernyanyi"],["💃","dancing","menari"],["🚴","cycling","bersepeda"],["🍳","cooking","memasak"]];
var COL=["#FFE08A","#FFC2D6","#B8F2D6","#D3C7FF","#FFC0B5","#BDE8FF","#FFE08A","#B8F2D6"];
var $=function(s){return document.querySelector(s)};
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function say(t){try{speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(t);u.lang="en-US";u.rate=.8;speechSynthesis.speak(u)}catch(e){}}
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
addEventListener("keydown",function(e){
  if(e.key==="ArrowRight"||e.key==="PageDown")go(cur+1);
  else if(e.key==="ArrowLeft"||e.key==="PageUp")go(cur-1);
  else if(e.key==="f"||e.key==="F"){try{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()}catch(x){}}});
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
[["⚽",70,380,86],["🎨",1100,70,80],["📚",1090,400,90],["🎤",90,90,78],["🏊",300,560,80],["💃",980,560,84],["🚴",180,250,76],["🍳",1010,230,76]].forEach(function(f,i){
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
function loadVid(s,id){s.querySelector("iframe").src=YT+id+"?rel=0&modestbranding=1&playsinline=1";s.querySelector(".yt").href="https://www.youtube.com/watch?v="+id;s.dataset.cur=id}
function vids(){S.forEach(function(s){var f=s.querySelector("iframe");if(!f)return;
  if(s.classList.contains("on")){if(!f.getAttribute("src"))loadVid(s,s.dataset.cur||s.dataset.yt)}else f.removeAttribute("src")})}
document.querySelectorAll(".song").forEach(function(b){b.onclick=function(){
  document.querySelectorAll(".song").forEach(function(x){x.classList.toggle("on",x===b)});loadVid(b.closest(".slide"),b.dataset.id)}});

/* game */
var sel=[],done=0,lock=false;
function newGame(){var p=shuffle(H.slice()).slice(0,6),cs=[];
  p.forEach(function(h){cs.push({k:h[1],c:"e",v:h[0]});cs.push({k:h[1],c:"w",v:h[1]})});
  shuffle(cs);sel=[];done=0;lock=false;$("#score").textContent="0 / 6";
  var box=$("#cards");box.innerHTML="";
  cs.forEach(function(cd){var b=document.createElement("button");b.className="st cd "+cd.c;b.textContent=cd.v;
    b.onclick=function(){
      if(lock||b.classList.contains("ok")||sel.indexOf(b)>-1)return;
      b.classList.add("pick");sel.push(b);b._k=cd.k;if(cd.c==="w")say(cd.k);
      if(sel.length===2){var a=sel[0],z=sel[1];
        if(a._k===z._k){[a,z].forEach(function(x){x.classList.remove("pick");x.classList.add("ok")});ding(true);done++;$("#score").textContent=done+" / 6";sel=[];if(done===6)conf()}
        else{lock=true;ding(false);[a,z].forEach(function(x){x.classList.add("bad")});
          setTimeout(function(){[a,z].forEach(function(x){x.classList.remove("pick","bad")});sel=[];lock=false},500)}}};
    box.appendChild(b)})}
$("#again").onclick=newGame;newGame();

/* finish: random hobby */
function setF(h){$("#fe").textContent=h[0];$("#ft").textContent="My hobby is "+h[1]+".";$("#fn").textContent="Now ask a friend: What’s your hobby?"}
$("#spin").onclick=function(){var n=0,t=setInterval(function(){var h=H[Math.floor(Math.random()*H.length)];setF(h);
  if(++n>12){clearInterval(t);conf();say("My hobby is "+h[1]+".")}},80)};
go(0);