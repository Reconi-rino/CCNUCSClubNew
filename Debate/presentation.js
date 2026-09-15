'use strict';
const deck=window.PPT_DECK;
const stage=document.getElementById('stage'),frame=document.getElementById('frame');
const status=document.getElementById('status'),pages=document.getElementById('pages');
let current=0,step=0,busy=false,animations=[],generation=0;
deck.slides.forEach((s,i)=>{const o=document.createElement('option');o.value=i;o.textContent=`${i+1} / ${deck.slides.length}`;pages.append(o)});
function resize(){const viewer=document.getElementById('viewer');const style=getComputedStyle(viewer);const w=viewer.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight);const h=viewer.clientHeight-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom);const scale=Math.min(w/1600,h/900);frame.style.width=`${1600*scale}px`;frame.style.height=`${900*scale}px`;stage.style.transform=`scale(${scale})`}
new ResizeObserver(resize).observe(document.getElementById('viewer'));
function update(){const count=deck.slides[current].groups.length;status.textContent=busy?'动画播放中…':count?`动画 ${step} / ${count}${step===count?' · 本页已完成':''}`:'本页无动画';document.getElementById('prev').disabled=current===0;document.getElementById('next').textContent=step<count?'下一步':current===deck.slides.length-1?'播放完毕':'下一页';document.getElementById('next').disabled=step>=count&&current===deck.slides.length-1;pages.value=current}
function cancel(){generation++;stage.getAnimations({subtree:true}).forEach(a=>a.cancel());animations=[];busy=false}
function show(index){cancel();current=Math.max(0,Math.min(deck.slides.length-1,index));step=0;stage.replaceChildren();const s=deck.slides[current];const hidden=new Set(s.effects.filter(e=>!e.exit).map(e=>e.target));s.layers.forEach(l=>{const img=document.createElement('img');img.className='layer';img.id=`object-${l.id}`;img.src=`assets/${l.file}`;img.alt=l.text||'';img.draggable=false;img.style.cssText=`left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;visibility:${hidden.has(l.id)?'hidden':'visible'}`;stage.append(img)});stage.setAttribute('aria-label',`第 ${current+1} 页，共 ${deck.slides.length} 页`);update();resize()}
function frames(e,img){
 const final={opacity:1,transform:'translate(0,0)',clipPath:'inset(0 0 0 0)'};
 if(e.type===1)return [{visibility:'visible'}, {visibility:'visible'}];
 if(e.type===2){let x=0,y=0;const s=e.subtype;const left=parseFloat(img.style.left),top=parseFloat(img.style.top);if([1,3,9].includes(s))x=-left-parseFloat(img.style.width);if([4,6,12].includes(s))y=900-top;if([2,3,6].includes(s)&&!y)y=-top-parseFloat(img.style.height);if([8,9,12].includes(s))x=1600-left;return [{opacity:1,transform:`translate(${x}px,${y}px)`},final]}
 if(e.type===12)return [{opacity:1,transform:`translateY(${parseFloat(img.style.height)*1.125}px)`,clipPath:'inset(100% 0 0 0)'},final];
 if(e.type===22)return [{opacity:1,clipPath:'inset(100% 0 0 0)'},final];
 return [{opacity:0},final];
}
function finish(){animations.forEach(a=>a.finish());busy=false;update()}
async function next(){if(busy){finish();return}const s=deck.slides[current];if(step>=s.groups.length){if(current<deck.slides.length-1)show(current+1);return}busy=true;const token=++generation;const group=s.groups[step++];update();animations=group.map(e=>{const img=document.getElementById(`object-${e.target}`);const f=frames(e,img);f.forEach(k=>k.visibility='visible');const a=img.animate(f,{duration:e.ms,delay:e.start,fill:'forwards',easing:'linear'});return a});await Promise.allSettled(animations.map(a=>a.finished));if(token===generation){busy=false;update()}}
function all(){cancel();deck.slides[current].layers.forEach(l=>document.getElementById(`object-${l.id}`).style.visibility='visible');step=deck.slides[current].groups.length;update()}
async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{status.textContent='请使用浏览器菜单进入全屏'}}
frame.addEventListener('click',next);document.getElementById('next').onclick=next;document.getElementById('prev').onclick=()=>show(current-1);document.getElementById('replay').onclick=()=>show(current);document.getElementById('all').onclick=all;document.getElementById('fullscreen').onclick=fullscreen;pages.onchange=()=>show(Number(pages.value));
document.addEventListener('keydown',e=>{if(e.target.closest('button,select,input'))return;if([' ','ArrowRight','PageDown','Enter'].includes(e.key)){e.preventDefault();next()}else if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();show(current-1)}else if(e.key.toLowerCase()==='r')show(current);else if(e.key.toLowerCase()==='f')fullscreen();else if(e.key==='Home')show(0);else if(e.key==='End')show(deck.slides.length-1)});
show(0);
