import { useState, useEffect } from "react";

/* ---------------- DESIGN TOKENS ---------------- */
const INK = "#17161A", PAPER = "#F3F2EE", MUTED = "#6E6A63", HAIR = "rgba(23,22,26,0.12)";
const CARD_BG = "#1A1823", GOLD = "#C9A54A", CREAM = "#F1E9D6";

const CSS = [
"@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=Fraunces:ital,opsz,wght@1,9..144,400;1,9..144,500&display=swap');",
":root { color-scheme: light; }",
".q-display { font-family: 'Space Grotesk', 'Helvetica Neue', sans-serif; letter-spacing: -0.03em; font-weight: 700; }",
".q-body { font-family: 'Inter', 'Helvetica Neue', sans-serif; }",
".q-whimsy { font-family: 'Fraunces', Georgia, serif; font-style: italic; }",
".q-eyebrow { font-family: 'Inter', sans-serif; font-weight: 600; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; }",
".q-card { background: #fff; border: 1px solid rgba(23,22,26,0.10); border-radius: 20px; box-shadow: 0 1px 2px rgba(23,22,26,0.03); }",
".q-answer { transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease; cursor: pointer; }",
".q-answer:hover { border-color: #17161A; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(23,22,26,0.08); }",
".q-answer:active { transform: translateY(0) scale(0.985); }",
".q-btn { transition: transform .15s ease, opacity .15s ease; }",
".q-btn:hover { opacity: 0.9; } .q-btn:active { transform: scale(0.97); }",
"@keyframes qUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }",
"@keyframes qPop { 0% { opacity: 0; transform: scale(0.92); } 70% { transform: scale(1.015); } 100% { opacity: 1; transform: scale(1); } }",
"@keyframes qDraw { from { opacity: 0; transform: translateY(16px) rotate(-2deg); } to { opacity: 1; transform: translateY(0) rotate(0deg); } }",
".anim-up { animation: qUp .45s cubic-bezier(.2,.7,.2,1) both; }",
".anim-pop { animation: qPop .5s cubic-bezier(.2,.7,.2,1) both; }",
".anim-draw { animation: qDraw .7s cubic-bezier(.2,.7,.2,1) both; }",
".q-focus:focus-visible { outline: 2px solid #17161A; outline-offset: 3px; }",
".deck { position: relative; display: block; width: 234px; height: 314px; margin: 0 auto; background: none; border: none; padding: 0; cursor: pointer; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }",
".deck-card { position: absolute; left: 50%; top: 0; width: 212px; margin-left: -106px; transition: transform .45s cubic-bezier(.22,.9,.32,1.15), opacity .35s ease; will-change: transform; }",
".deck-inner { border-radius: 12px; overflow: hidden; background: #0d1020; box-shadow: 0 14px 32px rgba(23,22,26,0.4); }",
".deck-top .deck-inner { animation: deckSway 5.5s 1.2s ease-in-out infinite alternate; }",
".deck-inner img { display: block; width: 100%; }",
".deck-fallback { display: none; aspect-ratio: 4 / 5; flex-direction: column; align-items: center; justify-content: center; gap: 5px; border: 2px solid #C9A54A; border-radius: 12px; background: #1A1823; padding: 10px; text-align: center; }",
"@keyframes deckSway { from { transform: rotate(0deg) translateY(0); } to { transform: rotate(1.6deg) translateY(-5px); } }",
"@media (prefers-reduced-motion: reduce) { .anim-up, .anim-pop, .anim-draw { animation: none !important; } .q-answer, .q-btn { transition: none !important; } .deck-inner, .deck-top .deck-inner { animation: none !important; } .deck-card { transition: none !important; } }",
".print-block { display: none; }",
"@media print { .no-print { display: none !important; } .print-block { display: block !important; } body { background: #fff !important; } .q-card { box-shadow: none !important; border-color: #c9c6bd !important; } .anim-up, .anim-pop, .anim-draw { animation: none !important; } }",
].join("\n");

/* ---------------- ELEMENTS & HEROES ---------------- */
const ELEMENTS = {
  light: {
    name: "Light", color: "#F5C400", dark: true, numeral: "X",
    hero: { emoji: "✨", name: "Lumen the Firefly",
      bio: "A Prospect Park firefly, yes, New York has fireflies; look low over the meadows on a July night. Lumen chases golden hour across all five boroughs and believes every rooftop deserves a sunset.",
      why: "You kept picking the glow, golden hours, dawn starts, skyline dusks. Lumen routes you toward parks, promenades, and rooms that catch the light." },
    cheer: "✨ Lumen glows a little brighter.",
    style: "golden-hour wanderer",
    hoods: ["prospectHeights", "fortGreene", "harlem", "chelsea"],
    wildcard: { name: "Sunset at Gantry Plaza State Park", note: "The Pepsi-Cola sign, the skyline, the river turning gold, Lumen's favorite bench in the city. (Long Island City, Queens)" },
  },
  dream: {
    name: "Dream", color: "#A64AC9", dark: false, numeral: "IX",
    hero: { emoji: "🦋", name: "Luna the Moth",
      bio: "A night moth from the lamplit lanes of Greenwich Village, where streets bend like they were drawn from memory. Luna sleeps through brunch and comes alive when the streetlamps do.",
      why: "Your answers favored slow mornings and happy detours. Luna plans days with room to wander and evenings that run a little late." },
    cheer: "🦋 Luna flutters approvingly.",
    style: "wandering romantic",
    hoods: ["westVillage", "washingtonHeights", "ditmasPark"],
    wildcard: { name: "A night show at United Palace", note: "A 1930s movie palace in Washington Heights so ornate it feels imagined. Luna insists you look up the whole time." },
  },
  rock: {
    name: "Rock", color: "#E23B2E", dark: false, numeral: "III",
    hero: { emoji: "🐦", name: "Rex the Pigeon",
      bio: "A native New York pigeon in a tiny leather jacket, his flock has worked these streets since the 1800s. Rex has seen every band worth seeing from a fire escape and will absolutely steal your fries.",
      why: "You chose loud guitars and dollar slices eaten standing up. Rex books you dive bars, mural alleys, and rooms where the amps still buzz." },
    cheer: "🐦 Rex bobs his head to the beat.",
    style: "gritty scene-seeker",
    hoods: ["astoria", "bushwick", "lowerEastSide"],
    wildcard: { name: "A show at Union Pool", note: "Williamsburg's beloved dive-with-a-backyard, taco truck, tiki bar, loud guitars. Rex knows the sound guy." },
  },
  storm: {
    name: "Storm", color: "#1D50A2", dark: false, numeral: "IV",
    hero: { emoji: "🦅", name: "Gale the Peregrine Falcon",
      bio: "A peregrine nesting on a skyscraper ledge, New York hosts one of the densest urban peregrine populations on Earth, and they're the fastest animals alive. Gale does everything at full speed.",
      why: "Dawn starts, wind at your back, see-everything pace: Gale packs your days full and trusts you to keep up." },
    cheer: "🦅 Gale dives with delight.",
    style: "high-velocity explorer",
    hoods: ["bushwick", "redHook", "astoria"],
    wildcard: { name: "Ride the Wonder Wheel", note: "Coney Island's swinging cars over the Atlantic. Gale calls it 'a good start.'" },
  },
  ember: {
    name: "Ember", color: "#EE6123", dark: false, numeral: "V",
    hero: { emoji: "🦎", name: "Cinder the Salamander",
      bio: "An eastern red-backed salamander from the woods of Inwood Hill Park, they really do live wild in Manhattan. Cinder follows smoke, sizzle, and steam wherever they drift.",
      why: "You followed the food in nearly every answer. Cinder routes your trip cart by cart, grill by grill, borough by borough." },
    cheer: "🦎 Cinder sizzles happily.",
    style: "flavor-first pilgrim",
    hoods: ["jacksonHeights", "lowerEastSide", "koreatown", "sunsetPark", "chinatown"],
    wildcard: { name: "The Queens Night Market (seasonal, Sat nights)", note: "Dozens of vendors, nearly everything around $5–6, in Flushing Meadows. Cinder's holy site." },
  },
  tide: {
    name: "Tide", color: "#0E8A4D", dark: false, numeral: "VIII",
    hero: { emoji: "🦭", name: "Moxie the Harbor Seal",
      bio: "A harbor seal who winters in New York Harbor, truly; look for them hauled out near Staten Island's Swinburne Island. Moxie knows every pier, ferry, and oyster happy hour on the waterline.",
      why: "Water kept pulling your answers, piers, brine, the harbor at dusk. Moxie keeps you within sight of it the whole trip." },
    cheer: "🦭 Moxie splashes in approval.",
    style: "waterfront soul",
    hoods: ["greenpoint", "redHook", "sunsetPark"],
    wildcard: { name: "NYC Ferry to Rockaway Beach", note: "A $4-ish boat ride that feels like a mini cruise, ending in tacos and surf breaks. Moxie swims alongside." },
  },
  frost: {
    name: "Frost", color: "#9BC0D6", dark: true, numeral: "I",
    hero: { emoji: "🦉", name: "Juniper the Snowy Owl",
      bio: "A snowy owl like the one that landed in Central Park in 2021 and stopped the city in its tracks. Juniper loves quiet galleries, long looks, and unhurried afternoons.",
      why: "You chose one perfect thing over ten rushed ones. Juniper builds calm, museum-anchored days with space to linger." },
    cheer: "🦉 Juniper blinks slowly. High praise.",
    style: "contemplative connoisseur",
    hoods: ["chelsea", "washingtonHeights", "longIslandCity", "upperWestSide"],
    wildcard: { name: "The Noguchi Museum", note: "Stone, paper, and silence in a converted factory in Queens. Juniper's idea of a perfect afternoon." },
  },
  bloom: {
    name: "Bloom", color: "#5FAE3F", dark: true, numeral: "II",
    hero: { emoji: "🐝", name: "Fern the Bumblebee",
      bio: "A bumblebee from a Brooklyn community garden, one of 200-plus wild bee species that genuinely live in the city. Fern keeps a mental map of every stoop planter in Kings County.",
      why: "Markets, gardens, treetops: you kept choosing things that grow. Fern plants your days in parks, gardens, and café terraces." },
    cheer: "🐝 Fern does a happy waggle dance.",
    style: "garden-and-café romantic",
    hoods: ["prospectHeights", "ditmasPark", "fortGreene"],
    wildcard: { name: "Green-Wood Cemetery walk", note: "Rolling hills, Civil War history, and a famous colony of wild monk parrots at the gates. Fern promises it's lovely, not spooky." },
  },
  shadow: {
    name: "Shadow", color: "#3E3A47", dark: false, numeral: "VI",
    hero: { emoji: "🐈‍⬛", name: "Noir the Bodega Cat",
      bio: "A bodega cat (New York's unofficial mascot) who naps on the chip rack by day and slips through unmarked doors by night. Noir knows which basements used to be speakeasies, because he never left.",
      why: "Whispered passwords and getting lost on purpose, that was you. Noir favors hidden bars, back rooms, and history hiding in plain sight." },
    cheer: "🐈‍⬛ Noir purrs from somewhere unseen.",
    style: "hidden-history hunter",
    hoods: ["lowerEastSide", "chinatown", "bushwick"],
    wildcard: { name: "The City Reliquary", note: "A tiny Williamsburg museum of NYC oddities, subway tokens, seltzer bottles, Statue of Liberty kitsch. Noir's personal treasure chest." },
  },
  echo: {
    name: "Echo", color: "#8A5A2B", dark: false, numeral: "XI",
    hero: { emoji: "🦜", name: "Rondo the Wild Parrot",
      bio: "A monk parrot from the famous feral flocks of Green-Wood Cemetery and Brooklyn College, repeating every great song he's ever overheard. Rondo treats the whole city as one long liner note.",
      why: "Mixtapes, classic rock, karaoke till closing, your answers hum. Rondo steers you to jazz rooms, singing rooms, and streets with a soundtrack." },
    cheer: "🦜 Rondo whistles the chorus back.",
    style: "music-and-memory keeper",
    hoods: ["harlem", "westVillage", "koreatown", "lowerEastSide"],
    wildcard: { name: "Weekend jazz at Bill's Place", note: "Friday and Saturday parlor sets in a BYOB Harlem brownstone (an original 133rd St speakeasy), led by sax legend Bill Saxton. Rondo has the whole set memorized." },
  },
  iron: {
    name: "Iron", color: "#5B5E63", dark: false, numeral: "XII",
    hero: { emoji: "🐀", name: "Rivet the Subway Rat",
      bio: "A fourth-generation tunnel engineer (self-taught) and proud descendant of Pizza Rat. Rivet loves bridges, gantries, and anything riveted, the hidden skeleton that holds the city up.",
      why: "Tokens, bass, skyline steel, you're drawn to how the city is built. Rivet routes you through its bones: bridges, factories-turned-museums, waterfront works." },
    cheer: "🐀 Rivet salutes with a tiny hard hat.",
    style: "industrial romantic",
    hoods: ["longIslandCity", "redHook", "greenpoint", "chelsea"],
    wildcard: { name: "Roosevelt Island Tram + lighthouse walk", note: "A commuter cable car with skyline views, ending at Gothic ruins and a tiny stone lighthouse. Rivet's dream commute." },
  },
  mist: {
    name: "Mist", color: "#AFBFC9", dark: true, numeral: "VII",
    hero: { emoji: "🪼", name: "Wisp the Jellyfish",
      bio: "A moon jelly who drifts up the East River when the summer blooms roll in, a real, gently weird New York phenomenon. Wisp has never rushed anywhere in her life.",
      why: "Soft drizzle, slow drift, no map: your pace is a saunter. Wisp plans low-key days that are prettiest half-hidden in fog." },
    cheer: "🪼 Wisp drifts by, serene and pleased.",
    style: "slow-drift dreamer",
    hoods: ["greenpoint", "ditmasPark", "washingtonHeights"],
    wildcard: { name: "Early-morning Staten Island Ferry (free)", note: "Ride it at dawn in the fog, coffee in hand, and come straight back. Wisp calls it 'commuting to nowhere, beautifully.'" },
  },
};

/* ---------------- TAROT CARD ART (inline SVG, deco style) ---------------- */
const CARD_SRC = (el) => "card-" + el + ".jpg";
const DECK_SRC = (el) => "deck-" + el + ".jpg";
const DECK_ORDER = ["frost", "bloom", "rock", "storm", "ember", "shadow", "mist", "tide", "dream", "light", "echo", "iron"];

