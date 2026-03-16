import { useState } from "react";

const TODAY = new Date().toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" });

const buildPrompt = (zipCode, cityState, count, extra, category, commitment) => {
  let msg = `Today is ${TODAY}. Find ${count} UPCOMING volunteer opportunities for high school students near ${cityState} (zip ${zipCode}).`;
  if (category && category !== "All") msg += ` Category: ${category}.`;
  if (commitment && commitment !== "Any") msg += ` Commitment: ${commitment}.`;
  if (extra) msg += ` Preference: "${extra}".`;
  msg += `

Use web search to find real, current opportunities from sites like volunteermatch.org, justserve.org, idealist.org, or the organization's own website. Only include events or programs that are currently active or upcoming as of ${TODAY}.

Return ONLY a JSON array — no explanation, no markdown fences. Each item:
{
  "org": "Organization name",
  "title": "Role or event title",
  "description": "1-2 sentences about what the volunteer does.",
  "category": "Environment|Community|Animals|Education|Healthcare|Food|Arts|Sports",
  "location": "City, State",
  "ageMin": 14,
  "eventDate": "Upcoming date or 'Ongoing'",
  "eventTime": "Time or 'Flexible'",
  "commitment": "e.g. 3 hrs one-time or Weekly",
  "hours": "e.g. 3 hours",
  "skills": ["skill1"],
  "whatToBring": "e.g. Closed-toe shoes",
  "orgUrl": "https://org-site.org",
  "eventUrl": "https://direct-signup-page.org",
  "source": "e.g. VolunteerMatch"
}`;
  return msg;
};

const CAT_COLOR = {
  Environment:"#2d6a4f", Community:"#1d3557", Animals:"#6d4c41",
  Education:"#4a148c", Healthcare:"#b71c1c", Food:"#e65100",
  Arts:"#880e4f", Sports:"#1a237e",
};
const CAT_EMOJI = {
  Environment:"🌿", Community:"🤝", Animals:"🐾", Education:"📚",
  Healthcare:"❤️", Food:"🥫", Arts:"🎨", Sports:"⚽",
};
const CATEGORIES = ["All","Environment","Community","Animals","Education","Healthcare","Food","Arts","Sports"];
const COMMITMENTS = ["Any","One-time","Weekly","Monthly"];
const STATE_ABBR = {"Alabama":"AL","Alaska":"AK","Arizona":"AZ","Arkansas":"AR","California":"CA","Colorado":"CO","Connecticut":"CT","Delaware":"DE","Florida":"FL","Georgia":"GA","Hawaii":"HI","Idaho":"ID","Illinois":"IL","Indiana":"IN","Iowa":"IA","Kansas":"KS","Kentucky":"KY","Louisiana":"LA","Maine":"ME","Maryland":"MD","Massachusetts":"MA","Michigan":"MI","Minnesota":"MN","Mississippi":"MS","Missouri":"MO","Montana":"MT","Nebraska":"NE","Nevada":"NV","New Hampshire":"NH","New Jersey":"NJ","New Mexico":"NM","New York":"NY","North Carolina":"NC","North Dakota":"ND","Ohio":"OH","Oklahoma":"OK","Oregon":"OR","Pennsylvania":"PA","Rhode Island":"RI","South Carolina":"SC","South Dakota":"SD","Tennessee":"TN","Texas":"TX","Utah":"UT","Vermont":"VT","Virginia":"VA","Washington":"WA","West Virginia":"WV","Wisconsin":"WI","Wyoming":"WY","District of Columbia":"DC"};

