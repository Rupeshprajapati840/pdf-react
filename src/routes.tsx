import { FC } from "react"; 
import PDFEditor from './components/PDFEditor';
import PDFUserViewer from "./components/PDFUserViewer";

interface Route {
  key: string;
  title: string;
  path: string;
  enabled: boolean;
  component: FC<{}>;
}

export const routes: Array<Route> = [
  {
    key: "home",
    title: "Home",
    path: "/",
    enabled: true,
    component: PDFEditor,
  },
  {
    key: "about",
    title: "About",
    path: "/about",
    enabled: true,
    component: PDFEditor,
  },
  {
    key: "services",
    title: "Services",
    path: "/services",
    enabled: true,
    component: PDFEditor,
  },
  {
    key: "contact",
    title: "Contact",
    path: "/contact",
    enabled: true,
    component: PDFEditor,
  },
  {
    key: "settings",
    title: "Settings",
    path: "/settings",
    enabled: true,
    component: PDFEditor,
  },
  {
    key: "profile",
    title: "Profile",
    path: "/profile",
    enabled: true,
    component: PDFEditor,
  },

  {
    key: "viewer",
    title: "Viewer",
    path: "/viewer",
    enabled: true,
    component: PDFUserViewer,
  }, 
]; 