function TarotDeck() {
  const n = DECK_ORDER.length;
  const [idx, onChange] = useState(0);
  const [touchX, setTouchX] = useState(null);
  const cur = DECK_ORDER[idx];
  const d = ELEMENTS[cur], a = ARCANA[cur];
  const poses = [
    "translate(0px, 0px) rotate(-2deg)",
    "translate(12px, 7px) rotate(3.5deg)",
    "translate(-13px, 12px) rotate(-6deg)",
    "translate(18px, 16px) rotate(7deg)",
    "translate(-6px, 19px) rotate(-9deg)",
  ];
  return (
    <div className="mt-9 text-center">
      <button type="button" className="deck q-focus"
        aria-label={"Tarot deck, card " + (idx + 1) + " of " + n + ": " + a.numeral + ", " + a.title + ", " + d.hero.name + ". Activate or press arrow keys to browse the deck."}
        onClick={(e) => { e.preventDefault(); onChange((idx + 1) % n); }}
        onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX == null) return;
          const dx = e.changedTouches[0].clientX - touchX;
          setTouchX(null);
          if (dx < -35) { e.preventDefault(); onChange((idx + 1) % n); }
          else if (dx > 35) { e.preventDefault(); onChange((idx + n - 1) % n); }
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); onChange((idx + 1) % n); }
          else if (e.key === "ArrowLeft") { e.preventDefault(); onChange((idx + n - 1) % n); }
        }}>
        {DECK_ORDER.map((el, i) => {
          const pos = (i - idx + n) % n;
          const leaving = pos === n - 1; // the card that just left the top: lift it away, above the stack
          return (
            <div key={el} className={"deck-card" + (pos === 0 ? " deck-top" : "")} aria-hidden="true"
              style={{
                transform: leaving ? "translate(150px, -14px) rotate(13deg)" : poses[Math.min(pos, 4)],
                zIndex: leaving ? 30 : 20 - pos,
                opacity: pos < 5 ? 1 : 0,
                pointerEvents: "none",
              }}>
              <div>
              <div className="deck-inner">
                <img src={DECK_SRC(el)} alt="" decoding="async"
                  onError={(e) => { e.target.style.display = "none"; if (e.target.nextSibling) e.target.nextSibling.style.display = "flex"; }} />
                <div className="deck-fallback">
                  <span className="q-eyebrow" style={{ color: GOLD }}>{ARCANA[el].numeral}</span>
                  <span className="q-display" style={{ color: CREAM, fontSize: 15 }}>{ELEMENTS[el].hero.name.split(" the ")[0]}</span>
                  <span className="q-whimsy" style={{ color: GOLD, fontSize: 11 }}>{ARCANA[el].title}</span>
                </div>
              </div>
              </div>
            </div>
          );
        })}
      </button>
      <div aria-hidden="true">
        <p className="q-eyebrow mt-5" style={{ color: "#7a5f16" }}>{a.numeral} · {a.title}</p>
        <p className="q-display text-[17px] mt-1">{d.hero.name}</p>
        <p className="q-whimsy text-[12.5px] mt-1.5" style={{ color: MUTED }}>Tap or swipe the deck to meet all twelve · {idx + 1} of {n}</p>
      </div>
    </div>
  );
}

function TarotCard({ el, w = 220 }) {
  const d = ELEMENTS[el];
  const a = ARCANA[el];
  const r = Math.round(w * 0.055);
  return (
    <div style={{ width: w }}>
      <img data-el={el} decoding="async" src={CARD_SRC(el)} alt={"Tarot card " + a.numeral + ", " + a.title + ": " + d.hero.name + ", an ornate Art Nouveau tarot illustration"}
        style={{ display: "block", width: "100%", borderRadius: r, boxShadow: "0 12px 30px rgba(23,22,26,0.35)" }}
        onError={(e) => { e.target.style.display = "none"; if (e.target.nextSibling) e.target.nextSibling.style.display = "flex"; }} />
      <div role="img" aria-label={"Tarot card " + a.numeral + ", " + a.title + ": " + d.hero.name}
        style={{ display: "none", width: "100%", aspectRatio: "4 / 5", borderRadius: r, background: CARD_BG,
        border: "2px solid " + GOLD, flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 6, textAlign: "center", padding: 10 }}>
        <span className="q-eyebrow" style={{ color: GOLD }}>{a.numeral}</span>
        <span className="q-display" style={{ color: CREAM, fontSize: Math.max(13, w * 0.075) }}>{d.hero.name.split(" the ")[0]}</span>
        <span className="q-whimsy" style={{ color: GOLD, fontSize: Math.max(10, w * 0.055) }}>{a.title}</span>
      </div>
    </div>
  );
}

/* ---------------- PROFESSIONS ---------------- */
const PROFESSIONS = {
  finance: { name: "The Rainmaker", field: "finance", blurb: "You like leverage, history, and a good vault. Your itinerary tips toward old money haunts and rooms where deals were struck.",
    picks: [
      { name: "Fraunces Tavern Museum", note: "Where Washington said farewell to his officers, and Hamilton's world began. The bar downstairs still pours." },
      { name: "The Dead Rabbit", note: "A world-famous Irish pub on Water Street, steps from the old counting houses. Order the Irish coffee." },
      { name: "Stone Street lunch", note: "A cobblestoned block of communal tables in the Financial District's oldest corner." },
    ] },
  engineering: { name: "The Builder", field: "engineering", blurb: "You see the city as one giant exploded diagram. Expect bridges, tunnels, and machines that still hum.",
    picks: [
      { name: "New York Transit Museum", note: "Vintage subway cars in a decommissioned 1936 station in Downtown Brooklyn. You can sit in all of them." },
      { name: "High Bridge walk", note: "NYC's oldest standing bridge, an 1848 aqueduct you can walk from the Bronx to Manhattan." },
      { name: "Roosevelt Island Tram", note: "Commuter-grade aerial cable car. Sit by the window and watch the cables work." },
    ] },
  realestate: { name: "The Cornerstone", field: "real estate", blurb: "You walk into rooms and mentally renovate them. Your trip leans architecture walks, landmark interiors, and streets worth coveting.",
    picks: [
      { name: "The Skyscraper Museum", note: "A small, obsessive Battery Park City museum about how this city grew straight up." },
      { name: "Victorian Flatbush stroll", note: "Albemarle & Argyle Roads in Ditmas Park, freestanding mansions with wraparound porches, in Brooklyn." },
      { name: "TWA Hotel at JFK", note: "Eero Saarinen's 1962 terminal reborn, a landmark adaptive-reuse case study with a rooftop pool." },
    ] },
  design: { name: "The Eye", field: "design", blurb: "You notice kerning on deli awnings. Your trip is tuned for pattern, print, and beautiful objects.",
    picks: [
      { name: "Cooper Hewitt, Smithsonian Design Museum", note: "The only U.S. museum devoted entirely to design, inside Carnegie's mansion. The interactive pen is a delight." },
      { name: "Poster House", note: "A Chelsea museum dedicated to poster design, rotating shows, gorgeous shop." },
      { name: "Printed Matter", note: "The world's great artists' book store. Budget an hour; you'll stay two." },
      { name: "Museum of Arts and Design", note: "Craft, object design, and material obsession at Columbus Circle; the jewelry floor alone is worth it." },
      { name: "Storefront for Art and Architecture", note: "A sliver of a Kenmare St gallery behind a famously pivoting fa\u00E7ade; free, strange, and pure design." },
      { name: "Lucky Risograph", note: "A tiny riso print studio and shop: zines, art prints, and paper goods in electric fluorescent ink." },
    ] },
  data: { name: "The Pattern-Seeker", field: "data science", blurb: "You want the whole dataset. Your trip includes the single greatest data visualization in New York: the city itself, at 1:1200 scale.",
    picks: [
      { name: "The Panorama at the Queens Museum", note: "A 9,335-square-foot scale model of all five boroughs, every building, every block. You will lose an hour finding your Airbnb." },
      { name: "NYPL Map Division & Rose Main Reading Room", note: "Centuries of the city's data on paper, under one of its finest ceilings." },
      { name: "Wonderville", note: "A Bushwick bar of indie and handmade arcade games. Peak-hour analysis encouraged." },
    ] },
  medicine: { name: "The Healer", field: "medicine", blurb: "You have steady hands and a taste for the beautifully strange. Your trip carries a gentle thread of medical history and curiosities.",
    picks: [
      { name: "C.O. Bigelow", note: "America's oldest apothecary, filling prescriptions in the Village since 1838; browse the vintage remedies up front." },
      { name: "Green-Wood Cemetery", note: "Where half of old New York (surgeons, inventors, Tiffanys) rests on glacier-carved hills. Gates open daily, just wander in." },
      { name: "The Evolution Store", note: "A SoHo cabinet of curiosities: skeletons, specimens, and fossils, all browsable." },
      { name: "New York Academy of Medicine rare book room", note: "One of the world's great historical medicine libraries, on Fifth Avenue at 103rd. Appointment required, book ahead and it's worth it." },
    ] },
  math: { name: "The Proof", field: "mathematics", blurb: "You appreciate an elegant solution. Your trip has puzzles, games, and at least one perfect proof by pastry.",
    picks: [
      { name: "MoMath, National Museum of Mathematics", note: "Ride a square-wheeled trike; it works, and knowing why is the fun part." },
      { name: "Chess Forum", note: "A Thompson St parlor where anyone can sit down and play for pocket change, day or night." },
      { name: "Hex & Company", note: "A cheerful Upper West Side board game caf\u00E9 with hundreds of games and decent snacks." },
      { name: "Marshall Chess Club", note: "The storied Village townhouse where Bobby Fischer played. Visits and events require booking ahead, check the calendar." },
      { name: "The Uncommons", note: "A Greenwich Village board game caf\u00E9, walk in, grab a game off the wall, stay for hours." },
      { name: "Wonderville", note: "A Bushwick bar of indie and homemade arcade cabinets, free or a dollar a play." },
    ] },
  product: { name: "The North Star", field: "product", blurb: "You triangulate users, feasibility, and Thursday's ship date without breaking eye contact. Your trip is scoped, sequenced, and still leaves room for discovery.",
    picks: [
      { name: "Future City Lab at the Museum of the City of New York", note: "An interactive lab where you redesign the city yourself, tradeoffs, constraints, stakeholders, the whole backlog." },
      { name: "Little Island", note: "A park floating on tulip-shaped pillars over the Hudson. Wander the winding paths up to the overlook and catch whatever's playing in the amphitheater." },
      { name: "Governors Island", note: "A seven-minute ferry to hammocks, old forts, and hills with harbor views. Rent a bike, lose the afternoon, let the skyline do the talking." },
    ] },
  uxr: { name: "The Field Notes", field: "UX research", blurb: "You trust what people do over what they say. Your trip is one long contextual inquiry with excellent snacks.",
    picks: [
      { name: "Washington Square Park chess corner", note: "The city's oldest usability lab, watch strangers make decisions under pressure, free of charge." },
      { name: "Tenement Museum", note: "Contextual inquiry, 1890s edition: how people actually lived, told inside their preserved apartments." },
      { name: "Mmuseumm", note: "A museum inside a Tribeca freight elevator, devoted to overlooked everyday objects. Peak artifact analysis." },
    ] },
  teaching: { name: "The Lectern", field: "teaching & academia", blurb: "You collect knowledge so you can give it away. Your trip is a syllabus disguised as a vacation, and everyone you love is auditing it.",
    picks: [
      { name: "The Morgan Library & Museum", note: "A Gilded Age scholar's palace: three tiers of books, a Gutenberg Bible, and rotating manuscript shows." },
      { name: "Rose Main Reading Room, NYPL", note: "The city's great free study hall, two city blocks long under 52-foot painted ceilings." },
      { name: "The Strand", note: "Eighteen miles of books. Set yourself a curriculum and get gloriously lost." },
    ] },
  writing: { name: "The Byline", field: "content & writing", blurb: "You know exactly what one word can do. Your trip reads like a tight second draft, every stop earns its place.",
    picks: [
      { name: "Housing Works Bookstore Cafe", note: "A volunteer-run SoHo bookstore in a gorgeous two-story room; proceeds fight homelessness and HIV/AIDS." },
      { name: "The Algonquin's Round Table room", note: "Drink where Dorothy Parker and the Vicious Circle traded the sharpest sentences in America." },
      { name: "KGB Bar", note: "A red-lit East Village literary institution with free readings most nights." },
      { name: "The Center for Fiction", note: "A Fort Greene temple to the novel: bookstore, caf\u00E9, and a library upstairs made for eavesdropping on ideas." },
      { name: "Albertine", note: "A French-English bookshop inside a Fifth Ave mansion, under a hand-painted ceiling of stars." },
    ] },
};

