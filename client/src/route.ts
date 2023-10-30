import Home from './pages/Content/Home/Home'
import About from './pages/Content/About';
import Detail from './pages/Content/Detail';
import NotFound from './pages/Content/NotFound';

import Login from './pages/AuthForm/Login';

// ルート情報の型を定義
interface RouteType{
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  name: string;
}

// ルート情報を配列として管理
const routes: RouteType[] = [
  {
    path: '/',
    component: Home,
    exact: true,
    name: 'Home'
  },
  {
    path: '/login',
    component: Login,
    exact: true,
    name: 'Login'
  },
  {
    path: '/about',
    component: About,
    name: 'About'
  },
  {
    path: '/detail',
    component: Detail,
    name: 'Detail'
  },
  {
    path: '/*',
    component: NotFound,
    name: 'NotFound'
  }
];

export default routes;
