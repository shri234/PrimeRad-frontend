import { Fragment, memo, useEffect, useState } from "react";

const FacultyDetailPage = memo(() => {
  // Mock location state - in real app this would come from navigation
  const mockLocationState = {
    facultyImage: "/assets/images/faculty1.jpg",
    facultyName: "Dr. Sarah Johnson",
    facultyDescription:
      "Dr. Sarah Johnson is a board-certified radiologist with over 15 years of experience in diagnostic and interventional radiology. She specializes in advanced cardiac imaging techniques and minimally invasive procedures.",
    facultySpecializations: [
      "Interventional Radiology",
      "Cardiac Imaging",
      "Musculoskeletal Radiology",
    ],
    facultyEmail: "sarah.johnson@hospital.edu",
    facultyPhone: "+1 (555) 123-4567",
  };

  const {
    facultyImage,
    facultyName,
    facultyDescription,
    facultySpecializations,
    facultyEmail,
    facultyPhone,
    facultyEducation,
    facultyExperience,
    facultyResearch,
    facultyCertifications,
    facultyPublications,
    facultyAwards,
  } = mockLocationState;

  const [faculty, setFaculty] = useState(null);
  const [activeTab, setActiveTab] = useState("education");

  useEffect(() => {
    const defaultFaculty = {
      id: "faculty-001",
      image: facultyImage || "/api/placeholder/400/400",
      name: facultyName || "Dr. Sarah Johnson",
      title: "Chief of Radiology",
      specializations: facultySpecializations || [
        "Interventional Radiology",
        "Cardiac Imaging",
        "Musculoskeletal Radiology",
      ],
      description:
        facultyDescription ||
        "Dr. Sarah Johnson is a board-certified radiologist with over 15 years of experience in diagnostic and interventional radiology. She specializes in advanced cardiac imaging techniques and minimally invasive procedures.",
      email: facultyEmail || "sarah.johnson@hospital.edu",
      phone: facultyPhone || "+1 (555) 123-4567",
      education: facultyEducation || [
        {
          degree: "MD - Doctor of Medicine",
          institution: "Harvard Medical School",
          year: "2008",
        },
        {
          degree: "Residency in Radiology",
          institution: "Massachusetts General Hospital",
          year: "2012",
        },
        {
          degree: "Fellowship in Interventional Radiology",
          institution: "Johns Hopkins Hospital",
          year: "2013",
        },
      ],
      experience: facultyExperience || [
        {
          position: "Chief of Radiology",
          institution: "City Medical Center",
          duration: "2018 - Present",
        },
        {
          position: "Senior Radiologist",
          institution: "Regional Hospital",
          duration: "2013 - 2018",
        },
      ],
      research: facultyResearch || [
        "AI-assisted diagnostic imaging",
        "Minimally invasive cardiac interventions",
        "Advanced MRI techniques for neurological disorders",
      ],
      certifications: facultyCertifications || [
        "American Board of Radiology",
        "Certificate of Added Qualification in Interventional Radiology",
        "Advanced Cardiac Life Support (ACLS)",
      ],
      publications: facultyPublications || [
        {
          title: "Advanced Techniques in Interventional Cardiology",
          journal: "Journal of Interventional Radiology",
          year: "2023",
        },
        {
          title: "AI Applications in Diagnostic Imaging",
          journal: "Radiology Today",
          year: "2022",
        },
      ],
      awards: facultyAwards || [
        "Excellence in Patient Care Award - 2023",
        "Outstanding Research in Radiology - 2022",
        "Best Teaching Faculty - 2021",
      ],
    };

    setFaculty(defaultFaculty);
  }, []);

  if (!faculty) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading faculty details...</p>
        </div>
      </div>
    );
  }

  const customStyles = `
    .faculty-detail-bg {
      background: linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%);
      min-height: 100vh;
      margin-top: 80px;
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
  `;

  return (
    <Fragment>
      <style>{customStyles}</style>

      <div className="faculty-detail-bg">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12" style={{ maxWidth: "1200px" }}>
              <div className="py-4">
                <div className="row g-4">
                  {/* Left Column - Faculty Profile */}
                  <div className="col-lg-4">
                    <div className="profile-card p-4">
                      {/* Profile Image */}
                      <div className="text-center mb-4">
                        <img
                          src={faculty.image}
                          alt={`${faculty.name} photo`}
                          className="profile-img"
                        />
                      </div>

                      {/* Basic Info */}
                      <div className="text-center mb-4">
                        <h1 className="h3 fw-bold text-dark mb-2">
                          {faculty.name}
                        </h1>
                        <p className="h5 text-primary fw-medium mb-3">
                          {faculty.title}
                        </p>

                        {/* Specializations */}
                        <div className="mb-4">
                          {faculty.specializations.map((spec, index) => (
                            <span key={index} className="specialization-badge">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="mb-4">
                        <h4 className="h5 fw-semibold text-dark border-bottom pb-2 mb-3">
                          Contact Information
                        </h4>

                        <div className="d-flex align-items-center mb-3">
                          <div className="contact-icon me-3">
                            <svg
                              width="20"
                              height="20"
                              fill="#1976d2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M3 8l7.89 4.05a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                stroke="#1976d2"
                                strokeWidth="2"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="small text-muted mb-0">Email</p>
                            <a
                              href={`mailto:${faculty.email}`}
                              className="text-primary fw-medium text-decoration-none"
                            >
                              {faculty.email}
                            </a>
                          </div>
                        </div>

                        <div className="d-flex align-items-center mb-3">
                          <div className="contact-icon me-3">
                            <svg
                              width="20"
                              height="20"
                              fill="#1976d2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                stroke="#1976d2"
                                strokeWidth="2"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="small text-muted mb-0">Phone</p>
                            <a
                              href={`tel:${faculty.phone}`}
                              className="text-primary fw-medium text-decoration-none"
                            >
                              {faculty.phone}
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Social Links */}
                      <div className="d-flex justify-content-center gap-3">
                        <a href="#" className="social-icon">
                          <svg
                            width="20"
                            height="20"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                          </svg>
                        </a>
                        <a href="#" className="social-icon">
                          <svg
                            width="20"
                            height="20"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Detailed Information */}
                  <div className="col-lg-8">
                    {/* About Section */}
                    <div className="content-card p-4 mb-4">
                      <h2 className="h3 fw-bold text-dark mb-3">
                        About Dr. {faculty.name.split(" ").pop()}
                      </h2>
                      <p className="text-muted lh-lg fs-5">
                        {faculty.description}
                      </p>
                    </div>

                    {/* Tabbed Content */}
                    <div className="content-card p-4">
                      {/* Tab Navigation */}
                      <ul
                        className="nav nav-tabs nav-tabs-custom mb-4"
                        role="tablist"
                      >
                        <li className="nav-item" role="presentation">
                          <button
                            className={`nav-link ${
                              activeTab === "education" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("education")}
                            type="button"
                          >
                            Education
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className={`nav-link ${
                              activeTab === "experience" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("experience")}
                            type="button"
                          >
                            Experience
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className={`nav-link ${
                              activeTab === "research" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("research")}
                            type="button"
                          >
                            Research
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className={`nav-link ${
                              activeTab === "publications" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("publications")}
                            type="button"
                          >
                            Publications
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className={`nav-link ${
                              activeTab === "awards" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("awards")}
                            type="button"
                          >
                            Awards
                          </button>
                        </li>
                      </ul>

                      {/* Tab Content */}
                      <div
                        className="tab-content"
                        style={{ minHeight: "300px" }}
                      >
                        {activeTab === "education" && (
                          <div className="tab-pane fade show active">
                            <h4 className="h5 fw-semibold text-dark mb-4">
                              Educational Background
                            </h4>
                            {faculty.education.map((edu, index) => (
                              <div key={index} className="timeline-item">
                                <h5 className="h6 fw-semibold text-dark">
                                  {edu.degree}
                                </h5>
                                <p className="text-primary fw-medium">
                                  {edu.institution}
                                </p>
                                <p className="text-muted">{edu.year}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {activeTab === "experience" && (
                          <div className="tab-pane fade show active">
                            <h4 className="h5 fw-semibold text-dark mb-4">
                              Professional Experience
                            </h4>
                            {faculty.experience.map((exp, index) => (
                              <div
                                key={index}
                                className="timeline-item experience"
                              >
                                <h5 className="h6 fw-semibold text-dark">
                                  {exp.position}
                                </h5>
                                <p className="text-primary fw-medium">
                                  {exp.institution}
                                </p>
                                <p className="text-muted">{exp.duration}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {activeTab === "research" && (
                          <div className="tab-pane fade show active">
                            <h4 className="h5 fw-semibold text-dark mb-4">
                              Research Interests
                            </h4>
                            <ul className="list-unstyled">
                              {faculty.research.map((research, index) => (
                                <li
                                  key={index}
                                  className="d-flex align-items-start mb-3"
                                >
                                  <span className="research-bullet"></span>
                                  <span className="text-muted">{research}</span>
                                </li>
                              ))}
                            </ul>

                            <div className="mt-5">
                              <h5 className="h6 fw-semibold text-dark mb-3">
                                Certifications
                              </h5>
                              <div className="row g-3">
                                {faculty.certifications.map((cert, index) => (
                                  <div key={index} className="col-md-6">
                                    <div className="certification-card">
                                      <span>{cert}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {activeTab === "publications" && (
                          <div className="tab-pane fade show active">
                            <h4 className="h5 fw-semibold text-dark mb-4">
                              Recent Publications
                            </h4>
                            {faculty.publications.map((pub, index) => (
                              <div key={index} className="publication-card">
                                <h5 className="h6 fw-semibold text-dark mb-2">
                                  {pub.title}
                                </h5>
                                <p className="text-primary fw-medium mb-1">
                                  {pub.journal}
                                </p>
                                <p className="text-muted small">{pub.year}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {activeTab === "awards" && (
                          <div className="tab-pane fade show active">
                            <h4 className="h5 fw-semibold text-dark mb-4">
                              Awards & Recognition
                            </h4>
                            {faculty.awards.map((award, index) => (
                              <div
                                key={index}
                                className="award-card d-flex align-items-center"
                              >
                                <div className="award-icon">
                                  <svg
                                    width="16"
                                    height="16"
                                    fill="white"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                  </svg>
                                </div>
                                <span className="text-dark fw-medium">
                                  {award}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
});

FacultyDetailPage.displayName = "FacultyDetailPage";
export default FacultyDetailPage;