/* ---------------- NEIGHBORHOOD DAYS ---------------- */
const HOODS = {
  greenpoint: { name: "Greenpoint", borough: "Brooklyn", vibe: "Old Poland meets the waterfront, steeples, kielbasa, and skyline piers.",
    slots: [
      ["Morning", "WNYC Transmitter Park & Franklin St", "A quiet pier facing Manhattan, then a slow stroll past Greenpoint's shops."],
      ["Coffee", "Peter Pan Donut & Pastry Shop", "A 1950s Polish-American donut counter, sour cream glazed and a drip coffee, no notes."],
      ["Lunch", "Karczma", "Hearty Polish plates (pierogi, kielbasa) in a wood-beamed dining room."],
      ["Afternoon", "WORD bookstore + Newtown Creek Nature Walk", "An indie bookshop, then a strange, beautiful industrial waterfront path."],
      ["Dinner", "Paulie Gee's", "Wood-fired pizza pilgrimage spot with a menu full of puns."],
      ["Evening", "Good Room", "A beloved, unpretentious dance club, or just a nightcap on Manhattan Ave."],
    ],
    extra: ["Detour", "Transmitter Park", "A quiet pier off Greenpoint Ave with a full-frontal Manhattan skyline."],
    dessert: { plush: ["Milk & Roses", "Dessert and amaro in a candlelit, book-lined Greenpoint garden."], gem: ["Peter Pan Donuts, round two", "Yes, again. A nightcap donut tastes different. Trust the process."] } },
  jacksonHeights: { name: "Jackson Heights", borough: "Queens", vibe: "The most delicious square mile in America, Himalayan, Colombian, Indian, all on foot.",
    slots: [
      ["Morning", "Travers Park & 34th Ave Open Street", "One of the city's great pedestrian promenades, buzzing with neighborhood life."],
      ["Coffee", "Espresso 77", "A homey local café on 77th Street."],
      ["Lunch", "Lhasa Fast Food or Mariscos El Submarino", "Tibetan momos hidden behind a 74th St shop, or Sinaloan aguachile at the Roosevelt Ave mariscos temple (second outpost in Astoria). Both legends; flip a coin."],
      ["Afternoon", "Diversity Plaza & 74th Street", "Sari shops, sweet shops, spice shops; browse like a local."],
      ["Dinner", "Arepa Lady", "A Queens street-food legend gone brick-and-mortar. Get the arepa de queso."],
      ["Evening", "Terraza 7", "Live Latin jazz on a tiny mezzanine stage, pure Queens magic."],
    ],
    extra: ["Detour", "Patel Brothers", "The legendary 37th Ave grocery: spice walls, mango season, and snack aisles for days."],
    dessert: { plush: ["Maharaja Sweets", "Kulfi, jalebi, and trays of mithai glowing like jewels."], gem: ["La Gran Uruguaya", "Alfajores and dulce de leche pastries at neighborhood-bakery prices."] } },
  koreatown: { name: "Koreatown", borough: "Manhattan", vibe: "One glowing block of 32nd Street, BBQ smoke, bakeries, and karaoke rooms stacked five stories high.",
    slots: [
      ["Morning", "Hani's Bakery + Caf\u00E9", "Cream buns, mochi doughnuts, and a proper latte, the Korean bakery breakfast of dreams."],
      ["Late morning", "H Mart & Koryo Books", "Snack-aisle safari, then K-lit, stationery, and albums on Korea Way, properly fed this time."],
      ["Lunch", "Cho Dang Gol", "House-made tofu in bubbling stone pots, a one-location K-town treasure on 35th Street."],
      ["Afternoon", "Besfren & the Korea Way shops", "Yuzu pastries and matcha soft-serve, then browse K-beauty, stationery, and photo booths stacked along 32nd."],
      ["Dinner", "Jongro BBQ", "Second-floor tabletop grilling that smells like a victory lap."],
      ["Evening", "Norebang at Gagopa Karaoke", "A private singing room till late, tambourine included."],
    ],
    extra: ["Detour", "Empire State Building lobby", "Two blocks over: duck into the gilded Art Deco lobby, then back to the K-town canyon."],
    dessert: { plush: ["Grace Street", "Black-sesame shaved snow and hotteok with ice cream in a big buzzy room, open late."], gem: ["Kim's hotteok", "A tiny 32nd St stand griddling brown-sugar hotteok for about five bucks."] } },
  fidi: { name: "Financial District", borough: "Manhattan", vibe: "Cobblestone lanes older than the republic, Art Deco towers, and bars in old counting houses.",
    slots: [
      ["Morning", "Trinity Church & Hamilton's grave", "The 1846 spire that once ruled the skyline, and the founding father resting beneath it."],
      ["Coffee", "Black Fox Coffee", "A polished, serious café where the deals nearby are quietly caffeinated."],
      ["Lunch", "Adrienne's Pizzabar", "Grandma-style square pies at communal tables on cobblestoned Stone Street."],
      ["Afternoon", "Federal Hall + the Elevated Acre", "Washington's inauguration site, then a hidden park floating a story above Water Street."],
      ["Dinner", "Delmonico's", "America's original fine-dining room (est. 1837), reborn, the namesake steak and the Baked Alaska were invented here."],
      ["Evening", "Overstory", "A tiny 64th-floor cocktail bar with a wraparound terrace. Go at opening for walk-in seats."],
    ],
    extra: ["Detour", "9/11 Memorial pools", "A few blocks north, free, and profoundly quiet at dusk."],
    dessert: { plush: ["Manhatta", "Dessert and a nightcap at the 60th-floor bar, all of downtown glittering below."], gem: ["George's", "Pie from the dessert case at FiDi's great surviving diner."] } },
  lowerEastSide: { name: "Lower East Side", borough: "Manhattan", vibe: "Tenements, smoked fish, galleries, and doors that don't say what's behind them.",
    slots: [
      ["Morning", "Tenement Museum tour", "The immigrant story of New York told inside actual preserved apartments. Book ahead."],
      ["Coffee", "Ludlow Coffee Supply", "A neighborhood standby for a strong flat white."],
      ["Lunch", "Russ & Daughters Café", "A sit-down shrine to bagels, lox, and 100+ years of appetizing."],
      ["Afternoon", "Orchard Street galleries + Essex Market", "Small contemporary galleries, then snacks in a historic market hall."],
      ["Dinner", "Wu's Wonton King", "Roast meats, wonton soup, and BYOB energy on East Broadway."],
      ["Evening", "Attaboy or Metrograph", "A no-menu cocktail bar behind a plain door, or an arthouse double feature."],
    ],
    extra: ["Detour", "Economy Candy", "A floor-to-ceiling candy time capsule on Rivington, family-run since 1937."],
    dessert: { plush: ["Supermoon Bakehouse", "Technicolor cruffins, \u00E9clairs, and soft serve on Rivington, open till 10pm."], gem: ["Il Laboratorio del Gelato", "A stark-white gelato lab on Ludlow scooping flavors like ricotta and black sesame."] } },
  fortGreene: { name: "Fort Greene", borough: "Brooklyn", vibe: "Brownstones, a hilltop park, and Brooklyn's most graceful cultural block.",
    slots: [
      ["Morning", "Fort Greene Park", "Climb to the Prison Ship Martyrs' Monument; Saturdays add a farmers market."],
      ["Coffee", "Bittersweet", "A closet-sized café pouring serious espresso."],
      ["Lunch", "Walter's", "A warm neighborhood bistro on the park's edge."],
      ["Afternoon", "Greenlight Bookstore + BAM", "One of NYC's best indie bookshops, then whatever BAM is showing."],
      ["Dinner", "Miss Ada", "Israeli-Mediterranean plates; get the hummus with lamb ragu."],
      ["Evening", "Frank's Cocktail Lounge", "A decades-old lounge with DJs and deep neighborhood roots."],
    ],
    extra: ["Detour", "DeKalb Market Hall", "Thirty-odd food stalls under City Point, a short stroll down Flatbush."],
    dessert: { plush: ["Evelina", "Italian dolci and an amaro at the corner spot on DeKalb, steps from the park."], gem: ["Junior's", "The original Flatbush Ave cheesecake temple, a ten-minute walk and gloriously unfancy."] } },
  astoria: { name: "Astoria", borough: "Queens", vibe: "Greek tavernas, sculpture on the river, and NYC's oldest beer garden.",
    slots: [
      ["Morning", "Socrates Sculpture Park + Noguchi Museum", "Outdoor art on the East River, then Noguchi's serene stone-and-paper sanctuary."],
      ["Coffee", "Astoria Coffee", "Friendly local roaster stop on 30th Ave."],
      ["Lunch", "Taverna Kyclades", "Grilled octopus and lemon potatoes worth any wait."],
      ["Afternoon", "Museum of the Moving Image", "Film history, props, and hands-on exhibits in Astoria's old studio district."],
      ["Dinner", "Sanfords", "A century-old Astoria institution, reborn as an all-day brasserie."],
      ["Evening", "Bohemian Hall & Beer Garden", "NYC's oldest beer garden (1910), long tables under the trees."],
    ],
    extra: ["Detour", "Astoria Park", "The borough's best river lawn, under the Hell Gate Bridge's great steel arch."],
    dessert: { plush: ["Martha's Country Bakery", "Towering cakes and pie \u00E0 la mode late into the night."], gem: ["Bel Aire Diner milkshake", "A 24-hour Astoria institution; the milkshake nightcap is a rite."] } },
  redHook: { name: "Red Hook", borough: "Brooklyn", vibe: "Cobblestones, container cranes, key lime pie, and the best Lady Liberty view in town.",
    slots: [
      ["Morning", "Louis Valentino Jr. Park & Pier", "A dead-on, crowd-free view of the Statue of Liberty across the harbor."],
      ["Snack", "Steve's Authentic Key Lime Pies", "The swingle (a chocolate-dipped pie on a stick) is mandatory."],
      ["Lunch", "Red Hook Lobster Pound", "Maine-style rolls in a barn-like room."],
      ["Afternoon", "Pioneer Works + Waterfront Museum", "A vast free art center in an old ironworks, then a museum on a 1914 barge."],
      ["Dinner", "Hometown Bar-B-Que", "Brisket that draws pilgrims from all boroughs."],
      ["Evening", "Sunny's Bar", "A 130-year-old dockworkers' bar with live bluegrass. A national treasure."],
    ],
    extra: ["Detour", "Red Hook Winery", "Walk-in tastings on Pier 41: New York grapes, harbor views, no appointment needed."],
    dessert: { plush: ["Raaka Chocolate", "Pocket single-origin bars from the Red Hook factory shop earlier, then unwrap them on the pier."], gem: ["A second Steve's swingle", "You bought two this morning. This is why."] } },
  harlem: { name: "Harlem", borough: "Manhattan", vibe: "Jazz history you can still hear tonight, brownstone rows, and Sunday-best energy.",
    slots: [
      ["Morning", "Marcus Garvey Park & Strivers' Row", "A fire-watchtower park, then two of the most beautiful blocks in Manhattan (W 138th–139th)."],
      ["Coffee", "The Chipped Cup", "A cozy, book-lined café in Hamilton Heights."],
      ["Lunch", "Charles Pan-Fried Chicken", "Harlem legend Charles Gabriel's crackling, pan-fried masterpiece."],
      ["Afternoon", "National Jazz Museum in Harlem", "Intimate, listening-room-style exhibits on the neighborhood's greatest export."],
      ["Dinner", "Red Rooster", "Marcus Samuelsson's lively Lenox Ave dining room."],
      ["Evening", "Shrine", "Nightly live sets on Adam Clayton Powell Blvd, no cover, the neighborhood's living jukebox. Walk past Minton's storied doorway on the way."],
    ],
    extra: ["Detour", "Apollo Theater marquee", "Swing down 125th past the most famous stage in America."],
    dessert: { plush: ["Sugar Hill Creamery", "Family-run scoops on Lenox with Harlem-history flavor names."], gem: ["Make My Cake", "Red velvet from a family bakery that's been at it for decades."] } },
  longIslandCity: { name: "Long Island City", borough: "Queens", vibe: "Gantries, galleries, and skyline views from a neighborhood built of factories.",
    slots: [
      ["Morning", "Gantry Plaza State Park", "Restored industrial gantries framing the Midtown skyline."],
      ["Coffee", "Sweetleaf", "A pioneering LIC café in a creaky, charming old building."],
      ["Lunch", "Court Square Diner", "A gleaming 24-hour Queens institution, booths, a phone-book menu, and proper egg creams since 1946."],
      ["Afternoon", "MoMA PS1 + SculptureCenter", "Contemporary art in a former public school, then a former trolley repair shop."],
      ["Dinner", "Mu Ramen", "Rich, serious ramen worth crossing the river for."],
      ["Evening", "Dutch Kills", "A dark, wood-boothed cocktail bar with hand-cut ice."],
    ],
    extra: ["Detour", "Hunters Point South Park", "A waterfront loop with the UN across the river and kayaks below."],
    dessert: { plush: ["Cannelle Patisserie", "The Queens-famous French pastry counter on Jackson Ave; they close earlier than you'll want, so time it."], gem: ["Gantry paletas", "On warm nights the fruit-pop carts work the waterfront; eat one under the Pepsi sign."] } },
  bushwick: { name: "Bushwick", borough: "Brooklyn", vibe: "Block-long murals, warehouse dance floors, and pizza that started a movement.",
    slots: [
      ["Morning", "The Bushwick Collective", "A self-guided walk through blocks of world-class street art around Troutman St."],
      ["Coffee", "SEY Coffee", "A light-flooded, plant-filled roastery, one of the city's best cups."],
      ["Lunch", "Roberta's", "The wood-fired pizza that put Bushwick on the map."],
      ["Afternoon", "Vintage crawl", "Dig through Urban Jungle and the Wyckoff Ave thrift warehouses."],
      ["Dinner", "Bunna Cafe", "Vegan Ethiopian feasts, eaten by hand from a shared platter."],
      ["Evening", "House of Yes or Nowadays", "Circus-adjacent spectacle, or a legendary sound-system dance floor."],
    ],
    extra: ["Detour", "Maria Hernandez Park", "The neighborhood's living room: handball, helado carts, golden light."],
    dessert: { plush: ["Fine & Raw", "Bean-to-bar chocolate from a Bushwick factory; the shop is worth the pilgrimage."], gem: ["Dun-Well Doughnuts", "Vegan doughnuts that convert skeptics, out on the Montrose border."] } },
  washingtonHeights: { name: "Washington Heights & Inwood", borough: "Manhattan", vibe: "Medieval cloisters, Manhattan's last forest, and mofongo worth the trip uptown.",
    slots: [
      ["Morning", "Fort Tryon Park & The Met Cloisters", "Medieval art in a hilltop monastery above the Hudson, the unicorn tapestries live here."],
      ["Coffee", "Café Buunni", "Ethiopian coffee roasted by a Heights family business."],
      ["Lunch", "Malecon", "Rotisserie chicken and Dominican classics, 'the king of roast chicken.'"],
      ["Afternoon", "Inwood Hill Park or Morris-Jumel Mansion", "Manhattan's last natural forest, or its oldest surviving house (1765)."],
      ["Dinner", "La Casa Del Mofongo", "A temple to the mashed-plantain masterpiece."],
      ["Evening", "United Palace", "Catch whatever's on at this jaw-dropping 1930 movie palace."],
    ],
    extra: ["Detour", "Little Red Lighthouse", "The storybook lighthouse hiding under the George Washington Bridge."],
    dessert: { plush: ["809 on Dyckman", "Dominican desserts and a mamajuana nightcap where Washington Heights meets Inwood."], gem: ["Carrot Top Pastries", "Uptown's legendary carrot cake, an institution for a reason."] } },
  westVillage: { name: "West Village", borough: "Manhattan", vibe: "Crooked streets, basement jazz, and cafés that have outlived every trend.",
    slots: [
      ["Morning", "Washington Square & the winding lanes", "Watch the chess hustlers, then get lost around Grove Court and Commerce Street."],
      ["Coffee", "Caffe Reggio", "Pouring cappuccinos since 1927, the original espresso machine is still on display."],
      ["Lunch", "Faicco's Italian Specialties", "A century-old pork store making heroic Italian sandwiches."],
      ["Afternoon", "Three Lives & Company", "A tiny, perfect bookshop, then browse Bleecker's quieter blocks."],
      ["Dinner", "Malatesta Trattoria", "Cash-only, candlelit, perpetually charming Italian on a corner by the river."],
      ["Evening", "Smalls Jazz Club", "A basement room where the sets run past midnight."],
    ],
    extra: ["Detour", "Washington Square Park", "Arch, fountain, piano guy, the Village's front porch at golden hour."],
    dessert: { plush: ["Bar Pisellino", "A Via Carota sibling for a spritz and gelato at a marble counter."], gem: ["Pasticceria Rocco", "Cannoli piped to order at the Bleecker St pasticceria that predates the tour buses."] } },
  ditmasPark: { name: "Ditmas Park", borough: "Brooklyn", vibe: "Victorian mansions, porch swings, and a main street that feels like a small town.",
    slots: [
      ["Morning", "Victorian Flatbush walk", "Albemarle and Argyle Roads: freestanding painted-lady mansions, in Brooklyn."],
      ["Coffee", "Café Madeline", "A sunny corner café on Cortelyou Road."],
      ["Lunch", "Mimi's Hummus", "A tiny Cortelyou Road favorite: silky hummus, warm laffa, and mint lemonade."],
      ["Afternoon", "Prospect Park's south side", "The lake, Drummer's Grove on weekends, and paths most visitors never find."],
      ["Dinner", "Wheated", "Sourdough pizza and one of Brooklyn's deepest bourbon lists."],
      ["Evening", "Sycamore", "A bar that's also a flower shop. Yes, really."],
    ],
    extra: ["Detour", "Parade Ground loop", "Past the ballfields into Prospect Park's quiet southern shore."],
    dessert: { plush: ["The Castello Plan", "House-made ice cream and dessert wine in the candlelit Cortelyou wine bar."], gem: ["Newkirk Plaza fruteros", "Mango con crema from the fruit carts, Flatbush's sweetest dollar."] } },
  sunsetPark: { name: "Sunset Park", borough: "Brooklyn", vibe: "A hilltop harbor view, Brooklyn's Chinatown, and taco trucks that never miss.",
    slots: [
      ["Morning", "Industry City", "Courtyards, makers' studios, and Japan Village inside a repurposed shipping complex."],
      ["Coffee", "Industry City food hall", "Grab a pour-over and pastry among the studios."],
      ["Lunch", "Yun Nan Flavour Garden", "Hand-pulled rice noodles in Brooklyn's Chinatown on 8th Ave."],
      ["Afternoon", "Sunset Park hilltop", "The panoramic harbor-and-skyline view the neighborhood is named for."],
      ["Dinner", "Tacos El Bronco", "Start at the truck or the sit-down spot, either way, get the al pastor."],
      ["Evening", "Irish Haven", "A gloriously unchanged neighborhood bar (it cameoed in The Departed)."],
    ],
    extra: ["Detour", "Sahadi's at Industry City", "The century-old Middle Eastern grocer's warehouse outpost: olives, halva, spices."],
    dessert: { plush: ["Japan Village sweets", "Matcha soft-serve and mochi inside Industry City's Japanese food hall."], gem: ["8th Ave egg tarts", "Follow the glow of any Chinese bakery case; a warm dan tat costs pocket change."] } },
  chinatown: { name: "Chinatown & Two Bridges", borough: "Manhattan", vibe: "Tai chi at dawn, dim sum on crooked Doyers Street, and apothecary cocktails after dark.",
    slots: [
      ["Morning", "Columbus Park", "Tai chi, Chinese chess, and musicians, the neighborhood's living room."],
      ["Snack", "Mei Lai Wah", "Baked pork buns from a beloved old-school bakery."],
      ["Lunch", "Nom Wah Tea Parlor", "Dim sum on Doyers Street since 1920."],
      ["Afternoon", "Wing on Wo & Co.", "The oldest shop in Chinatown, exquisite porcelain and neighborhood history."],
      ["Dinner", "Great N.Y. Noodletown", "Roast duck and ginger-scallion noodles, open late."],
      ["Evening", "Apotheke", "A hidden cocktail 'apothecary' at the crook of Doyers Street."],
    ],
    extra: ["Detour", "Mott St browse & Ten Ren Tea", "Trinket shops, herbalists, and a decades-old tea counter for the road."],
    dessert: { plush: ["Taiyaki NYC", "Fish-shaped cones with soft-serve tails on Baxter, open late."], gem: ["Fong On", "Warm tofu pudding from a family at it since 1933. They close early; if the shutters are down, Taiyaki has you."] } },
  prospectHeights: { name: "Prospect Heights", borough: "Brooklyn", vibe: "A world-class museum, a legendary garden, and blocks built for lingering.",
    slots: [
      ["Morning", "Brooklyn Botanic Garden", "Cherry esplanade, bonsai museum, and the bluebell wood in season."],
      ["Coffee", "Sit & Wonder", "A mellow café with a back garden on Washington Ave."],
      ["Lunch", "Cheryl's Global Soul", "Comfort plates and famous chocolate chip cookies, a Park Place mainstay steps from the museum."],
      ["Afternoon", "Brooklyn Museum", "Egyptian galleries to Kehinde Wiley, huge and never overwhelming."],
      ["Dinner", "Olmsted", "Playful, garden-driven plates on Vanderbilt Ave, walk-in counter seats make it doable without the reservation scramble."],
      ["Evening", "Barbès", "World-music sets in a tiny red-lit room, worth the trip across the park to Park Slope."],
    ],
    extra: ["Detour", "Vanderbilt Ave open street", "On summer weekends the avenue goes car-free and caf\u00E9 tables take the asphalt."],
    dessert: { plush: ["Olmsted's back garden", "Stay after dinner, the s'mores happen out back."], gem: ["Culture frozen yogurt", "Tart, farm-milk fro-yo on 5th Ave, conveniently en route across the park to Barb\u00E8s."] } },
  upperWestSide: { name: "Upper West Side", borough: "Manhattan", vibe: "Riverside promenades, smoked sturgeon, and cultural institutions in comfortable shoes.",
    slots: [
      ["Morning", "Riverside Park", "The Hudson-side promenade locals prefer to Central Park's crowds."],
      ["Snack", "Zabar's", "The one-and-only UWS food emporium since 1934, a coffee and a black-and-white cookie at the café counter."],
      ["Lunch", "Barney Greengrass", "'The Sturgeon King', a 1908 appetizing institution, cash preferred."],
      ["Afternoon", "The New York Historical", "The city's oldest museum (freshly renamed and expanded), full of Tiffany lamps and NYC lore."],
      ["Dinner", "Jacob's Pickles", "Biscuits, pickles, and Southern comfort on Amsterdam Ave."],
      ["Evening", "Smoke Jazz Club", "An intimate uptown jazz room, reborn and better than ever."],
    ],
    extra: ["Detour", "Westsider Books", "A creaky, teetering used-book shop straight out of old New York."],
    dessert: { plush: ["Caf\u00E9 Lalo", "The You've Got Mail dessert caf\u00E9, cake by candlelight."], gem: ["Old John's", "A hot-fudge sundae at the revived 1951 luncheonette near Lincoln Center."] } },
  chelsea: { name: "Chelsea", borough: "Manhattan", vibe: "The gallery district, free world-class art, a railway turned garden, and bars behind unmarked doors.",
    slots: [
      ["Morning", "The High Line (start at 30th St)", "Enter uptown to skip the crowds and stroll the rail-turned-garden south past the art."],
      ["Coffee", "Seven Grams Caffè", "Sharp espresso and a famously good chocolate chip cookie."],
      ["Lunch", "Sullivan Street Bakery", "Roman-style pizza bianca and serious sandwiches from a legendary bread bakery on Ninth Ave at 24th."],
      ["Afternoon", "Chelsea gallery crawl", "David Zwirner, Gagosian, Pace, and dozens more in the West 20s, all free."],
      ["Dinner", "Cookshop", "Market-driven American cooking right across from the High Line."],
      ["Evening", "Bathtub Gin", "A Prohibition-style bar hidden behind a working coffee shop counter."],
    ],
    extra: ["Detour", "Little Island", "Pier 55's tulip-stilt park, five minutes from the High Line's south end."],
    dessert: { plush: ["Supermoon at Chelsea Market", "The LES cruffin cult's newly landed market flagship."], gem: ["Doughnuttery", "Hot mini-donuts sugared to order inside Chelsea Market."] } },
};

