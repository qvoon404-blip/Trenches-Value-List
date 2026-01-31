const petList=document.getElementById("pet-list");
const search=document.getElementById("search");
const filterButtons=document.querySelectorAll(".filter-bar button");
const sortSelect=document.getElementById("sort");
const totalCount=document.getElementById("total-count");
const visibleCount=document.getElementById("visible-count");
let pets=[];
let currentFilter="all";
let currentSort="default";

async function loadPets(){
  try{
    const res=await fetch("data/pets.json");
    pets=await res.json();
    totalCount.textContent=pets.length;
    filterAndDisplay();
  }catch(e){
    console.error(e);
    petList.innerHTML="<p style='text-align:center;'>⚠️ Could not load pet data.</p>";
  }
}

function filterAndDisplay(){
  const query=search.value.toLowerCase();
  let list=pets.filter(p=>p.name.toLowerCase().includes(query));
  if(currentFilter!=="all"){list=list.filter(p=>p.rarity===currentFilter);}
  if(currentSort==="a-z"){list.sort((a,b)=>a.name.localeCompare(b.name));}
  if(currentSort==="rarity"){
    const order=["Titanic","Huge","Exclusive","Mythical"];
    list.sort((a,b)=>order.indexOf(a.rarity)-order.indexOf(b.rarity));
  }
  render(list);
}

function render(list){
  petList.innerHTML="";
  list.forEach(p=>{
    const div=document.createElement("div");
    div.classList.add("pet-card",p.rarity.toLowerCase());
    const tip=p.description?p.description:"Coming Soon";
    div.innerHTML=`
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>Rarity: <strong>${p.rarity}</strong></p>
      <p>Value: <strong>${p.value}</strong></p>
      <div class="tooltip">${tip}</div>`;
    petList.appendChild(div);
  });
  visibleCount.textContent=list.length;
}

search.addEventListener("input",filterAndDisplay);
filterButtons.forEach(btn=>{
  btn.addEventListener("click",()=>{
    filterButtons.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter=btn.dataset.filter;
    filterAndDisplay();
  });
});
sortSelect.addEventListener("change",e=>{
  currentSort=e.target.value;
  filterAndDisplay();
});
loadPets();
