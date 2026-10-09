const starterItems = [
 {id:1,type:'found',name:'Everyday backpack',category:'Bags',location:'Library · Block B',description:'Olive green backpack with a small keychain attached to the front zip.',time:'2 hours ago',icon:'🎒',art:'bags'},
 {id:2,type:'lost',name:'Wireless earbuds case',category:'Electronics',location:'Cafeteria · Ground floor',description:'White charging case. Lost around the lunch tables during break.',time:'4 hours ago',icon:'🎧',art:'electronics'},
 {id:3,type:'found',name:'Student ID card',category:'Documents',location:'Computer lab · Block A',description:'Student ID card found near the entrance. Name can be confirmed by owner.',time:'Yesterday',icon:'🪪',art:'documents'},
 {id:4,type:'lost',name:'Silver water bottle',category:'Accessories',location:'Sports ground',description:'Metal bottle with a black lid and a few small stickers on the side.',time:'Yesterday',icon:'🥤',art:'accessories'},
 {id:5,type:'found',name:'Notebook & notes',category:'Other',location:'Room 204 · Block C',description:'Blue notebook with handwritten class notes inside. Found after class.',time:'2 days ago',icon:'📓',art:'other'},
 {id:6,type:'lost',name:'Black calculator',category:'Electronics',location:'Exam hall corridor',description:'Scientific calculator in a black protective cover. Initials may be on the back.',time:'2 days ago',icon:'🧮',art:'electronics'}
];
let items = [...starterItems];
let activeFilter = 'all';
const grid = document.getElementById('listing-grid');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const modal = document.getElementById('report-modal');
const form = document.getElementById('report-form');

function escapeHTML(value) {
 return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function render() {
 const query = searchInput.value.trim().toLowerCase();
 const category = categoryFilter.value;
 const filtered = items.filter(item => {
  const matchesType = activeFilter === 'all' || item.type === activeFilter;
  const matchesCategory = category === 'all' || item.category === category;
  const matchesQuery = `${item.name} ${item.location} ${item.description} ${item.category}`.toLowerCase().includes(query);
  return matchesType && matchesCategory && matchesQuery;
 });
 grid.innerHTML = filtered.map(item => `
  <article class="listing-card">
   <div class="listing-art art-${escapeHTML(item.art)}"><span>${escapeHTML(item.icon)}</span></div>
   <div class="listing-meta"><span class="status ${item.type === 'found' ? 'status-found' : 'status-lost'}">${item.type === 'found' ? 'FOUND ITEM' : 'LOST ITEM'}</span><span class="posted-time">${escapeHTML(item.time)}</span></div>
   <h3>${escapeHTML(item.name)}</h3><p class="listing-description">${escapeHTML(item.description)}</p>
   <div class="listing-location"><span>⌖</span>${escapeHTML(item.location)}</div>
   <div class="listing-card-footer"><span class="category-label">${escapeHTML(item.category)}</span><button class="details-btn" data-item-id="${item.id}">View details ↗</button></div>
  </article>`).join('');
 document.getElementById('empty-state').classList.toggle('hidden', filtered.length !== 0);
 grid.classList.toggle('hidden', filtered.length === 0);
 document.getElementById('showing-count').textContent = filtered.length;
 document.getElementById('stat-total').textContent = String(items.length).padStart(2,'0');
 document.getElementById('all-count').textContent = items.length;
 document.getElementById('lost-count').textContent = items.filter(i => i.type === 'lost').length;
 document.getElementById('found-count').textContent = items.filter(i => i.type === 'found').length;
}
function openModal() { modal.classList.remove('hidden'); document.body.style.overflow='hidden'; setTimeout(()=>document.getElementById('report-name').focus(),100); }
function closeModal() { modal.classList.add('hidden'); document.body.style.overflow=''; }
document.querySelectorAll('[data-open-modal]').forEach(button => button.addEventListener('click', openModal));
document.getElementById('close-modal').addEventListener('click', closeModal);
modal.addEventListener('click', event => { if(event.target === modal) closeModal(); });
document.addEventListener('keydown', event => { if(event.key === 'Escape') closeModal(); if((event.metaKey || event.ctrlKey) && event.key.toLowerCase()==='k'){event.preventDefault();searchInput.focus();document.getElementById('browse').scrollIntoView({behavior:'smooth'});} });
document.querySelectorAll('.filter-btn').forEach(button => button.addEventListener('click', () => {
 document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
 button.classList.add('active'); activeFilter=button.dataset.filter; render();
}));
searchInput.addEventListener('input', render);
categoryFilter.addEventListener('change', render);
document.getElementById('clear-filters').addEventListener('click', () => {
 searchInput.value='';categoryFilter.value='all';activeFilter='all';
 document.querySelectorAll('.filter-btn').forEach(b=>b.classList.toggle('active',b.dataset.filter==='all'));render();
});
grid.addEventListener('click', event => {
 const button = event.target.closest('[data-item-id]');
 if(!button) return;
 const item = items.find(i=>i.id===Number(button.dataset.itemId));
 if(item) alert(`${item.type.toUpperCase()} ITEM: ${item.name}\n\nLocation: ${item.location}\nCategory: ${item.category}\n\n${item.description}\n\nMini-project demo: contact details and claim verification would be handled by the backend in a complete version.`);
});
form.addEventListener('submit', event => {
 event.preventDefault();
 const type=document.getElementById('report-type').value;
 const category=document.getElementById('report-category').value;
 const name=document.getElementById('report-name').value.trim();
 const location=document.getElementById('report-location').value.trim();
 const description=document.getElementById('report-description').value.trim();
 const contact=document.getElementById('report-contact').value.trim();
 if(!name||!location||!description||!contact) return;
 const icons={Electronics:'🎧',Accessories:'🥤',Bags:'🎒',Documents:'📄',Other:'📦'};
 const art={Electronics:'electronics',Accessories:'accessories',Bags:'bags',Documents:'documents',Other:'other'};
 items.unshift({id:Date.now(),type,category,name,location,description:`${description} · Contact: ${contact}`,time:'Just now',icon:icons[category],art:art[category]});
 render();closeModal();form.reset();
 document.getElementById('toast').classList.remove('hidden');
 setTimeout(()=>document.getElementById('toast').classList.add('hidden'),3500);
 document.getElementById('browse').scrollIntoView({behavior:'smooth'});
});
document.querySelector('.menu-toggle').addEventListener('click',()=>document.querySelector('.nav-links').classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>document.querySelector('.nav-links').classList.remove('open')));
render();