/* ---------------- QUESTIONS ---------------- */
const QUESTIONS = [
  { q: "Pick a soundtrack for wandering the city at midnight.", type: "element", answers: [
    { text: "Rap, borough anthems, windows-down loud", pts: { rock: 2, echo: 1 } },
    { text: "Classic rock crackling from a fire-escape radio", pts: { echo: 2, rock: 1 } },
    { text: "Rainy-window jazz, slow and blue", pts: { mist: 2, echo: 1 } },
    { text: "EDM/House thudding from a warehouse", pts: { iron: 2, storm: 1 } },
    { text: "Afrobeats or reggaetón, the block party follows you", pts: { ember: 2, light: 1 } },
    { text: "Pop so catchy you mouth the words in public", pts: { dream: 2, bloom: 1 } },
    { text: "Classical, strings swelling over the skyline", pts: { frost: 2, echo: 1 } },
    { text: "A podcast or audiobook while the city plays B-roll", pts: { frost: 2, mist: 1 } },
  ]},
  { q: "Your ideal Saturday morning looks like…", type: "element", answers: [
    { text: "Flowers and peaches at the farmers market", pts: { bloom: 2, light: 1 } },
    { text: "Sleeping in, then a slow diner breakfast", pts: { dream: 2, mist: 1 } },
    { text: "A run along the water before the city wakes", pts: { tide: 2, storm: 1 } },
    { text: "First in line when the museum opens", pts: { frost: 2, echo: 1 } },
    { text: "Bagels by the river, watching the boats", pts: { mist: 2, tide: 1 } },
    { text: "Up on the roof with coffee and the skyline", pts: { light: 2, iron: 1 } },
    { text: "Stoop coffee and gossip with the neighbors", pts: { echo: 2, bloom: 1 } },
    { text: "Hitting the flea market before the good stuff goes", pts: { shadow: 2, rock: 1 } },
  ]},
  { q: "Choose your perfect weather.", type: "element", answers: [
    { text: "Golden hour, everything glowing", pts: { light: 2 } },
    { text: "A bright, breezy kite-flying kind of day", pts: { storm: 2, tide: 1 } },
    { text: "The hush of a light first snow", pts: { frost: 2 } },
    { text: "A warm summer evening, fireflies out", pts: { ember: 2, light: 1 } },
    { text: "A soft gray drizzle, umbrella optional", pts: { mist: 2 } },
    { text: "Crisp October air, leaves going amber", pts: { bloom: 2, echo: 1 } },
    { text: "That electric stillness right before a storm", pts: { shadow: 2, storm: 1 } },
    { text: "A cold clear night, steam rising from the grates", pts: { iron: 2, frost: 1 } },
  ]},
  { q: "Pick a scent to bottle and keep.", type: "element", answers: [
    { text: "White peach, fig leaf, and golden amber: Union Square greenmarket on a bright morning", pts: { bloom: 2, light: 1 } },
    { text: "Sandalwood, velvet rose, and cedar shelves: the library's Rose Reading Room", pts: { echo: 2, frost: 1 } },
    { text: "Jasmine sambac, peony, and cherry blossom: sidewalk pails in the Flower District at dawn", pts: { mist: 2, ember: 1 } },
    { text: "Sea salt, driftwood, and ambergris: masts swaying at North Cove Marina", pts: { tide: 2, storm: 1 } },
    { text: "Clean linen, fresh lavender, and cool air: a hushed Fifth Avenue lobby, first thing", pts: { frost: 2, iron: 1 } },
    { text: "Smoked leather, amber resin, and dark vanilla: a dim East Village listening bar", pts: { rock: 2, shadow: 1 } },
    { text: "Oud, saffron, and crisp vetiver: crossing the Williamsburg Bridge at midnight", pts: { ember: 2, shadow: 1 } },
    { text: "Night-blooming jasmine, iris, and soft musk: a Village stoop in late summer", pts: { dream: 2, mist: 1 } },
  ]},
  { q: "Comfort food, no judgment:", type: "element", answers: [
    { text: "Something flame-grilled from a street cart", pts: { ember: 2, rock: 1 } },
    { text: "Oysters and anything briny", pts: { tide: 2, frost: 1 } },
    { text: "A dollar slice, folded, eaten standing up", pts: { rock: 2, iron: 1 } },
    { text: "Pastries in a garden café", pts: { bloom: 2, dream: 1 } },
    { text: "Diner pancakes at an hour you won't disclose", pts: { dream: 2, shadow: 1 } },
    { text: "A bowl of soup from a place with no sign", pts: { shadow: 2, ember: 1 } },
    { text: "A bodega chopped cheese, no substitutions", pts: { iron: 2, ember: 1 } },
    { text: "A black-and-white cookie from grandma's bakery", pts: { echo: 2, light: 1 } },
  ]},
  { q: "You're wandering around NYC and something catches your eye. What's your first instinct?", type: "spend", answers: [
    { text: "\u201CI have one life. If it looks incredible, I'm going for it.\u201D", pts: {}, spend: 7 },
    { text: "\u201CIf everyone's saying it's worth it, I'll happily treat myself.\u201D", pts: {}, spend: 6 },
    { text: "\u201CI'll splurge on the things I'll remember, and keep everything else pretty chill.\u201D", pts: {}, spend: 5 },
    { text: "\u201CI like mixing iconic experiences with cool local finds.\u201D", pts: {}, spend: 4 },
    { text: "\u201CI get weirdly excited when I discover something amazing that isn't overpriced.\u201D", pts: {}, spend: 3 },
    { text: "\u201CThe hidden gems always end up being my favorite part of the trip.\u201D", pts: {}, spend: 2 },
    { text: "\u201CI'd rather stretch the day and experience more than spend a lot on one thing.\u201D", pts: {}, spend: 1 },
    { text: "\u201CGive me the places that prove you don't need to spend much to have the best day ever.\u201D", pts: {}, spend: 0 },
  ] },
  { q: "Pick a New York artifact to keep forever.", type: "element", answers: [
    { text: "A brass subway token", pts: { iron: 2, echo: 1 } },
    { text: "A speakeasy password, whispered once", pts: { shadow: 2 } },
    { text: "A mixtape found at a stoop sale", pts: { echo: 2, rock: 1 } },
    { text: "A matchbook from a legendary restaurant", pts: { ember: 2, shadow: 1 } },
    { text: "A pressed flower from the Botanic Garden", pts: { bloom: 2, frost: 1 } },
    { text: "A Polaroid of the skyline at dawn", pts: { light: 2, dream: 1 } },
    { text: "A cassette of rain recorded on a fire escape", pts: { mist: 2, dream: 1 } },
    { text: "A pennant from a game that went to extra innings", pts: { storm: 2, tide: 1 } },
  ]},
  { q: "Friday night, best-case scenario:", type: "element", answers: [
    { text: "Rooftop golden hour that melts into string lights", pts: { light: 2, dream: 1 } },
    { text: "Karaoke in a private room till your voice gives out", pts: { echo: 2, ember: 1 } },
    { text: "A warehouse dance floor at 2am", pts: { iron: 2, storm: 1 } },
    { text: "A candlelit wine bar, corner table", pts: { shadow: 2, frost: 1 } },
    { text: "A late movie, then noodles after", pts: { mist: 2, dream: 1 } },
    { text: "A pickup game under the bridge lights", pts: { storm: 2, rock: 1 } },
    { text: "A ferry ride to nowhere with a tallboy", pts: { tide: 2, mist: 1 } },
    { text: "A golden-hour picnic that outlasts the sunset", pts: { bloom: 2, light: 1 } },
  ]},
  { q: "Your travel pace is…", type: "element", answers: [
    { text: "Up at dawn, see everything, sleep later", pts: { storm: 2, light: 1 } },
    { text: "One perfect thing per day, savored", pts: { frost: 2, dream: 1 } },
    { text: "Wherever the food leads, I follow", pts: { ember: 2, tide: 1 } },
    { text: "Get lost on purpose, no map", pts: { mist: 2, shadow: 1 } },
    { text: "Anchor at a park and radiate outward", pts: { bloom: 2, tide: 1 } },
    { text: "Walk every bridge, count the rivets", pts: { iron: 2, storm: 1 } },
    { text: "Chase whatever's playing live tonight", pts: { echo: 2, rock: 1 } },
    { text: "Sleep in, then one legendary dinner", pts: { dream: 2, ember: 1 } },
  ]},
  { q: "Pick a view to end the day on.", type: "element", answers: [
    { text: "The skyline from a rooftop at dusk", pts: { light: 2, iron: 1 } },
    { text: "The harbor from the end of a pier", pts: { tide: 2, mist: 1 } },
    { text: "A mural-covered alley, spray cans still fresh", pts: { rock: 2, shadow: 1 } },
    { text: "Treetops from a hill in the park", pts: { bloom: 2, frost: 1 } },
    { text: "Stage lights from the back of a tiny club", pts: { echo: 2, rock: 1 } },
    { text: "The city sliding past a night train window", pts: { dream: 2, iron: 1 } },
    { text: "Lightning splitting the sky over the harbor", pts: { storm: 2, tide: 1 } },
    { text: "A garden courtyard glowing with lanterns", pts: { ember: 2, bloom: 1 } },
  ]},
  { q: "It's 9am on a Tuesday. Your happy place is…", type: "profession", answers: [
    { text: "The opening bell ringing downtown, coffee from the corner cart, everything green", pts: { finance: 2, data: 1 } },
    { text: "Crossing the Brooklyn Bridge, admiring how 140-year-old stone and cable still hold the whole thing up", pts: { engineering: 2, math: 1 } },
    { text: "A mood board, floor plans, material samples", pts: { design: 2, realestate: 1 } },
    { text: "Morning rounds, checking in on people", pts: { medicine: 2 } },
    { text: "A room of skeptical students, and the moment it clicks", pts: { teaching: 2, writing: 1 } },
    { text: "A high window over the grid, watching the city's patterns reveal themselves", pts: { data: 2, math: 1 } },
    { text: "A sun-flooded open house, an hour before anyone arrives", pts: { realestate: 2, design: 1 } },
    { text: "A roadmap of sticky notes, ruthlessly prioritized", pts: { product: 2, engineering: 1 } },
    { text: "The first paragraph landing exactly right, coffee still warm", pts: { writing: 2, design: 1 } },
  ]},
  { q: "Choose a low-key superpower.", type: "profession", answers: [
    { text: "Turning any chaos into a clean model", pts: { data: 2, math: 1 } },
    { text: "Knowing what every building is worth at a glance", pts: { realestate: 2, finance: 1 } },
    { text: "Perfectly steady hands under pressure", pts: { medicine: 2, engineering: 1 } },
    { text: "Explaining anything to anyone, at any level", pts: { teaching: 2, product: 1 } },
    { text: "Making anything both beautiful and functional", pts: { design: 2, engineering: 1 } },
    { text: "Spotting the mispriced thing everyone missed", pts: { finance: 2, data: 1 } },
    { text: "A proof so elegant it fits on a napkin", pts: { math: 2 } },
    { text: "Getting strangers to tell you the real story", pts: { uxr: 2, writing: 1 } },
    { text: "Saying no to 100 good ideas so the great one ships", pts: { product: 2 } },
  ]},
  { q: "Pick your fantasy job in old New York.", type: "profession", answers: [
    { text: "Subway map cartographer", pts: { design: 2, data: 1 } },
    { text: "Radio City stage manager", pts: { product: 2, engineering: 1 } },
    { text: "Poet-in-residence at the Chelsea Hotel", pts: { writing: 2, uxr: 1 } },
    { text: "Census taker, 1900, Lower East Side", pts: { uxr: 2, data: 1 } },
    { text: "Brooklyn Bridge inspector", pts: { engineering: 2 } },
    { text: "Wall Street shoeshine, overhearing stock tips", pts: { finance: 2 } },
    { text: "House physician at the old Metropolitan Opera", pts: { medicine: 2 } },
    { text: "Human computer at the Hayden Planetarium", pts: { math: 2, data: 1 } },
  ]},
];

