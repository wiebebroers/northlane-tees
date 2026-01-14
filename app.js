const CART_KEY = "nl_cart_v1";

function readCart(){
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch(e){ return []; }
}
function writeCart(items){
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  updateCartBadge();
}
function addToCart(id, name, price){
  const items = readCart();
  const found = items.find(i => i.id === id);
  if(found){ found.qty += 1; }
  else { items.push({id, name, price, qty: 1}); }
  writeCart(items);
  toast(`${name} toegevoegd aan winkelwagen`);
}
function removeFromCart(id){
  writeCart(readCart().filter(i => i.id !== id));
  if(typeof renderCart === "function") renderCart();
}
function changeQty(id, delta){
  const items = readCart();
  const item = items.find(i => i.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0){
    removeFromCart(id);
    return;
  }
  writeCart(items);
  if(typeof renderCart === "function") renderCart();
}
function cartCount(){
  return readCart().reduce((sum, i) => sum + i.qty, 0);
}
function cartTotal(){
  return readCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}
function updateCartBadge(){
  const el = document.querySelector("[data-cart-count]");
  if(!el) return;
  const n = cartCount();
  el.textContent = n;
  el.style.display = n > 0 ? "inline-flex" : "none";
}
function euro(n){
  return new Intl.NumberFormat("nl-NL", {style:"currency", currency:"EUR"}).format(n);
}
function toast(msg){
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.position = "fixed";
  t.style.left = "50%";
  t.style.bottom = "18px";
  t.style.transform = "translateX(-50%)";
  t.style.padding = "10px 12px";
  t.style.borderRadius = "12px";
  t.style.border = "1px solid rgba(36,36,51,.9)";
  t.style.background = "rgba(19,19,26,.92)";
  t.style.color = "#f2f3f5";
  t.style.boxShadow = "0 10px 30px rgba(0,0,0,.35)";
  t.style.zIndex = 9999;
  document.body.appendChild(t);
  setTimeout(()=>{ t.style.opacity = "0"; t.style.transition = "opacity .25s"; }, 1100);
  setTimeout(()=>{ t.remove(); }, 1500);
}
document.addEventListener("DOMContentLoaded", updateCartBadge);

// Bind add-to-cart buttons
document.addEventListener("click", (e)=>{
  const btn = e.target.closest("[data-add]");
  if(!btn) return;
  addToCart(btn.dataset.id, btn.dataset.name, Number(btn.dataset.price));
});