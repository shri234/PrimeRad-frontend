import{r as d,c as I,a as w,j as e,e as A,C as E,R as x,b as m,f as b,g as S,h as n,i as r,k as M,l as T,m as F}from"./index-f415b1f3.js";const a={primary:"#1976d2",secondary:"#00bfae",background:"#f4f8fb",card:"#fff",accent:"#ffb300",text:"#263238",border:"#e0e0e0"},z=({options:t,activeOption:o,onOptionChange:s,label:f,icon:g})=>e.jsx("div",{style:{marginBottom:"0"},children:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"16px",justifyContent:"flex-start"},children:[e.jsx("span",{style:{fontSize:"15px",fontWeight:o===t[0].value?600:400,color:o===t[0].value?a.text:"#9ca3af",transition:"all 0.3s ease",cursor:"pointer",minWidth:"70px",textAlign:"right"},onClick:()=>s(t[0].value),children:t[0].label}),e.jsx("div",{style:{position:"relative",background:"#90ee90",borderRadius:"25px",padding:"3px",width:"64px",height:"30px",display:"flex",alignItems:"center",cursor:"pointer",transition:"all 0.3s ease",boxShadow:"0 2px 6px rgba(0,0,0,0.1)"},onClick:()=>s(o===t[0].value?t[1].value:t[0].value),children:e.jsx("div",{style:{position:"absolute",top:"3px",left:o===t[0].value?"3px":"calc(100% - 27px)",width:"24px",height:"24px",background:"#ffffff",borderRadius:"50%",transition:"all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",boxShadow:"0 2px 8px rgba(0,0,0,0.15)",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx(n,{icon:o===t[0].value?t[0].icon:t[1].icon,style:{fontSize:"10px",color:"#555",transition:"all 0.3s ease"}})})}),e.jsx("span",{style:{fontSize:"15px",fontWeight:o===t[1].value?600:400,color:o===t[1].value?a.text:"#9ca3af",transition:"all 0.3s ease",cursor:"pointer",minWidth:"70px",textAlign:"left"},onClick:()=>s(t[1].value),children:t[1].label})]})}),W=({pkg:t,navigate:o,billingPeriod:s,userType:f})=>{const g=()=>t.amount===0?0:t.durationUnit==="month"&&s==="annually"?Math.round(t.amount*12*.83):t.durationUnit==="year"&&s==="monthly"?Math.round(t.amount/12*100)/100:t.amount,u=()=>s==="annually"?"/year":"/month",c=g();return t.durationUnit==="month"?t.amount:t.amount/12,e.jsxs("div",{style:{background:a.card,borderRadius:18,boxShadow:"0 8px 30px rgba(0,0,0,0.1)",padding:"32px",textAlign:"center",position:"relative",height:"100%",border:t.packageName==="Premium"||t.packageName==="Pro"?`2px solid ${a.primary}`:"none",transform:"translateY(0)",transition:"all 0.3s ease"},onMouseEnter:i=>{i.currentTarget.style.transform="translateY(-4px)",i.currentTarget.style.boxShadow="0 12px 40px rgba(0,0,0,0.15)"},onMouseLeave:i=>{i.currentTarget.style.transform="translateY(0)",i.currentTarget.style.boxShadow="0 8px 30px rgba(0,0,0,0.1)"},children:[(t.packageName==="Premium"||t.packageName==="Pro")&&e.jsx("div",{style:{position:"absolute",top:0,right:20,background:`linear-gradient(135deg, ${a.primary} 0%, ${a.secondary} 100%)`,color:a.card,padding:"6px 16px",borderRadius:"0 0 12px 12px",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"},children:"Most Popular"}),s==="annually"&&t.amount>0&&e.jsx("div",{style:{position:"absolute",top:16,left:16,background:a.accent,color:"#fff",padding:"4px 8px",borderRadius:"6px",fontSize:11,fontWeight:600},children:"Save 17%"}),e.jsx("h4",{style:{color:a.primary,fontWeight:700,marginBottom:16},children:t.packageName}),e.jsx("div",{style:{marginBottom:8},children:e.jsxs("h5",{style:{color:a.text,fontWeight:700,marginBottom:4},children:[c===0?"$0":`$${c.toFixed(2)}`,e.jsx("span",{style:{fontSize:16,color:a.text,fontWeight:400},children:c>0?u():""})]})}),e.jsx("ul",{style:{listStyle:"none",padding:0,margin:"24px 0"},children:(t.features||[]).length>0?t.features.map((i,y)=>e.jsxs("li",{style:{display:"flex",alignItems:"center",justifyContent:"flex-start",gap:12,marginBottom:14,color:a.text,fontSize:14,textAlign:"left"},children:[e.jsx(n,{icon:r,style:{color:a.secondary,fontSize:12,minWidth:16}}),i]},y)):e.jsxs(e.Fragment,{children:[t.packageName==="Free"&&e.jsxs(e.Fragment,{children:[e.jsxs("li",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:14,fontSize:14},children:[e.jsx(n,{icon:r,style:{color:a.secondary,fontSize:12}}),"Access to limited CME courses"]}),e.jsxs("li",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:14,fontSize:14},children:[e.jsx(n,{icon:r,style:{color:a.secondary,fontSize:12}}),"Online articles"]}),e.jsxs("li",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:14,fontSize:14},children:[e.jsx(n,{icon:r,style:{color:a.secondary,fontSize:12}}),"Basic support"]})]}),t.packageName==="Basic"&&e.jsxs(e.Fragment,{children:[e.jsxs("li",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:14,fontSize:14},children:[e.jsx(n,{icon:r,style:{color:a.secondary,fontSize:12}}),"Access to 10 CME courses"]}),e.jsxs("li",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:14,fontSize:14},children:[e.jsx(n,{icon:r,style:{color:a.secondary,fontSize:12}}),"Online support"]}),e.jsxs("li",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:14,fontSize:14},children:[e.jsx(n,{icon:r,style:{color:a.secondary,fontSize:12}}),"Certificate of completion"]})]}),(t.packageName==="Pro"||t.packageName==="Premium")&&e.jsxs(e.Fragment,{children:[e.jsxs("li",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:14,fontSize:14},children:[e.jsx(n,{icon:r,style:{color:a.secondary,fontSize:12}}),"Access to all CME courses"]}),e.jsxs("li",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:14,fontSize:14},children:[e.jsx(n,{icon:r,style:{color:a.secondary,fontSize:12}}),"Unlimited lectures"]}),e.jsxs("li",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:14,fontSize:14},children:[e.jsx(n,{icon:r,style:{color:a.secondary,fontSize:12}}),"Priority support"]}),e.jsxs("li",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:14,fontSize:14},children:[e.jsx(n,{icon:r,style:{color:a.secondary,fontSize:12}}),"Certificate of completion"]}),e.jsxs("li",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:14,fontSize:14},children:[e.jsx(n,{icon:r,style:{color:a.secondary,fontSize:12}}),"Offline access to materials"]})]}),t.packageName==="Enterprise"&&e.jsxs(e.Fragment,{children:[e.jsxs("li",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:14,fontSize:14},children:[e.jsx(n,{icon:r,style:{color:a.secondary,fontSize:12}}),"Customized for your institution"]}),e.jsxs("li",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:14,fontSize:14},children:[e.jsx(n,{icon:r,style:{color:a.secondary,fontSize:12}}),"Dedicated account manager"]}),e.jsxs("li",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:14,fontSize:14},children:[e.jsx(n,{icon:r,style:{color:a.secondary,fontSize:12}}),"Advanced reporting"]}),e.jsxs("li",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:14,fontSize:14},children:[e.jsx(n,{icon:r,style:{color:a.secondary,fontSize:12}}),"All Pro features"]})]})]})}),e.jsx("button",{style:{background:t.packageName==="Pro"||t.packageName==="Premium"?`linear-gradient(135deg, ${a.primary} 0%, ${a.secondary} 100%)`:a.secondary,color:a.card,fontWeight:700,fontSize:16,border:"none",borderRadius:12,padding:"16px 24px",width:"100%",cursor:"pointer",transition:"all 0.3s ease",textTransform:"capitalize",letterSpacing:"0.5px"},onClick:()=>o("/cart",{state:{packageId:t._id,billingPeriod:s,userType:f,amount:t.amount,adjustedPrice:c}}),onMouseEnter:i=>{i.target.style.transform="translateY(-2px)",i.target.style.boxShadow="0 8px 25px rgba(0,0,0,0.2)"},onMouseLeave:i=>{i.target.style.transform="translateY(0)",i.target.style.boxShadow="none"},children:t.packageName==="Enterprise"?"Contact Sales":`Choose ${t.packageName}`})]})},k=d.memo(()=>{I();const t=w(),[o,s]=d.useState([]),[f,g]=d.useState(!0),[u,c]=d.useState(null),[i,y]=d.useState("student"),[j,v]=d.useState("annually"),N=[{value:"student",label:"Student",icon:M},{value:"consultant",label:"Consultant",icon:b}],P=[{value:"annually",label:"Annual",icon:T},{value:"monthly",label:"Monthly",icon:S}];return d.useEffect(()=>{(async()=>{g(!0),c(null);try{const p=await F.get("https://primerad-backend.onrender.com/api/subscription/get");if(p.data&&Array.isArray(p.data.data)){const C=p.data.data.sort((l,B)=>l.amount-B.amount).map(l=>({...l,features:l.features||(l.packageName==="Free"?["Access to limited CME courses","Online articles","Basic support"]:l.packageName==="Basic"?["Access to 10 CME courses","Online support","Certificate of completion"]:l.packageName==="Pro"||l.packageName==="Premium"?["Access to all CME courses","Unlimited lectures","Priority support","Certificate of completion","Offline access to materials"]:l.packageName==="Enterprise"?["Customized for your institution","Dedicated account manager","Advanced reporting","All Pro features"]:[])}));s(C)}else c("No pricing plans found."),s([])}catch(p){console.error("Error fetching pricing plans:",p),c("Failed to load pricing plans. Please try again later."),s([])}finally{g(!1)}})()},[]),e.jsxs(d.Fragment,{children:[e.jsx(A,{customPath:"/home"}),e.jsx("style",{children:`
        @media (max-width: 768px) {
          .pricing-title {
            font-size: 2rem !important;
            margin-bottom: 0.75rem !important;
          }
          
          .pricing-subtitle {
            font-size: 16px !important;
          }
          
          .toggle-container {
            flex-direction: column !important;
            gap: 30px !important;
            padding: 15px 20px !important;
            max-width: 100% !important;
          }
          
          .pricing-card {
            padding: 24px !important;
            margin-bottom: 20px !important;
          }
          
          .card-button {
            font-size: 14px !important;
            padding: 14px 20px !important;
          }
        }
        
        @media (max-width: 576px) {
          .pricing-title {
            font-size: 1.75rem !important;
          }
          
          .toggle-container {
            gap: 25px !important;
            padding: 15px !important;
          }
          
          .pricing-card {
            padding: 20px !important;
          }
          
          .popular-badge {
            right: 15px !important;
            font-size: 10px !important;
            padding: 5px 12px !important;
          }
          
          .save-badge {
            left: 15px !important;
            font-size: 10px !important;
            padding: 3px 6px !important;
          }
        }
        
        @media (min-width: 769px) and (max-width: 1024px) {
          .toggle-container {
            gap: 100px !important;
            padding: 20px 30px !important;
          }
          
          .pricing-card {
            padding: 28px !important;
          }
        }
      `}),e.jsx("div",{className:"section-padding",style:{backgroundColor:a.background,minHeight:"100vh"},children:e.jsxs(E,{children:[e.jsx(x,{className:"justify-content-center",children:e.jsxs(m,{lg:8,className:"text-center mb-5",children:[e.jsx("h1",{className:"pricing-title",style:{color:a.text,fontWeight:700,fontSize:"2.5rem"},children:"Find the Perfect Plan for Your Needs"}),e.jsx("p",{className:"pricing-subtitle",style:{color:a.text,fontSize:18,opacity:.8,lineHeight:1.6},children:"Choose the subscription that best fits your professional development goals and start learning today."})]})}),e.jsx(x,{className:"justify-content-center mb-5",children:e.jsx(m,{lg:10,children:e.jsxs("div",{className:"toggle-container",style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"190px",padding:"20px 40px",maxWidth:"800px",margin:"0 auto"},children:[e.jsx("div",{style:{flex:1},children:e.jsx(z,{options:N,activeOption:i,onOptionChange:y,label:"Designation",icon:b})}),e.jsx("div",{style:{flex:1},children:e.jsx(z,{options:P,activeOption:j,onOptionChange:v,label:"Billing Period",icon:S})})]})})}),f?e.jsx(x,{children:e.jsxs(m,{className:"text-center py-5",children:[e.jsx("div",{style:{display:"inline-block",width:40,height:40,border:`4px solid ${a.border}`,borderTop:`4px solid ${a.primary}`,borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("p",{style:{marginTop:20,color:a.text},children:"Loading pricing plans..."}),e.jsx("style",{children:`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `})]})}):u?e.jsx(x,{children:e.jsx(m,{className:"text-center py-5",children:e.jsxs("div",{style:{background:"#fef2f2",color:"#dc2626",padding:"20px",borderRadius:"12px",border:"1px solid #fecaca"},children:[e.jsx("strong",{children:"Error:"})," ",u]})})}):o.length===0?e.jsx(x,{children:e.jsx(m,{className:"text-center py-5",children:e.jsx("p",{style:{color:a.text},children:"No pricing plans available at the moment."})})}):e.jsx(x,{className:"justify-content-center",children:o.map((h,p)=>e.jsx(m,{lg:"3",md:"3",className:"mb-4",children:e.jsx("div",{className:"pricing-card",children:e.jsx(W,{pkg:h,navigate:t,billingPeriod:j,userType:i})})},h._id||p))})]})})]})});k.displayName="PricingPage";export{k as default};
