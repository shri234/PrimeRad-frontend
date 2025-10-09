import React, {
  memo,
  Fragment,
  Suspense,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  Button,
  Nav,
  Navbar,
  Offcanvas,
  Container,
  Dropdown,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../../store/auth/selectors";
import { logout } from "../../store/auth/actions";
import { theme_scheme_direction } from "../../store/setting/actions";
import { createPortal } from "react-dom";
import Logo from "../logo";
import CustomToggle from "../CustomToggle";
import { useTranslation } from "react-i18next";

import "./HeaderDefault.css";
import user from "/assets/images/user/user1.webp";
import { AiFillHome } from "react-icons/ai";
import { RiNewspaperFill } from "react-icons/ri";
import { GiAtlas } from "react-icons/gi";
import { FaUserAstronaut, FaTimes } from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";

const HeaderDefault = memo(() => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef(null);
  const location = useLocation();

  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    if (lng === "ar") {
      dispatch(theme_scheme_direction("rtl"));
    } else {
      dispatch(theme_scheme_direction("ltr"));
    }
  };

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleCloseMobileMenu = () => setShowMobileMenu(false);
  const handleShowMobileMenu = () => setShowMobileMenu(true);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserDropdown]);
  useEffect(() => {
    const handleScroll = () => {
      const headerSticky = document.querySelector(".header-sticky");
      if (headerSticky) {
        if (window.scrollY > 1) {
          headerSticky.classList.add("sticky");
        } else {
          headerSticky.classList.remove("sticky");
        }
      }
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navigationItems = [
    {
      path: "/home",
      icon: <AiFillHome style={{ fontSize: 18 }} />,
      label: "Home",
    },
    {
      path: "/main-page",
      icon: <GiAtlas style={{ fontSize: 18 }} />,
      label: "Content",
    },
    {
      path: "/myspace",
      icon: <FaUserAstronaut style={{ fontSize: 18 }} />,
      label: "My Space",
    },
    {
      path: "/scoreboard",
      icon: <MdLeaderboard style={{ fontSize: 18 }} />,
      label: "Scoreboard",
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    handleCloseMobileMenu();
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        overflow: "hidden",
        right: 0,
        zIndex: 1050,
        height: "70px",
        transition: "all 0.3s ease-in-out",
        willChange: "transform",
      }}
    >
      <Navbar
        expand="lg"
        className="nav navbar-light iq-navbar header-hover-menu py-xl-0"
        style={{
          backgroundColor: "white",
          height: windowWidth < 768 ? "60px" : "75px",

          overflow: "hidden",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Container
          fluid
          className="navbar-inner"
          style={{
            overflow: "hidden !important",
          }}
        >
          <div className="d-flex align-items-center justify-content-between w-100 landing-header">
            <div className="d-flex align-items-center logo-area">
              <div
                style={{
                  transition: "transform 0.3s ease-in-out",
                  transformOrigin: "left center",
                }}
              >
                <Logo />
              </div>
            </div>

            <div className="right-panel d-none d-lg-block">
              <Navbar.Collapse id="navbarSupportedContent">
                <ul
                  className="navbar-nav align-items-center ms-auto mb-2 mb-xl-0 polished-nav"
                  style={{
                    flexWrap: "nowrap",
                    whiteSpace: "nowrap",
                  }}
                >
                  {navigationItems.map((item, index) => (
                    <Nav.Item
                      key={index}
                      className="mx-0 px-0 py-0 polished-nav-item"
                      style={{ flexBasis: "auto", flexShrink: 0 }}
                    >
                      <Nav.Link
                        className={`nav-link text-sm px-1 py-1 ${
                          location.pathname === item.path ||
                          (item.path === "/atlas" &&
                            location.pathname.startsWith("/atlas"))
                            ? "active-link"
                            : ""
                        }`}
                        onClick={() => handleNavigation(item.path)}
                        style={{
                          transition: "all 0.3s ease-in-out",
                          fontSize: "18px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            marginRight: windowWidth < 1200 ? 3 : 6,
                            fontSize: 18,
                            verticalAlign: "middle",
                            transition: "margin-right 0.3s ease-in-out",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {React.cloneElement(item.icon, {
                            style: {
                              fontSize: 18,
                              verticalAlign: "middle",
                            },
                          })}
                        </span>

                        <span
                          style={{
                            fontSize: "14px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.label}
                        </span>
                      </Nav.Link>
                    </Nav.Item>
                  ))}

                  <Nav.Item
                    as="li"
                    className="mx-1 polished-nav"
                    style={{ flexShrink: 0 }}
                  >
                    <Button
                      variant="primary"
                      className="btn-subscribe d-flex align-items-center"
                      onClick={() => navigate("/pricing")}
                      style={{
                        background:
                          "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                        color: "white",
                        fontWeight: "700",
                        borderRadius: "10px",
                        padding: "8px 16px",
                        fontSize: "1rem",
                        border: "none",
                        boxShadow: "0 4px 15px rgba(25, 118, 210, 0.4)",
                        width: "130px",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: "10px",
                        gap: "8px",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 6px 20px rgba(25, 118, 210, 0.5)";
                        e.currentTarget.style.filter = "brightness(1.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 15px rgba(25, 118, 210, 0.4)";
                        e.currentTarget.style.filter = "brightness(1)";
                      }}
                    >
                      <i
                        className="fas fa-star"
                        style={{
                          color: "gold",
                          fontSize: "0.9rem",
                        }}
                      ></i>
                      <span>Subscribe</span>
                    </Button>
                  </Nav.Item>

                  {isAuthenticated ? (
                    <div className="position-relative" ref={userDropdownRef}>
                      <button
                        className="user-icon-button p-0 border-0 bg-transparent d-flex align-items-center"
                        style={{
                          cursor: "pointer",
                          fontSize: windowWidth < 1200 ? "1.2rem" : "1.4rem",
                          gap: "4px",
                        }}
                        onClick={() => setShowUserDropdown(!showUserDropdown)}
                      >
                        <i className="fas fa-user-circle"></i>
                        <i
                          className="fas fa-chevron-down"
                          style={{
                            fontSize: windowWidth < 1200 ? "0.7rem" : "0.8rem",
                            transition: "transform 0.2s ease",
                            transform: showUserDropdown
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          }}
                        ></i>
                      </button>

                      {showUserDropdown &&
                        createPortal(
                          <div
                            className="dropdown-menu show"
                            style={{
                              position: "fixed",
                              top: "60px",
                              right: "20px",
                              zIndex: 10000,
                              minWidth: "200px",
                              backgroundColor: "white",
                              border: "1px solid #dee2e6",
                              borderRadius: "0.375rem",
                              boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
                              padding: "0.5rem 0",
                            }}
                          >
                            <div className="dropdown-item-text">
                              <div className="d-flex align-items-center">
                                <div className="ms-3">
                                  <h6 className="mb-0">{user?.name}</h6>
                                  <p
                                    className="mb-0"
                                    style={{ fontSize: "12px" }}
                                  >
                                    {user?.email}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <hr className="dropdown-divider" />
                            <Dropdown.Item
                              onClick={() => {
                                console.log("Logout clicked");
                                setShowUserDropdown(false);
                                dispatch(logout());
                                navigate("/");
                              }}
                            >
                              Logout
                            </Dropdown.Item>
                          </div>,
                          document.body
                        )}
                    </div>
                  ) : (
                    <Nav.Item
                      as="li"
                      className="mx-1 polished-nav"
                      style={{ flexShrink: 0 }}
                    >
                      <Button
                        variant="primary"
                        onClick={() => navigate("/login")}
                        className="login-btn"
                        style={{
                          transition: "transform 0.3s ease-in-out",
                          fontSize: windowWidth < 1200 ? "12px" : "14px",
                          padding:
                            windowWidth < 1200
                              ? "0.3rem 0.6rem"
                              : "0.375rem 0.75rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span>Login / Sign Up</span>
                      </Button>
                    </Nav.Item>
                  )}
                </ul>
              </Navbar.Collapse>
            </div>

            <div className="d-lg-none">
              {showMobileMenu ? (
                <FaTimes
                  style={{
                    marginRight: "10px",
                    // marginBottom: "20px",
                  }}
                  // className="mobile-menu-toggle"
                  size={18}
                  onClick={handleCloseMobileMenu}
                />
              ) : (
                <Button
                  variant="outline-secondary"
                  onClick={handleShowMobileMenu}
                  className="mobile-menu-toggle"
                  aria-label="Toggle navigation"
                >
                  <i className="fas fa-bars"></i>
                </Button>
              )}
            </div>
          </div>
        </Container>
      </Navbar>

      <Offcanvas
        show={showMobileMenu}
        onHide={handleCloseMobileMenu}
        placement="end"
        className="mobile-nav-offcanvas"
        style={{
          marginTop: "30px",
        }}
      >
        {/* <Offcanvas.Header
          closeButton
          style={{
            marginTop: "40px",
          }}
        >
          {/* <Offcanvas.Title>Main Navigation</Offcanvas.Title> */}
        {/* </Offcanvas.Header>  */}
        <Offcanvas.Body>
          <div className="mobile-nav-container">
            <div className="mobile-nav-items">
              {navigationItems.map((item, index) => (
                <div
                  key={index}
                  className={`mobile-nav-item ${
                    location.pathname === item.path ||
                    (item.path === "/atlas" &&
                      location.pathname.startsWith("/atlas"))
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <div className="mobile-nav-icon">{item.icon}</div>
                  <span className="mobile-nav-label">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="mobile-action-buttons">
              <Button
                variant="primary"
                className="mobile-subscribe-btn w-100 mb-3 text-white"
                onClick={() => {
                  navigate("/pricing");
                  handleCloseMobileMenu();
                }}
              >
                <i
                  className="fas fa-star"
                  style={{ color: "gold", marginRight: 8 }}
                ></i>
                Subscribe
              </Button>

              {isAuthenticated ? (
                <Dropdown className="mobile-user-section">
                  <Dropdown.Toggle
                    variant="link"
                    id="dropdown-basic"
                    className="mobile-user-info"
                  >
                    <i className="fas fa-user-circle mobile-user-avatar"></i>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="sub-drop dropdown-menu-end">
                    <Dropdown.Item>
                      <div className="d-flex align-items-center">
                        <div className="ms-3">
                          <h6 className="mb-0">{user?.name}</h6>
                          <p className="mb-0 font-size-12">{user?.email}</p>
                        </div>
                      </div>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={() => {
                        dispatch(logout());
                        navigate("/");
                      }}
                    >
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Button
                  variant="primary"
                  className="w-100"
                  onClick={() => {
                    navigate("/login");
                    handleCloseMobileMenu();
                  }}
                >
                  Login / Sign Up
                </Button>
              )}
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </header>
  );
});

HeaderDefault.displayName = "HeaderDefault";
export default HeaderDefault;
