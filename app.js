const $=s=>document.querySelector(s);
const taskList=$('#taskList'), input=$('#taskInput');
let tasks=JSON.parse(localStorage.getItem('orbit-tasks')||'[]');
let seconds=1500, running=false, interval=null;
function save(){localStorage.setItem('orbit-tasks',JSON.stringify(tasks))}
function render(){
  taskList.innerHTML='';
  tasks.forEach((t,i)=>{
    const row=document.createElement('div');
    row.className='group flex items-center gap-3 rounded-2xl px-3 py-3 hover:bg-white/[.035] transition';
    row.innerHTML='<button class="check w-6 h-6 rounded-lg border border-white/15 grid place-items-center shrink-0">'+(t.done?'✓':'')+'</button><span class="flex-1 text-sm '+(t.done?'task-done':'')+'">'+escapeHtml(t.text)+'</span><button class="delete opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition px-2">×</button>';
    row.querySelector('.check').onclick=()=>{tasks[i].done=!tasks[i].done;save();render()};
    row.querySelector('.delete').onclick=()=>{tasks.splice(i,1);save();render()};
    taskList.appendChild(row);
  });
  const done=tasks.filter(t=>t.done).length;
  $('#doneStat').textContent=done;
  $('#progressStat').textContent=(tasks.length?Math.round(done/tasks.length*100):0)+'%';
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
$('#taskForm').onsubmit=e=>{e.preventDefault();tasks.unshift({text:input.value.trim(),done:false});input.value='';save();render();input.focus()};
$('#clearBtn').onclick=()=>{tasks=tasks.filter(t=>!t.done);save();render()};
function paint(){const m=String(Math.floor(seconds/60)).padStart(2,'0'),s=String(seconds%60).padStart(2,'0');$('#timer').textContent=m+':'+s;$('#focusStat').textContent=m+':'+s;$('#bar').style.width=((1500-seconds)/1500*100)+'%'}
function toggle(){running=!running;$('#timerBtn').textContent=running?'Pause':'Start';if(running){interval=setInterval(()=>{if(seconds>0){seconds--;paint()}else{clearInterval(interval);running=false;$('#timerBtn').textContent='Start';alert('Focus session complete. Great work!')}} ,1000)}else clearInterval(interval)}
$('#timerBtn').onclick=toggle;
$('#resetBtn').onclick=()=>{clearInterval(interval);running=false;seconds=1500;$('#timerBtn').textContent='Start';paint()};
$('#focusBtn').onclick=()=>{document.querySelector('.glass').scrollIntoView({behavior:'smooth'});if(!running)toggle()};
$('#themeBtn').onclick=()=>document.body.classList.toggle('brightness-125');
setInterval(()=>{$('#clock').textContent=new Date().toLocaleString([], {weekday:'short',hour:'2-digit',minute:'2-digit'})},1000);
render();paint();