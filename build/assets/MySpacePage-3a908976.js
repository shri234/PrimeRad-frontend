import{r as d,I as Q,a3 as R,j as e,p as ne,T as re,a as ae,a4 as de,a5 as le,a6 as ce,a7 as pe,W as ge}from"./index-f415b1f3.js";import{N as xe,M as K}from"./react-tooltip.min-e5c3736b.js";/* empty css                      */function A(){return A=Object.assign||function(o){for(var n=1;n<arguments.length;n++){var h=arguments[n];for(var g in h)Object.prototype.hasOwnProperty.call(h,g)&&(o[g]=h[g])}return o},A.apply(this,arguments)}function he(o,n){if(o==null)return{};var h=ue(o,n),g,f;if(Object.getOwnPropertySymbols){var b=Object.getOwnPropertySymbols(o);for(f=0;f<b.length;f++)g=b[f],!(n.indexOf(g)>=0)&&Object.prototype.propertyIsEnumerable.call(o,g)&&(h[g]=o[g])}return h}function ue(o,n){if(o==null)return{};var h={},g=Object.keys(o),f,b;for(b=0;b<g.length;b++)f=g[b],!(n.indexOf(f)>=0)&&(h[f]=o[f]);return h}var F=d.forwardRef(function(o,n){var h=o.color,g=h===void 0?"currentColor":h,f=o.size,b=f===void 0?24:f,w=he(o,["color","size"]);return Q.createElement("svg",A({ref:n,xmlns:"http://www.w3.org/2000/svg",width:b,height:b,viewBox:"0 0 24 24",fill:"none",stroke:g,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},w),Q.createElement("polyline",{points:"6 9 12 15 18 9"}))});F.propTypes={color:R.string,size:R.oneOfType([R.string,R.number])};F.displayName="ChevronDown";const ee=F,fe=`
.sidebar-container {
  position: relative;
  display: flex;
}

.arrow-toggle {
  position: fixed;
  top: 80px;
  left: 10px;
  z-index: 1000;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.arrow-toggle:hover {
  background: #f5f5f5;
  transform: scale(1.05);
}

.arrow-toggle.open {
  left: 260px; /* Adjust based on sidebar width + margin */
}

.sidebar {
  transition: transform 0.3s ease;
}

.sidebar.hidden {
  transform: translateX(-100%);
}

/* Media queries for responsive behavior */
@media (min-width: 350px) and (max-width: 890px) {
  .arrow-toggle {
    display: flex;
  }
}

@media (max-width: 349px) {
  .arrow-toggle {
    display: none;
  }
}

@media (min-width: 890px) {
  .arrow-toggle {
    display: none;
  }
  
  .sidebar {
    transform: translateX(0) !important;
  }
}
  .video-card {
    position: relative;
    background: none !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0;
    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
    max-width: 320px;
    min-width: 260px;
    border-radius: 20px;
  }
  .video-card:hover {
    background: #f5f5f5 !important;
    box-shadow: 0 4px 16px rgba(0,0,0,0.10);
  }
  .video-container {
    position: relative;
    width: 100%;
    padding-top: 56.25%; /* 16:9 aspect ratio */
    border-radius: 18px;
    overflow: hidden;
    background: #000;
    margin-bottom: 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  .video-container img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 18px;
    display: block;
    background: #000;
  }
  .duration-badge {
    position: absolute;
    bottom: 10px;
    right: 14px;
    background: ivory;
    color: gray;
    border-radius: 8px;
    padding: 2px 10px;
    font-size: 15px;
    font-weight: 600;
    z-index: 2;
    letter-spacing: 0.5px;
  }
  .category-badge {
    position: absolute;
    top: 12px;
    right: 16px;
    background: #1976d2;
    color: #fff;
    border-radius: 8px;
    padding: 4px 14px;
    font-size: 13px;
    font-weight: 600;
    z-index: 2;
    box-shadow: 0 2px 8px rgba(25,118,210,0.10);
    letter-spacing: 0.5px;
    text-transform: capitalize;
  }
  .badges-row {
    display: flex;
    gap: 8px;
    margin-top: 12px;
    margin-bottom: 6px;
    flex-wrap: wrap;
    align-items: center;
  }
  .label-badge {
    border-radius: 6px;
    padding: 2px 8px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: #e3f2fd;
    color: #1976d2;
    display: inline-block;
  }
  .label-badge.status-free {
    background: #e0f7fa;
    color: #00bfae;
  }
  .label-badge.status-locked {
    background: #ffe0b2;
    color: #ffb300;
  }
  .days-ago {
    color: #666;
    font-size: 15px;
    margin-top: 2px;
    margin-bottom: 0;
    font-weight: 500;
    letter-spacing: 0.2px;
  }
  .video-title {
    font-weight: 700;
    font-size: 20px;
    color: #222;
    margin-top: 14px;
    margin-bottom: 0;
    line-height: 1.2;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .video-cards-outer-card {
    background: ;
    border-radius: 28px;
    box-shadow: 0 4px 32px rgba(0,0,0,0.07);
    padding: 18px 18px 18px 18px;
    max-width: 1400px;
    margin: 28px auto 0 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .video-cards-outer-card .video-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 32px 24px;
    width: 100%;
  }
  
  /* Mobile responsive grid */
  @media (max-width: 580px) {
    .video-cards-outer-card .video-cards-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    
    .video-cards-outer-card {
      padding: 12px;
      margin: 16px auto 0 auto;
      border-radius: 20px;
    }
    
    .video-card {
      max-width: 100%;
      min-width: 0;
    }
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    font-size: 18px;
    color: #666;
  }

  .error-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    color: #f44336;
    text-align: center;
  }

  .no-data-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    color: #666;
    text-align: center;
    font-size: 18px;
  }

  /* New List View Styles */
  .list-view-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .module-card {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .module-card:hover {
    box-shadow: 0 4px 20px rgba(0,0,0,0.10);
  }

  .module-header {
    padding: 28px 24px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-bottom: 2px solid #dee2e6;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s ease;
  }

  .module-header:hover {
    background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
  }

  .module-title {
    font-size: 18px;
    font-weight: 700;
    color: #1976d2;
    margin: 0;
  }

  .module-stats {
    display: flex;
    gap: 20px;
    align-items: center;
    font-size: 14px;
    color: #666;
  }

  .pathology-section {
    padding: 10px 24px;
    background: #fafbfc;
  }

  .pathology-card {
    border-bottom: 1px solid #e9ecef;
    transition: all 0.3s ease;
  }

  .pathology-card:last-child {
    border-bottom: none;
  }

  .pathology-header {
    padding: 16px 10px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s ease;
  }

  .pathology-header:hover {
    background: rgba(25, 118, 210, 0.05);
    margin: 0 -24px;
    padding-left: 24px;
    padding-right: 24px;
  }

  .pathology-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0;
  }

  .pathology-stats {
    display: flex;
    gap: 16px;
    align-items: center;
    font-size: 13px;
    color: #666;
  }

  .session-list {
    padding: 16px 0 16px 24px;
    background: #f8f9fa;
    border-top: 1px solid #e9ecef;
  }

  .session-item {
    display: flex;
    align-items: center;
    padding: 16px 16px;
    margin-bottom: 8px;
    background: #fff;
    border-radius: 12px;
    border: 1px solid #e9ecef;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .session-item:hover {
    border-color: #1976d2;
    box-shadow: 0 2px 8px rgba(25, 118, 210, 0.15);
    transform: translateY(-1px);
  }

  .session-thumbnail {
    width: 60px;
    height: 36px;
    border-radius: 8px;
    object-fit: cover;
    margin-right: 16px;
    background: #000;
  }

  .session-info {
    flex: 1;
  }

  .session-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin: 0 0 4px 0;
    line-height: 1.3;
  }

  .session-meta {
    display: flex;
    gap: 12px;
    align-items: center;
    font-size: 12px;
    color: #666;
  }

  .progress-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 120px;
    justify-content: flex-end;
  }

  .progress-bar-small {
    width: 60px;
    height: 4px;
    background: #e0e0e0;
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-fill-small {
    height: 100%;
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  .chevron-icon {
    transition: transform 0.3s ease;
  }

  .chevron-icon.expanded {
    transform: rotate(180deg);
  }

  @media (max-width: 768px) {
    .module-header {
      padding: 16px 16px;
    }
    
    .module-stats {
      flex-direction: column;
      gap: 8px;
      align-items: flex-end;
    }
    
    .pathology-section {
      padding: 0 16px;
    }
    
    .pathology-stats {
      flex-direction: column;
      gap: 4px;
      align-items: flex-end;
    }
    
    .session-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
    
    .progress-indicator {
      width: 100%;
      justify-content: space-between;
    }
  }
`,me={primary:"#1976d2",secondary:"#00bfae",background:"#f4f8fb",card:"#fff",accent:"#ffb300",text:"#263238",border:"#e0e0e0"},be=d.memo(({module:o})=>{console.log(o);const n=o.progressPercentage===100,h={padding:"16px",background:"#e8f5e9",borderRadius:"16px",boxShadow:"0 2px 10px rgba(0,0,0,0.05)",border:`1px solid ${n?"#4caf50":"#e0e0e0"}`},g={width:"100%",height:"8px",background:"#e0e0e0",borderRadius:"4px",overflow:"hidden",marginTop:"8px"},f={width:`${Math.round(o.progressPercentage)||50}%`,height:"100%",background:n?"#4caf50":"#1976d2",transition:"width 0.3s ease-in-out"};return(o==null?void 0:o.totalSessionsCount)>0?e.jsxs("div",{style:h,children:[e.jsx("div",{style:{fontWeight:600,fontSize:"14px"},children:o.moduleName}),e.jsxs("div",{style:{fontSize:"14px",fontWeight:"500",color:"darkslategrey"},children:["1 / ",o.totalSessionsCount," Sessions"]}),e.jsx("div",{style:g,children:e.jsx("div",{style:f})}),e.jsxs("div",{style:{fontSize:"12px",color:"#666",marginTop:"4px"},children:[Math.round(o.progressPercentage)||50,"% Complete"]})]}):null}),ye=d.memo(({filteredCards:o,handleCardClick:n,formatTimeAgo:h,isMobile:g})=>{const[f,b]=d.useState(new Set),[w,r]=d.useState(new Set),T=o.reduce((i,a)=>{const x=a.category||"Uncategorized",j=a.type||"General";return i[x]||(i[x]={}),i[x][j]||(i[x][j]=[]),i[x][j].push(a),i},{}),c=i=>{const a=new Set(f);a.has(i)?a.delete(i):a.add(i),b(a)},L=i=>{const a=new Set(w);a.has(i)?a.delete(i):a.add(i),r(a)},$=i=>{const a=Object.values(i).flat(),x=a.length,j=a.filter(y=>y.progress>=1).length,W=a.reduce((y,m)=>{var u;const v=parseInt(((u=m.sessionDuration)==null?void 0:u.split(" ")[0])||"0");return y+v},0),S=a.reduce((y,m)=>{var u;const v=parseInt(((u=m.sessionDuration)==null?void 0:u.split(" ")[0])||"0");return y+v*m.progress},0);return{totalSessions:x,completedSessions:j,totalMinutes:W,completedMinutes:Math.round(S),progressPercentage:x>0?j/x*100:0}},D=i=>{const a=i.length,x=i.filter(S=>S.progress>=1).length,j=i.reduce((S,y)=>{var v;const m=parseInt(((v=y.sessionDuration)==null?void 0:v.split(" ")[0])||"0");return S+m},0),W=i.reduce((S,y)=>{var v;const m=parseInt(((v=y.sessionDuration)==null?void 0:v.split(" ")[0])||"0");return S+m*y.progress},0);return{totalSessions:a,completedSessions:x,totalMinutes:j,completedMinutes:Math.round(W),progressPercentage:a>0?x/a*100:0}},k=i=>{if(i<60)return`${i}m`;const a=Math.floor(i/60),x=i%60;return x>0?`${a}h ${x}m`:`${a}h`};return Object.keys(T).length===0?e.jsxs("div",{className:"no-data-container",children:[e.jsx("div",{style:{fontSize:24,marginBottom:16},children:"📋"}),e.jsx("div",{style:{marginBottom:8},children:"No sessions found"}),e.jsx("div",{style:{fontSize:14,color:"#999"},children:"Try adjusting your filters or start watching some content"})]}):e.jsx("div",{className:"list-view-container",children:Object.entries(T).map(([i,a])=>{const x=$(a),j=f.has(i);return e.jsxs("div",{className:"module-card",children:[e.jsxs("div",{className:"module-header",onClick:()=>c(i),children:[e.jsx("div",{children:e.jsx("h3",{className:"module-title",children:i})}),e.jsxs("div",{className:"module-stats",children:[e.jsxs("span",{children:[x.completedSessions,"/",x.totalSessions," ","sessions"]}),e.jsxs("span",{children:[k(x.completedMinutes),"/",k(x.totalMinutes)]}),e.jsxs("span",{children:[Math.round(x.progressPercentage),"% complete"]}),e.jsx(ee,{size:20,className:`chevron-icon ${j?"expanded":""}`})]})]}),j&&e.jsx("div",{className:"pathology-section",children:Object.entries(a).map(([W,S])=>{const y=`${i}-${W}`,m=D(S),v=w.has(y);return e.jsxs("div",{className:"pathology-card",children:[e.jsxs("div",{className:"pathology-header",onClick:()=>L(y),children:[e.jsx("div",{children:e.jsx("h4",{className:"pathology-title",children:W})}),e.jsxs("div",{className:"pathology-stats",children:[e.jsxs("span",{children:[m.completedSessions,"/",m.totalSessions," sessions"]}),e.jsxs("span",{children:[k(m.completedMinutes),"/",k(m.totalMinutes)]}),e.jsx(ee,{size:18,className:`chevron-icon ${v?"expanded":""}`})]})]}),v&&e.jsx("div",{className:"session-list",children:S.map(u=>e.jsxs("div",{className:"session-item",onClick:()=>n(u),children:[e.jsx("img",{src:u.thumbnail,alt:u.type,className:"session-thumbnail",onError:B=>{B.target.src="/assets/images/continue-watch/01.jpg"}}),e.jsxs("div",{className:"session-info",children:[e.jsx("h5",{className:"session-title",children:u.type}),e.jsxs("div",{className:"session-meta",children:[e.jsx("span",{className:`label-badge status-${u.status.toLowerCase()}`,children:u.status}),e.jsx("span",{children:u.level}),e.jsx("span",{children:u.sessionDuration}),u.lastWatchedAt&&e.jsx("span",{children:h(u.lastWatchedAt)})]})]}),e.jsxs("div",{className:"progress-indicator",children:[e.jsx("div",{className:"progress-bar-small",children:e.jsx("div",{className:"progress-fill-small",style:{width:`${Math.round(u.progress*100)}%`,background:u.progress>=1?"#4caf50":"#1976d2"}})}),e.jsxs("span",{style:{fontSize:"12px",color:"#666"},children:[Math.round(u.progress*100),"%"]})]})]},u.id))})]},y)})})]},i)})})}),we=d.memo(()=>{const o=ne(re),[n,h]=d.useState("watching"),[g,f]=d.useState("grid"),b=ae(),{activeFilters:w}=de();d.useRef(null);const[r,T]=d.useState(!1),[c,L]=d.useState(!1);d.useState(!1);const[$,D]=d.useState(0),[k,i]=d.useState(!1),a=200,[x,j]=d.useState([]),[W,S]=d.useState([]),[y,m]=d.useState(!0),[v,u]=d.useState([]),[B,te]=d.useState(0),[V,P]=d.useState(null),[se,oe]=d.useState([]),[M,ve]=d.useState({isSubscribed:!0,planName:"Free"}),I=localStorage.getItem("userId"),[E,ie]=d.useState(!1),H=t=>{const s={};return t.forEach(l=>{const p=l.moduleName||"Uncategorized";s[p]||(s[p]={totalSessions:0,watchedSessions:0}),s[p].totalSessions+=1,l.playbackProgress&&l.playbackProgress.progressPercentage>=1&&(s[p].watchedSessions+=1)}),Object.keys(s).map(l=>({moduleName:l,totalSessions:s[l].totalSessions,watchedSessions:s[l].watchedSessions,progressPercentage:s[l].watchedSessions/s[l].totalSessions*100}))};d.useEffect(()=>{const t=()=>{const s=window.innerWidth;T(s<550),L(s>=300&&s<=1290),ie(s>=350&&s<=890),(s>890||s<350)&&i(!1)};return t(),window.addEventListener("resize",t),()=>window.removeEventListener("resize",t)},[]),d.useEffect(()=>{if(!o)return;(async()=>{try{const l=await(await fetch(`https://primerad-backend.onrender.com/api/assessments/getUserPoints?userId=${localStorage.getItem("userId")}`)).json();(l==null?void 0:l.totalPoints)!==void 0&&D(l.totalPoints)}catch(s){console.error("Error fetching user points:",s)}})()},[o]),d.useEffect(()=>{const t=()=>{T(window.innerWidth<=590)};return t(),window.addEventListener("resize",t),()=>window.removeEventListener("resize",t)},[]),d.useEffect(()=>{r&&n==="grid"?h("list"):!r&&n==="list"&&h("grid")},[r,n]),d.useEffect(()=>{if(!o||!I)return;(async()=>{try{m(!0),P(null);const s=await fetch(`https://primerad-backend.onrender.com/api/sessions/getWatchedSessions?userId=${I}`);if(!s.ok)throw new Error(`HTTP error! status: ${s.status}`);const p=(await s.json()).data||[];j(p),S(H(p))}catch(s){console.error("Error fetching watched sessions:",s),P(s.message)}finally{m(!1)}})()},[o,I]),d.useEffect(()=>{if(!o||!I)return;(async()=>{try{m(!0),P(null);const s=await fetch(`https://primerad-backend.onrender.com/api/sessions/getCompletedSessions?userId=${I}`);if(!s.ok)throw new Error(`HTTP error! status: ${s.status}`);const l=await s.json(),p=l.data||[];console.log(l,l.count),te(parseInt(l.count))}catch(s){console.error("Error fetching watched sessions:",s),P(s.message)}finally{m(!1)}})()},[o,I]),d.useEffect(()=>{if(!o||!I)return;console.log(B,"completed"),(async()=>{try{m(!0),P(null);const s=await fetch("https://primerad-backend.onrender.com/api/modules/getModulesSessionCount");if(!s.ok)throw new Error(`HTTP error! status: ${s.status}`);const p=(await s.json()).data||[];console.log(p,typeof p),console.log(p),oe(p),S(H(p))}catch(s){console.error("Error fetching watched sessions:",s),P(s.message)}finally{m(!1)}})()},[o]);const U=t=>{var N,J;const s=t.playbackProgress,l=t.sessionDuration?parseInt(t.sessionDuration.split(" ")[0]):0,p=s!=null&&s.currentTime?Math.floor(s.currentTime/60):0,z=l>0?Math.min(p/l,1):0,C=Math.max(l-p,0);return{id:t._id,type:t.title,vimeoVideoId:t.vimeoVideoId,isFree:t.isFree,category:t.moduleName,level:((N=t.difficulty)==null?void 0:N.charAt(0).toUpperCase())+((J=t.difficulty)==null?void 0:J.slice(1))||"Beginner",status:t.isFree?"Free":"Locked",thumbnail:t.imageUrl_1920x1080?`https://primerad-backend.onrender.com${t.imageUrl_1920x1080}`:"/assets/images/continue-watch/01.jpg",minutesLeft:C,progress:z,timeLeft:C>0?`${C} mins left`:"Completed",sessionType:t.sessionType,lastWatchedAt:s==null?void 0:s.lastWatchedAt,currentTime:(s==null?void 0:s.currentTime)||0,sessionDuration:t.sessionDuration,isAssessment:t.isAssessment}},_=x.map(U),Y=_.filter(t=>t.progress<1),G=_.filter(t=>t.progress>=1),X=v.map(U),O=(n==="watching"?Y:n==="completed"?G:X).filter(t=>{const s=w.area.length===0||w.area.includes(t.category),l=w.level.length===0||w.level.includes(t.level),p=w.status.length===0||w.status.includes(t.status),z=w.type.length===0||w.type.some(N=>t.type.toLowerCase().includes(N.toLowerCase())),C=w.pathology.length===0||w.pathology.some(N=>t.type.toLowerCase().includes(N.toLowerCase()));return s&&l&&p&&z&&C}),Z=t=>{t.status==="Locked"?b("/lecture-detail",{state:{id:t.id,vimeoVideoId:t.vimeoVideoId,title:t.type,description:t.description,faculty:t.faculty,module:t.module,isFree:t.isFree,submodule:t.submodule,duration:t.sessionDuration,startDate:t.startDate,contentType:t.contentType}}):b("/lecture-detail",{state:{id:t.id,vimeoVideoId:t.vimeoVideoId,title:t.type,description:t.description,faculty:t.faculty,module:t.module,isFree:t.isFree,submodule:t.submodule,duration:t.sessionDuration,startDate:t.startDate,contentType:t.contentType}})},q=t=>{const s=new Date,l=new Date(t),p=Math.floor((s-l)/(1e3*60));if(p<1)return"Just now";if(p<60)return`${p} min${p>1?"s":""} ago`;const z=Math.floor(p/60);if(z<24)return`${z} hour${z>1?"s":""} ago`;const C=Math.floor(z/24);if(C<7)return`${C} day${C>1?"s":""} ago`;const N=Math.floor(C/7);return`${N} week${N>1?"s":""} ago`};return o?e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:{height:"100vh",width:"100vw",background:"#f4f8fb",overflowY:"auto",display:"flex"},children:[e.jsx("style",{children:fe}),e.jsx("style",{jsx:!0,children:`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}),E&&e.jsx("button",{className:`sidebar-toggle ${k?"open":""}`,onClick:()=>i(!k),style:{position:"fixed",top:"20px",left:"20px",marginTop:"35px",marginLeft:"-10px",zIndex:1001,width:"32px",height:"32px",background:"linear-gradient(135deg, #3b82f6, #1d4ed8)",border:"none",borderRadius:"12px",color:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(59,130,246,0.3)",transition:"all 0.2s ease"},children:k?e.jsx(le,{size:18}):e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"currentColor",children:e.jsx("path",{d:"M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z"})})}),(!r||E&&k)&&e.jsx("div",{className:"sidebar-wrapper",style:{width:"250px",flexShrink:0,position:E?"fixed":"sticky",marginTop:r?"80px":"50px",left:E&&!k?"-250px":"0",height:"100vh",overflowY:"hidden",zIndex:1e3,transition:"left 0.3s ease",boxShadow:E?"2px 0 10px rgba(0,0,0,0.1)":"none"},children:e.jsx(xe,{})}),E&&k&&e.jsx("div",{className:"sidebar-overlay",onClick:()=>i(!1),style:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(0,0,0,0.5)",zIndex:999}}),e.jsx("div",{style:{display:"flex",background:"transparent",flex:1,paddingTop:r?"100px":"70px",paddingRight:r?"12px":"10px",paddingLeft:r?"12px":"0px"},children:e.jsxs("div",{style:{flex:1,padding:r?"4px":"8px",backgroundColor:"transparent"},children:[e.jsxs("div",{style:{marginBottom:r?"16px":"20px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:r?"16px":"24px",flexWrap:"wrap"},children:[e.jsxs("div",{style:{background:"antiquewhite",borderRadius:c?12:16,boxShadow:"0 2px 8px rgba(0,0,0,0.04)",padding:c?"12px 16px":"18px 28px",display:"flex",alignItems:"center",gap:c?16:24,marginTop:r?"10px":"-20px",maxWidth:900,width:"100%",minWidth:c?280:320,flex:1,flexDirection:c?"column":"row"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:r?8:12,padding:r?"12px 16px":"16px 20px",background:M.isSubscribed?"linear-gradient(135deg, #e8f5e8 0%, #f0f9f0 100%)":"linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%)",borderRadius:r?12:16,border:`2px solid ${M.isSubscribed?"#4caf50":"#e0e0e0"}`,boxShadow:M.isSubscribed?"0 4px 20px rgba(76, 175, 80, 0.15)":"0 4px 16px rgba(0, 0, 0, 0.08)",minWidth:r?140:200,textAlign:"left",transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",cursor:"default",position:"relative",overflow:"hidden"},children:[e.jsx("div",{style:{width:r?24:28,height:r?24:28,borderRadius:"50%",background:M.isSubscribed?"linear-gradient(135deg, #4caf50, #66bb6a)":"linear-gradient(135deg, #9e9e9e, #bdbdbd)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(0, 0, 0, 0.15)",flexShrink:0},children:e.jsx("div",{style:{width:r?8:10,height:r?8:10,background:"white",borderRadius:"50%",opacity:M.isSubscribed?1:.7}})}),e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("div",{style:{fontSize:r?12:13,fontWeight:500,color:"#666",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:2,lineHeight:1},children:"Subscription"}),e.jsx("div",{style:{fontSize:r?16:18,fontWeight:700,color:M.isSubscribed?"#2e7d32":"#5f6368",lineHeight:1.2,textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"},children:M.planName})]}),M.isSubscribed&&e.jsx("div",{style:{position:"absolute",top:-1,right:-1,background:"linear-gradient(135deg, #ffd700, #ffb300)",color:"#333",fontSize:c?8:9,fontWeight:700,padding:"2px 6px",borderRadius:"0 14px 0 8px",textTransform:"uppercase",letterSpacing:"0.3px",boxShadow:"0 2px 4px rgba(0, 0, 0, 0.2)"},children:"Active"}),e.jsx("div",{style:{position:"absolute",top:0,left:0,right:0,bottom:0,background:M.isSubscribed?"linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)":"none",animation:M.isSubscribed?"shimmer 3s infinite":"none",pointerEvents:"none"}})]}),e.jsxs("div",{style:{fontSize:c?16:20,fontWeight:400,minWidth:c?120:180,textAlign:c?"center":"left"},children:["Current Belt:"," ",e.jsx("span",{style:{fontWeight:700,color:"#1976d2"},children:"Green"})]}),e.jsx("div",{style:{flex:1,minWidth:c?100:120,margin:c?"0 8px":"0 18px"},children:e.jsx("div",{style:{width:"100%",height:r?6:16,background:"ghostwhite",borderRadius:8,overflow:"hidden",position:"relative"},children:e.jsx("div",{style:{width:`${Math.min(Math.round($/a*100),100)}%`,height:"100%",background:"#1976d2",borderRadius:8,transition:"width 0.4s"}})})}),e.jsxs("div",{style:{fontSize:c?12:16,fontWeight:400,minWidth:c?80:100,textAlign:"center"},children:[$," / ",a," pts to"," ",e.jsx("span",{style:{fontWeight:700,color:"#222"},children:"Black"})]})]}),e.jsxs("div",{style:{display:"flex",gap:c?"6px":"8px"},children:[e.jsxs("button",{style:{padding:"8px 10px",backgroundColor:n==="watching"?"darkslategray":"lightgray",color:n==="watching"?"white":"black",border:"none",borderRadius:c?"8px":"10px",fontSize:c?"12px":"14px",fontWeight:"600"},onClick:()=>h("watching"),children:["Watching (",Y.length,")"]}),e.jsxs("button",{style:{padding:"8px 10px",backgroundColor:n==="completed"?"darkslategray":"lightgray",color:n==="completed"?"white":"black",border:"none",borderRadius:c?"8px":"10px",fontSize:c?"12px":"14px",fontWeight:"600"},onClick:()=>h("completed"),children:["Completed (",G.length,")"]}),e.jsxs("button",{style:{padding:c?"6px 8px":"8px 10px",backgroundColor:n==="saved"?"darkslategray":"lightgray",color:n==="saved"?"white":"black",border:"none",borderRadius:c?"8px":"10px",fontSize:c?"12px":"14px",fontWeight:"600"},onClick:()=>h("saved"),children:["Saved (",X.length,")"]})]})]}),e.jsxs("div",{style:{marginBottom:r?"16px":"20px",display:"flex",justifyContent:"flex-end",alignItems:"center",gap:"8px"},children:[e.jsxs("button",{style:{padding:"8px 12px",backgroundColor:g==="grid"?"darkslategrey":"#f0f0f0",color:g==="grid"?"white":"#333",border:"none",borderRadius:"8px",display:"flex",alignItems:"center",gap:"6px",cursor:"pointer",fontSize:"14px",fontWeight:"500",transition:"all 0.3s ease"},onClick:()=>f("grid"),children:[e.jsx(ce,{size:14}),"Grid"]}),e.jsxs("button",{style:{padding:"8px 12px",backgroundColor:g==="list"?"darkslategrey":"#f0f0f0",color:g==="list"?"white":"#333",border:"none",borderRadius:"8px",display:"flex",alignItems:"center",gap:"6px",cursor:"pointer",fontSize:"14px",fontWeight:"500",transition:"all 0.3s ease"},onClick:()=>f("list"),children:[e.jsx(pe,{size:14}),"List"]})]}),W.length>0&&n!=="saved"&&g==="grid"&&e.jsxs("div",{style:{marginBottom:r?"24px":"32px",padding:r?"12px":"18px",background:"#e5eaf0",borderRadius:r?"12px":"16px",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"},children:[e.jsx("h3",{style:{fontSize:r?"20px":"24px",marginBottom:"16px",fontWeight:700,color:me.text},children:"Module Progress"}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:r?"12px":"20px"},children:se.map(t=>e.jsx(be,{module:t},t.moduleName))})]}),e.jsx("div",{className:"video-cards-outer-card",children:y?e.jsx("div",{className:"loading-container",children:e.jsx("div",{children:"Loading your watched sessions..."})}):V?e.jsxs("div",{className:"error-container",children:[e.jsx(ge,{size:48,style:{marginBottom:16}}),e.jsx("div",{style:{fontSize:18,marginBottom:8},children:"Error loading sessions"}),e.jsx("div",{style:{fontSize:14},children:V}),e.jsx("button",{style:{marginTop:16,padding:"8px 16px",background:"#1976d2",color:"white",border:"none",borderRadius:8,cursor:"pointer"},onClick:()=>window.location.reload(),children:"Retry"})]}):O.length===0?e.jsxs("div",{className:"no-data-container",children:[e.jsx("div",{style:{fontSize:24,marginBottom:16},children:n==="watching"?"📺":n==="completed"?"✅":"💾"}),e.jsx("div",{style:{marginBottom:8},children:n==="watching"?"No sessions in progress":n==="completed"?"No completed sessions":"No saved sessions"}),e.jsx("div",{style:{fontSize:14,color:"#999"},children:n==="watching"?"Start watching some content to see your progress here":n==="completed"?"Complete some sessions to see them here":"Save some sessions to see them here"})]}):g==="list"?e.jsx(ye,{filteredCards:O,handleCardClick:Z,formatTimeAgo:q,isMobile:r}):e.jsx("div",{className:"video-cards-grid",children:O.map(t=>e.jsxs("div",{className:"video-card",style:{cursor:"pointer"},onClick:()=>Z(t),children:[e.jsxs("div",{className:"video-container",children:[e.jsx("img",{src:t.thumbnail,alt:t.type+" thumbnail",onError:s=>{s.target.src="/assets/images/continue-watch/01.jpg"}}),e.jsx("span",{className:"duration-badge",children:t.timeLeft})]}),e.jsx("div",{style:{width:"100%",margin:"8px 0 0 0"},children:e.jsx("div",{style:{width:"100%",height:"6px",background:"#e0e0e0",borderRadius:"4px",overflow:"hidden"},children:e.jsx("div",{style:{width:`${Math.round(t.progress*100)}%`,height:"100%",background:t.progress>=1?"#4caf50":"#1976d2",borderRadius:"4px",transition:"width 0.3s"}})})}),e.jsx("div",{className:"video-title",children:t.type}),e.jsxs("div",{className:"badges-row",children:[e.jsx("span",{className:"label-badge",children:t.level}),t.status==="Locked"?e.jsxs("span",{"data-tip":!0,"data-for":`locked-tip-${t.id}`,style:{fontSize:18,marginRight:6,cursor:"pointer"},children:[e.jsx("span",{role:"img","aria-label":"Locked",children:"🔒"}),e.jsx(K,{id:`locked-tip-${t.id}`,effect:"solid",clickable:!0,children:e.jsxs("div",{style:{padding:8,textAlign:"center"},children:[e.jsx("div",{style:{marginBottom:8},children:"This content is locked."}),e.jsx("button",{style:{background:"#1976d2",color:"#fff",border:"none",borderRadius:6,padding:"6px 18px",fontWeight:600,cursor:"pointer"},onClick:s=>{s.stopPropagation(),b("/pricing")},children:"Upgrade"})]})})]}):e.jsx("span",{className:`label-badge status-${t.status.toLowerCase()}`,children:t.status})]}),t.lastWatchedAt&&e.jsx("div",{className:"days-ago",children:q(t.lastWatchedAt)})]},t.id))})})]})})]}),e.jsx(K,{effect:"solid",clickable:!0})]}):e.jsx("div",{children:e.jsx("div",{style:{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)",padding:"20px"},children:e.jsxs("div",{style:{textAlign:"center",maxWidth:"400px"},children:[e.jsx("h2",{style:{fontSize:r?"24px":"32px",fontWeight:"bold",color:"#1565c0",marginBottom:"16px",fontFamily:"system-ui, -apple-system, sans-serif"},children:"Login to view your Watched Sessions"}),e.jsx("p",{style:{color:"#546e7a",marginBottom:"32px",fontSize:"16px",lineHeight:"1.5"},children:"Module progress and compete with others!"}),e.jsx("button",{onClick:()=>b("/login"),style:{padding:"12px 24px",background:"linear-gradient(135deg, #1976d2, #1565c0)",color:"white",border:"none",borderRadius:"8px",fontSize:"16px",fontWeight:"600",cursor:"pointer",boxShadow:"0 4px 16px rgba(25,118,210,0.3)",transition:"all 0.2s ease"},onMouseEnter:t=>{t.target.style.transform="translateY(-2px)",t.target.style.boxShadow="0 8px 24px rgba(25,118,210,0.4)"},onMouseLeave:t=>{t.target.style.transform="translateY(0)",t.target.style.boxShadow="0 4px 16px rgba(25,118,210,0.3)"},children:"Get Started"})]})})})});we.displayName="MySpacePage";export{we as default};
