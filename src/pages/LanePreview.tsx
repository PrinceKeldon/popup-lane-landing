const LanePreview = () => {
  return (
    <div dangerouslySetInnerHTML={{
      __html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>PopUp Lane — Mock Lane with Offers & Carousel</title>
<meta name="description" content="Mock Lane preview — featured, trending, highlights, and multi-row brand feed with offers and image carousel.">

<!-- Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">

<style>
/* ======================================================
   PopUp Lane — Enhanced Design with Urgency & Excitement
   Palette: Neutral (#FAF9F8) + Wine accents (#A23E48 → #C05A61)
   Includes: Featured / Trending / Highlights / Multi-row Feed
   Cards: Main image + discount badge + offer snapshot
   Modal: Carousel (prev/next), details, offers + CTAs
   ====================================================== */

/* ===== tokens ===== */
:root{
  --bg:#FAF9F8;
  --card:#FFFFFF;
  --text:#141414;
  --muted:#5f6163;
  --wine:#A23E48;
  --wine-2:#C05A61;
  --accent:linear-gradient(90deg,var(--wine),var(--wine-2));
  --shadow:0 18px 50px rgba(17,18,23,0.06);
  --maxw:1280px;
  --gutter:18px;
  --urgent-red:#E53935;
  --urgent-red-light:#FF5252;
}

/* ===== base ===== */
*{box-sizing:border-box}
body{margin:0;font-family:"Inter",system-ui,Arial;background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased}
a{color:inherit}
.wrap{max-width:var(--maxw);margin:0 auto;padding:36px var(--gutter) 120px}

/* ===== hero ===== */
.hero{ text-align:center;padding:44px 18px;border-radius:16px;margin-bottom:22px;background:linear-gradient(180deg, rgba(192,90,97,0.03), rgba(250,250,250,0.67)); border:1px solid rgba(162,62,72,0.04); position:relative; overflow:hidden; }
.hero::before{ content:''; position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg, var(--urgent-red), var(--urgent-red-light)); }
.eyebrow{font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:1.6px;margin-bottom:10px}
.hero h1{font-family:"Space Grotesk",serif;font-size:clamp(28px,4.6vw,48px);line-height:1.02;margin:0}
.hero p{max-width:880px;margin:12px auto 18px;color:var(--muted);font-size:16px}
.status-row{display:flex;gap:12px;justify-content:center;align-items:center;margin-top:8px;flex-wrap:wrap}
.pill{padding:8px 12px;border-radius:999px;background:var(--card);border:1px solid rgba(17,18,23,0.04);font-weight:600}
.countdown{display:flex;gap:12px;justify-content:center;margin-top:14px;font-family:Inter,monospace}
.ctas{display:flex;gap:12px;justify-content:center;margin-top:18px;flex-wrap:wrap}
.btn{padding:12px 18px;border-radius:10px;border:none;font-weight:700;cursor:pointer;transition:all 0.2s ease;font-size:14px;}
.btn-primary{background:var(--accent);color:#fff;box-shadow:0 10px 30px rgba(162,62,72,0.06)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 12px 35px rgba(162,62,72,0.15)}
.btn-ghost{background:transparent;border:1px solid rgba(17,18,23,0.06);color:var(--text)}
.btn-ghost:hover{background:rgba(17,18,23,0.03);transform:translateY(-1px)}

/* ===== Featured ===== */
.featured-wrap{margin-top:8px;margin-bottom:18px}
.featured-feed{display:flex;gap:16px;overflow-x:auto;padding:12px 4px;scroll-behavior:smooth;-webkit-overflow-scrolling:touch}
.featured-tile{flex:0 0 340px;border-radius:16px;overflow:hidden;background:var(--card);border:2px solid transparent;box-shadow:0 24px 60px rgba(17,18,23,0.06);display:flex;flex-direction:column;transition:all 0.3s ease;position:relative;}
.featured-tile:hover{transform:translateY(-5px);box-shadow:0 30px 70px rgba(17,18,23,0.12);border-color:rgba(162,62,72,0.1)}
.featured-tile .media{position:relative;height:180px;display:block}
.featured-tile .media img{width:100%;height:100%;object-fit:cover;display:block}
.featured-tile .discount-badge{position:absolute;top:12px;left:12px;background:var(--urgent-red);color:#fff;padding:8px 12px;border-radius:8px;font-weight:800;box-shadow:0 8px 30px rgba(229,57,53,0.25);font-size:14px;z-index:2;animation:pulse 2s infinite;}
@keyframes pulse {
  0% { box-shadow: 0 8px 30px rgba(229,57,53,0.25); }
  50% { box-shadow: 0 8px 30px rgba(229,57,53,0.5); }
  100% { box-shadow: 0 8px 30px rgba(229,57,53,0.25); }
}
.featured-tile .content{padding:16px;flex:1;display:flex;flex-direction:column;justify-content:space-between}
.featured-tile h4{margin:0 0 8px;font-size:18px;}
.featured-tile p{margin:0;color:var(--muted)}
.featured-tile .actions{display:flex;gap:10px;margin-top:12px}

/* ===== Trending strip ===== */
.trending-wrap{margin:18px 0}
.trending-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
.trending-feed{display:flex;gap:12px;overflow-x:auto;padding:8px 4px}
.trending-tile{flex:0 0 260px;border-radius:12px;background:var(--card);padding:12px;border:1px solid rgba(17,18,23,0.04);box-shadow:var(--shadow);display:flex;flex-direction:column;gap:10px;transition:all 0.2s ease;}
.trending-tile:hover{transform:translateY(-3px);box-shadow:0 20px 50px rgba(17,18,23,0.1)}
.trending-tile .media{height:110px;border-radius:8px;overflow:hidden}
.trending-badge{display:inline-block;padding:6px 8px;border-radius:8px;background:rgba(255,110,95,0.12);color:#B02E34;font-weight:700}

/* ===== Highlights (editorial) ===== */
.highlights-wrap{margin:20px 0;padding:16px;border-radius:12px;background:linear-gradient(180deg, rgba(192,90,97,0.02), rgba(250,250,250,0.6));border:1px solid rgba(162,62,72,0.03)}
.highlights-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}
.highlight{background:var(--card);padding:16px;border-radius:10px;box-shadow:0 10px 30px rgba(17,18,23,0.04);min-height:88px;transition:all 0.2s ease;}
.highlight:hover{transform:translateY(-3px);box-shadow:0 15px 35px rgba(17,18,23,0.08)}

/* ===== Main multi-row feed (grid) ===== */
.feed{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;padding:8px 0;margin-top:16px}
.tile{background:var(--card);border-radius:12px;padding:0;border:1px solid rgba(17,18,23,0.04);box-shadow:var(--shadow);display:flex;flex-direction:column;overflow:hidden;transition:all 0.3s ease;}
.tile:hover{transform:translateY(-5px);box-shadow:0 25px 60px rgba(17,18,23,0.12);border-color:rgba(162,62,72,0.1)}
.tile .media{position:relative;height:160px;background:#faf6f6}
.tile .media img{width:100%;height:100%;object-fit:cover;display:block}
.discount-badge{position:absolute;top:10px;left:10px;background:var(--urgent-red);color:#fff;padding:6px 10px;border-radius:8px;font-weight:800;box-shadow:0 8px 30px rgba(229,57,53,0.25);font-size:13px;z-index:2;animation:pulse 2s infinite;}
.tile .body{padding:16px;display:flex;flex-direction:column;gap:8px}
.tile h4{margin:0;font-size:15px}
.tile p{margin:0;color:var(--muted);font-size:14px}
.offer-bar{background:linear-gradient(90deg, rgba(162,62,72,0.04), rgba(192,90,97,0.02));padding:8px;border-radius:8px;font-weight:700;color:var(--wine);font-size:13px}

/* actions */
.actions{display:flex;gap:8px;align-items:center;margin-top:8px;padding:12px}
.btn-visit{background:linear-gradient(90deg,var(--wine),var(--wine-2));color:#fff;border:none;padding:10px 12px;border-radius:8px;font-weight:700;cursor:pointer;transition:all 0.2s ease;font-size:13px;}
.btn-visit:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(162,62,72,0.3)}
.btn-save{background:transparent;border:1px solid rgba(17,18,23,0.06);padding:8px 10px;border-radius:8px;color:var(--wine);font-weight:700;cursor:pointer;transition:all 0.2s ease;font-size:13px;}
.btn-save:hover{background:rgba(162,62,72,0.05);transform:translateY(-1px)}

/* ===== Modal / Carousel ===== */
.modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.45);display:none;align-items:center;justify-content:center;z-index:980}
.modal{width:min(980px,96%);background:var(--card);border-radius:14px;padding:18px;display:flex;gap:18px;box-shadow:0 30px 90px rgba(17,18,23,0.6);max-height:90vh;overflow-y:auto;}
.modal-left{flex:1;min-width:320px;display:flex;flex-direction:column;gap:12px}
.carousel{position:relative;overflow:hidden;border-radius:12px}
.carousel-track{display:flex;transition:transform .36s ease}
.carousel-track img{width:100%;height:380px;object-fit:cover;display:block}
.carousel-nav{position:absolute;top:50%;transform:translateY(-50%);width:100%;display:flex;justify-content:space-between;padding:0 8px;pointer-events:none}
.carousel-button{background:rgba(255,255,255,0.9);border-radius:999px;padding:8px 10px;border:1px solid rgba(17,18,23,0.06);cursor:pointer;pointer-events:auto;transition:all 0.2s ease;}
.carousel-button:hover{background:rgba(255,255,255,1);transform:scale(1.1)}

/* modal right */
.modal-right{flex:1;display:flex;flex-direction:column;gap:12px}
.modal-right h2{margin:0}
.small-muted{color:var(--muted);font-size:14px}

/* drawer & utility */
.drawer{position:fixed;right:18px;bottom:18px;width:360px;max-width:calc(100% - 40px);background:var(--card);border-radius:12px;padding:12px;box-shadow:0 30px 70px rgba(17,18,23,0.12);z-index:800}
.find-item{display:flex;align-items:center;gap:10px;padding:8px;border-radius:8px;border:1px solid rgba(17,18,23,0.03);margin-bottom:8px}
.last-chance{position:sticky;bottom:16px;left:50%;transform:translateX(-50%);max-width:980px;margin:0 auto;padding:12px 18px;border-radius:999px;background:var(--urgent-red);color:#fff;font-weight:700;display:none;z-index:700;animation:pulse 1.5s infinite;text-align:center;}
.closed-overlay{padding:36px;border-radius:12px;text-align:center;background:linear-gradient(180deg,#fff,#fbfbfb);border:1px solid rgba(17,18,23,0.04);box-shadow:var(--shadow);margin-top:20px;display:none}

/* badge styling */
.badge {
  display: inline-block;
  padding: 4px 8px;
  background: rgba(162, 62, 72, 0.08);
  color: var(--wine);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  margin-right: 6px;
}

/* utils */
.muted{color:var(--muted)}
.small{font-size:13px;color:var(--muted)}
.hidden{display:none}

/* responsive */
@media (max-width:980px){
  .featured-tile{flex:0 0 300px}
  .carousel-track img{height:260px}
  .modal{flex-direction:column;padding:14px}
  .modal-left{min-width:100%}
  .drawer{width:92%;right:4%;bottom:12px}
}
</style>
</head>
<body>
<main class="wrap" id="app" aria-live="polite">

  <!-- HERO -->
  <section class="hero" aria-labelledby="hero-title">
    <div class="eyebrow">Black Friday Preview</div>
    <h1 id="hero-title">Discover Small Brands with Big Energy</h1>
    <p id="hero-sub">A living preview of PopUp Lane — featured brands, trending names, editor highlights, and the full multi-row Lane. Each tile shows the main sale product, headline discount, and a quick offer snapshot.</p>

    <div class="status-row" role="status" aria-live="polite">
      <div id="state-pill" class="pill">Preview</div>
      <div id="live-counter" class="small muted">— preview mode</div>
    </div>

    <div class="ctas" role="group" aria-label="Hero actions">
      <button id="explore" class="btn btn-primary">Explore the Lane</button>
      <button id="notify" class="btn btn-ghost">Get Notified</button>
    </div>
  </section>

  <!-- FEATURED -->
  <section class="featured-wrap" aria-label="Featured Brands">
    <h3 style="margin:0 0 8px;font-family:Space Grotesk">Featured Brands</h3>
    <div class="featured-feed" id="featured-feed" aria-live="polite">
      <!-- JS populates featured tiles -->
    </div>
  </section>

  <!-- TRENDING -->
  <section class="trending-wrap" aria-label="Trending brands">
    <div class="trending-header">
      <h3 class="trending-title">🔥 Trending Now</h3>
      <div class="small muted">What shoppers are saving most</div>
    </div>
    <div class="trending-feed" id="trending-feed" aria-live="polite">
      <!-- JS populates trending tiles -->
    </div>
  </section>

  <!-- HIGHLIGHTS -->
  <section class="highlights-wrap" aria-label="PopUp Lane Highlights">
    <div class="highlights-grid" id="highlights-grid">
      <!-- JS populates highlights -->
    </div>
  </section>

  <!-- MAIN FEED (grid) -->
  <section aria-label="Main Lane Feed">
    <div class="feed" id="feed" aria-live="polite" aria-busy="false">
      <!-- JS populates main grid -->
    </div>
  </section>

  <!-- last chance -->
  <div id="last-chance" class="last-chance" role="status" aria-live="polite">Last chance — Lane closes soon</div>

  <!-- closed overlay -->
  <div id="closed-overlay" class="closed-overlay" role="status" aria-live="polite" style="display:none">
    <h3>The Lane is Closed</h3>
    <p class="muted">Thanks for visiting — sign up to be notified when the Lane reopens.</p>
    <div style="margin-top:12px"><button class="btn btn-primary" id="closed-notify">Get Notified</button></div>
  </div>

  <!-- Merchant CTA -->
  <div style="margin-top:22px;text-align:center" class="preview-cta">
    <strong>Merchants:</strong> Want a featured or trending spot? <em>Apply to be featured this season.</em>
    <div style="margin-top:10px"><button id="merchant-apply" class="btn btn-ghost">Apply for a Spot</button></div>
  </div>

  <!-- Drawer: My Finds -->
  <aside id="my-finds" class="drawer" aria-labelledby="finds-title" role="region">
    <h4 id="finds-title">My Finds</h4>
    <div id="finds-list" style="min-height:48px"></div>
    <div style="display:flex;gap:10px;justify-content:space-between;align-items:center;margin-top:8px">
      <button class="btn btn-ghost" id="clear-finds">Clear</button>
      <button class="btn btn-primary" id="email-finds">Email My Finds</button>
    </div>
  </aside>

  <!-- Modal: Brand Spotlight + Carousel -->
  <div id="modal-backdrop" class="modal-backdrop" role="dialog" aria-modal="true" aria-hidden="true">
    <div class="modal" role="document">
      <div class="modal-left">
        <!-- Carousel -->
        <div class="carousel" id="carousel">
          <div class="carousel-track" id="carousel-track">
            <!-- images injected by JS -->
          </div>
          <div class="carousel-nav" aria-hidden="false">
            <button class="carousel-button" id="carousel-prev" aria-label="Previous image">&lt;</button>
            <button class="carousel-button" id="carousel-next" aria-label="Next image">&gt;</button>
          </div>
        </div>
        <div class="small-muted" id="carousel-counter" style="text-align:center;margin-top:6px"></div>
      </div>

      <div class="modal-right">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <h2 id="modal-title">Brand</h2>
            <div class="small-muted" id="modal-tag">Tagline</div>
          </div>
          <div id="modal-badges"></div>
        </div>

        <p id="modal-story" class="small-muted"></p>

        <div id="modal-offers" style="margin-top:6px"></div>

        <div style="margin-top:12px;display:flex;gap:8px">
          <a id="modal-shop" class="btn btn-visit" href="#" target="_blank" rel="noopener">Visit Store</a>
          <button id="modal-save" class="btn btn-save">Save</button>
          <button id="modal-share" class="btn btn-ghost">Share</button>
        </div>

        <div id="modal-footer-note" class="small-muted" style="margin-top:8px"></div>
      </div>
    </div>
  </div>

</main>

<script>
/* ============================================================
   JS: Mock Lane with Offer badges + Modal carousel
   - All brand tiles (Featured/Trending/Main) show main product image,
     discount badge, and an offer snapshot.
   - Clicking opens modal with a 3-image carousel, full offers, and CTAs.
   - clickCount increments when user discovers or visits; drives Trending.
   - My Finds persisted to localStorage.
   - Inline comments indicate where to replace assets or hook analytics.
   ============================================================ */

/* ---------------- CONFIG ---------------- */
const POPUP_CONFIG = {
  seasonName: "BLACK FRIDAY '25",
  openDate: "2025-11-21T10:00:00",
  closeDate: "2025-11-28T23:59:59",
  lastChanceMinutes: 180,
  tracking: { utm_source: "preview_popuplane", utm_campaign: "bf25" }
};

/* ---------------- MOCK BRANDS (8 brands, each with 3 images + offer data) ---------------- */
/* Replace hero/product image URLs with real assets for production.
   Fields:
   id, name, tagline, logoText, tier, clickCount, badges[], shopUrl,
   images: [url1,url2,url3], offer: {headline: '30% OFF', snapshot: 'Free shipping • Ends Nov 25'}
*/
const MOCK_BRANDS = [
  {
    id:'loomfound',
    name:'Loom & Found',
    tagline:'Handwoven home essentials',
    logoText:'LF',
    tier:'featured',
    clickCount:52,
    badges:['Emerging','Sustainable'],
    shopUrl:'https://example.com/loom',
    images:[
      'https://placehold.co/800x520/C05A61/fff?text=Loom+Throw',
      'https://placehold.co/800x520/A23E48/fff?text=Loom+Pillow',
      'https://placehold.co/800x520/ffe6e6/6b3a3a?text=Loom+Set'
    ],
    offer:{headline:'30% OFF', snapshot:'Selected linens • Free shipping over $80'}
  },
  {
    id:'brightstudio',
    name:'Bright Studio',
    tagline:'Modern ceramics & gifts',
    logoText:'BS',
    tier:'featured',
    clickCount:33,
    badges:['Boutique'],
    shopUrl:'https://example.com/bright',
    images:[
      'https://placehold.co/800x520/ffd6d6/6b3a3a?text=Glazed+Cup',
      'https://placehold.co/800x520/ffefef/6b3a3a?text=Ceramic+Set',
      'https://placehold.co/800x520/fff0f0/6b3a3a?text=Plate'
    ],
    offer:{headline:'Buy 2 Get 1', snapshot:'Limited sets • Ends Nov 26'}
  },
  {
    id:'threadtheory',
    name:'Thread Theory',
    tagline:'Apparel with intent',
    logoText:'TT',
    tier:'trending',
    clickCount:118,
    badges:['Style','Trending'],
    shopUrl:'https://example.com/thread',
    images:[
      'https://placehold.co/800x520/efe6e2/6b3a3a?text=Everyday+Tee',
      'https://placehold.co/800x520/e9e0dc/6b3a3a?text=Classic+Shirt',
      'https://placehold.co/800x520/f0eae6/6b3a3a?text=Comfort+Jacket'
    ],
    offer:{headline:'25% OFF', snapshot:'Selected styles • Extra 10% with code LANE10'}
  },
  {
    id:'olivebranch',
    name:'Olive Branch',
    tagline:'Organic skincare',
    logoText:'OB',
    tier:'featured',
    clickCount:64,
    badges:['Wellness','Sustainable'],
    shopUrl:'https://example.com/olive',
    images:[
      'https://placehold.co/800x520/e8ebe5/6b3a3a?text=Repair+Serum',
      'https://placehold.co/800x520/f0f2ed/6b3a3a?text=Glow+Oil',
      'https://placehold.co/800x520/eef1e9/6b3a3a?text=Gift+Set'
    ],
    offer:{headline:'40% OFF', snapshot:'Best sellers only'}
  },
  {
    id:'indieflame',
    name:'Indie Flame',
    tagline:'Small-batch candles',
    logoText:'IF',
    tier:'trending',
    clickCount:96,
    badges:['Limited'],
    shopUrl:'https://example.com/indie',
    images:[
      'https://placehold.co/800x520/fbeeea/6b3a3a?text=Nocturne+Candle',
      'https://placehold.co/800x520/fff1f0/6b3a3a?text=Scent+Set',
      'https://placehold.co/800x520/fff8f6/6b3a3a?text=Gift+Box'
    ],
    offer:{headline:'15% OFF', snapshot:'Holiday scents • Small batches'}
  },
  {
    id:'caffino',
    name:'Caffino',
    tagline:'Cold brew blends',
    logoText:'C',
    tier:'regular',
    clickCount:22,
    badges:['Boutique','Emerging'],
    shopUrl:'https://example.com/caffino',
    images:[
      'https://placehold.co/800x520/e8f0f2/6b3a3a?text=Weekend+Blend',
      'https://placehold.co/800x520/dff0f7/6b3a3a?text=Cold+Brew+Kit',
      'https://placehold.co/800x520/eef7fb/6b3a3a?text=Gift+Pack'
    ],
    offer:{headline:'20% OFF', snapshot:'Subscription discount available'}
  },
  {
    id:'velvetarc',
    name:'Velvet Arc',
    tagline:'Design-led accessories',
    logoText:'VA',
    tier:'regular',
    clickCount:16,
    badges:['Sustainable'],
    shopUrl:'https://example.com/velvet',
    images:[
      'https://placehold.co/800x520/ffeef0/6b3a3a?text=Arc+Wallet',
      'https://placehold.co/800x520/fff5f6/6b3a3a?text=Leather+Tag',
      'https://placehold.co/800x520/fff1f4/6b3a3a?text=Accessory'
    ],
    offer:{headline:'Up to 40% OFF', snapshot:'Select accessories • While stocks last'}
  },
  {
    id:'echolaus',
    name:'Echo Haus',
    tagline:'Speakers for small spaces',
    logoText:'EH',
    tier:'regular',
    clickCount:9,
    badges:['Tech'],
    shopUrl:'https://example.com/echo',
    images:[
      'https://placehold.co/800x520/fff2e6/6b3a3a?text=Pocket+Speaker',
      'https://placehold.co/800x520/fff9f1/6b3a3a?text=Mini+Dock',
      'https://placehold.co/800x520/fffaf6/6b3a3a?text=Compact+Set'
    ],
    offer:{headline:'10% OFF', snapshot:'Bundle deals available'}
  },
  {
    id:'mintwell',
    name:'Mintwell',
    tagline:'Plant-forward skincare',
    logoText:'MW',
    tier:'regular',
    clickCount:28,
    badges:['Sustainable'],
    shopUrl:'https://example.com/mint',
    images:[
      'https://placehold.co/800x520/fff7f5/6b3a3a?text=Calm+Serum',
      'https://placehold.co/800x520/fffaf8/6b3a3a?text=Cleanser',
      'https://placehold.co/800x520/fff9f7/6b3a3a?text=Gift+Set'
    ],
    offer:{headline:'Bundle Deal', snapshot:'Buy serum + cleanser, save 30%'}
  }
];

/* ---------------- POPUP HIGHLIGHTS ---------------- */
const POPUP_HIGHLIGHTS = [
  { id:'h1', title:'Coming Soon: Black Friday Specials', text:'A curated set of limited-time offers — preview what arrives next week.' },
  { id:'h2', title:'Editor Picks', text:'Brands our team loves this season.' },
  { id:'h3', title:'Shop Small, Scale Smart', text:'How small merchants can make big impact during seasonal drops.' }
];

/* ---------------- APP STATE ---------------- */
const APP = {
  brands: MOCK_BRANDS.slice(),
  finds: [],
  current: null,
  carouselIndex: 0
};

/* ---------------- DOM refs ---------------- */
const featuredFeedEl = document.getElementById('featured-feed');
const trendingFeedEl = document.getElementById('trending-feed');
const highlightsGridEl = document.getElementById('highlights-grid');
const feedEl = document.getElementById('feed');
const findsListEl = document.getElementById('finds-list');
const modalBackdrop = document.getElementById('modal-backdrop');
const carouselTrack = document.getElementById('carousel-track');
const carouselCounter = document.getElementById('carousel-counter');
const carouselPrev = document.getElementById('carousel-prev');
const carouselNext = document.getElementById('carousel-next');
const modalTitle = document.getElementById('modal-title');
const modalTag = document.getElementById('modal-tag');
const modalStory = document.getElementById('modal-story');
const modalBadges = document.getElementById('modal-badges');
const modalShop = document.getElementById('modal-shop');
const modalSave = document.getElementById('modal-save');
const modalShare = document.getElementById('modal-share');
const modalOffers = document.getElementById('modal-offers');
const modalFooterNote = document.getElementById('modal-footer-note');
const liveCounterEl = document.getElementById('live-counter');

/* ---------------- Helpers ---------------- */
const pad = n => String(n).padStart(2,'0');
const escapeHtml = s => { if(!s && s !== 0) return ''; return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); };
function addUtm(url, params){
  try{ const u = new URL(url); if(params.source) u.searchParams.set('utm_source', params.source); if(params.campaign) u.searchParams.set('utm_campaign', params.campaign); if(params.content) u.searchParams.set('utm_content', params.content); return u.toString(); }catch(e){ return url; }
}

/* ---------------- Init ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  loadFinds();
  renderAllSections();
  attachGlobalHandlers();
  startLiveCounter();
});

/* ---------------- Render Sections ---------------- */
function renderAllSections(){
  renderFeatured();
  renderTrending();
  renderHighlights();
  renderFeed();
}

function renderFeatured(){
  featuredFeedEl.innerHTML = '';
  const featured = APP.brands.filter(b => b.tier === 'featured');
  featured.forEach(b=>{
    const tile = document.createElement('div');
    tile.className = 'featured-tile';
    tile.innerHTML = \`
      <div class="media">
        <img src="\${escapeHtml(b.images[0])}" alt="\${escapeHtml(b.name)} main product" loading="lazy">
        <div class="discount-badge">\${escapeHtml(b.offer.headline)}</div>
      </div>
      <div class="content">
        <div>
          <h4>\${escapeHtml(b.name)}</h4>
          <p class="muted">\${escapeHtml(b.tagline)}</p>
          <div style="margin-top:8px"><small class="muted">\${escapeHtml(b.badges.join(' • '))}</small></div>
        </div>
        <div class="actions">
          <button class="btn btn-primary feat-discover" data-id="\${escapeHtml(b.id)}">Discover</button>
          <button class="btn btn-ghost feat-visit" data-id="\${escapeHtml(b.id)}">Visit</button>
        </div>
      </div>
    \`;
    featuredFeedEl.appendChild(tile);
  });

  featuredFeedEl.querySelectorAll('.feat-discover').forEach(btn=> btn.addEventListener('click', e=> openModalById(e.target.dataset.id)));
  featuredFeedEl.querySelectorAll('.feat-visit').forEach(btn=> btn.addEventListener('click', e=> visitBrandById(e.target.dataset.id)));
}

function renderTrending(){
  trendingFeedEl.innerHTML = '';
  const trending = APP.brands.slice().sort((a,b)=> (b.clickCount||0) - (a.clickCount||0)).slice(0,8);
  trending.forEach(b=>{
    const tile = document.createElement('div');
    tile.className = 'trending-tile';
    tile.innerHTML = \`
      <div class="media"><img src="\${escapeHtml(b.images[0])}" alt="\${escapeHtml(b.name)} main" loading="lazy" style="width:100%;height:100%;object-fit:cover;border-radius:8px"></div>
      <strong>\${escapeHtml(b.name)}</strong>
      <div class="muted" style="font-size:13px">\${escapeHtml(b.tagline)}</div>
      <div style="margin-top:8px"><span class="trending-badge">🔥 Trending</span> <span class="small muted" style="margin-left:8px">\${b.clickCount||0} saves</span></div>
      <div style="margin-top:10px;display:flex;gap:8px">
        <button class="btn btn-primary trend-discover" data-id="\${escapeHtml(b.id)}">Discover</button>
        <button class="btn btn-ghost trend-visit" data-id="\${escapeHtml(b.id)}">Visit</button>
      </div>
    \`;
    trendingFeedEl.appendChild(tile);
  });

  trendingFeedEl.querySelectorAll('.trend-discover').forEach(btn=> btn.addEventListener('click', e=> openModalById(e.target.dataset.id)));
  trendingFeedEl.querySelectorAll('.trend-visit').forEach(btn=> btn.addEventListener('click', e=> visitBrandById(e.target.dataset.id)));
}

function renderHighlights(){
  highlightsGridEl.innerHTML = '';
  POPUP_HIGHLIGHTS.forEach(h=>{
    const card = document.createElement('article');
    card.className = 'highlight';
    card.innerHTML = \`<h4>\${escapeHtml(h.title)}</h4><p>\${escapeHtml(h.text)}</p>\`;
    highlightsGridEl.appendChild(card);
  });
}

function renderFeed(){
  feedEl.innerHTML = '';
  APP.brands.forEach(b=>{
    const art = document.createElement('article');
    art.className = 'tile';
    art.innerHTML = \`
      <div class="media">
        <img src="\${escapeHtml(b.images[0])}" alt="\${escapeHtml(b.name)} main product" loading="lazy">
        <div class="discount-badge">\${escapeHtml(b.offer.headline)}</div>
      </div>
      <div class="body">
        <div>
          <h4>\${escapeHtml(b.name)}</h4>
          <p class="muted">\${escapeHtml(b.tagline)}</p>
          <div class="badges">\${(b.badges||[]).map(x=>\`<span class="badge">\${escapeHtml(x)}</span>\`).join('')}</div>
          <div class="offer-bar" style="margin-top:8px">\${escapeHtml(b.offer.snapshot)}</div>
        </div>
        <div class="actions">
          <button class="btn-visit" data-id="\${escapeHtml(b.id)}">Discover</button>
          <button class="btn-save" data-id="\${escapeHtml(b.id)}">\${isSaved(b.id)?'Saved':'Save'}</button>
        </div>
      </div>
    \`;
    feedEl.appendChild(art);
  });

  // Attach tile handlers
  feedEl.querySelectorAll('.btn-visit').forEach(btn=> btn.addEventListener('click', e=> openModalById(e.target.dataset.id)));
  feedEl.querySelectorAll('.btn-save').forEach(btn=> btn.addEventListener('click', e=> { 
    toggleSave(e.target.dataset.id); 
    e.target.textContent = isSaved(e.target.dataset.id)?'Saved':'Save'; 
    renderTrending(); 
  }));
}

/* ---------------- Modal + Carousel ---------------- */
function openModalById(id){
  const b = APP.brands.find(x=> x.id === id);
  if(!b) return;
  APP.current = b;
  // populate modal content
  modalTitle.textContent = b.name;
  modalTag.textContent = b.tagline || '';
  modalStory.textContent = b.description || b.tagline || '';
  modalBadges.innerHTML = (b.badges||[]).map(x=> \`<span class="badge">\${escapeHtml(x)}</span>\`).join(' ');
  modalOffers.innerHTML = \`<div class="offer-bar">\${escapeHtml(b.offer.snapshot)}</div><div style="margin-top:8px;font-weight:800">\${escapeHtml(b.offer.headline)}</div>\`;
  modalShop.href = addUtm(b.shopUrl, {source:POPUP_CONFIG.tracking.utm_source, campaign:POPUP_CONFIG.tracking.utm_campaign, content:b.id});
  modalSave.textContent = isSaved(b.id)?'Saved':'Save';
  modalFooterNote.textContent = 'You will be taken to the merchant store to complete purchase — PopUp Lane does not process payments.';
  // build carousel
  buildCarousel(b.images || []);
  // show modal
  modalBackdrop.style.display = 'flex';
  modalBackdrop.setAttribute('aria-hidden','false');
  // engagement
  incrementClick(b.id);
  renderTrending();
}

/* build carousel DOM */
function buildCarousel(images){
  carouselTrack.innerHTML = '';
  images.forEach(src=>{
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.loading = 'lazy';
    carouselTrack.appendChild(img);
  });
  APP.carouselIndex = 0;
  updateCarousel();
}

/* carousel controls */
carouselPrev.addEventListener('click', ()=> {
  if(!carouselTrack.children.length) return;
  APP.carouselIndex = (APP.carouselIndex - 1 + carouselTrack.children.length) % carouselTrack.children.length;
  updateCarousel();
});
carouselNext.addEventListener('click', ()=> {
  if(!carouselTrack.children.length) return;
  APP.carouselIndex = (APP.carouselIndex + 1) % carouselTrack.children.length;
  updateCarousel();
});

function updateCarousel(){
  const count = carouselTrack.children.length;
  if(count === 0) { 
    carouselTrack.style.transform = ''; 
    carouselCounter.textContent = ''; 
    return; 
  }
  const offset = APP.carouselIndex * carouselTrack.clientWidth;
  carouselTrack.style.transform = \`translateX(-\${APP.carouselIndex * 100}%)\`;
  carouselCounter.textContent = \`\${APP.carouselIndex + 1} / \${count}\`;
}

/* close modal */
modalBackdrop.addEventListener('click', (e)=> { 
  if(e.target === modalBackdrop) closeModal(); 
});
document.addEventListener('keydown', (e)=> { 
  if(e.key === 'Escape') closeModal(); 
});
function closeModal(){ 
  modalBackdrop.style.display = 'none'; 
  modalBackdrop.setAttribute('aria-hidden','true'); 
  APP.current = null; 
}

/* ---------------- Visit brand (open link + track) ---------------- */
function visitBrandById(id){
  const b = APP.brands.find(x=> x.id === id);
  if(!b) return;
  incrementClick(id);
  trackClickOut(b);
  const url = addUtm(b.shopUrl, {source:POPUP_CONFIG.tracking.utm_source, campaign:POPUP_CONFIG.tracking.utm_campaign, content:id});
  window.open(url, '_blank', 'noopener');
  renderTrending();
}

/* ---------------- Click / Trending metrics ---------------- */
function incrementClick(id){
  const b = APP.brands.find(x=> x.id === id);
  if(!b) return;
  b.clickCount = (b.clickCount || 0) + 1;
  // Optional: POST to analytics endpoint to persist clickCount
  // fetch('/api/track-click', {method:'POST', body: JSON.stringify({brandId:id})});
}

/* ---------------- My Finds (localStorage) ---------------- */
function loadFinds(){
  try{ 
    APP.finds = JSON.parse(localStorage.getItem('pl_finds')||'[]') || []; 
  }catch(e){ 
    APP.finds = []; 
  }
  renderFinds();
}
function saveFinds(){ 
  localStorage.setItem('pl_finds', JSON.stringify(APP.finds)); 
  renderFinds(); 
}
function isSaved(id){ 
  return APP.finds.includes(id); 
}
function toggleSave(id){
  if(isSaved(id)) {
    APP.finds = APP.finds.filter(x=> x !== id);
  } else {
    APP.finds.push(id);
  }
  saveFinds();
}
function renderFinds(){
  findsListEl.innerHTML = '';
  if(APP.finds.length === 0){ 
    findsListEl.innerHTML = '<div class="small muted">Save brands as you browse — they\\'ll appear here.</div>'; 
    return; 
  }
  APP.finds.forEach(id=>{
    const b = APP.brands.find(x=> x.id === id);
    if(!b) return;
    const div = document.createElement('div');
    div.className = 'find-item';
    div.innerHTML = \`
      <div class="logo" aria-hidden="true" style="width:48px;height:48px;border-radius:8px;background:#faf6f6;display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--wine)">\${escapeHtml(b.logoText)}</div>
      <div style="flex:1">
        <strong>\${escapeHtml(b.name)}</strong>
        <div class="small muted">\${escapeHtml(b.tagline)}</div>
      </div>
      <button class="btn btn-ghost remove-find" data-id="\${escapeHtml(b.id)}">Remove</button>
    \`;
    div.querySelector('.remove-find').addEventListener('click', ()=> { 
      APP.finds = APP.finds.filter(x => x !== b.id); 
      saveFinds(); 
    });
    findsListEl.appendChild(div);
  });
}

/* clear & email finds (demo) */
document.getElementById('clear-finds').addEventListener('click', ()=> { 
  if(confirm('Clear saved brands?')) { 
    APP.finds = []; 
    saveFinds(); 
  }
});
document.getElementById('email-finds').addEventListener('click', ()=> {
  const email = prompt('Enter your email to receive your saved brands (demo):');
  if(!email) return;
  // In production: POST to notify/email endpoint with APP.finds
  alert('Thanks — we would email your saved brands to ' + email + '. (Hook to email service in production.)');
});

/* ---------------- Sharing & Tracking placeholders ---------------- */
modalShare.addEventListener('click', ()=> { 
  if(!APP.current) return; 
  shareBrand(APP.current); 
});
function shareBrand(b){
  const url = addUtm(b.shopUrl, {source:POPUP_CONFIG.tracking.utm_source, campaign:POPUP_CONFIG.tracking.utm_campaign, content:b.id});
  if(navigator.share) {
    navigator.share({title:\`Check \${b.name} on PopUp Lane\`, text: b.tagline, url});
  } else {
    navigator.clipboard.writeText(url).then(()=> alert('Link copied to clipboard'));
  }
}
function trackClickOut(b){
  // Hook to analytics provider here (Plausible/GA/PostHog)
  console.log('TRACK CLICKOUT', b.id);
}

/* ---------------- UI Attachments ---------------- */
function attachGlobalHandlers(){
  // hero explore
  document.getElementById('explore').addEventListener('click', ()=> {
    document.querySelector('.featured-feed').scrollIntoView({behavior:'smooth'});
  });
  document.getElementById('notify').addEventListener('click', ()=> {
    alert('Notification signup would appear here in production');
  });
  document.getElementById('merchant-apply').addEventListener('click', ()=> {
    alert('Merchant application would appear here in production');
  });
  document.getElementById('closed-notify').addEventListener('click', ()=> {
    alert('Notification signup would appear here in production');
  });

  // periodically refresh trending so it reflects new clickCounts
  setInterval(()=> renderTrending(), 1500);
}

/* ---------------- Live counter (simulated) ---------------- */
function startLiveCounter(){
  let val = Math.floor(Math.random()*140)+20;
  liveCounterEl.textContent = \`\${val} shoppers browsing\`;
  setInterval(()=> { 
    val += Math.floor(Math.random()*7)-3; 
    val = Math.max(6,val); 
    liveCounterEl.textContent = \`\${val} shoppers browsing\`; 
  }, 5000 + Math.random()*4000);
}

/* ---------------- Initial render (ensures UI shown) ---------------- */
renderAllSections();

</script>
</body>
</html>
      `
    }} />
  );
};

export default LanePreview;
