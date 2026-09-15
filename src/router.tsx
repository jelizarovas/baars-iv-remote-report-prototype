import { createRootRoute, createRoute, createRouter, useLocation, useNavigate } from '@tanstack/react-router';
import App from './App';

function RoutedApp() {
  const location = useLocation();
  const navigate = useNavigate();
  return <App routePath={location.pathname} navigateRoute={(to, replace) => { void navigate({ to, replace }); }}/>;
}

const rootRoute = createRootRoute({ component: RoutedApp });
const routes = [
  createRoute({ getParentRoute: () => rootRoute, path: '/' }),
  createRoute({ getParentRoute: () => rootRoute, path: '/start' }),
  createRoute({ getParentRoute: () => rootRoute, path: '/invite' }),
  createRoute({ getParentRoute: () => rootRoute, path: '/questionnaire' }),
  createRoute({ getParentRoute: () => rootRoute, path: '/review' }),
  createRoute({ getParentRoute: () => rootRoute, path: '/respond/$payload' }),
];

const basepath = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';
const routeTree = rootRoute.addChildren(routes);
export const router = createRouter({ routeTree, basepath, scrollRestoration: true });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
