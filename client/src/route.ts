import Home from "./pages/Content/Home/Home";
import About from "./pages/Content/About";
import Favorite from "./pages/Content/Home/Favorite";
import AdminHome from "./pages/Admin/AdminHome/AdminHome";
import AdminImage from "./pages/Admin/AdminImage/AdminImage";
import AdminType from "./pages/Admin/AdminType/AdminType";
import AdminCategory from "./pages/Admin/AdminCategory/AdminCategory";
import NotFound from "./pages/Content/NotFound";

import Login from "./pages/Login/Login";

// ルート情報の型を定義
interface RouteType {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  name: string;
}

// ルート情報を配列として管理
const routes: RouteType[] = [
  {
    path: "/",
    component: Home,
    exact: true,
    name: "Home",
  },
  {
    path: "/login",
    component: Login,
    exact: true,
    name: "Login",
  },
  {
    path: "/about",
    component: About,
    name: "About",
  },
  {
    path: "/favorite",
    component: Favorite,
    name: "Favorite",
  },
  {
    path: "/admin",
    component: AdminHome,
    name: "AdminHome",
  },
  {
    path: "/admin/image",
    component: AdminImage,
    name: "AdminImage",
  },
  {
    path: "/admin/type",
    component: AdminType,
    name: "AdminType",
  },
  {
    path: "/admin/category",
    component: AdminCategory,
    name: "AdminCategory",
  },
  {
    path: "/*",
    component: NotFound,
    name: "NotFound",
  },
];

export default routes;