/* ---------------- SCORING ---------------- */
function hoodsFor(elKey, manhattanBias) {
  let hs = ELEMENTS[elKey].hoods.slice();
  if (manhattanBias) {
    // Finance & data callings lean toward the island: the Villages, Chelsea, FiDi.
    if (["iron", "shadow", "frost", "light", "echo"].includes(elKey) && !hs.includes("fidi")) hs = [...hs, "fidi"];
    hs.sort((a, b) => (HOODS[a].borough === "Manhattan" ? 0 : 1) - (HOODS[b].borough === "Manhattan" ? 0 : 1));
  }
  return hs;
}

function routeDays(primary, secondary, prof) {
  const bias = prof === "finance" || prof === "data";
  const days = []; const used = new Set();
  hoodsFor(primary, bias).slice(0, 3).forEach(h => { if (!used.has(h)) { days.push({ hood: h, from: primary }); used.add(h); } });
  hoodsFor(secondary, bias).forEach(h => { if (days.length < 5 && !used.has(h)) { days.push({ hood: h, from: secondary }); used.add(h); } });
  hoodsFor(primary, bias).forEach(h => { if (days.length < 5 && !used.has(h)) { days.push({ hood: h, from: primary }); used.add(h); } });
  Object.keys(HOODS).forEach(h => { if (days.length < 5 && !used.has(h)) { days.push({ hood: h, from: secondary }); used.add(h); } });

  // Rainmakers always get their FiDi day.
  if (prof === "finance" && !days.some(d => d.hood === "fidi")) {
    let idx = days.map(d => HOODS[d.hood].borough).lastIndexOf("Brooklyn");
    if (idx === -1) idx = days.length - 1;
    days[idx] = { hood: "fidi", from: days[idx].from };
  }
  return { days: days.slice(0, 5), bias };
}

function computeResult(answerLog) {
  // Weighted, multi-signal scoring. Every answer casts a strong vote (2 pts)
  // for its lead element and an affinity vote (1 pt) for a kindred one, so
  // results blend dimensions instead of tallying single categories. Ties are
  // broken by conviction (count of strong votes), then by which spirit
  // claimed you first, never by list order.
  const e = {}; const p = {}; const strong = {}; const first = {};
  let spendSum = 0, spendCnt = 0;
  answerLog.forEach(({ question, answer }, idx) => {
    if (answer.spend !== undefined) { spendSum += answer.spend; spendCnt++; }
    const bank = question.type === "element" ? e : p;
    Object.entries(answer.pts).forEach(([k, v]) => {
      bank[k] = (bank[k] || 0) + v;
      if (v >= 2) strong[k] = (strong[k] || 0) + 1;
      if (!(k in first)) first[k] = idx;
    });
  });
  const rank = (bank) => Object.keys(bank).sort((a, b) =>
    (bank[b] - bank[a]) ||
    ((strong[b] || 0) - (strong[a] || 0)) ||
    ((first[a] !== undefined ? first[a] : 99) - (first[b] !== undefined ? first[b] : 99)));
  const eSorted = rank(e).filter(k => ELEMENTS[k]);
  const pSorted = rank(p).filter(k => PROFESSIONS[k]);
  const primary = eSorted[0] || "light";
  const secondary = eSorted[1] || (primary === "dream" ? "mist" : "dream");
  const prof = pSorted[0] || "design";
  const { days, bias } = routeDays(primary, secondary, prof);
  const spend = spendCnt ? spendSum / (spendCnt * 7) : 0.5;
  return { primary, secondary, prof, days, bias, spend };
}

function resultFromParams() {
  try {
    const q = new URLSearchParams(window.location.search);
    const p = q.get("p"), s = q.get("s"), c = q.get("c");
    const bRaw = parseInt(q.get("b"), 10);
    const spend = Number.isFinite(bRaw) && bRaw >= 0 && bRaw <= 100 ? bRaw / 100 : 0.5;
    if (p && s && c && ELEMENTS[p] && ELEMENTS[s] && PROFESSIONS[c] && p !== s) {
      const { days, bias } = routeDays(p, s, c);
      return { primary: p, secondary: s, prof: c, days, bias, spend };
    }
  } catch (e) {}
  return null;
}

/* ---------------- RESULT PERSISTENCE (works on the live site) ---------------- */
function saveResult(r) {
  try { window.localStorage.setItem("nyq-result", JSON.stringify({ p: r.primary, s: r.secondary, c: r.prof, b: Math.round((r.spend != null ? r.spend : 0.5) * 100) })); } catch (e) {}
}
function loadStoredResult() {
  try {
    const raw = window.localStorage.getItem("nyq-result");
    if (!raw) return null;
    const o = JSON.parse(raw);
    if (o && ELEMENTS[o.p] && ELEMENTS[o.s] && PROFESSIONS[o.c] && o.p !== o.s) {
      const { days, bias } = routeDays(o.p, o.s, o.c);
      const spend = typeof o.b === "number" && o.b >= 0 && o.b <= 100 ? o.b / 100 : 0.5;
      return { primary: o.p, secondary: o.s, prof: o.c, days, bias, spend };
    }
  } catch (e) {}
  return null;
}
function clearStoredResult() {
  try { window.localStorage.removeItem("nyq-result"); } catch (e) {}
}
function putResultInURL(r) {
  try { window.history.replaceState({}, "", window.location.pathname + "?p=" + r.primary + "&s=" + r.secondary + "&c=" + r.prof + "&b=" + Math.round((r.spend != null ? r.spend : 0.5) * 100)); } catch (e) {}
}

/* ---------------- EXPORT & SHARING UTILITIES ---------------- */

/* ---------------- THE ARCANA ---------------- */
const ARCANA = {
  frost: { numeral: "I", title: "The High Priestess",
    essence: "Stillness that sees. You read the room before you enter it, keep your own counsel, and know the deepest currents run silent under the ice.",
    strengths: "Discernment, patience, and a curator's memory. You choose one perfect thing a day and let it change you, and people trust you with secrets because you never spill.",
    challenges: "Keeping counsel so well that no one fully knows you. Watching can become a substitute for walking in, and winter serenity can read as distance.",
    symbolism: "The snowy owl enthroned between the pillars of the veil. First snow, the unblinking gaze, the hush of a museum hall at opening." },
  bloom: { numeral: "II", title: "The Empress",
    essence: "The garden in the grid. You are the force that makes things grow: friendships, window boxes, whole blocks, anyone lucky enough to sit at your table.",
    strengths: "Warmth, hospitality, and an eye that finds beauty in soil and stoop alike. You feed people, in every sense, and your care multiplies whatever it touches.",
    challenges: "Tending everything but yourself. Sweetness spread too thin turns to exhaustion, and not every garden you plant is yours to water forever.",
    symbolism: "The bumblebee crowned among blossoms. The community garden gate, wheat-gold honeycomb, the first farmers market of spring." },
  rock: { numeral: "III", title: "The Emperor",
    essence: "Sovereign of the streets. Your authority is not inherited but earned, block by block, and you hold your ground with the unbothered calm of one who has seen it all.",
    strengths: "Resilience, loyalty, and a nose for what is real. You cannot be hustled, you show up daily, and your people know exactly where you stand.",
    challenges: "Stubbornness wearing the costume of wisdom. A kingdom of familiar corners can shrink if you never cross the bridge, and pride can mistake routine for reign.",
    symbolism: "The pigeon on his fire-escape throne. The folded slice, the standpipe scepter, the ledge with the best view in the city." },
  storm: { numeral: "IV", title: "The Chariot",
    essence: "Will in motion. You harness opposing winds and drive them toward a single destination, and hesitation is the only weather you cannot fly in.",
    strengths: "Courage, decisiveness, and stamina that outlasts any itinerary. You commit fully, arrive first, and make velocity look like grace.",
    challenges: "Speed can outrun reflection. Triumph rings hollow if no one could keep pace, and not every red light is an enemy.",
    symbolism: "The peregrine in her two-hundred-mile dive between towers. Wheels, crosswinds, the express track, dawn departures." },
  ember: { numeral: "V", title: "Strength",
    essence: "Fire mastered from within. Yours is not the loud flame but the banked coal: appetite turned to devotion, passion held steady enough to warm instead of burn.",
    strengths: "Persistence, sensual attention to the world, and the courage to want things openly. You savor, you return, you keep the hearth of any friendship lit.",
    challenges: "Burning too hot for slow company. Hunger can masquerade as direction, and a craving followed blindly forgets why it began.",
    symbolism: "The salamander of old alchemy coiled unharmed in the flame. The lemniscate of patience, the open kitchen, the last ember that outlives the party." },
  shadow: { numeral: "VI", title: "The Hermit",
    essence: "The lantern in the dark. You move through the city's hidden layer, comfortable in solitude, collecting knowledge the daylight crowds walk right past.",
    strengths: "Self-sufficiency, depth, and discretion. You find the unmarked door, keep the confidence, and offer wisdom only when it is truly sought.",
    challenges: "The back room can become a hiding place. Solitude chosen too often hardens into walls, and mystery can be a way of never being asked.",
    symbolism: "The bodega cat slipping between shelves and worlds. The haloed lamp, the whispered password, the alley that opens into a garden." },
  mist: { numeral: "VII", title: "The Hanged Man",
    essence: "Wisdom by surrender. You hang serene where others thrash, letting the current do the carrying, and from that suspended angle you see what strivers miss.",
    strengths: "Patience, perspective, and grace under uncertainty. You are unhurried, unbothered, and quietly luminous exactly when things go formless.",
    challenges: "Waiting can quietly become the plan. Fog flatters indecision, and the willing float must eventually choose a shore.",
    symbolism: "The moon jelly suspended in the harbor's slack tide. The inverted view, the held breath, the veil of fog on the morning ferry." },
  tide: { numeral: "VIII", title: "Temperance",
    essence: "The art of the mixture. You pour between opposites, salt and sweet, motion and stillness, work and water, and somehow keep every glass level.",
    strengths: "Adaptability, unshakeable calm in a current, and the healer's knack for restoring others to balance just by being near.",
    challenges: "Forever adjusting to others can dissolve your own edges. Harbors are shelter, but they are also for leaving, and moderation itself can become an extreme.",
    symbolism: "The harbor seal pouring between two waters. The pearl strand, the turning tide, the ferry wake smoothing to glass." },
  dream: { numeral: "IX", title: "The Moon",
    essence: "Navigation by moonlight. You steer by feel and symbol where others demand maps, at home in ambiguity, fluent in the city's 2 a.m. logic.",
    strengths: "Intuition, imagination, and deep empathy. You sense the mood beneath the words and find doors in walls where no one else looks.",
    challenges: "The beautiful detour can become avoidance. Drifting past decisions leaves them to be made for you, and not every glow is the moon.",
    symbolism: "The moth spiraling the lamplight. The crescent over the reservoir, streets redrawn from memory, the dream you write down at dawn." },
  light: { numeral: "X", title: "The Sun",
    essence: "Joy as a discipline. You walk toward warmth on instinct and carry your own light into every room, and the city brightens measurably where you stand.",
    strengths: "Generosity, honesty, and the rare gift of making others feel seen. You find golden hour in ordinary corners and share it freely.",
    challenges: "Chasing the glow can mean refusing the dark. Joy performed without rest dims, and even the sun goes down so it can rise.",
    symbolism: "The firefly carrying her lantern through the meadow. The rooftop at dusk, the gilded window, golden hour lasting one stop longer." },
  echo: { numeral: "XI", title: "Judgment",
    essence: "The call and the answer. You carry voices forward, old songs, old friends, second chances, and when the horn sounds you are the first to rise and reply.",
    strengths: "Loyalty to lineage, a gift for gathering the flock, and the courage to begin again loudly. You make revival feel like celebration.",
    challenges: "Living in the liner notes. Nostalgia can be mistaken for destiny, and repeating the beloved song is not the same as writing the next verse.",
    symbolism: "The wild parrot crying dawn over Green-Wood. The trumpet phrase, the B-side flipped, the chorus that returns transformed." },
  iron: { numeral: "XII", title: "The World",
    essence: "The city, completed. You see the whole system, bones and bolts and timetables, and you are the quiet reason everything holds together and arrives.",
    strengths: "Reliability, craft, and endurance. You finish what you start, honor the unglamorous work, and find genuine romance in girders and schedules.",
    challenges: "Perfection delays arrival. The wreath only closes when you let a thing be finished, and holding the world up leaves little time to stand inside it.",
    symbolism: "The subway rat crowned within the laurel ring. Rivets, bridge cables, the completed circuit, the last train that always comes." },
};

