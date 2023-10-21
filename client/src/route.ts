import Home from './components/Home';
import About from './components/About';
import Detail from './components/Detail';
import NotFound from './components/NotFound';

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
