import{r as l,j as e,a as te,a4 as ie,p as oe,T as se,m as ne,a5 as ae,a6 as H,a8 as re,a9 as le,aa as de,a7 as pe,W as ce,ab as U,ac as O}from"./index-f415b1f3.js";import{O as G}from"./OndemandVideo-f2e1ef46.js";import{N as xe,M as R}from"./react-tooltip.min-e5c3736b.js";import{c as ge}from"./createSvgIcon-4f7a0c31.js";/* empty css                      */const Y=()=>{const a=l.useRef(!0);return l.useEffect(()=>{a.current=!1},[]),a.current},Z=ge(e.jsx("path",{d:"M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2m-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2m3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1z"})),_={primary:"#1976d2",secondary:"#00bfae",background:"#f4f8fb",card:"#fff",accent:"#ffb300",text:"#263238",border:"#e0e0e0"},he=`
  .video-card {
    position: relative;
    background: none !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0;
    // transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
    box-shadow: 0 4px 32px rgba(0,0,0,0.07);
    boxshadow: 
    max-width: 200px;
    min-width: 100px;
    border-radius: 20px;
  }
  .video-card.list-view {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    max-width: 600px;
    min-width: 0;
    width: 100%;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    border-radius: 18px;
    // margin-bottom: 12px;
    padding: 0;
  }
  .video-container {
    position: relative;
    width: 100%;
    padding-top: 56.25%; /* 16:9 aspect ratio */
    border-radius: 18px;
    overflow: hidden;
    background: #000;
    // margin-bottom: 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  .video-card.list-view .video-container {
    width: 180px;
    min-width: 100px;
    height: 30px;
    padding-top: 0;
    border-radius: 14px 0 0 14px;
    margin: 0;
    box-shadow: none;
  }
  .video-card.list-view .video-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 14px 0 0 14px;
    position: static;
  }
  .video-card.list-view .video-content {
    flex: 1;
    // padding: 16px 18px 16px 18px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
  }
  .video-card.list-view .video-title {
    font-size: 14px;
    margin-top: 0;
    margin-bottom: 6px;
    font-weight: 700;
    color: #222;
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .video-card:hover {
    background:  !important;
    // box-shadow: 0 4px 16px rgba(0,0,0,0.10);
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
  .live-badge {
    position: absolute;
    bottom: 10px;
    right: 14px;
    background: #ff1744;
    color: #fff;
    border-radius: 8px;
    padding: 2px 10px;
    font-size: 13px;
    font-weight: 600;
    z-index: 2;
    letter-spacing: 0.5px;
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
  }
  .category-badge {
    position: absolute;
    top: 12px;
    right: 16px;
    background: linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%);
    color: navy;
    border-radius: 8px;
    padding: 4px 14px;
    font-size: 12px;
    // font-weight: 500;
    z-index: 2;
    box-shadow: 0 2px 8px rgba(25,118,210,0.10);
    letter-spacing: 0.5px;
    text-transform: capitalize;
  }
  .badges-row {
    display: flex;
    gap: 8px;
    margin-top: 8px;
    // margin-bottom: 6px;
    flex-wrap: wrap;
    align-items: center;
  }
  .content-type-badge {
    border-radius: 6px;
    padding: 2px 8px;
    font-size: 12px;
    // font-weight: 500;
    // text-transform: uppercase;
    letter-spacing: 0.5px;
    background: linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%);
    color: navy;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .label-badge {
    border-radius: 6px;
    padding: 2px 8px;
    font-size: 12px;
    // font-weight: 500;
    // text-transform: uppercase;
    letter-spacing: 0.5px;
    display: inline-block;
  }
  .label-badge.level-beginner {
    background: linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%);
    color: navy;
  }
  .label-badge.level-advanced {
    background: linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%);
    color: navy;
  }
  .label-badge.status-free {
    background: linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%);
    color: navy;
  }
  .label-badge.status-locked {
    background: #ffe0b2;
    color: #ffb300;
  }
  .days-ago {
    color: #666;
    font-size: 13px;
    margin-top: 2px;
    margin-bottom: 0;
    font-weight: 500;
    letter-spacing: 0.2px;
  }
  .video-title {
    font-weight: 600;
    font-size: 18px;
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
    gap:20px;
    max-width: 1400px;
    margin: isAuthenticated ? -10px auto 0 auto : 28px auto 0 auto;
    width: 100%;
    /* height: calc(100vh - 170px); */
    /* min-height: 0; */
    display: flex;
    flex-direction: column;
    align-items: stretch;
    /* overflow: hidden; */
  }
  .video-cards-outer-card .video-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 36px 24px;
    width: 100%;
  }
  
  /* Mobile responsive grid */
  @media (max-width: 768px) {
    .video-cards-outer-card .video-cards-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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
    
    .video-card.list-view {
      max-width: 100%;
      margin-bottom: 16px;
    }
  }
  
  /* Small mobile devices */
  @media (max-width: 480px) {
    .video-cards-outer-card .video-cards-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }
  }
  .video-card {
    /* height: 100%; */
    min-width: 0;
    max-width: 100%;
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 769px) {
    .main-page-desktop-layout {
      display: flex;
    }
    .desktop-sidebar {
      width: 250px;
      flex-shrink: 0;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
    }
    .desktop-main-content {
      flex: 1;
      min-height: 100vh;
      overflow-y: auto; /* This is the key for the scrollable area */
      padding-top: 70px;
      // padding-right: 18px;
    }
  }
`,q=()=>e.jsxs("div",{style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"#eee",zIndex:1},children:[e.jsx("div",{style:{width:22,height:22,border:"4px solid #ccc",borderTop:"4px solid #1976d2",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("style",{children:"@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }"})]}),fe=({card:a,view:d,isMobile:M,handleCardClick:z,children:c})=>{const[n,x]=l.useState(!1);return e.jsx("div",{className:`video-card${d==="list"?" list-view":""}`,style:{cursor:"pointer",width:d==="list"?"100%":"auto",maxWidth:d==="list"||M?"100%":320,minWidth:0,background:d==="list"?"#fff":void 0,borderRadius:d==="list"?18:void 0,boxShadow:d==="list"?"0 2px 8px rgba(0,0,0,0.04)":void 0,display:d==="list"?"flex":void 0,flexDirection:d==="list"?"row":void 0,alignItems:d==="list"?"center":void 0,padding:d==="list"?"0 0px 0 0":void 0,gap:d==="list"?0:void 0},onClick:()=>z(a),onMouseEnter:h=>{h.currentTarget.style.transform="scale(1.02)"},onMouseLeave:h=>{h.currentTarget.style.transform="scale(1)"},children:d==="list"?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"video-container",style:{width:90,minWidth:90,height:60,margin:"0px 24px 18px 0",borderRadius:14,overflow:"hidden",flexShrink:0,position:"relative"},children:[!n&&e.jsx(q,{}),e.jsx("img",{src:a.thumbnail,alt:a.type+" thumbnail",style:{width:"100%",height:"100%",objectFit:"cover",borderRadius:"14px",opacity:n?1:0,transition:"opacity 0.3s"},onLoad:()=>x(!0),onError:()=>x(!0)})]}),e.jsx("div",{className:"video-content",style:{flex:1,padding:"0",display:"flex",flexDirection:"column",justifyContent:"center",paddingRight:"20px"},children:c})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"video-container",style:{position:"relative"},children:[!n&&e.jsx(q,{}),e.jsx("img",{src:a.thumbnail,alt:a.type+" thumbnail",style:{objectFit:"cover",width:"100%",height:"100%",opacity:n?1:0,transition:"opacity 0.3s"},onLoad:()=>x(!0),onError:()=>x(!0)}),a.isLive?e.jsx("span",{className:"live-badge",children:"LIVE"}):null,e.jsx("span",{className:"category-badge",children:a.category})]}),c]})},a.id)},ue=l.memo(()=>{const[a,d]=l.useState("atlas"),[M,z]=l.useState([]),c=te(),{activeFilters:n}=ie(),[x,h]=l.useState(0),W=200,f=oe(se),[F,J]=l.useState(1),[u,A]=l.useState(!0),[j,D]=l.useState(!0),[m,V]=l.useState(!1),[i,K]=l.useState(!1),[o,me]=l.useState(!1),[b,N]=l.useState(!1),k=12,Q=[];l.useEffect(()=>{if(!f)return;(async()=>{try{const r=await(await fetch(`https://primerad-backend.onrender.com/api/assessments/getUserPoints?userId=${localStorage.getItem("userId")}`)).json();(r==null?void 0:r.totalPoints)!==void 0&&h(r.totalPoints)}catch(p){console.error("Error fetching user points:",p)}})()},[f]);const C=l.useCallback(async(t,p=!1)=>{if(!(!u&&p)&&!(m&&p)){p?V(!0):D(!0);try{const r=await ne.get(`https://primerad-backend.onrender.com/api/sessions/get?page=${t}&limit=${k}`),{data:y,total:g}=r.data,v=s=>{if(!s)return"";const E=new Date,T=new Date(s),w=E-T,S=Math.floor(w/(1e3*60)),I=Math.floor(w/(1e3*60*60)),P=Math.floor(w/(1e3*60*60*24));return S<60&&I===0?S<=1?"just now":`${S} minutes ago`:I<24?I===1?"1 hour ago":`${I} hours ago`:P===1?"1 day ago":`${P} days ago`},$=(s,E)=>{if(E==="Lecture"&&s){const T=s.match(/(\d+)/);if(T){const w=parseInt(T[1]);return`${Math.max(5,Math.floor(w*.7))} min`}}return s},B=(y||[]).map(s=>({id:s._id,type:s.title,contentType:s.sessionType==="Dicom"?"Case":s.sessionType==="Vimeo"?"Lecture":s.sessionType||"Other",level:s.difficulty==="beginner"?"Beginner":"Advanced",status:s.isFree?"Free":"Locked",thumbnail:s.imageUrl_1920x1080?`https://primerad-backend.onrender.com${s.imageUrl_1920x1080}`:s.imageUrl?`https://primerad-backend.onrender.com${s.imageUrl}`:"/default-thumbnail.jpg",duration:$(s.sessionDuration||"",s.sessionType==="Dicom"?"Case":s.sessionType==="Vimeo"?"Lecture":s.sessionType||"Other"),isLive:!1,isFree:s.isFree,category:s.moduleName||s.subCategoryId||"",timeAgo:v(s.startDate),vimeoVideoId:s.vimeoVideoId||null,description:s.description||"No description available.",faculty:s.faculty||"Unknown Faculty",module:s.moduleName||"General",submodule:s.subCategoryId||"General",startDate:s.startDate}));z(s=>p?[...s,...B]:B),A(t*k<g),console.log(`Page: ${t}, Limit: ${k}, Total: ${g}`),console.log(`Calculated hasMore: ${t*k<g}`),console.log(`Current hasMore state: ${u}`),console.log(`Is Fetching More: ${m}`)}catch(r){console.error("Error fetching sessions:",r),A(!1)}finally{D(!1),V(!1),console.log("Fetch finished. isFetchingMore set to false.")}}},[]);l.useEffect(()=>{Y&&C(1,!1)},[C,Y]),l.useEffect(()=>{const t=()=>{const r=window.innerWidth<=768;K(r),r||N(!1)};t(),window.addEventListener("resize",t);const p=()=>{if(!i){const{scrollY:r}=window,{scrollHeight:y,clientHeight:g}=document.documentElement;y-r<=g+200&&u&&!m&&!j&&J(v=>v+1)}};return i||window.addEventListener("scroll",p),()=>{window.removeEventListener("resize",t),i||window.removeEventListener("scroll",p)}},[i,u,m,j]),l.useEffect(()=>{F>1&&C(F,!0)},[F,C]);const L=[...Q,...M].filter(t=>{const p=n.area.length===0||n.area.includes(t.category),r=n.level.length===0||n.level.includes(t.level),y=n.status.length===0||n.status.includes(t.status),g=n.type.length===0||n.type.includes(t.contentType),v=n.pathology.length===0||n.pathology.some($=>t.type.toLowerCase().includes($.toLowerCase()));return p&&r&&y&&g&&v}),X=t=>{t.contentType&&t.contentType.toLowerCase()==="case"?c(`/case/${t.id}`):t.contentType&&t.contentType.toLowerCase()==="lecture"?c("/lecture-detail",{state:{id:t.id,vimeoVideoId:t.vimeoVideoId,title:t.type,description:t.description,faculty:t.faculty,module:t.module,isFree:t.isFree,submodule:t.submodule,duration:t.duration,startDate:t.startDate,contentType:t.contentType}}):t.contentType&&t.contentType.toLowerCase()==="live"&&c("/live/5387499339",{state:t})},ee=()=>{const t=[];return n.area.length>0&&t.push(`Area: ${n.area.join(", ")}`),n.level.length>0&&t.push(`Level: ${n.level.join(", ")}`),n.status.length>0&&t.push(`Status: ${n.status.join(", ")}`),n.type.length>0&&t.push(`Type: ${n.type.join(", ")}`),n.pathology.length>0&&t.push(`Pathology: ${n.pathology.join(", ")}`),t.join(" | ")};return e.jsxs("div",{style:{background:_.background},children:[e.jsx("style",{children:he}),i&&e.jsx("button",{style:{position:"fixed",top:"68px",zIndex:1001,width:"28px",height:"28px",background:"linear-gradient(135deg, #3b82f6, #1d4ed8)",border:"none",borderRadius:"0px 12px 12px 0px",color:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(59,130,246,0.3)",transition:"all 0.2s ease"},onClick:()=>N(!b),children:b?e.jsx(ae,{size:18}):e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"currentColor",children:e.jsx("path",{d:"M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z"})})}),e.jsxs("div",{className:i?"":"main-page-desktop-layout",children:[e.jsxs("div",{className:i?"":"desktop-sidebar",style:{width:i?b?"250px":"0":void 0,position:i?"fixed":void 0,left:i?"0":"10px",top:i?b?"32px":"0":void 0,height:i?"100vh":void 0,overflowY:i?"auto":"hidden",background:i?_.card:void 0,zIndex:i?1e3:void 0,transition:i?"width 0.3s ease":void 0},children:[e.jsx("div",{style:{padding:"14px",marginTop:f?"50px":"40px"},children:e.jsxs("div",{style:{display:"flex",borderRadius:"12px",padding:"4px",gap:"2px"},children:[e.jsxs("button",{style:{flex:1,padding:"8px 8px",backgroundColor:"#B0E0E6",color:"black",border:"none",borderRadius:"8px",gap:"6px",fontSize:"14px",fontWeight:"600",cursor:"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center"},onClick:()=>{d("atlas")},children:[e.jsx(H,{size:14}),"List"]}),e.jsxs("button",{style:{flex:1,padding:"8px 8px",backgroundColor:"white",color:"black",border:"none",borderRadius:"8px",fontSize:"14px",fontWeight:"600",cursor:"pointer",transition:"all 0.2s"},onClick:()=>{c("/atlas")},children:[e.jsx(re,{style:{fontSize:18}}),"Atlas"]})]})}),e.jsx(xe,{view:"atlas"})]}),i&&b&&e.jsx("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",zIndex:999},onClick:()=>N(!1)}),e.jsx("div",{className:i?"":"desktop-main-content",style:{paddingTop:i?"120px":void 0,paddingRight:i?"12px":void 0,paddingLeft:i?"12px":void 0,overflowY:i?void 0:"auto"},children:e.jsxs("div",{style:{flex:1,padding:i?"4px":"8px",backgroundColor:"transparent"},children:[e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",justifyContent:"space-between",alignItems:"center",width:"100%",gap:"16px",marginBottom:"2px"},children:[f?e.jsxs("div",{style:{background:"antiquewhite",marginLeft:i?"8px":o?"12px":"18px",marginBottom:"20px",marginTop:i?" -18px":"-20px",borderRadius:i?12:o?14:16,boxShadow:"0 2px 8px rgba(0,0,0,0.04)",padding:i?"12px 16px":o?"16px 22px":"18px 28px",display:"flex",alignItems:"center",gap:i?12:o?20:24,maxWidth:900,width:i?"calc(100% - 16px)":o?"calc(100% - 24px)":"100%",minWidth:i?250:o?300:320,flexDirection:i||o?"column":"row"},children:[e.jsxs("div",{style:{fontSize:i?14:o?18:20,fontWeight:400,minWidth:i?"auto":o?160:180,textAlign:i?"center":"left",whiteSpace:i?"normal":"nowrap"},children:["Current Belt:"," ",e.jsx("span",{style:{fontWeight:700,color:"#1976d2"},children:"Green"})]}),e.jsx("div",{style:{flex:1,minWidth:i?80:o?100:120,margin:i?"8px 0":o?"0 12px":"0 18px",width:i?"100%":"auto"},children:e.jsx("div",{style:{width:"100%",height:i?8:o?9:11,background:"ghostwhite",borderRadius:i?6:o?7:8,overflow:"hidden",position:"relative"},children:e.jsx("div",{style:{width:`${Math.min(Math.round(x/W*100),100)}%`,height:"100%",background:"#1976d2",borderRadius:i?6:o?7:8,transition:"width 0.4s"}})})}),e.jsxs("div",{style:{fontSize:i?12:o?16:18,fontWeight:400,minWidth:i?"auto":o?140:180,textAlign:i?"center":"right",whiteSpace:i?"normal":"nowrap"},children:[x," / ",W," pts to"," ",e.jsx("span",{style:{fontWeight:700,color:"#222"},children:"Black"})]})]}):e.jsx("div",{style:{background:"#E8F5E9",border:"1px solid #C8E6C9",marginLeft:i?"8px":o?"12px":"18px",marginBottom:"10px",marginTop:"-20px",borderRadius:i?12:o?14:16,boxShadow:"0 4px 12px rgba(0, 0, 0, 0.08)",padding:i?"16px 20px":o?"16px 24px":"18px 28px",display:"flex",alignItems:"center",justifyContent:"center",gap:i?16:o?20:24,maxWidth:900,width:i?"calc(100% - 16px)":o?"calc(100% - 24px)":"100%",minWidth:i?250:o?300:320,flexDirection:i?"column":"row"},children:e.jsxs("div",{style:{fontSize:i?14:o?18:22,fontWeight:600,textAlign:"center",color:"#2E7D32",display:"flex",alignItems:"center",gap:"5px",flexDirection:i?"column":"row",flexWrap:"wrap",justifyContent:"center"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"5px"},children:[e.jsx(le,{size:i?14:o?16:20}),e.jsx("span",{style:{fontWeight:500,fontSize:i?"14px":o?"16px":"18px"},children:"Login to watch unlimited videos and win big with module assessments!"})]}),e.jsxs("button",{style:{padding:i?"6px 8px":o?"5px 7px":"4px 6px",backgroundColor:"#4CAF50",color:"darkslategrey",border:"none",borderRadius:"8px",display:"flex",alignItems:"center",gap:"8px",letterSpacing:1,cursor:"pointer",fontSize:i?"14px":o?"15px":"16px",fontWeight:"600",boxShadow:"0 4px 6px rgba(0,0,0,0.1)",transition:"transform 0.2s ease, background-color 0.2s ease",marginLeft:i?"0":"auto",marginTop:i?"8px":"0"},onMouseEnter:t=>{t.target.style.transform="scale(1.05)",t.target.style.backgroundColor="#66BB6A"},onMouseLeave:t=>{t.target.style.transform="scale(1)",t.target.style.backgroundColor="#4CAF50"},onClick:()=>{c("/login")},children:[e.jsx(de,{size:i?14:16}),"Login"]})]})}),e.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",alignItems:"center",gap:i?"6px":o?"7px":"8px",marginBottom:f?"0px":"10px",marginTop:"-10px",flexGrow:1,paddingRight:i?"8px":o?"12px":"18px",width:i?"100%":"auto"},children:[e.jsxs("button",{style:{padding:i?"6px 10px":o?"7px 11px":"8px 12px",backgroundColor:a==="atlas"?"lightblue":"#f0f0f0",color:a==="atlas"?"black":"#333",border:"none",borderRadius:i?"6px":o?"7px":"8px",display:"flex",alignItems:"center",gap:i?"4px":o?"5px":"6px",cursor:"pointer",fontSize:i?"12px":o?"13px":"14px",fontWeight:"500",transition:"all 0.3s ease",minWidth:i?"60px":o?"70px":"auto",justifyContent:"center"},onClick:()=>d("atlas"),children:[e.jsx(H,{size:i?12:o?13:14}),!i&&"Grid",i&&"Grid"]}),e.jsxs("button",{style:{padding:i?"6px 10px":o?"7px 11px":"8px 12px",backgroundColor:a==="list"?"lightblue":"#f0f0f0",color:a==="list"?"black":"#333",border:"none",borderRadius:i?"6px":o?"7px":"8px",display:"flex",alignItems:"center",gap:i?"4px":o?"5px":"6px",cursor:"pointer",fontSize:i?"12px":o?"13px":"14px",fontWeight:"500",transition:"all 0.3s ease",minWidth:i?"60px":o?"70px":"auto",justifyContent:"center"},onClick:()=>d("list"),children:[e.jsx(pe,{size:i?12:o?13:14}),!i&&"List",i&&"List"]})]})]}),j&&L.length===0?e.jsx("div",{style:{textAlign:"center",padding:40},children:"Loading..."}):L.length===0?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"60vh",textAlign:"center",color:"#666"},children:[e.jsx(ce,{style:{fontSize:"48px",marginBottom:"16px",color:"#999"}}),e.jsx("h3",{children:"No records found"}),e.jsx("p",{style:{marginTop:"8px"},children:"There are no cards matching your current filters."}),Object.values(n).some(t=>t.length>0)&&e.jsxs("p",{style:{marginTop:"4px",fontSize:"0.9rem"},children:["Active filters: ",ee()]})]}):e.jsx("div",{className:"video-cards-outer-card",children:e.jsx("div",{className:a==="atlas"?"video-cards-grid":void 0,style:a==="list"?{display:"flex",flexDirection:"column",gap:"12px",width:"100%"}:void 0,children:L.map((t,p)=>e.jsx(fe,{card:t,view:a,isMobile:i,handleCardClick:X,children:a==="list"?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"video-title",style:{fontSize:16,fontWeight:700,color:"#222"},children:t.type}),e.jsxs("div",{style:{display:"flex",flexDirection:"row",justifyContent:"space-between"},children:[e.jsxs("div",{className:"badges-row",style:{marginTop:3},children:[e.jsxs("span",{className:"content-type-badge",children:[t.contentType==="Case"&&e.jsx(U,{style:{marginRight:4}}),t.contentType==="Lecture"&&e.jsx(G,{style:{marginRight:4}}),t.contentType==="Live"&&e.jsx(O,{style:{marginRight:4}}),t.contentType]}),e.jsx("span",{className:`label-badge level-${t.level.toLowerCase()}`,children:t.level}),t.status==="Locked"?e.jsxs("span",{"data-tip":!0,"data-for":`locked-tip-${t.id}`,style:{fontSize:18,marginRight:6,cursor:"pointer"},children:[e.jsx("span",{role:"img","aria-label":"Locked",children:e.jsx(Z,{style:{color:"#2563EB"}})}),e.jsx(R,{id:`locked-tip-${t.id}`,effect:"solid",clickable:!0,children:e.jsxs("div",{style:{padding:8,textAlign:"center"},children:[e.jsx("div",{style:{marginBottom:8},children:"This content is locked."}),e.jsx("button",{style:{background:"#1976d2",color:"#fff",border:"none",borderRadius:6,padding:"6px 18px",fontWeight:600,cursor:"pointer"},onClick:r=>{r.stopPropagation(),c("/pricing")},children:"Upgrade"})]})})]}):e.jsx("span",{className:`label-badge status-${t.status.toLowerCase()}`,children:t.status})]}),e.jsx("div",{className:"days-ago",style:{color:"#666",fontSize:15},children:t.isLive?`Live - ${t.liveDate||"Now"}`:t.timeAgo})]})]}):e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"video-title",children:t.type}),e.jsxs("div",{className:"badges-row",children:[e.jsxs("span",{className:"content-type-badge",children:[t.contentType==="Case"&&e.jsx(U,{style:{marginRight:4}}),t.contentType==="Lecture"&&e.jsx(G,{style:{width:"15px",height:"20px"}}),t.contentType==="Live"&&e.jsx(O,{style:{marginRight:4}}),t.contentType]}),e.jsx("span",{className:`label-badge level-${t.level.toLowerCase()}`,children:t.level}),t.status==="Locked"?e.jsxs("span",{"data-tip":!0,"data-for":`locked-tip-${t.id}`,style:{fontSize:18,marginRight:6,cursor:"pointer"},children:[e.jsx("span",{role:"img","aria-label":"Locked",children:e.jsx(Z,{style:{width:"20px",height:"20px",color:"#2563EB"}})}),e.jsx(R,{id:`locked-tip-${t.id}`,effect:"solid",clickable:!0,children:e.jsxs("div",{style:{padding:8,textAlign:"center"},children:[e.jsx("div",{style:{marginBottom:8},children:"This content is locked."}),e.jsx("button",{style:{background:"#1976d2",color:"#fff",border:"none",borderRadius:6,padding:"6px 18px",fontWeight:600,cursor:"pointer"},onClick:r=>{r.stopPropagation(),c("/pricing")},children:"Upgrade"})]})})]}):e.jsx("span",{className:`label-badge status-${t.status.toLowerCase()}`,children:t.status})]}),e.jsx("div",{className:"days-ago",children:t.isLive?`Live - ${t.liveDate||"Now"}`:t.timeAgo})]})},t.id))})}),m&&e.jsxs("div",{style:{textAlign:"center",padding:"20px"},children:["Loading more sessions...",e.jsx("div",{style:{width:32,height:32,border:"4px solid #ccc",borderTop:"4px solid #1976d2",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"10px auto"}}),e.jsx("style",{children:"@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }"})]}),!u&&!j&&L.length>0&&e.jsx("div",{style:{textAlign:"center",padding:"20px",color:"#666"},children:"You've reached the end of the list!"})]})})]}),e.jsx(R,{effect:"solid",clickable:!0})]})});ue.displayName="MainPage";export{ue as default};
