import React, { Fragment, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Home,
  ChevronRight,
  PlayArrow,
  Book,
  Person,
  Settings,
  School,
  Science,
  VideoCall,
  Assignment,
  EmojiEvents,
  AccountCircle,
  Map,
  MenuBook,
  Description,
  Store,
  ShoppingCart,
  CreditCard,
  Info,
  Email,
  HelpOutline,
  Policy,
  Gavel,
  Login,
  AppRegistration,
  VpnKey,
  TrendingUp,
  Schedule,
  Biotech,
  PersonOutline,
  Security,
  AccessTime,
  Error
} from "@mui/icons-material";

const MobileBreadcrumb = ({ 
  customBreadcrumbs = null,
  className = "",
  showOnDesktop = false,
  hideHome = false
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Route configuration with MUI icons
  const routeConfig = {
    '/': { label: 'Home', icon: <Home className="breadcrumb-icon" />, parent: null },
    '/home': { label: 'Home', icon: <Home className="breadcrumb-icon" />, parent: null },
    '/main-page': { label: 'Dashboard', icon: <Home className="breadcrumb-icon" />, parent: null },
    
    '/lecture-detail': { 
      label: 'Lecture', 
      icon: <PlayArrow className="breadcrumb-icon" />, 
      parent: '/main-page',
      getDynamicLabel: (state) => state?.title || 'Lecture'
    },
    '/case/:caseId': { 
      label: 'Case Study', 
      icon: <Science className="breadcrumb-icon" />, 
      parent: '/atlas',
      getDynamicLabel: (state) => state?.title || 'Case Study'
    },
    '/live/:caseId': { 
      label: 'Live Session', 
      icon: <VideoCall className="breadcrumb-icon" />, 
      parent: '/main-page',
      getDynamicLabel: (state) => state?.title || 'Live Session'
    },
    
    '/atlas': { label: 'Atlas', icon: <Map className="breadcrumb-icon" />, parent: '/main-page' },
    '/atlas/:moduleName': { 
      label: 'Module', 
      icon: <MenuBook className="breadcrumb-icon" />, 
      parent: '/atlas',
      getDynamicLabel: (state) => state?.moduleName || state?.module || 'Module'
    },
    
    '/assessment': { label: 'Assessment', icon: <Assignment className="breadcrumb-icon" />, parent: '/main-page' },
    '/assessment/:moduleName/practice': { 
      label: 'Practice', 
      icon: <Biotech className="breadcrumb-icon" />, 
      parent: '/assessment',
      getDynamicLabel: (state, params) => `${params?.moduleName || 'Module'} Practice`
    },
    
    '/scoreboard': { label: 'Scoreboard', icon: <EmojiEvents className="breadcrumb-icon" />, parent: '/main-page' },
    '/myspace': { label: 'My Space', icon: <AccountCircle className="breadcrumb-icon" />, parent: '/main-page' },
    
    '/faculty': { label: 'Faculty', icon: <PersonOutline className="breadcrumb-icon" />, parent: '/main-page' },
    '/faculty-detail': { 
      label: 'Faculty Details', 
      icon: <Person className="breadcrumb-icon" />, 
      parent: '/faculty',
      getDynamicLabel: (state) => state?.name || 'Faculty Details'
    },
    
    '/view-all': { label: 'View All', icon: <Description className="breadcrumb-icon" />, parent: '/main-page' },
    '/trending-view-all': { label: 'Trending', icon: <TrendingUp className="breadcrumb-icon" />, parent: '/view-all' },
    '/recent-items-view-all': { label: 'Recent Items', icon: <Schedule className="breadcrumb-icon" />, parent: '/view-all' },
    '/recommended-cases-view-all': { label: 'Recommended Cases', icon: <Science className="breadcrumb-icon" />, parent: '/view-all' },
    '/upcoming-live-programs-view-all': { label: 'Live Programs', icon: <VideoCall className="breadcrumb-icon" />, parent: '/view-all' },
    '/recommended-lectures-view-all': { label: 'Recommended Lectures', icon: <PlayArrow className="breadcrumb-icon" />, parent: '/view-all' },
    
    '/merchandise-store': { label: 'Store', icon: <Store className="breadcrumb-icon" />, parent: '/main-page' },
    '/cart': { label: 'Cart', icon: <ShoppingCart className="breadcrumb-icon" />, parent: '/merchandise-store' },
    '/checkout': { label: 'Checkout', icon: <CreditCard className="breadcrumb-icon" />, parent: '/cart' },
    '/account': { label: 'Account', icon: <AccountCircle className="breadcrumb-icon" />, parent: '/main-page' },
    '/payment': { label: 'Payment', icon: <CreditCard className="breadcrumb-icon" />, parent: '/checkout' },
    
    '/pricing': { label: 'Pricing', icon: <CreditCard className="breadcrumb-icon" />, parent: '/main-page' },
    '/restricted-content': { label: 'Premium Content', icon: <Security className="breadcrumb-icon" />, parent: '/pricing' },
    
    '/about-us': { label: 'About Us', icon: <Info className="breadcrumb-icon" />, parent: '/main-page' },
    '/contact-us': { label: 'Contact Us', icon: <Email className="breadcrumb-icon" />, parent: '/about-us' },
    '/faq': { label: 'FAQ', icon: <HelpOutline className="breadcrumb-icon" />, parent: '/about-us' },
    '/PrivacyPolicy': { label: 'Privacy Policy', icon: <Policy className="breadcrumb-icon" />, parent: '/about-us' },
    '/terms-of-use': { label: 'Terms of Use', icon: <Gavel className="breadcrumb-icon" />, parent: '/about-us' },
    
    '/login': { label: 'Login', icon: <Login className="breadcrumb-icon" />, parent: null },
    '/register': { label: 'Register', icon: <AppRegistration className="breadcrumb-icon" />, parent: null },
    '/lost-password': { label: 'Reset Password', icon: <VpnKey className="breadcrumb-icon" />, parent: '/login' },
    
    '/coming-soon': { label: 'Coming Soon', icon: <AccessTime className="breadcrumb-icon" />, parent: null },
    '/error-page-one': { label: 'Error', icon: <Error className="breadcrumb-icon" />, parent: null },
    '/error-page-two': { label: 'Error', icon: <Error className="breadcrumb-icon" />, parent: null },
  };

  // Generate breadcrumbs from location state
  const generateBreadcrumbsFromState = (state) => {
    const { module, submodule, contentType, title } = state;
    const items = [];

    if (!hideHome) {
      items.push({
        label: 'Dashboard',
        path: '/main-page',
        icon: <Home className="breadcrumb-icon" />
      });
    }

    if (module || submodule) {
      items.push({
        label: 'Atlas',
        path: '/atlas',
        icon: <Map className="breadcrumb-icon" />
      });
    }

    if (module && module !== "General") {
      items.push({
        label: module,
        path: `/atlas/${encodeURIComponent(module)}`,
        icon: <MenuBook className="breadcrumb-icon" />
      });
    }

    if (submodule && submodule !== "General" && submodule !== module) {
      items.push({
        label: submodule,
        path: `/atlas/${encodeURIComponent(module)}`,
        state: { module, submodule },
        icon: <Description className="breadcrumb-icon" />
      });
    }

    return {
      breadcrumbItems: items,
      currentPage: title || getCurrentPageFromRoute(location.pathname),
      currentPageIcon: getIconForContentType(contentType)
    };
  };

  // Generate breadcrumbs from route
  const generateBreadcrumbsFromRoute = (pathname) => {
    const items = [];
    let currentPath = pathname;
    const visited = new Set();

    while (currentPath && !visited.has(currentPath)) {
      visited.add(currentPath);
      
      let routeInfo = routeConfig[currentPath];
      let matchedRoute = currentPath;
      let params = {};
      
      if (!routeInfo) {
        const matchingRoute = Object.keys(routeConfig).find(route => {
          if (route.includes(':')) {
            const pattern = route.replace(/:[^/]+/g, '[^/]+');
            const regex = new RegExp(`^${pattern}$`);
            if (regex.test(currentPath)) {
              params = extractParams(currentPath, route);
              return true;
            }
          }
          return false;
        });
        
        if (matchingRoute) {
          routeInfo = routeConfig[matchingRoute];
          matchedRoute = matchingRoute;
        }
      }

      if (routeInfo) {
        const label = routeInfo.getDynamicLabel 
          ? routeInfo.getDynamicLabel(location.state, params)
          : routeInfo.label;

        items.unshift({
          label,
          path: currentPath,
          icon: routeInfo.icon,
          originalRoute: matchedRoute
        });
        currentPath = routeInfo.parent;
      } else {
        break;
      }
    }

    const breadcrumbItems = items.slice(0, -1);
    const currentPageInfo = items[items.length - 1];

    return {
      breadcrumbItems: hideHome ? breadcrumbItems.filter(item => item.label !== 'Dashboard' && item.label !== 'Home') : breadcrumbItems,
      currentPage: currentPageInfo?.label || getCurrentPageFromRoute(pathname),
      currentPageIcon: currentPageInfo?.icon || <Description className="breadcrumb-icon" />
    };
  };

  const extractParams = (pathname, routePattern) => {
    const patternParts = routePattern.split('/');
    const pathParts = pathname.split('/');
    const params = {};
    
    patternParts.forEach((part, index) => {
      if (part.startsWith(':')) {
        const paramName = part.slice(1);
        params[paramName] = pathParts[index];
      }
    });
    
    return params;
  };

  const getCurrentPageFromRoute = (pathname) => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return 'Home';
    
    const lastSegment = segments[segments.length - 1];
    return lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getIconForContentType = (contentType) => {
    const iconMap = {
      'lecture': <PlayArrow className="breadcrumb-icon" />,
      'video': <VideoCall className="breadcrumb-icon" />,
      'case': <Science className="breadcrumb-icon" />,
      'live': <VideoCall className="breadcrumb-icon" />,
      'course': <Book className="breadcrumb-icon" />,
      'assessment': <Assignment className="breadcrumb-icon" />,
    };
    
    return iconMap[contentType?.toLowerCase()] || <Description className="breadcrumb-icon" />;
  };

  const handleNavigation = (path, state = null) => {
    if (path && typeof path === 'function') {
      path();
    } else if (path) {
      navigate(path, state ? { state } : undefined);
    }
  };

  const pageInfo = useMemo(() => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    if (location.state) {
      const { title, module, contentType, breadcrumb } = location.state;
      
      if (breadcrumb) {
        return breadcrumb;
      }
      
      if (title || module || contentType) {
        return generateBreadcrumbsFromState(location.state);
      }
    }

    return generateBreadcrumbsFromRoute(location.pathname);
  }, [location.pathname, location.state, customBreadcrumbs, hideHome]);

  const { breadcrumbItems = [], currentPage = '', currentPageIcon = null } = 
    typeof pageInfo === 'object' && 'breadcrumbItems' in pageInfo 
      ? pageInfo 
      : { breadcrumbItems: pageInfo || [], currentPage: '', currentPageIcon: null };

  if (!breadcrumbItems?.length && !currentPage) {
    return null;
  }

  return (
    <div className={`mobile-breadcrumb ${!showOnDesktop ? 'd-lg-none' : ''} ${className}`}>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb-list">
          {breadcrumbItems.map((item, index) => (
            <Fragment key={`breadcrumb-${index}`}>
              <li className="breadcrumb-item">
                {item.icon && item.icon}
                <button
                  className="breadcrumb-link"
                  onClick={() => handleNavigation(item.path, item.state)}
                  style={{ background: 'none', border: 'none', padding: 0 }}
                  disabled={item.disabled}
                  title={item.tooltip || item.label}
                >
                  {t(item.label)}
                </button>
              </li>
              <li className="breadcrumb-separator">
                <ChevronRight className="breadcrumb-chevron" />
              </li>
            </Fragment>
          ))}
          
          {currentPage && (
            <li className="breadcrumb-item">
              {currentPageIcon && currentPageIcon}
              <span 
                className="breadcrumb-current" 
                title={currentPage}
              >
                {t(currentPage)}
              </span>
            </li>
          )}
        </ol>
      </nav>
    </div>
  );
};

export default MobileBreadcrumb;
