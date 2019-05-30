import Dashboard from "views/Dashboard/Dashboard.jsx";
import Notifications from "views/Notifications/Notifications.jsx";
import Icons from "views/Icons/Icons.jsx";
import Typography from "views/Typography/Typography.jsx";
import TableList from "views/TableList/TableList.jsx";
import Maps from "views/Maps/Maps.jsx";
import UserPage from "views/UserPage/UserPage.jsx";

import MetamaskLoggedOut from "views/MetamaskLoggedOut/MetamaskLoggedOut.jsx"
import RootPainel from "views/RootPainel/RootPainel.jsx"
import AdministratorPainel from "views/AdministratorPainel/AdministratorPainel.jsx";
import SignCertificate from "views/SignCertificate/SignCertificate.jsx";
import QueryCertificate from "views/QueryCertificate/QueryCertificate.jsx";


var dashRoutes = [
  {
    root: true,
    path: "/root",
    name: "Painel do Root",
    icon: "nc-icon nc-laptop",
    component: RootPainel
  },
  {
    administrador: true,
    path: "/administrador",
    name: "Painel do ADM",
    icon: "nc-icon nc-laptop",
    component: AdministratorPainel
  },
  {
    autorizado: true,
    path: "/assinar-certificado",
    name: "Assinar Certificado",
    icon: "nc-icon nc-touch-id",
    component: SignCertificate
  },
  {
    path: "/consulta",
    name: "Consultar Certificado",
    icon: "nc-icon nc-key-25",
    component: QueryCertificate
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: Dashboard
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "nc-icon nc-diamond",
    component: Icons
  },
  { path: "/maps", name: "Maps", icon: "nc-icon nc-pin-3", component: Maps },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "nc-icon nc-bell-55",
    component: Notifications
  },
  {
    path: "/user-page",
    name: "User Profile",
    icon: "nc-icon nc-single-02",
    component: UserPage
  },
  {
    path: "/tables",
    name: "Table List",
    icon: "nc-icon nc-tile-56",
    component: TableList
  },
  {
    hidden: true,
    path: "/metamaskloggedout",
    name: "Metamask deslogado",
    component: MetamaskLoggedOut
  },
  {
    path: "/typography",
    name: "Typography",
    icon: "nc-icon nc-caps-small",
    component: Typography
  },
  {
    pro: true,
    path: "/upgrade",
    name: "Upgrade to PRO",
    icon: "nc-icon nc-spaceship"
  },
  { redirect: true, path: "/", pathTo: "/dashboard", name: "Dashboard" }
];
export default dashRoutes;
