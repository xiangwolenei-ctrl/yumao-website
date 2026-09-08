/* Yumao Pet — Smart Assistant (built-in FAQ chatbot, offline, free) */
(function () {
  'use strict';
  if (window.YumaoChat) return;

  // ---------- Knowledge base (English) ----------
  const KB = [
    {
      k: ['moq', 'minimum order', 'quantity', 'how many', 'small order', 'order quantity'],
      a: 'Our MOQ is 100 pcs per model for most products. For first orders or market testing we can discuss smaller trial orders — tell us your target quantity and we will try to support you.'
    },
    {
      k: ['price', 'cost', 'how much', 'quote', 'pricing', 'exw', 'fob', 'cif', 'wholesale price'],
      a: 'All prices on our site are EXW factory prices in USD (tax and freight excluded). We can quote FOB / CIF / DDP to your port — just tell us your destination and quantity. Prices start from $5.56 for entry models up to premium smart models around $25 retail.'
    },
    {
      k: ['sample', 'samples', 'try', 'test before'],
      a: 'Yes, samples are available. Sample cost is charged and refundable against a bulk order. Delivery by DHL/FedEx/UPS takes about 3–7 days. Tell us the model and we will arrange it.'
    },
    {
      k: ['lead time', 'delivery time', 'shipping time', 'how long', 'production time'],
      a: 'Stock / standard models: 7–15 days after confirmation. Custom OEM/ODM: 25–45 days. Shipping to US/EU by sea takes about 25–40 days; express 3–7 days.'
    },
    {
      k: ['payment', 'pay', 'tt', 'deposit', 'terms', 'western union', 'paypal'],
      a: 'We accept T/T bank transfer (30% deposit, 70% before shipment) and Alibaba Trade Assurance. PayPal is accepted for samples. Full terms are on our quotation sheet.'
    },
    {
      k: ['shipping', 'delivery', 'freight', 'sea', 'air', 'express', 'dhl', 'fedex', 'ups', 'transport'],
      a: 'We ship by sea (economical for bulk), air, or international express (samples). We can quote FOB / CIF / DDP and handle shipping to your port or door.'
    },
    {
      k: ['certification', 'certificate', 'ce', 'fcc', 'rohs', 'msds', 'un38.3', 'ul', 'compliance', 'document'],
      a: 'Our products are CE / FCC / RoHS compliant. Products with rechargeable batteries include MSDS, Sea Transport Identification Report and UN38.3 test report for air/sea shipping and Amazon FBA. Custom certifications can be arranged for bulk orders.'
    },
    {
      k: ['oem', 'odm', 'custom', 'customize', 'private label', 'logo', 'brand', 'packaging', 'design'],
      a: 'Yes — we are the factory with our own R&D and mold team. We support custom logo, color, packaging, manuals and full ODM development. One-stop from mold to finished goods.'
    },
    {
      k: ['warranty', 'guarantee', 'quality', 'defect', 'return', 'replace', 'after-sale'],
      a: 'Every unit is 100% function-tested before packing. We provide a 12-month warranty — defective units are replaced or credited after inspection.'
    },
    {
      k: ['pump-free', 'no pump', 'pumpless', 'without pump', 'water fountain', 'fountain'],
      a: 'Our pump-free fountains have no water pump inside — no clogging, no mold, no noise, no pump failure. 100% water-electricity separation for safety, with infrared sensor and multiple flow modes. A truly differentiated product for the US/EU market.'
    },
    {
      k: ['discount', 'cheaper', 'best price', 'deal', 'offer', 'bulk discount'],
      a: 'Prices are already factory-direct. For larger quantities (500+, 1000+) we can offer better pricing — send us your target quantity and we will give you the best rate.'
    },
    {
      k: ['who', 'about', 'company', 'factory', 'manufacturer', 'where', 'location', 'visit'],
      a: 'ShenZhen Yumao Technology Co., Ltd. operates a 23,000 m² self-contained factory in Dongguan, Guangdong, China — 219 production staff and 13 R&D engineers. Customers are always welcome to visit.'
    },
    {
      k: ['contact', 'whatsapp', 'email', 'phone', 'call', 'reach', 'talk', 'human', 'agent'],
      a: 'You can reach us 24/7: Siyang Shen +86 135 4378 0054, Yuan Weipeng +86 156 3918 6565 (WhatsApp). Or leave your email and question in the inquiry form below and we reply within 24 hours.'
    },
    {
      k: ['cat', 'dog', 'which', 'recommend', 'suitable', 'best seller', 'popular', 'hot'],
      a: 'Our best sellers are WF670 / WF560 pump-free smart fountains and PFF015 / PFF040 smart feeders. For cats we recommend fountains with quiet sensor modes; for large dogs, the 12L WF610. Tell us your target pets and channel and we will recommend models + pricing.'
    },
    {
      k: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
      a: 'Hello! 👋 Welcome to Yumao Pet — a direct pet water fountain / feeder factory. Ask me about prices, MOQ, samples, shipping, or customization, and I will answer right away.'
    },
    {
      k: ['thank', 'thanks', 'great', 'perfect', 'ok', 'nice'],
      a: 'You are welcome! 😊 Anything else about our products, prices or samples — just ask.'
    }
  ];

  const FALLBACK = 'Sorry, I could not find that in my knowledge base. 😅 For specific questions please leave your email/WhatsApp in the inquiry form, or contact Siyang Shen (+86 135 4378 0054) / Yuan Weipeng (+86 156 3918 6565) — we reply within 24 hours.';

  function answer(q) {
    const text = String(q || '').toLowerCase();
    let best = null, bestScore = 0;
    for (const item of KB) {
      let score = 0;
      for (const kw of item.k) {
        if (text.includes(kw)) score += kw.length > 4 ? 2 : 1;
      }
      if (score > bestScore) { bestScore = score; best = item; }
    }
    return bestScore >= 2 ? best.a : FALLBACK;
  }

  // ---------- UI ----------
  function build() {
    const styles = document.createElement('style');
    styles.textContent = `
#yumao-chat-btn{position:fixed;right:22px;bottom:22px;z-index:9999;width:58px;height:58px;border-radius:50%;
 background:linear-gradient(135deg,#0284c7,#38bdf8);color:#fff;font-size:26px;display:flex;align-items:center;justify-content:center;
 box-shadow:0 8px 24px rgba(2,132,199,.4);cursor:pointer;border:0;transition:transform .15s}
#yumao-chat-btn:hover{transform:scale(1.08)}
#yumao-chat-btn .dot{position:absolute;top:2px;right:2px;width:13px;height:13px;background:#f97316;border-radius:50%;border:2px solid #fff}
#yumao-chat{position:fixed;right:22px;bottom:90px;z-index:9999;width:min(380px,92vw);height:min(520px,75vh);border-radius:18px;
 background:#fff;box-shadow:0 24px 70px rgba(15,23,42,.28);display:none;flex-direction:column;overflow:hidden;border:1px solid #e2e8f0}
#yumao-chat.open{display:flex}
.yc-head{background:linear-gradient(135deg,#0c4a6e,#0284c7);color:#fff;padding:14px 18px;display:flex;align-items:center;gap:10px}
.yc-head .ava{width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:19px}
.yc-head b{font-size:15px}
.yc-head small{display:block;color:#bae6fd;font-size:11px}
.yc-head .x{margin-left:auto;background:none;border:0;color:#fff;font-size:22px;cursor:pointer}
.yc-body{flex:1;overflow-y:auto;padding:16px;background:#f8fafc;display:flex;flex-direction:column;gap:10px}
.yc-msg{max-width:85%;padding:10px 13px;border-radius:13px;font-size:13.5px;line-height:1.55;white-space:pre-wrap}
.yc-in{background:#e2e8f0;color:#0f172a;align-self:flex-end;border-bottom-right-radius:3px}
.yc-out{background:#fff;color:#0f172a;border:1px solid #e2e8f0;align-self:flex-start;border-bottom-left-radius:3px}
.yc-out .who{display:block;font-size:10px;color:#0284c7;font-weight:700;margin-bottom:3px}
.yc-quick{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 6px;background:#f8fafc}
.yc-quick button{border:1px solid #bae6fd;background:#fff;color:#0369a1;font-size:11.5px;padding:5px 10px;border-radius:999px;cursor:pointer}
.yc-quick button:hover{background:#f0f9ff}
.yc-input{display:flex;gap:8px;padding:12px;border-top:1px solid #e2e8f0;background:#fff}
.yc-input input{flex:1;padding:10px 13px;border:1.5px solid #e2e8f0;border-radius:999px;font-size:13.5px;outline:none;font-family:inherit}
.yc-input input:focus{border-color:#0284c7}
.yc-input button{background:linear-gradient(135deg,#0284c7,#38bdf8);color:#fff;border:0;border-radius:999px;padding:0 18px;font-size:15px;cursor:pointer}
@media (max-width:480px){#yumao-chat{right:10px;bottom:80px;width:96vw}}`;
    document.head.appendChild(styles);

    const btn = document.createElement('button');
    btn.id = 'yumao-chat-btn';
    btn.innerHTML = '💬<span class="dot"></span>';
    btn.setAttribute('aria-label', 'Chat assistant');
    btn.addEventListener('click', () => panel.classList.toggle('open'));

    const panel = document.createElement('div');
    panel.id = 'yumao-chat';
    panel.innerHTML =
      '<div class="yc-head"><div class="ava">🤖</div><div><b>Yumao Assistant</b><small>Online · replies instantly</small></div>' +
      '<button class="x" aria-label="Close">×</button></div>' +
      '<div class="yc-body" id="ycBody"></div>' +
      '<div class="yc-quick">' +
        '<button>Price & MOQ</button><button>Samples</button><button>Shipping</button><button>Certifications</button><button>OEM/ODM</button>' +
      '</div>' +
      '<div class="yc-input"><input id="ycInput" placeholder="Type your question… e.g. What is the MOQ?"><button id="ycSend">➤</button></div>';

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    const body = panel.querySelector('#ycBody');
    const input = panel.querySelector('#ycInput');
    const send = panel.querySelector('#ycSend');

    function push(text, from) {
      const div = document.createElement('div');
      div.className = 'yc-msg ' + (from === 'in' ? 'yc-in' : 'yc-out');
      div.innerHTML = from === 'in' ? escapeHtml(text) : '<span class="who">Yumao Assistant</span>' + escapeHtml(text);
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    }
    function escapeHtml(s) {
      return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function ask(q) {
      const text = (q || '').trim();
      if (!text) return;
      push(text, 'in');
      input.value = '';
      const a = answer(text);
      setTimeout(() => push(a, 'out'), 350 + Math.random() * 400);
    }
    send.addEventListener('click', () => ask(input.value));
    input.addEventListener('keydown', e => { if (e.key === 'Enter') ask(input.value); });
    panel.querySelector('.x').addEventListener('click', () => panel.classList.remove('open'));
    panel.querySelectorAll('.yc-quick button').forEach(b => {
      b.addEventListener('click', () => ask(b.textContent));
    });

    // greeting
    setTimeout(() => {
      push('Hello! 👋 I am the Yumao Pet assistant. Ask me anything — prices, MOQ, samples, shipping, certifications, customization. I answer instantly!', 'out');
    }, 600);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();

  window.YumaoChat = { answer };
})();
