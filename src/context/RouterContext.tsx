import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface RouteInfo {
  path: string;
  params: Record<string, string>;
  search: string;
}

interface RouterContextType {
  currentPath: string;
  routeParams: Record<string, string>;
  navigate: (to: string) => void;
  matchesRoute: (pattern: string) => boolean;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string) => {
    if (window.location.pathname !== to) {
      window.history.pushState({}, '', to);
      setCurrentPath(to);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Simple pattern matching for /events/:slug, /register/:slug, /registration-success/:id, etc.
  const extractParams = (pattern: string, path: string): Record<string, string> | null => {
    const patternParts = pattern.split('/').filter(Boolean);
    const pathParts = path.split('/').filter(Boolean);

    if (patternParts.length !== pathParts.length) return null;

    const params: Record<string, string> = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        const paramName = patternParts[i].slice(1);
        params[paramName] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }
    return params;
  };

  const matchesRoute = useCallback((pattern: string) => {
    if (pattern === currentPath) return true;
    return extractParams(pattern, currentPath) !== null;
  }, [currentPath]);

  // Derive active route params
  let routeParams: Record<string, string> = {};
  const patternsToCheck = [
    '/events/:slug',
    '/register/:slug',
    '/registration-success/:registrationId',
    '/admin/registrations/:id'
  ];

  for (const pat of patternsToCheck) {
    const match = extractParams(pat, currentPath);
    if (match) {
      routeParams = match;
      break;
    }
  }

  return (
    <RouterContext.Provider value={{ currentPath, routeParams, navigate, matchesRoute }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