const VOICES = {
  light: "Follow the glow and you can't get lost, I checked.",
  dream: "We'll take the long way. It's shorter in the ways that count.",
  rock: "Wear the boots. We're standing near the amps.",
  storm: "Eat a big breakfast. I'm not slowing down for you.",
  ember: "If you smell smoke, that's not a problem, that's the destination.",
  tide: "Keep the water on your right and your schedule loose.",
  frost: "One perfect thing a day. Everything else is garnish.",
  bloom: "Stop and smell literally everything. That's the itinerary.",
  shadow: "If the door has no sign, knock twice. Tell them Noir sent you.",
  echo: "Every block has a B-side. We're flipping all of them.",
  iron: "Mind the gap, admire the girders, tip your sandhogs.",
  mist: "We drift. The city arranges itself around us. Trust the fog.",
};

const FALLBACK_URL = "https://dianakao1.github.io/nyc-elements-quiz/";

function shareURL(p, s, c) {
  let base = FALLBACK_URL;
  try {
    if (window.location && String(window.location.origin).indexOf("http") === 0) {
      base = window.location.origin + window.location.pathname;
    }
  } catch (e) {}
  return base + "?p=" + p + "&s=" + s + "&c=" + c;
}

function taglineFor(p, s) {
  return "A " + ELEMENTS[p].style + " with a " + ELEMENTS[s].name.toLowerCase() + " streak. One city, taken personally.";
}

function csvEscape(v) { return '"' + String(v).replace(/"/g, '""') + '"'; }

function downloadBlob(name, blob) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
}

async function downloadCards(p1, p2) {
  for (const el of [p1, p2]) {
    try {
      const res = await fetch(CARD_SRC(el));
      if (!res.ok) throw new Error("missing");
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = ELEMENTS[el].hero.name.split(" the ")[0].toLowerCase() + "-" + ARCANA[el].title.toLowerCase().replace(/\s+/g, "-") + ".jpg";
      document.body.appendChild(a);
      a.click();
      setTimeout(((h, node) => () => { URL.revokeObjectURL(h); node.remove(); })(a.href, a), 2000);
      await new Promise((r) => setTimeout(r, 400));
    } catch (e) {
      alert("Couldn't fetch " + ELEMENTS[el].hero.name + "'s card. The card images need to be uploaded alongside the site.");
      return;
    }
  }
}

function expandSlots(H, spend, di) {
  const sp = spend != null ? spend : 0.5;
  const out = [];
  H.slots.forEach((row) => {
    out.push(row);
    if (row[0] === "Afternoon" && H.extra) out.push(H.extra);
    if (row[0] === "Dinner" && H.dessert) {
      const plushy = sp >= 0.55 ? true : sp <= 0.45 ? false : di % 2 === 0;
      const d = plushy ? H.dessert.plush : H.dessert.gem;
      out.push(["Dessert", d[0], d[1]]);
    }
  });
  return out;
}

function downloadCSV(days, spend) {
  const rows = [["Day", "Neighborhood", "Borough", "Slot", "Place", "Notes", "Location (for Google My Maps)"]];
  days.forEach((d, i) => {
    const H = HOODS[d.hood];
    expandSlots(H, spend, i).forEach(([slot, place, note]) => {
      rows.push(["Day " + (i + 1), H.name, H.borough, slot, place, note, place + ", " + H.name + ", New York, NY"]);
    });
  });
  const csv = "\uFEFF" + rows.map(r => r.map(csvEscape).join(",")).join("\r\n");
  downloadBlob("nyc-itinerary.csv", new Blob([csv], { type: "text/csv;charset=utf-8" }));
}

function mapsLink(H) {
  const pts = H.slots.map(s => s[1] + ", " + H.name + ", New York, NY");
  const e = encodeURIComponent;
  const mid = pts.slice(1, -1).map(e).join("%7C");
  return "https://www.google.com/maps/dir/?api=1&travelmode=walking&origin=" + e(pts[0]) +
    "&destination=" + e(pts[pts.length - 1]) + (mid ? "&waypoints=" + mid : "");
}

function buildDocExport(days, primary, secondary, prof, spend) {
  const P = ELEMENTS[primary], S = ELEMENTS[secondary], PR = PROFESSIONS[prof];
  const esc = t => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  let html = "<h1>Which New York Are You: The " + esc(P.name) + "/" + esc(S.name) + " Line</h1>";
  let text = "WHICH NEW YORK ARE YOU? · THE " + P.name.toUpperCase() + "/" + S.name.toUpperCase() + " LINE\n";
  html += "<p><i>Divined by " + esc(P.hero.name) + " (" + esc(ARCANA[primary].title) + ") &amp; " + esc(S.hero.name) + " (" + esc(ARCANA[secondary].title) + ") \u00B7 " + esc(taglineFor(primary, secondary)) + "</i></p>";
  text += "Divined by " + P.hero.name + " (" + ARCANA[primary].title + ") & " + S.hero.name + " (" + ARCANA[secondary].title + ") \u00B7 " + taglineFor(primary, secondary) + "\n\n";
  days.forEach((d, i) => {
    const H = HOODS[d.hood];
    html += "<h2>Day " + (i + 1) + ": " + esc(H.name) + ", " + esc(H.borough) + "</h2><p><i>" + esc(H.vibe) + "</i></p><ul>";
    text += "DAY " + (i + 1) + ": " + H.name + ", " + H.borough + "\n" + H.vibe + "\n";
    expandSlots(H, spend, i).forEach(([slot, place, note]) => {
      html += "<li><b>" + esc(slot) + ": " + esc(place) + "</b>: " + esc(note) + "</li>";
      text += "  \u2022 " + slot + ": " + place + ": " + note + "\n";
    });
    html += "</ul><p><a href=\"" + mapsLink(H) + "\">Walking route in Google Maps</a></p>";
    text += "  Route: " + mapsLink(H) + "\n\n";
  });
  html += "<h2>Bonus stops for " + esc(PR.name) + " (" + esc(PR.field) + ")</h2><ul>";
  text += "BONUS STOPS FOR " + PR.name.toUpperCase() + " (" + PR.field + ")\n";
  PR.picks.forEach(w => { html += "<li><b>" + esc(w.name) + "</b>: " + esc(w.note) + "</li>"; text += "  \u2022 " + w.name + ": " + w.note + "\n"; });
  html += "</ul><h2>Wildcards</h2><ul>";
  text += "\nWILDCARDS\n";
  [P, S].forEach(el => { html += "<li><b>" + esc(el.wildcard.name) + "</b>: " + esc(el.wildcard.note) + "</li>"; text += "  \u2022 " + el.wildcard.name + ": " + el.wildcard.note + "\n"; });
  html += "</ul>";
  return { html, text };
}

function svgDataURL(elKey) {
  return CARD_SRC(elKey);
}

function loadImg(src) {
  return new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = src; });
}

function fitFont(ctx, text, px, family, maxW, style) {
  let size = px;
  while (size > 14) {
    ctx.font = (style ? style + " " : "") + "700 " + size + "px " + family;
    if (ctx.measureText(text).width <= maxW) break;
    size -= 2;
  }
  return size;
}

function wrapTwo(ctx, text, maxW) {
  if (ctx.measureText(text).width <= maxW) return [text];
  const words = text.split(" ");
  let a = "", i = 0;
  for (; i < words.length; i++) {
    const t = a ? a + " " + words[i] : words[i];
    if (ctx.measureText(t).width > maxW && a) break;
    a = t;
  }
  return [a, words.slice(i).join(" ")];
}

