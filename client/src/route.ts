import Home from "./pages/Content/Home/Home";
import SearchHome from "./pages/Content/Home/SearchHome";
import SearchTypeHome from "./pages/Content/Home/SearchTypeHome";
import SearchCategoryHome from "./pages/Content/Home/SearchCategoryHome";
import Favorite from "./pages/Content/Home/Favorite";
import AdminHome from "./pages/Admin/AdminHome/AdminHome";
import AdminImage from "./pages/Admin/AdminImage/AdminImage";
import AdminType from "./pages/Admin/AdminType/AdminType";
import AdminCategory from "./pages/Admin/AdminCategory/AdminCategory";
import NotFound from "./pages/Content/NotFound";

import Login from "./pages/Login/Login";
import ImageDetail from "./pages/Content/ImageDetail/ImageDetail";

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
    name: "Home",
  },
  {
    path: "/:title",
    component: ImageDetail,
    name: "ImageDetail",
  },
  {
    path: "/search",
    component: SearchHome,
    name: "SearchHome",
  },
  {
    path: "/search/type/:name",
    component: SearchTypeHome,
    name: "SearchHome",
  },
  {
    path: "/search/category/:name",
    component: SearchCategoryHome,
    name: "SearchHome",
  },
  {
    path: "/login",
    component: Login,
    name: "Login",
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
