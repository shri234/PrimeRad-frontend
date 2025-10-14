import{r as n,j as e}from"./index-f415b1f3.js";const N=n.memo(()=>{const l={facultyImage:"/assets/images/faculty1.jpg",facultyName:"Dr. Sarah Johnson",facultyDescription:"Dr. Sarah Johnson is a board-certified radiologist with over 15 years of experience in diagnostic and interventional radiology. She specializes in advanced cardiac imaging techniques and minimally invasive procedures.",facultySpecializations:["Interventional Radiology","Cardiac Imaging","Musculoskeletal Radiology"],facultyEmail:"sarah.johnson@hospital.edu",facultyPhone:"+1 (555) 123-4567"},{facultyImage:c,facultyName:o,facultyDescription:d,facultySpecializations:m,facultyEmail:h,facultyPhone:x,facultyEducation:u,facultyExperience:f,facultyResearch:p,facultyCertifications:g,facultyPublications:b,facultyAwards:v}=l,[i,j]=n.useState(null),[t,r]=n.useState("education");if(n.useEffect(()=>{j({id:"faculty-001",image:c||"/api/placeholder/400/400",name:o||"Dr. Sarah Johnson",title:"Chief of Radiology",specializations:m||["Interventional Radiology","Cardiac Imaging","Musculoskeletal Radiology"],description:d||"Dr. Sarah Johnson is a board-certified radiologist with over 15 years of experience in diagnostic and interventional radiology. She specializes in advanced cardiac imaging techniques and minimally invasive procedures.",email:h||"sarah.johnson@hospital.edu",phone:x||"+1 (555) 123-4567",education:u||[{degree:"MD - Doctor of Medicine",institution:"Harvard Medical School",year:"2008"},{degree:"Residency in Radiology",institution:"Massachusetts General Hospital",year:"2012"},{degree:"Fellowship in Interventional Radiology",institution:"Johns Hopkins Hospital",year:"2013"}],experience:f||[{position:"Chief of Radiology",institution:"City Medical Center",duration:"2018 - Present"},{position:"Senior Radiologist",institution:"Regional Hospital",duration:"2013 - 2018"}],research:p||["AI-assisted diagnostic imaging","Minimally invasive cardiac interventions","Advanced MRI techniques for neurological disorders"],certifications:g||["American Board of Radiology","Certificate of Added Qualification in Interventional Radiology","Advanced Cardiac Life Support (ACLS)"],publications:b||[{title:"Advanced Techniques in Interventional Cardiology",journal:"Journal of Interventional Radiology",year:"2023"},{title:"AI Applications in Diagnostic Imaging",journal:"Radiology Today",year:"2022"}],awards:v||["Excellence in Patient Care Award - 2023","Outstanding Research in Radiology - 2022","Best Teaching Faculty - 2021"]})},[]),!i)return e.jsx("div",{className:"min-vh-100 d-flex align-items-center justify-content-center",style:{backgroundColor:"#f8f9fa"},children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"spinner-border text-primary mb-3",role:"status",children:e.jsx("span",{className:"visually-hidden",children:"Loading..."})}),e.jsx("p",{className:"text-muted",children:"Loading faculty details..."})]})});const y=`
    .faculty-detail-bg {
      background: linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%);
      min-height: 100vh;
      margin-top: 50px;
    }
    
    .profile-card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.1);
      position: sticky;
      top: 2rem;
    }
    
    .profile-img {
      width: 12rem;
      height: 12rem;
      object-fit: cover;
      border-radius: 50%;
      border: 4px solid #bbdefb;
      box-shadow: 0 0.25rem 0.5rem rgba(0,0,0,0.15);
    }
    
    .specialization-badge {
      background-color: #e3f2fd;
      color: #1976d2;
      border-radius: 1rem;
      padding: 0.25rem 0.75rem;
      font-size: 0.875rem;
      font-weight: 500;
      display: inline-block;
      margin: 0.125rem;
    }
    
    .contact-icon {
      width: 2.5rem;
      height: 2.5rem;
      background-color: #e3f2fd;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .social-icon {
      width: 2.5rem;
      height: 2.5rem;
      background-color: #1976d2;
      color: white;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      transition: background-color 0.2s;
    }
    
    .social-icon:hover {
      background-color: #1565c0;
      color: white;
    }
    
    .content-card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.1);
    }
    
    .nav-tabs-custom {
      background-color: #f8f9fa;
      border-radius: 0.75rem;
      padding: 0.25rem;
      border: none;
    }
    
    .nav-tabs-custom .nav-link {
      border: none;
      border-radius: 0.5rem;
      font-weight: 500;
      color: #6c757d;
      transition: all 0.2s;
      margin: 0 0.125rem;
    }
    
    .nav-tabs-custom .nav-link:hover {
      background-color: #e3f2fd;
      color: #1976d2;
    }
    
    .nav-tabs-custom .nav-link.active {
      background-color: #1976d2;
      color: white;
      box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.15);
    }
    
    .timeline-item {
      border-left: 4px solid #1976d2;
      padding-left: 1.5rem;
      margin-bottom: 1.5rem;
    }
    
    .timeline-item.experience {
      border-left-color: #28a745;
    }
    
    .timeline-item.experience .text-primary {
      color: #28a745 !important;
    }
    
    .research-bullet {
      width: 0.5rem;
      height: 0.5rem;
      background-color: #6f42c1;
      border-radius: 50%;
      display: inline-block;
      margin-right: 0.75rem;
      margin-top: 0.375rem;
      flex-shrink: 0;
    }
    
    .certification-card {
      background-color: #f3e5f5;
      border-radius: 0.5rem;
      padding: 0.75rem;
    }
    
    .certification-card span {
      color: #7b1fa2;
      font-weight: 500;
    }
    
    .publication-card {
      background-color: #f8f9fa;
      border-radius: 0.5rem;
      padding: 1rem;
      margin-bottom: 1rem;
    }
    
    .award-card {
      background-color: #fff8e1;
      border-radius: 0.5rem;
      padding: 1rem;
      margin-bottom: 1rem;
    }
    
    .award-icon {
      width: 2rem;
      height: 2rem;
      background-color: #ffc107;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 1rem;
    }
    
    @media (max-width: 991px) {
      .profile-card {
        position: static;
        margin-bottom: 2rem;
      }
      
      .profile-img {
        width: 8rem;
        height: 8rem;
      }
    }
  `;return e.jsxs(n.Fragment,{children:[e.jsx("style",{children:y}),e.jsx("div",{className:"faculty-detail-bg",children:e.jsx("div",{className:"container-fluid",children:e.jsx("div",{className:"row justify-content-center",children:e.jsx("div",{className:"col-12",style:{maxWidth:"1200px"},children:e.jsx("div",{className:"py-4",children:e.jsxs("div",{className:"row g-4",children:[e.jsx("div",{className:"col-lg-4",children:e.jsxs("div",{className:"profile-card p-4",children:[e.jsx("div",{className:"text-center mb-4",children:e.jsx("img",{src:i.image,alt:`${i.name} photo`,className:"profile-img"})}),e.jsxs("div",{className:"text-center mb-4",children:[e.jsx("h1",{className:"h3 fw-bold text-dark mb-2",children:i.name}),e.jsx("p",{className:"h5 text-primary fw-medium mb-3",children:i.title}),e.jsx("div",{className:"mb-4",children:i.specializations.map((a,s)=>e.jsx("span",{className:"specialization-badge",children:a},s))})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx("h4",{className:"h5 fw-semibold text-dark border-bottom pb-2 mb-3",children:"Contact Information"}),e.jsxs("div",{className:"d-flex align-items-center mb-3",children:[e.jsx("div",{className:"contact-icon me-3",children:e.jsx("svg",{width:"20",height:"20",fill:"#1976d2",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M3 8l7.89 4.05a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",stroke:"#1976d2",strokeWidth:"2",fill:"none",strokeLinecap:"round",strokeLinejoin:"round"})})}),e.jsxs("div",{children:[e.jsx("p",{className:"small text-muted mb-0",children:"Email"}),e.jsx("a",{href:`mailto:${i.email}`,className:"text-primary fw-medium text-decoration-none",children:i.email})]})]}),e.jsxs("div",{className:"d-flex align-items-center mb-3",children:[e.jsx("div",{className:"contact-icon me-3",children:e.jsx("svg",{width:"20",height:"20",fill:"#1976d2",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",stroke:"#1976d2",strokeWidth:"2",fill:"none",strokeLinecap:"round",strokeLinejoin:"round"})})}),e.jsxs("div",{children:[e.jsx("p",{className:"small text-muted mb-0",children:"Phone"}),e.jsx("a",{href:`tel:${i.phone}`,className:"text-primary fw-medium text-decoration-none",children:i.phone})]})]})]}),e.jsx("div",{className:"d-flex justify-content-center gap-3",children:e.jsx("a",{href:"#",className:"social-icon",children:e.jsx("svg",{width:"20",height:"20",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"})})})})]})}),e.jsxs("div",{className:"col-lg-8",children:[e.jsxs("div",{className:"content-card p-4 mb-4",children:[e.jsxs("h5",{className:"h4 fw-bold mb-3",children:["About Dr. ",i.name.split(" ").pop()]}),e.jsx("p",{className:"text-muted lh-lg fs-5",children:i.description})]}),e.jsxs("div",{className:"content-card p-4",children:[e.jsxs("ul",{className:"nav nav-tabs nav-tabs-custom mb-4",role:"tablist",children:[e.jsx("li",{className:"nav-item",role:"presentation",children:e.jsx("button",{className:`nav-link ${t==="education"?"active":""}`,onClick:()=>r("education"),type:"button",children:"Education"})}),e.jsx("li",{className:"nav-item",role:"presentation",children:e.jsx("button",{className:`nav-link ${t==="experience"?"active":""}`,onClick:()=>r("experience"),type:"button",children:"Experience"})}),e.jsx("li",{className:"nav-item",role:"presentation",children:e.jsx("button",{className:`nav-link ${t==="research"?"active":""}`,onClick:()=>r("research"),type:"button",children:"Research"})}),e.jsx("li",{className:"nav-item",role:"presentation",children:e.jsx("button",{className:`nav-link ${t==="publications"?"active":""}`,onClick:()=>r("publications"),type:"button",children:"Publications"})}),e.jsx("li",{className:"nav-item",role:"presentation",children:e.jsx("button",{className:`nav-link ${t==="awards"?"active":""}`,onClick:()=>r("awards"),type:"button",children:"Awards"})})]}),e.jsxs("div",{className:"tab-content",style:{minHeight:"300px"},children:[t==="education"&&e.jsxs("div",{className:"tab-pane fade show active",children:[e.jsx("h4",{className:"h5 fw-semibold text-dark mb-4",children:"Educational Background"}),i.education.map((a,s)=>e.jsxs("div",{className:"timeline-item",children:[e.jsx("h5",{className:"h6 fw-semibold text-dark",children:a.degree}),e.jsx("p",{className:"text-primary fw-medium",children:a.institution}),e.jsx("p",{className:"text-muted",children:a.year})]},s))]}),t==="experience"&&e.jsxs("div",{className:"tab-pane fade show active",children:[e.jsx("h4",{className:"h5 fw-semibold text-dark mb-4",children:"Professional Experience"}),i.experience.map((a,s)=>e.jsxs("div",{className:"timeline-item experience",children:[e.jsx("h5",{className:"h6 fw-semibold text-dark",children:a.position}),e.jsx("p",{className:"text-primary fw-medium",children:a.institution}),e.jsx("p",{className:"text-muted",children:a.duration})]},s))]}),t==="research"&&e.jsxs("div",{className:"tab-pane fade show active",children:[e.jsx("h4",{className:"h5 fw-semibold text-dark mb-4",children:"Research Interests"}),e.jsx("ul",{className:"list-unstyled",children:i.research.map((a,s)=>e.jsxs("li",{className:"d-flex align-items-start mb-3",children:[e.jsx("span",{className:"research-bullet"}),e.jsx("span",{className:"text-muted",children:a})]},s))}),e.jsxs("div",{className:"mt-5",children:[e.jsx("h5",{className:"h6 fw-semibold text-dark mb-3",children:"Certifications"}),e.jsx("div",{className:"row g-3",children:i.certifications.map((a,s)=>e.jsx("div",{className:"col-md-6",children:e.jsx("div",{className:"certification-card",children:e.jsx("span",{children:a})})},s))})]})]}),t==="publications"&&e.jsxs("div",{className:"tab-pane fade show active",children:[e.jsx("h4",{className:"h5 fw-semibold text-dark mb-4",children:"Recent Publications"}),i.publications.map((a,s)=>e.jsxs("div",{className:"publication-card",children:[e.jsx("h5",{className:"h6 fw-semibold text-dark mb-2",children:a.title}),e.jsx("p",{className:"text-primary fw-medium mb-1",children:a.journal}),e.jsx("p",{className:"text-muted small",children:a.year})]},s))]}),t==="awards"&&e.jsxs("div",{className:"tab-pane fade show active",children:[e.jsx("h4",{className:"h5 fw-semibold text-dark mb-4",children:"Awards & Recognition"}),i.awards.map((a,s)=>e.jsxs("div",{className:"award-card d-flex align-items-center",children:[e.jsx("div",{className:"award-icon",children:e.jsx("svg",{width:"16",height:"16",fill:"white",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"})})}),e.jsx("span",{className:"text-dark fw-medium",children:a})]},s))]})]})]})]})]})})})})})})]})});N.displayName="FacultyDetailPage";export{N as default};