async function buildShareCardDataURL(format, primary, secondary, prof) {
  try { await document.fonts.ready; } catch (e) {}
  const P = ELEMENTS[primary], S = ELEMENTS[secondary];
  const W = format === "og" ? 1200 : 1080;
  const H = format === "story" ? 1920 : format === "square" ? 1080 : 630;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = CARD_BG; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = GOLD; ctx.lineWidth = 4; ctx.strokeRect(24, 24, W - 48, H - 48);
  ctx.lineWidth = 1.5; ctx.strokeStyle = P.color; ctx.strokeRect(38, 38, W - 76, H - 76);

  const pSrc = svgDataURL(primary), sSrc = svgDataURL(secondary);
  if (!pSrc || !sSrc) throw new Error("card art not rendered yet");
  const [pi, si] = await Promise.all([loadImg(pSrc), loadImg(sSrc)]);

  const draw = (img, cx, cy, w, rot) => {
    const h = w * (img.height / img.width || 1.25);
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot * Math.PI / 180);
    ctx.shadowColor = "rgba(0,0,0,0.45)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 12;
    ctx.drawImage(img, -w / 2, -h / 2, w, h); ctx.restore();
  };

  const SG = "'Space Grotesk', sans-serif", FR = "'Fraunces', Georgia, serif";
  const title = "WHICH NEW YORK ARE YOU?";
  const names = P.hero.name.split(" the ")[0].toUpperCase() + "  \u00D7  " + S.hero.name.split(" the ")[0].toUpperCase();
  const species = (d) => d.hero.name.split(" the ")[1] || d.name;
  const arcTxt = (ARCANA[primary].title + " " + species(P) + "  \u00D7  " + ARCANA[secondary].title + " " + species(S)).toUpperCase();
  const essence = (ARCANA[primary].essence.split(". ")[0] + ".");
  const lineTxt = "THE " + P.name.toUpperCase() + "/" + S.name.toUpperCase() + " LINE \u00B7 NEW YORK";
  const wrapLines = (c, text, maxW, maxLines) => {
    const words = text.split(" "); const lines = []; let cur = "";
    words.forEach((w) => {
      const t = cur ? cur + " " + w : w;
      if (c.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else { cur = t; }
    });
    if (cur) lines.push(cur);
    if (lines.length > maxLines) { lines.length = maxLines; lines[maxLines - 1] += "\u2026"; }
    return lines;
  };
  const tag = taglineFor(primary, secondary);
  const url = shareURL(primary, secondary, prof).replace(/^https?:\/\//, "");
  try { ctx.letterSpacing = "4px"; } catch (e) {}

  if (format === "story") {
    ctx.textAlign = "center";
    ctx.fillStyle = GOLD;
    ctx.font = "700 " + fitFont(ctx, title, 44, SG, 920) + "px " + SG; ctx.fillText(title, W / 2, 170);
    draw(pi, 540, 720, 620, -2);   // the person's card, front and center
    draw(si, 800, 1070, 270, 8);   // sidekick tucked at its shoulder
    ctx.fillStyle = CREAM;
    ctx.font = "700 " + fitFont(ctx, names, 62, SG, 940) + "px " + SG; ctx.fillText(names, W / 2, 1330);
    ctx.fillStyle = GOLD; ctx.font = "700 " + fitFont(ctx, arcTxt, 27, SG, 960) + "px " + SG; ctx.fillText(arcTxt, W / 2, 1392);
    ctx.fillStyle = CREAM; ctx.font = "italic 500 34px " + FR;
    wrapLines(ctx, essence, 880, 3).forEach((ln, i) => ctx.fillText(ln, W / 2, 1460 + i * 50));
    ctx.fillStyle = GOLD; ctx.font = "700 24px " + SG; ctx.fillText(lineTxt, W / 2, 1650);
    ctx.fillStyle = GOLD; ctx.font = "500 24px " + SG; ctx.fillText(url, W / 2, 1810);
  } else if (format === "square") {
    ctx.textAlign = "center";
    ctx.fillStyle = GOLD;
    ctx.font = "700 " + fitFont(ctx, title, 38, SG, 920) + "px " + SG; ctx.fillText(title, W / 2, 110);
    draw(pi, 450, 470, 400, -3);   // primary large
    draw(si, 790, 600, 230, 7);    // sidekick small
    ctx.fillStyle = CREAM;
    ctx.font = "700 " + fitFont(ctx, names, 46, SG, 940) + "px " + SG; ctx.fillText(names, W / 2, 812);
    ctx.fillStyle = GOLD; ctx.font = "700 " + fitFont(ctx, arcTxt, 20, SG, 960) + "px " + SG; ctx.fillText(arcTxt, W / 2, 858);
    ctx.fillStyle = CREAM; ctx.font = "italic 500 26px " + FR;
    wrapLines(ctx, essence, 860, 2).forEach((ln, i) => ctx.fillText(ln, W / 2, 908 + i * 38));
    ctx.fillStyle = GOLD; ctx.font = "500 20px " + SG; ctx.fillText(url, W / 2, 1012);
  } else {
    draw(pi, 185, 320, 260, -4); draw(si, 395, 360, 200, 7);
    ctx.textAlign = "left";
    ctx.fillStyle = GOLD;
    ctx.font = "700 " + fitFont(ctx, title, 32, SG, 560) + "px " + SG; ctx.fillText(title, 560, 118);
    ctx.fillStyle = CREAM;
    ctx.font = "700 " + fitFont(ctx, names, 48, SG, 570) + "px " + SG; ctx.fillText(names, 560, 205);
    ctx.fillStyle = GOLD; ctx.font = "700 " + fitFont(ctx, arcTxt, 20, SG, 570) + "px " + SG; ctx.fillText(arcTxt, 560, 252);
    ctx.fillStyle = GOLD; ctx.font = "700 17px " + SG; ctx.fillText(lineTxt, 560, 292);
    ctx.fillStyle = CREAM; ctx.font = "italic 500 26px " + FR;
    const lines = wrapTwo(ctx, tag, 570);
    ctx.fillText(lines[0], 560, 340);
    if (lines[1]) ctx.fillText(lines[1], 560, 378);
    ctx.fillStyle = GOLD; ctx.font = "500 20px " + SG; ctx.fillText(url, 560, 555);
  }

  return canvas.toDataURL("image/png");
}

/* ---------------- UI PIECES ---------------- */
function Bullet({ el, size = 44 }) {
  const d = ELEMENTS[el];
  const first = d.hero.name.split(" the ")[0];
  const collide = Object.values(ELEMENTS).filter(x => x.hero.name[0] === first[0]).length > 1;
  return (
    <span aria-hidden="true" className="q-display inline-flex flex-col items-center justify-center rounded-full flex-shrink-0 leading-none select-none"
      style={{ background: d.color, color: d.dark ? INK : "#fff", width: size, height: size, fontSize: size * (collide ? 0.36 : 0.42) }}>
      <span>{first[0]}</span>
      {collide && <span style={{ fontSize: Math.max(6.5, size * 0.145), marginTop: size * 0.04, letterSpacing: "0.02em" }}>{first}</span>}
    </span>
  );
}

function Eyebrow({ children, color = MUTED }) {
  return <p className="q-eyebrow" style={{ color }}>{children}</p>;
}

function CopyIcon() {
  return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", verticalAlign: "-2px", marginLeft: 4 }}><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>);
}

/* ---------------- APP ---------------- */
export default function App() {
  const [result, setResult] = useState(() => resultFromParams() || loadStoredResult());
  const [screen, setScreen] = useState(result ? "result" : "intro");
  const [qi, setQi] = useState(0);
  const [log, setLog] = useState([]);
  const [cheer, setCheer] = useState(null);
  const [openDay, setOpenDay] = useState(0);
  const [printMode, setPrintMode] = useState(false);
  const [preview, setPreview] = useState(null); // null | "csv" | "pdf" | "docs"
  const [cardPreview, setCardPreview] = useState(null); // { format, label, url }
  const [docsCopied, setDocsCopied] = useState(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") { setPreview(null); setCardPreview(null); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const answer = (a) => {
    const question = QUESTIONS[qi];
    const newLog = [...log, { question, answer: a }];
    setLog(newLog);
    if (question.type === "element") {
      const top = Object.entries(a.pts).sort((x, y) => y[1] - x[1])[0][0];
      setCheer(ELEMENTS[top].cheer);
    } else if (question.type === "spend") {
      setCheer("🪙 The deck weighs your appetite for splendor. No judgment. Some judgment.");
    } else {
      setCheer("🔮 The deck stirs. It has caught the scent of your calling.");
    }
    if (qi + 1 < QUESTIONS.length) { setQi(qi + 1); }
    else {
      const r = computeResult(newLog);
      setResult(r); saveResult(r); putResultInURL(r);
      setScreen("result"); setOpenDay(0);
    }
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    setCheer(null);
    if (qi === 0) { setLog([]); setScreen("intro"); }
    else { setLog(log.slice(0, -1)); setQi(qi - 1); }
    window.scrollTo(0, 0);
  };

  const backFromResult = () => {
    setResult(null); setCheer(null);
    setLog(log.slice(0, -1));
    setQi(QUESTIONS.length - 1);
    setScreen("quiz");
    try { window.history.replaceState({}, "", window.location.pathname); } catch (e) {}
    window.scrollTo(0, 0);
  };

  const restart = () => {
    clearStoredResult();
    try { window.history.replaceState({}, "", window.location.pathname); } catch (e) {}
    setScreen("intro"); setQi(0); setLog([]); setCheer(null); setResult(null);
    window.scrollTo(0, 0);
  };

  const Shell = ({ children }) => (
    <div className="q-body min-h-screen" style={{ background: PAPER, color: INK }}>
      <style>{CSS}</style>
      <main className="max-w-2xl mx-auto px-5 py-9">{children}</main>
    </div>
  );

  /* ---- INTRO ---- */
  if (screen === "intro") return (
    <Shell>
      <div className="anim-up" style={{ borderTop: "6px solid " + INK, paddingTop: 18 }}>
        <Eyebrow>New York City · A five-card reading</Eyebrow>
        <h1 className="q-display mt-3" style={{ fontSize: "clamp(2.6rem,8vw,4.2rem)", lineHeight: 0.98 }}>
          Which New York<br />are you?
        </h1>
        <p className="q-whimsy mt-5 text-lg" style={{ color: "#3d3b36", maxWidth: "36ch" }}>
          {QUESTIONS.length} questions. Twelve arcana, twelve wild New Yorkers. One five-day itinerary of the city's
          less-trodden corners, each day walkable within a single neighborhood.
        </p>
      </div>

      <TarotDeck />

      <p className="q-whimsy mt-7 text-sm" style={{ color: MUTED, maxWidth: "44ch" }}>
        Two of these little heroes will claim you, a primary and a sidekick, and at the end you'll
        draw their cards. The deck reads more than elements: it may also glimpse your worldly craft,
        the trade written faintly on your palms. Don't fight it.
      </p>

      <button onClick={() => setScreen("quiz")}
        className="q-btn q-focus q-display mt-8 w-full py-4 rounded-full text-lg text-white"
        style={{ background: INK }}>
        Start the quiz →
      </button>
    </Shell>
  );

  /* ---- QUIZ ---- */
  if (screen === "quiz") {
    const q = QUESTIONS[qi];
    return (
      <Shell>
        <div className="flex items-center" aria-hidden="true">
          {QUESTIONS.map((_, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="rounded-full flex-shrink-0" style={{
                width: i === qi ? 13 : 10, height: i === qi ? 13 : 10,
                background: i < qi ? INK : i === qi ? "#E23B2E" : PAPER,
                border: "2px solid " + INK,
                transition: "all .25s ease",
              }} />
              {i < QUESTIONS.length - 1 && <div style={{ height: 2, background: i < qi ? INK : HAIR, flex: 1, transition: "background .25s ease" }} />}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <Eyebrow>Stop {qi + 1} of {QUESTIONS.length}{q.type === "profession" ? " · the veil thins" : ""}</Eyebrow>
          <button onClick={goBack} className="q-eyebrow q-focus underline underline-offset-4" style={{ color: INK, background: "none", border: "none", cursor: "pointer", padding: "12px 8px", margin: "-12px -8px" }}>
            ← Back
          </button>
        </div>

        <div key={qi} className="anim-up">
          <p role="status" aria-live="polite" className="q-whimsy mt-4 text-sm" style={{ color: "#3d3b36", minHeight: "1.4em" }}>{cheer || ""}</p>

          <h2 className="q-display mt-4" style={{ fontSize: "clamp(1.6rem,5.5vw,2.3rem)", lineHeight: 1.05 }}>{q.q}</h2>

          <div className="mt-6 flex flex-col gap-2.5">
            {q.answers.map((a, i) => (
              <button key={i} onClick={() => answer(a)}
                className="q-card q-answer q-focus anim-up text-left px-5 py-3.5 font-medium text-[15px]"
                style={{ color: INK, animationDelay: (i * 45) + "ms" }}>
                {a.text}
              </button>
            ))}
          </div>
        </div>
      </Shell>
    );
  }

  /* ---- RESULT ---- */
  const { primary, secondary, prof, days, bias } = result;
  const P = ELEMENTS[primary], S = ELEMENTS[secondary], PR = PROFESSIONS[prof];

  const printItinerary = () => {
    setPrintMode(true);
    setTimeout(() => {
      try {
        window.print();
      } catch (e) {
        alert("Printing is blocked in this preview environment, on the live site this opens your print dialog, where you can choose Save as PDF.");
      }
      setPrintMode(false);
    }, 350);
  };

  const copyForDocs = () => {
    const { html, text } = buildDocExport(days, primary, secondary, prof, result.spend);
    const done = () => { setDocsCopied(true); setTimeout(() => setDocsCopied(false), 2500); };
    const fallback = () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(() => window.prompt("Copy your plan:", text));
      } else { window.prompt("Copy your plan:", text); }
    };
    if (navigator.clipboard && navigator.clipboard.write && window.ClipboardItem) {
      // Called synchronously inside the click gesture; promise-form blobs keep Safari happy.
      const item = new ClipboardItem({
        "text/html": Promise.resolve(new Blob([html], { type: "text/html" })),
        "text/plain": Promise.resolve(new Blob([text], { type: "text/plain" })),
      });
      navigator.clipboard.write([item]).then(done).catch(fallback);
    } else { fallback(); }
  };

  const makeCard = async (format, label) => {
    try {
      const url = await buildShareCardDataURL(format, primary, secondary, prof);
      setCardPreview({ format, label, url });
    } catch (e) {
      alert("Couldn't render the card (" + e.message + "). Try again in a second.");
    }
  };

  return (
    <Shell>
      <div className="print-block" style={{ marginBottom: 24, borderBottom: "2px solid " + INK, paddingBottom: 16 }}>
        <Eyebrow>Which New York Are You? · A five-day field guide</Eyebrow>
        <p className="q-display" style={{ fontSize: 24, marginTop: 6 }}>Divined by {P.hero.name} & {S.hero.name}</p>
        <p className="q-eyebrow" style={{ marginTop: 6, color: "#7a5f16" }}>{ARCANA[primary].numeral} {ARCANA[primary].title} × {ARCANA[secondary].numeral} {ARCANA[secondary].title}</p>
        <p className="q-whimsy" style={{ color: "#3d3b36", marginTop: 8 }}>"{VOICES[primary]}" · {P.hero.name.split(" the ")[0]}</p>
        <p className="q-whimsy" style={{ color: MUTED, marginTop: 4, fontSize: 13 }}>{taglineFor(primary, secondary)} · {shareURL(primary, secondary, prof)}</p>
      </div>

      {log.length === QUESTIONS.length && (
        <button onClick={backFromResult} className="q-eyebrow q-focus no-print mb-5 underline underline-offset-4" style={{ color: INK, background: "none", border: "none", cursor: "pointer" }}>
          ← Change my last answer
        </button>
      )}

      {/* The draw */}
      <div className="text-center">
        <Eyebrow>Your card has been drawn</Eyebrow>
        <div className="mt-4 flex justify-center anim-draw">
          <TarotCard el={primary} w={232} />
        </div>
        <h1 className="q-display mt-6" style={{ fontSize: "clamp(2rem,7vw,3rem)", lineHeight: 1 }}>{P.hero.name}</h1>
        <p className="q-eyebrow mt-2.5" style={{ color: "#7a5f16", letterSpacing: "0.18em" }}>{ARCANA[primary].numeral} · {ARCANA[primary].title}</p>
        <p className="q-eyebrow mt-1.5" style={{ color: MUTED }}>{P.name} · {P.style}</p>
        <p className="q-whimsy mt-4 text-[15px] leading-relaxed mx-auto" style={{ color: "#3d3b36", maxWidth: "44ch" }}>{P.hero.bio}</p>
        <div className="q-card anim-up mx-auto text-left px-5 py-4 mt-5" style={{ maxWidth: 460, animationDelay: "250ms" }}>
          <Eyebrow>Why {P.hero.name.split(" the ")[0]} chose you</Eyebrow>
          <p className="text-sm leading-relaxed mt-1.5" style={{ color: "#3d3b36" }}>{P.hero.why}</p>
        </div>
        <div className="q-card anim-up mx-auto text-left px-5 py-4 mt-3" style={{ maxWidth: 460, animationDelay: "320ms" }}>
          <Eyebrow>The reading · {ARCANA[primary].title}</Eyebrow>
          {[["Essence", ARCANA[primary].essence], ["Strengths", ARCANA[primary].strengths],
            ["Shadow to watch", ARCANA[primary].challenges], ["Symbols", ARCANA[primary].symbolism]].map(([h, t]) => (
            <div key={h} className="mt-3">
              <h3 className="q-eyebrow" style={{ fontSize: 10, color: "#7a5f16" }}>{h}</h3>
              <p className="text-sm leading-relaxed mt-1" style={{ color: "#3d3b36" }}>{t}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sidekick + profession */}
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        <div className="q-card anim-up p-5" style={{ animationDelay: "350ms" }}>
          <div className="flex gap-4 items-start">
            <TarotCard el={secondary} w={86} />
            <div>
              <Eyebrow>Sidekick · {ARCANA[secondary].numeral} · {ARCANA[secondary].title}</Eyebrow>
              <p className="q-display text-[17px] mt-0.5">{S.hero.name}</p>
              <p className="q-whimsy text-[13px] mt-2 leading-relaxed" style={{ color: MUTED }}>{S.hero.why}</p>
            </div>
          </div>
          <p className="text-[13px] mt-3 leading-relaxed" style={{ color: "#4a473f" }}>{S.hero.bio}</p>
          <p className="q-whimsy text-[12.5px] mt-2.5 leading-relaxed" style={{ color: MUTED }}>{ARCANA[secondary].essence}</p>
        </div>
        <div className="q-card anim-up p-5" style={{ animationDelay: "420ms" }}>
          <Eyebrow>Worldly calling · {PR.field}</Eyebrow>
          <p className="q-display text-[17px] mt-1">{PR.name}</p>
          <p className="text-[13px] mt-2.5 leading-relaxed" style={{ color: "#4a473f" }}>{PR.blurb}</p>
        </div>
      </div>

      {/* Itinerary */}
      <div className="mt-10 flex items-baseline justify-between">
        <h2 className="q-display text-2xl">Five stops</h2>
        <Eyebrow>One neighborhood per day</Eyebrow>
      </div>
      <p className="q-whimsy mt-1.5 text-sm" style={{ color: MUTED }}>
        Everything within each day is walkable. Tap a stop to open it.
        {bias ? " The deck sensed your calling and kept you mostly on the island, candlelight, cobblestones, old money blocks." : ""}
      </p>

      <div className="mt-5 relative">
        <div className="absolute rounded" style={{ left: 20, top: 22, bottom: 22, width: 3, background: INK }} />
        {days.map((d, i) => {
          const H = HOODS[d.hood]; const el = ELEMENTS[d.from]; const open = printMode || openDay === i;
          return (
            <div key={i} className="relative pb-3 anim-up" style={{ paddingLeft: 60, animationDelay: (450 + i * 70) + "ms" }}>
              <div className="absolute" style={{ left: 0, top: 4 }}><Bullet el={d.from} size={44} /></div>
              <button aria-expanded={open} onClick={() => setOpenDay(open ? -1 : i)}
                className="q-card q-answer q-focus w-full text-left px-5 py-4">
                <Eyebrow>Day {i + 1} · {H.borough}</Eyebrow>
                <p className="q-display text-xl mt-0.5" style={{ lineHeight: 1.1 }}>{H.name}</p>
                <p className="q-whimsy text-sm mt-1.5" style={{ color: MUTED }}>{H.vibe}</p>
                <p className="text-xs mt-2 font-medium" style={{ color: el.dark ? "#77716a" : el.color }}>
                  {el.hero.name.split(" the ")[0]} picked this one · {open ? "close" : "open"}
                </p>
              </button>
              {open && (
                <div className="q-card anim-up mt-2 px-5 py-4 flex flex-col gap-3.5">
                  {expandSlots(H, result.spend, i).map(([slot, place, note], j) => (
                    <div key={j} style={{ borderLeft: "2px solid " + el.color, paddingLeft: 14 }}>
                      <Eyebrow>{slot}</Eyebrow>
                      <p className="q-display text-[15px] mt-0.5">{place}</p>
                      <p className="text-[13px] leading-relaxed mt-0.5" style={{ color: "#4a473f" }}>{note}</p>
                    </div>
                  ))}
                  <a className="q-eyebrow no-print mt-1" href={mapsLink(H)} target="_blank" rel="noopener noreferrer"
                    style={{ color: INK, textDecoration: "underline", textUnderlineOffset: 3 }}>
                    Navigate this day in Google Maps ↗
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Profession picks */}
      <h2 className="q-display text-2xl mt-10">Bonus stops for {PR.name}</h2>
      <p className="q-whimsy mt-1.5 text-sm" style={{ color: MUTED }}>The deck read your palms and dealt three extra stops, slot them into any afternoon.</p>
      <div className="mt-4 flex flex-col gap-2.5">
        {PR.picks.map((w, i) => (
          <div key={i} className="q-card px-5 py-4">
            <p className="q-display text-[15px]">{w.name}</p>
            <p className="text-[13px] leading-relaxed mt-0.5" style={{ color: "#4a473f" }}>{w.note}</p>
          </div>
        ))}
      </div>

      {/* Wildcards */}
      <h2 className="q-display text-2xl mt-10">Wildcards from your heroes</h2>
      <div className="mt-4 flex flex-col gap-2.5">
        {[P, S].map((el, i) => (
          <div key={i} className="q-card px-5 py-4 flex gap-3.5 items-start">
            <Bullet el={i === 0 ? primary : secondary} size={30} />
            <div>
              <p className="q-display text-[15px]">{el.wildcard.name}</p>
              <p className="text-[13px] leading-relaxed mt-0.5" style={{ color: "#4a473f" }}>{el.wildcard.note}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Take it with you, one-tap exports */}
      <h2 className="q-display text-2xl mt-10 no-print">Take it with you</h2>
      <div className="mt-4 grid grid-cols-2 gap-2.5 no-print">
        <button onClick={() => setPreview("csv")} className="q-btn q-focus q-display py-3.5 rounded-2xl text-[15px] text-white" style={{ background: INK }}>
          Excel ⬇
        </button>
        <button onClick={() => setPreview("pdf")} className="q-btn q-focus q-display py-3.5 rounded-2xl text-[15px] text-white" style={{ background: INK }}>
          PDF ⬇
        </button>
        <button onClick={() => setPreview("cards")} className="q-btn q-focus q-display py-3.5 rounded-2xl text-[15px] text-white" style={{ background: INK }}>
          Cards ⬇
        </button>
        <button onClick={() => setPreview("docs")} className="q-btn q-focus q-display py-3.5 rounded-2xl text-[15px] text-white" style={{ background: INK }}>
          {docsCopied ? "Copied ✓" : (<span>Copy<CopyIcon/></span>)}
        </button>
      </div>
      <div className="mt-2.5 grid grid-cols-3 gap-2.5 no-print">
        <button onClick={() => makeCard("story", "9:16 Story")} className="q-btn q-focus q-eyebrow py-3 rounded-2xl" style={{ border: "1.5px solid " + INK, background: "transparent", color: INK, cursor: "pointer" }}>Story card</button>
        <button onClick={() => makeCard("square", "1:1 Square")} className="q-btn q-focus q-eyebrow py-3 rounded-2xl" style={{ border: "1.5px solid " + INK, background: "transparent", color: INK, cursor: "pointer" }}>Square card</button>
        <button onClick={() => makeCard("og", "Link preview")} className="q-btn q-focus q-eyebrow py-3 rounded-2xl" style={{ border: "1.5px solid " + INK, background: "transparent", color: INK, cursor: "pointer" }}>Preview card</button>
      </div>

      <button onClick={restart} className="q-btn q-focus q-display no-print mt-10 w-full py-4 rounded-full text-lg text-white" style={{ background: INK }}>
        ↺ Draw again
      </button>
      {preview && (
        <div className="no-print" role="dialog" aria-modal="true"
          aria-label={preview === "csv" ? "Spreadsheet preview" : preview === "pdf" ? "PDF preview" : preview === "cards" ? "Card images preview" : "Copy preview"}
          onClick={() => setPreview(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(23,22,26,0.55)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div className="q-card anim-pop" onClick={e => e.stopPropagation()}
            style={{ maxWidth: 520, width: "100%", maxHeight: "82vh", overflowY: "auto", padding: 20 }}>

            {preview === "csv" ? (
              <div>
                <Eyebrow>Preview · nyc-itinerary.csv</Eyebrow>
                <p className="q-display text-lg mt-1">Your trip as a spreadsheet</p>
                <div className="mt-3" style={{ border: "1px solid " + HAIR, borderRadius: 12, overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
                    <thead>
                      <tr style={{ background: PAPER }}>
                        {["Day", "Slot", "Place", "Neighborhood"].map(h => (
                          <th key={h} className="q-eyebrow" style={{ textAlign: "left", padding: "7px 8px", borderBottom: "1px solid " + HAIR, fontSize: 9.5 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {HOODS[days[0].hood].slots.map(([slot, place], j) => (
                        <tr key={j}>
                          <td style={{ padding: "6px 8px", borderBottom: "1px solid " + HAIR, color: MUTED }}>Day 1</td>
                          <td style={{ padding: "6px 8px", borderBottom: "1px solid " + HAIR, color: MUTED }}>{slot}</td>
                          <td style={{ padding: "6px 8px", borderBottom: "1px solid " + HAIR, fontWeight: 600 }}>{place}</td>
                          <td style={{ padding: "6px 8px", borderBottom: "1px solid " + HAIR, color: MUTED }}>{HOODS[days[0].hood].name}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan="4" className="q-whimsy" style={{ padding: "8px", color: MUTED, textAlign: "center" }}>
                          … plus Days 2–5, every note, and a Location column that imports straight into Google My Maps
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : preview === "pdf" ? (
              <div>
                <Eyebrow>Preview · printable field guide</Eyebrow>
                <p className="q-display text-lg mt-1">A PDF in {P.hero.name.split(" the ")[0]}'s voice</p>
                <div className="mt-3" style={{ border: "1px solid " + HAIR, borderRadius: 12, padding: 16, background: "#fff" }}>
                  <div style={{ borderBottom: "2px solid " + INK, paddingBottom: 10 }}>
                    <Eyebrow>Which New York Are You? · A five-day field guide</Eyebrow>
                    <p className="q-display" style={{ fontSize: 17, marginTop: 4 }}>Divined by {P.hero.name} & {S.hero.name}</p>
                    <p className="q-eyebrow" style={{ marginTop: 4, fontSize: 9, color: "#7a5f16" }}>{ARCANA[primary].title} × {ARCANA[secondary].title}</p>
                    <p className="q-whimsy text-[12.5px] mt-1.5" style={{ color: "#3d3b36" }}>"{VOICES[primary]}" · {P.hero.name.split(" the ")[0]}</p>
                  </div>
                  <div className="mt-3">
                    <Eyebrow>Day 1 · {HOODS[days[0].hood].borough}</Eyebrow>
                    <p className="q-display text-[15px] mt-0.5">{HOODS[days[0].hood].name}</p>
                    {HOODS[days[0].hood].slots.slice(0, 2).map(([slot, place, note], j) => (
                      <div key={j} className="mt-2" style={{ borderLeft: "2px solid " + P.color, paddingLeft: 10 }}>
                        <p className="q-eyebrow" style={{ fontSize: 9 }}>{slot}</p>
                        <p className="text-[12.5px] font-semibold">{place}</p>
                        <p className="text-[11.5px]" style={{ color: MUTED }}>{note}</p>
                      </div>
                    ))}
                    <p className="q-whimsy text-[12px] mt-2.5" style={{ color: MUTED }}>… all five days, every stop, cards and wildcards included</p>
                  </div>
                </div>
                <p className="text-[12px] mt-2.5" style={{ color: MUTED }}>Your print dialog opens next, choose "Save as PDF."</p>
              </div>
            ) : preview === "cards" ? (
              <div>
                <Eyebrow>Preview · two collectible cards</Eyebrow>
                <p className="q-display text-lg mt-1">Your two cards</p>
                <div className="mt-3 flex gap-3 justify-center">
                  {[primary, secondary].map((el) => (
                    <div key={el} style={{ width: "42%" }}>
                      <img src={CARD_SRC(el)} alt={"Tarot card " + ARCANA[el].numeral + ", " + ARCANA[el].title + ": " + ELEMENTS[el].hero.name}
                        style={{ width: "100%", borderRadius: 10, display: "block", boxShadow: "0 8px 20px rgba(23,22,26,0.25)" }}
                        onError={(e) => { e.target.style.opacity = 0.25; }} />
                      <p className="q-whimsy text-[11.5px] mt-1.5 text-center" style={{ color: MUTED }}>{ELEMENTS[el].hero.name.split(" the ")[0]} · {ARCANA[el].title}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[12px] mt-2.5" style={{ color: MUTED }}>Downloads two separate full-resolution JPGs, your card and your sidekick's, collectibles for your camera roll.</p>
              </div>
            ) : (
              <div>
                <Eyebrow>Preview · copy for Google Docs</Eyebrow>
                <p className="q-display text-lg mt-1">Your plan, formatted to paste</p>
                <div className="mt-3" style={{ border: "1px solid " + HAIR, borderRadius: 12, padding: 16, background: "#fff" }}>
                  <p className="q-display" style={{ fontSize: 16 }}>Which New York Are You?: The {P.name}/{S.name} Line</p>
                  <p className="q-whimsy text-[12px] mt-1" style={{ color: "#3d3b36" }}>Divined by {P.hero.name} & {S.hero.name} · {taglineFor(primary, secondary)}</p>
                  <p className="q-display text-[14px] mt-3">Day 1: {HOODS[days[0].hood].name}, {HOODS[days[0].hood].borough}</p>
                  <p className="q-whimsy text-[12px]" style={{ color: MUTED }}>{HOODS[days[0].hood].vibe}</p>
                  {HOODS[days[0].hood].slots.slice(0, 2).map(([slot, place, note], j) => (
                    <p key={j} className="text-[12px] mt-1.5" style={{ color: "#4a473f" }}>• <b>{slot}: {place}</b>, {note}</p>
                  ))}
                  <p className="q-whimsy text-[12px] mt-2" style={{ color: MUTED }}>… all five days with headings, walking-route links, bonus stops, and wildcards</p>
                </div>
                <p className="text-[12px] mt-2.5" style={{ color: MUTED }}>Copies rich text to your clipboard, so headings and links paste into Google Docs intact.</p>
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <button onClick={() => setPreview(null)} className="q-btn q-focus q-display py-3 rounded-2xl text-[15px]"
                style={{ border: "1.5px solid " + INK, background: "transparent", color: INK, cursor: "pointer" }}>
                Cancel
              </button>
              <button autoFocus onClick={() => { const mode = preview; setPreview(null); if (mode === "csv") downloadCSV(days, result.spend); else if (mode === "pdf") printItinerary(); else if (mode === "cards") downloadCards(primary, secondary); else copyForDocs(); }}
                className="q-btn q-focus q-display py-3 rounded-2xl text-[15px] text-white" style={{ background: INK }}>
                {preview === "csv" ? "Download ⬇" : preview === "pdf" ? "Print / Save" : preview === "cards" ? "Download 2 ⬇" : (<span>Copy<CopyIcon/></span>)}
              </button>
            </div>
          </div>
        </div>
      )}

      {cardPreview && (
        <div className="no-print" role="dialog" aria-modal="true" aria-label={cardPreview.label + " share card preview"}
          onClick={() => setCardPreview(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(23,22,26,0.72)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div className="q-card anim-pop" onClick={e => e.stopPropagation()}
            style={{ maxWidth: 440, width: "100%", maxHeight: "88vh", overflowY: "auto", padding: 16 }}>
            <Eyebrow>Share card · {cardPreview.label}</Eyebrow>
            <img src={cardPreview.url} alt={"Share card featuring " + P.hero.name + " and " + S.hero.name}
              style={{ width: "100%", height: "auto", maxHeight: "58vh", objectFit: "contain", borderRadius: 12, border: "1px solid " + HAIR, marginTop: 10, background: CARD_BG }} />
            <p className="text-[12px] mt-2" style={{ color: MUTED }}>On a phone: press and hold the image to save it to your photos.</p>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <button autoFocus onClick={() => setCardPreview(null)} className="q-btn q-focus q-display py-3 rounded-2xl text-[15px]"
                style={{ border: "1.5px solid " + INK, background: "transparent", color: INK, cursor: "pointer" }}>
                Close
              </button>
              <a href={cardPreview.url} download={"which-new-york-" + cardPreview.format + ".png"}
                className="q-btn q-focus q-display py-3 rounded-2xl text-[15px] text-white text-center"
                style={{ background: INK, textDecoration: "none", display: "block" }}>
                Download ⬇
              </a>
            </div>
          </div>
        </div>
      )}

      <p className="q-whimsy text-center text-xs mt-5 pb-6" style={{ color: MUTED }}>
        Hours change and reservations help, check before you go. {P.hero.name.split(" the ")[0]} believes in you.
      </p>
    </Shell>
  );
}
