(function () {
  // ---- Store settings: edit these before taking real orders ----
  var WHATSAPP_NUMBER = ""; // e.g. "923001234567" (country code, no + or spaces). Empty = show order summary to copy.
  var SHIPPING_FLAT = 250;  // Rs. flat shipping (sample value)
  var FREE_SHIP_OVER = 3000; // Rs. free shipping above this subtotal (sample value)

  // Sample products for demonstration. Replace with real products and photos.
  var PRODUCTS = [
    { id: 1, name: "Men's Cotton Polo Shirt", cat: "Men", em: "👕", bg: "#e3f0ff", price: 1299, was: 1799, sizes: ["S", "M", "L", "XL"] },
    { id: 2, name: "Men's Printed T-Shirt", cat: "Men", em: "👕", bg: "#fff1d6", price: 799, was: 999, sizes: ["S", "M", "L", "XL"] },
    { id: 3, name: "Men's Slim Fit Jeans", cat: "Men", em: "👖", bg: "#dfe7f5", price: 2299, was: 2999, sizes: ["30", "32", "34", "36"] },
    { id: 4, name: "Men's Winter Hoodie", cat: "Men", em: "🧥", bg: "#e8e8ee", price: 2499, was: 3299, sizes: ["M", "L", "XL"] },
    { id: 5, name: "Men's Kurta", cat: "Men", em: "👘", bg: "#e6f4ea", price: 1899, was: 2399, sizes: ["S", "M", "L", "XL"] },
    { id: 6, name: "Women's Lawn Suit (3 Piece)", cat: "Women", em: "👗", bg: "#ffe3ee", price: 2799, was: 3699, sizes: ["S", "M", "L"] },
    { id: 7, name: "Women's Printed Kurti", cat: "Women", em: "👚", bg: "#f3e5ff", price: 1499, was: 1999, sizes: ["S", "M", "L", "XL"] },
    { id: 8, name: "Women's Casual Top", cat: "Women", em: "👚", bg: "#ffe9e0", price: 999, was: 1399, sizes: ["S", "M", "L"] },
    { id: 9, name: "Women's Winter Shawl", cat: "Women", em: "🧣", bg: "#fff4d9", price: 1699, was: 2199, sizes: ["Free size"] },
    { id: 10, name: "Women's Abaya", cat: "Women", em: "🥻", bg: "#e4e4ec", price: 3299, was: 3999, sizes: ["52", "54", "56"] },
    { id: 11, name: "Men's Running Sneakers", cat: "Shoes", em: "👟", bg: "#ddf3f0", price: 2999, was: 3999, sizes: ["7", "8", "9", "10", "11"] },
    { id: 12, name: "Men's Formal Shoes", cat: "Shoes", em: "👞", bg: "#efe6dc", price: 3499, was: 4499, sizes: ["7", "8", "9", "10", "11"] },
    { id: 13, name: "Men's Peshawari Sandals", cat: "Shoes", em: "🥿", bg: "#f1e4d3", price: 1999, was: 2599, sizes: ["7", "8", "9", "10", "11"] },
    { id: 14, name: "Women's Block Heels", cat: "Shoes", em: "👠", bg: "#ffe0e6", price: 2599, was: 3299, sizes: ["5", "6", "7", "8"] },
    { id: 15, name: "Women's Flat Sandals", cat: "Shoes", em: "👡", bg: "#fff0dc", price: 1499, was: 1999, sizes: ["5", "6", "7", "8"] },
    { id: 16, name: "Women's Sneakers", cat: "Shoes", em: "👟", bg: "#e5eefc", price: 2799, was: 3499, sizes: ["5", "6", "7", "8"] }
  ];
  var CATS = ["All", "Men", "Women", "Shoes"];

  var state = { cat: "All", q: "", sort: "", cart: [], pick: {} };
  try { state.cart = JSON.parse(localStorage.getItem("sasta_cart") || "[]"); } catch (e) { state.cart = []; }

  var $ = function (id) { return document.getElementById(id); };
  var rs = function (n) { return "Rs. " + n.toLocaleString("en-PK"); };
  var save = function () { try { localStorage.setItem("sasta_cart", JSON.stringify(state.cart)); } catch (e) {} };
  var el = function (tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  };

  function renderTabs() {
    var box = $("tabs");
    box.textContent = "";
    CATS.forEach(function (c) {
      var b = el("button", "tab" + (state.cat === c ? " on" : ""), c);
      b.type = "button";
      b.onclick = function () { state.cat = c; renderTabs(); renderGrid(); };
      box.appendChild(b);
    });
  }

  function renderGrid() {
    var list = PRODUCTS.filter(function (p) {
      var okCat = state.cat === "All" || p.cat === state.cat;
      var okQ = !state.q || p.name.toLowerCase().indexOf(state.q) !== -1;
      return okCat && okQ;
    });
    if (state.sort === "lo") list.sort(function (a, b) { return a.price - b.price; });
    if (state.sort === "hi") list.sort(function (a, b) { return b.price - a.price; });
    var grid = $("grid");
    grid.textContent = "";
    $("empty").hidden = list.length > 0;
    list.forEach(function (p) {
      if (!state.pick[p.id]) state.pick[p.id] = p.sizes[0];
      var card = el("div", "card");
      var pic = el("div", "pic", p.em);
      pic.style.background = p.bg;
      var off = Math.round((1 - p.price / p.was) * 100);
      pic.appendChild(el("span", "tag", off + "% OFF"));
      var body = el("div", "cb");
      body.appendChild(el("div", "cat", p.cat));
      body.appendChild(el("h4", "", p.name));
      var pr = el("div", "price", rs(p.price));
      pr.appendChild(el("s", "", rs(p.was)));
      body.appendChild(pr);
      var opts = el("div", "opts");
      p.sizes.forEach(function (s) {
        var o = el("button", "opt" + (state.pick[p.id] === s ? " on" : ""), s);
        o.type = "button";
        o.onclick = function () {
          state.pick[p.id] = s;
          Array.prototype.forEach.call(opts.children, function (x) { x.classList.toggle("on", x === o); });
        };
        opts.appendChild(o);
      });
      body.appendChild(opts);
      var add = el("button", "add", "Add to cart");
      add.type = "button";
      add.onclick = function () { addToCart(p, state.pick[p.id]); };
      body.appendChild(add);
      card.appendChild(pic);
      card.appendChild(body);
      grid.appendChild(card);
    });
  }

  function addToCart(p, size) {
    var found = state.cart.filter(function (i) { return i.id === p.id && i.size === size; })[0];
    if (found) found.qty += 1; else state.cart.push({ id: p.id, size: size, qty: 1 });
    save(); renderCart(); openCart();
  }

  function lines() {
    return state.cart.map(function (i) {
      var p = PRODUCTS.filter(function (x) { return x.id === i.id; })[0];
      return p ? { p: p, i: i } : null;
    }).filter(Boolean);
  }

  function totals() {
    var sub = lines().reduce(function (s, l) { return s + l.p.price * l.i.qty; }, 0);
    var ship = sub === 0 || sub >= FREE_SHIP_OVER ? 0 : SHIPPING_FLAT;
    return { sub: sub, ship: ship, total: sub + ship };
  }

  function renderCart() {
    var ls = lines();
    $("count").textContent = ls.reduce(function (n, l) { return n + l.i.qty; }, 0);
    var box = $("items");
    box.textContent = "";
    if (!ls.length) {
      box.appendChild(el("p", "empty", "Your cart is empty."));
      $("foot").hidden = true;
      return;
    }
    $("foot").hidden = false;
    ls.forEach(function (l) {
      var row = el("div", "item");
      row.appendChild(el("div", "em", l.p.em));
      var t = el("div", "t", l.p.name);
      t.appendChild(el("small", "", "Size " + l.i.size + " · " + rs(l.p.price)));
      row.appendChild(t);
      var q = el("div", "qty");
      var minus = el("button", "", "−"); minus.type = "button";
      var plus = el("button", "", "+"); plus.type = "button";
      minus.onclick = function () { l.i.qty -= 1; if (l.i.qty <= 0) state.cart.splice(state.cart.indexOf(l.i), 1); save(); renderCart(); };
      plus.onclick = function () { l.i.qty += 1; save(); renderCart(); };
      q.appendChild(minus); q.appendChild(el("span", "", String(l.i.qty))); q.appendChild(plus);
      row.appendChild(q);
      box.appendChild(row);
    });
    var t2 = totals();
    $("sub").textContent = rs(t2.sub);
    $("ship").textContent = t2.ship === 0 ? "Free" : rs(t2.ship);
    $("tot").textContent = rs(t2.total);
  }

  function openCart() { $("drawer").classList.add("on"); $("veil").classList.add("on"); $("drawer").setAttribute("aria-hidden", "false"); }
  function closeCart() { $("drawer").classList.remove("on"); $("veil").classList.remove("on"); $("drawer").setAttribute("aria-hidden", "true"); }

  function orderText(f) {
    var t = totals();
    var out = ["New SastaStore order (Cash on Delivery)", ""];
    lines().forEach(function (l) { out.push(l.i.qty + " x " + l.p.name + " (Size " + l.i.size + ") - " + rs(l.p.price * l.i.qty)); });
    out.push("", "Subtotal: " + rs(t.sub), "Shipping: " + (t.ship === 0 ? "Free" : rs(t.ship)), "Total: " + rs(t.total), "",
      "Name: " + f.name.value.trim(), "Phone: " + f.phone.value.trim(), "City: " + f.city.value.trim(), "Address: " + f.address.value.trim());
    return out.join("\n");
  }

  $("form").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!state.cart.length) return;
    var text = orderText(e.target);
    if (WHATSAPP_NUMBER) {
      window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    } else {
      var box = $("foot");
      box.textContent = "";
      var d = el("div", "done");
      d.appendChild(el("h3", "", "Order summary ready"));
      d.appendChild(el("p", "small", "WhatsApp ordering is not connected yet. Copy this summary and send it to the store."));
      d.appendChild(el("pre", "", text));
      var c = el("button", "btn wide", "Copy order");
      c.type = "button";
      c.onclick = function () {
        if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { c.textContent = "Copied"; });
      };
      d.appendChild(c);
      box.appendChild(d);
    }
  });

  $("q").addEventListener("input", function (e) { state.q = e.target.value.trim().toLowerCase(); renderGrid(); });
  $("sort").addEventListener("change", function (e) { state.sort = e.target.value; renderGrid(); });
  $("cartBtn").addEventListener("click", openCart);
  $("closeBtn").addEventListener("click", closeCart);
  $("veil").addEventListener("click", closeCart);

  renderTabs(); renderGrid(); renderCart();
})();