// ── Robust JSON extractor ──────────────────────────────────────────────────────
const extractJSON = (raw) => {
  if (!raw) return null;
  // Strip markdown fences
  let text = raw.replace(/```json[\s\S]*?```/g, m => m.replace(/```json|```/g,""))
                .replace(/```[\s\S]*?```/g, m => m.replace(/```/g,""))
                .trim();
  // Find outermost [ ... ]
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) return null;
  const candidate = text.slice(start, end + 1);
  try {
    const parsed = JSON.parse(candidate);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    // Try to fix truncated JSON by closing open objects
    try {
      const fixed = candidate.replace(/,\s*$/, "") + "]}".slice(candidate.match(/\{/g)?.length > (candidate.match(/\}/g)?.length || 0) ? 0 : 2);
      return JSON.parse(fixed);
    } catch { return null; }
  }
};

// ── API call (single-shot with web search) ────────────────────────────────────
const callClaude = async (userMessage) => {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      tool_choice: { type: "auto" },
      system: `You are a volunteer opportunity finder for high school students. Use web search to find real, current opportunities. Always respond with ONLY a valid JSON array starting with [ and ending with ]. No markdown, no explanation.`,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`API error ${res.status}: ${t.slice(0, 200)}`);
  }

  const data = await res.json();
  if (data.type === "error") throw new Error(data.error?.message || "API error");

  // Collect all text blocks from the response
  const textBlocks = (data.content || []).filter(b => b.type === "text").map(b => b.text);
  return textBlocks.join("\n");
};

// ── Modal ─────────────────────────────────────────────────────────────────────
function EventModal({ opp, onClose }) {
  const color = CAT_COLOR[opp.category] || "#7ec8a0";
  const emoji = CAT_EMOJI[opp.category] || "🙌";
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"linear-gradient(160deg,#152a1e,#0f1f17)",border:`1px solid ${color}55`,borderTop:`4px solid ${color}`,borderRadius:18,padding:"32px 36px",maxWidth:620,width:"100%",maxHeight:"90vh",overflowY:"auto",position:"relative",boxShadow:`0 0 60px ${color}22,0 20px 60px rgba(0,0,0,0.6)`}}>
        <button onClick={onClose} style={{position:"absolute",top:16,right:18,background:"rgba(255,255,255,0.08)",border:"none",borderRadius:"50%",width:36,height:36,color:"#a8c5b5",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>

        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}>
          <span style={{background:`${color}30`,color:"#c8e6c9",fontSize:13,padding:"4px 12px",borderRadius:20}}>{emoji} {opp.category}</span>
          {opp.source && <span style={{background:"rgba(100,180,255,0.1)",color:"#90c8ff",fontSize:12,padding:"4px 10px",borderRadius:20}}>🔍 {opp.source}</span>}
        </div>

        <div style={{fontSize:11,color:"#7ec8a0",letterSpacing:3,textTransform:"uppercase",marginBottom:6}}>{opp.org}</div>
        <h2 style={{margin:"0 0 20px",fontSize:24,color:"#f0ede6",lineHeight:1.3}}>{opp.title}</h2>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
          {[{label:"📅 Date",value:opp.eventDate},{label:"⏰ Time",value:opp.eventTime},{label:"📍 Location",value:opp.location},{label:"⏱ Duration",value:opp.hours},{label:"🎓 Min Age",value:opp.ageMin?`${opp.ageMin}+`:null},{label:"📋 Commitment",value:opp.commitment}].filter(d=>d.value).map((d,i)=>(
            <div key={i} style={{background:"rgba(255,255,255,0.05)",borderRadius:10,padding:"10px 14px"}}>
              <div style={{fontSize:11,color:"#7ec8a0",marginBottom:3}}>{d.label}</div>
              <div style={{fontSize:14,color:"#e0ede6",lineHeight:1.4}}>{d.value}</div>
            </div>
          ))}
        </div>

        <p style={{color:"#b8d0c4",fontSize:15,lineHeight:1.7,margin:"0 0 16px"}}>{opp.description}</p>

        {opp.skills?.length > 0 && (
          <div style={{marginBottom:16}}>
            <div style={{fontSize:12,color:"#7ec8a0",letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Skills Gained</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{opp.skills.map((s,i)=><span key={i} style={{background:"rgba(126,200,160,0.12)",color:"#a8d5b8",fontSize:13,padding:"4px 12px",borderRadius:14}}>{s}</span>)}</div>
          </div>
        )}

        {opp.whatToBring && (
          <div style={{background:"rgba(255,213,80,0.08)",border:"1px solid rgba(255,213,80,0.2)",borderRadius:10,padding:"12px 16px",marginBottom:22}}>
            <div style={{fontSize:12,color:"#ffd580",marginBottom:4}}>🎒 What to Bring</div>
            <div style={{color:"#e0d8b0",fontSize:14}}>{opp.whatToBring}</div>
          </div>
        )}

        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          {opp.eventUrl && (
            <a href={opp.eventUrl} target="_blank" rel="noopener noreferrer" style={{flex:1,minWidth:200,background:`linear-gradient(135deg,${color},${color}bb)`,color:"#fff",borderRadius:10,padding:"15px 20px",textDecoration:"none",fontWeight:700,fontSize:15,textAlign:"center",fontFamily:"Georgia,serif",display:"block"}}>
              📋 Go to Event Page →
            </a>
          )}
          {opp.orgUrl && (
            <a href={opp.orgUrl} target="_blank" rel="noopener noreferrer" style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",color:"#c8e6c9",borderRadius:10,padding:"15px 20px",textDecoration:"none",fontSize:14,textAlign:"center",fontFamily:"Georgia,serif",display:"block"}}>
              🌐 Org Site
            </a>
          )}
        </div>
        <div style={{marginTop:14,fontSize:12,color:"#4a6a5a",textAlign:"center"}}>Verify dates & availability directly with the organization.</div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function VolunteerAgent() {
  const [opps, setOpps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [debugRaw, setDebugRaw] = useState("");
  const [selected, setSelected] = useState(null);

  const [zipInput, setZipInput] = useState("98029");
  const [zipCode, setZipCode] = useState("");
  const [cityState, setCityState] = useState("");
  const [zipLoading, setZipLoading] = useState(false);
  const [zipError, setZipError] = useState("");
  const [zipConfirmed, setZipConfirmed] = useState(false);

  const [category, setCategory] = useState("All");
  const [commitment, setCommitment] = useState("Any");
  const [searchText, setSearchText] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // ── Zip lookup ──────────────────────────────────────────────────────────
  const lookupZip = async (zip) => {
    const z = zip.trim();
    if (!/^\d{5}$/.test(z)) { setZipError("Enter a valid 5-digit zip code."); return; }
    setZipLoading(true); setZipError(""); setZipConfirmed(false);
    let found = false;
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${z}&country=US&format=json&limit=1&addressdetails=1`, {headers:{"User-Agent":"VolunteerFinder/1.0","Accept-Language":"en"}});
      const d = await r.json();
      if (d?.length > 0) {
        const a = d[0].address;
        const city = a.city||a.town||a.village||a.suburb||a.county||"";
        const st = STATE_ABBR[a.state]||a.state||"";
        setCityState(city?`${city}, ${st}`:st); setZipCode(z); setZipConfirmed(true);
        setOpps([]); setHasSearched(false); setError("");
        found = true;
      }
    } catch {}
    if (!found) {
      // Claude fallback
      try {
        const txt = await callClaude(`What city and state is zip code ${z} in the US? Reply with ONLY "City, ST" — nothing else.`);
        const cs = txt.trim().replace(/['".\n]/g,"").split("\n")[0];
        if (cs?.includes(",")) { setCityState(cs); setZipCode(z); setZipConfirmed(true); setOpps([]); setHasSearched(false); found = true; }
      } catch {}
    }
    if (!found) setZipError("Couldn't find that zip code. Please check and try again.");
    setZipLoading(false);
  };

  // ── Search (initial 3) ──────────────────────────────────────────────────
  const doSearch = async () => {
    if (!zipConfirmed) { setZipError("Set your location first."); return; }
    setLoading(true); setHasSearched(true); setOpps([]); setError(""); setDebugRaw("");
    try {
      const msg = buildPrompt(zipCode, cityState, 3, searchText, category, commitment);
      const raw = await callClaude(msg);
      setDebugRaw(raw.slice(0, 600));
      const parsed = extractJSON(raw);
      if (parsed?.length > 0) setOpps(parsed);
      else setError("Couldn't parse results from the search response.");
    } catch(e) { setError(e.message); }
    setLoading(false);
  };

  // ── Load more (3 more) ──────────────────────────────────────────────────
  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const existing = opps.map(o => o.title).join(", ");
      const msg = buildPrompt(zipCode, cityState, 3, searchText, category, commitment)
        + ` Exclude these already shown: ${existing}.`;
      const raw = await callClaude(msg);
      const parsed = extractJSON(raw);
      if (parsed?.length > 0) setOpps(prev => [...prev, ...parsed]);
    } catch(e) { console.error(e); }
    setLoadingMore(false);
  };

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f2027 0%,#1a3a2a 50%,#0f2027 100%)",fontFamily:"Georgia,serif",color:"#f0ede6"}}>
      {selected && <EventModal opp={selected} onClose={() => setSelected(null)} />}

      <div style={{position:"fixed",inset:0,opacity:0.04,pointerEvents:"none",backgroundImage:"repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)",backgroundSize:"20px 20px"}}/>

      {/* Header */}
      <div style={{padding:"40px 32px 22px",textAlign:"center",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
        <div style={{fontSize:11,letterSpacing:6,color:"#7ec8a0",textTransform:"uppercase",marginBottom:10}}>Live Search · Any US Zip Code</div>
        <h1 style={{fontSize:"clamp(26px,5vw,50px)",fontWeight:700,margin:0,background:"linear-gradient(135deg,#7ec8a0,#c8e6c9,#7ec8a0)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:-1}}>
          Volunteer Finder
        </h1>
        <p style={{color:"#a8c5b5",fontSize:15,marginTop:8,fontStyle:"italic"}}>Current volunteer events for high school students</p>
      </div>

      <div style={{maxWidth:940,margin:"0 auto",padding:"24px 20px"}}>

        {/* Zip */}
        <div style={{background:"rgba(126,200,160,0.07)",border:"1px solid rgba(126,200,160,0.25)",borderRadius:14,padding:"18px 24px",marginBottom:18}}>
          <div style={{fontSize:11,letterSpacing:3,color:"#7ec8a0",textTransform:"uppercase",marginBottom:10}}>📍 Your Location</div>
          <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
            <input value={zipInput} onChange={e=>{setZipInput(e.target.value.replace(/\D/g,"").slice(0,5));setZipConfirmed(false);setZipError("");}}
              onKeyDown={e=>e.key==="Enter"&&lookupZip(zipInput)} maxLength={5} placeholder="Zip"
              style={{width:110,background:"rgba(255,255,255,0.09)",border:"1px solid rgba(126,200,160,0.4)",borderRadius:8,padding:"10px 14px",color:"#f0ede6",fontSize:20,fontFamily:"Georgia,serif",outline:"none",letterSpacing:3,textAlign:"center"}}/>
            <button onClick={()=>lookupZip(zipInput)} disabled={zipLoading} style={{background:"linear-gradient(135deg,#7ec8a0,#4caf50)",color:"#0f2027",border:"none",borderRadius:8,padding:"10px 20px",cursor:zipLoading?"not-allowed":"pointer",fontWeight:700,fontFamily:"Georgia,serif",fontSize:14,opacity:zipLoading?0.6:1}}>
              {zipLoading?"Looking up…":"Set Location"}
            </button>
            {zipConfirmed && <span style={{color:"#7ec8a0",fontSize:16}}>✓ <span style={{color:"#c8e6c9",fontStyle:"italic"}}>{cityState}</span></span>}
          </div>
          {zipError && <div style={{color:"#ff7675",fontSize:13,marginTop:8}}>{zipError}</div>}
        </div>

        {/* Filters + Search */}
        <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(126,200,160,0.2)",borderRadius:16,padding:"20px 24px",backdropFilter:"blur(10px)",marginBottom:24}}>
          <input value={searchText} onChange={e=>setSearchText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doSearch()}
            placeholder='Optional: "tutoring" · "food bank" · "animal shelter"'
            style={{width:"100%",boxSizing:"border-box",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(126,200,160,0.3)",borderRadius:10,padding:"12px 16px",color:"#f0ede6",fontSize:15,outline:"none",fontFamily:"Georgia,serif",marginBottom:16}}/>

          <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:16}}>
            <div>
              <div style={{fontSize:11,letterSpacing:2,color:"#7ec8a0",marginBottom:6,textTransform:"uppercase"}}>Category</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {CATEGORIES.map(c=><button key={c} onClick={()=>setCategory(c)} style={{padding:"4px 11px",borderRadius:20,fontSize:13,cursor:"pointer",border:"1px solid rgba(126,200,160,0.3)",background:category===c?"#7ec8a0":"rgba(255,255,255,0.05)",color:category===c?"#0f2027":"#c8e6c9",fontFamily:"Georgia,serif",transition:"all 0.2s"}}>{c}</button>)}
              </div>
            </div>
            <div>
              <div style={{fontSize:11,letterSpacing:2,color:"#7ec8a0",marginBottom:6,textTransform:"uppercase"}}>Commitment</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {COMMITMENTS.map(c=><button key={c} onClick={()=>setCommitment(c)} style={{padding:"4px 11px",borderRadius:20,fontSize:13,cursor:"pointer",border:"1px solid rgba(126,200,160,0.3)",background:commitment===c?"#7ec8a0":"rgba(255,255,255,0.05)",color:commitment===c?"#0f2027":"#c8e6c9",fontFamily:"Georgia,serif",transition:"all 0.2s"}}>{c}</button>)}
              </div>
            </div>
          </div>

          <button onClick={doSearch} disabled={loading||!zipConfirmed} style={{background:(loading||!zipConfirmed)?"rgba(126,200,160,0.2)":"linear-gradient(135deg,#7ec8a0,#4caf50)",color:(loading||!zipConfirmed)?"#7ec8a0":"#0f2027",border:"none",borderRadius:10,padding:"13px 28px",fontSize:15,fontWeight:700,cursor:(loading||!zipConfirmed)?"not-allowed":"pointer",fontFamily:"Georgia,serif",transition:"all 0.3s"}}>
            {loading ? "Searching…" : zipConfirmed ? `🔍 Find Events near ${cityState}` : "🔍 Set zip code first"}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{textAlign:"center",padding:"48px 20px"}}>
            <div style={{fontSize:36,marginBottom:12,display:"inline-block"}}>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}} .spin{animation:spin 2s linear infinite;display:inline-block}`}</style>
              <span className="spin">🌐</span>
            </div>
            <div style={{color:"#7ec8a0",fontSize:16,fontStyle:"italic",marginBottom:6}}>Searching live volunteer sites…</div>
            <div style={{color:"#4a6a5a",fontSize:13}}>Checking VolunteerMatch, JustServe & local orgs</div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{background:"rgba(255,100,100,0.1)",border:"1px solid rgba(255,100,100,0.3)",borderRadius:12,padding:20,marginBottom:20}}>
            <div style={{color:"#ff9090",fontWeight:700,marginBottom:6}}>⚠️ Something went wrong</div>
            <div style={{color:"#ffb0b0",fontSize:14,marginBottom:10}}>{error}</div>
            {debugRaw && <details><summary style={{color:"#a8c5b5",cursor:"pointer",fontSize:13}}>Show raw response</summary><pre style={{color:"#7ec8a0",fontSize:11,marginTop:8,overflowX:"auto",whiteSpace:"pre-wrap",maxHeight:200}}>{debugRaw}</pre></details>}
          </div>
        )}

        {/* No results */}
        {hasSearched && !loading && !error && opps.length===0 && (
          <div style={{textAlign:"center",color:"#a8c5b5",padding:48}}>No events found. Try different filters or a nearby zip code.</div>
        )}

        {/* Results */}
        {opps.length > 0 && (
          <>
            <div style={{fontSize:13,color:"#7ec8a0",marginBottom:14,fontStyle:"italic"}}>
              {opps.length} opportunities found near {cityState} — click any card for details & signup
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:18}}>
              {opps.map((opp,i) => {
                const color = CAT_COLOR[opp.category]||"#7ec8a0";
                const emoji = CAT_EMOJI[opp.category]||"🙌";
                return (
                  <div key={i} onClick={()=>setSelected(opp)}
                    style={{background:"rgba(255,255,255,0.05)",border:`1px solid ${color}33`,borderTop:`3px solid ${color}`,borderRadius:14,padding:22,backdropFilter:"blur(8px)",transition:"all 0.2s",cursor:"pointer"}}
                    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 8px 30px ${color}22`;}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,flexWrap:"wrap",gap:6}}>
                      <span style={{background:`${color}30`,color:"#c8e6c9",fontSize:12,padding:"3px 10px",borderRadius:12}}>{emoji} {opp.category}</span>
                      {opp.eventDate && <span style={{background:"rgba(255,213,80,0.12)",color:"#ffd580",fontSize:12,padding:"3px 10px",borderRadius:12}}>📅 {opp.eventDate}</span>}
                    </div>
                    <div style={{fontSize:11,color:"#7ec8a0",letterSpacing:2,textTransform:"uppercase",marginBottom:3}}>{opp.org}</div>
                    <h3 style={{margin:"0 0 8px",fontSize:16,color:"#f0ede6",lineHeight:1.3}}>{opp.title}</h3>
                    <p style={{color:"#b0c4b8",fontSize:14,lineHeight:1.55,margin:"0 0 12px",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{opp.description}</p>
                    <div style={{display:"flex",gap:10,fontSize:12,color:"#a8c5b5",marginBottom:12,flexWrap:"wrap"}}>
                      {opp.eventTime && <span>⏰ {opp.eventTime}</span>}
                      {opp.hours && <span>⏱ {opp.hours}</span>}
                      {opp.ageMin && <span>🎓 {opp.ageMin}+</span>}
                    </div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",borderTop:"1px solid rgba(255,255,255,0.07)",paddingTop:10}}>
                      <span style={{fontSize:12,color:"#6a9a80",fontStyle:"italic"}}>{opp.source?"🔍 "+opp.source:"📍 "+opp.location}</span>
                      <span style={{fontSize:13,color,fontWeight:700}}>Details →</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More */}
            <div style={{textAlign:"center",marginTop:28}}>
              <button onClick={loadMore} disabled={loadingMore} style={{background:loadingMore?"rgba(126,200,160,0.15)":"rgba(126,200,160,0.1)",border:"1px solid rgba(126,200,160,0.35)",color:"#7ec8a0",borderRadius:12,padding:"13px 32px",cursor:loadingMore?"not-allowed":"pointer",fontSize:15,fontFamily:"Georgia,serif",transition:"all 0.2s"}}>
                {loadingMore ? "Loading more…" : "⬇ Load 3 More Opportunities"}
              </button>
            </div>
          </>
        )}
      </div>

      <div style={{textAlign:"center",padding:20,color:"#4a6a5a",fontSize:12}}>
        Powered by Claude with live web search · Results as of {TODAY}
      </div>
    </div>
  );
}
