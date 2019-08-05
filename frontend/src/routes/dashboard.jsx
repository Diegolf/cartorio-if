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
import AddCertificate from "views/addCertificate/addCertificate.jsx";
import AddCertificateLogin from "views/addCertificateLogin/addCertificateLogin.jsx";


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
    hidden: true,
    path: "/adicionar-certificado",
    name: "Adicionar Certificado",
    icon: "nc-icon nc-paper",
    component: AddCertificate
  },
  {
    path: "/adicionar-certificado/login",
    name: "Login",
    icon: "nc-icon nc-paper",
    component: AddCertificateLogin
  },
  {
    hidden:true,
    path: "/dashboard",
    name: "Início",
    icon: "nc-icon nc-bank",
    component: Dashboard
  },
  {
    hidden:true,
    path: "/icons",
    name: "Icons",
    icon: "nc-icon nc-diamond",
    component: Icons
  },
  {
    hidden:true,
    path: "/maps", 
    name: "Maps", 
    icon: "nc-icon nc-pin-3", 
    component: Maps
  },
  {
    hidden:true,
    path: "/notifications",
    name: "Notifications",
    icon: "nc-icon nc-bell-55",
    component: Notifications
  },
  {
    hidden:true,
    path: "/user-page",
    name: "User Profile",
    icon: "nc-icon nc-single-02",
    component: UserPage
  },
  {
    hidden:true,
    path: "/tables",
    name: "Table List",
    icon: "nc-icon nc-tile-56",
    component: TableList
  },
  {
    hidden:true,
    path: "/typography",
    name: "Typography",
    icon: "nc-icon nc-caps-small",
    component: Typography
  },
  {
    hidden: true,
    path: "/metamaskloggedout",
    name: "Metamask deslogado",
    component: MetamaskLoggedOut
  },
  {
    hidden:true,
    pro: true,
    path: "/upgrade",
    name: "Upgrade to PRO",
    icon: "nc-icon nc-spaceship"
  },
  { redirect: true, path: "/", pathTo: "/consulta", name: "Consultar Certificado" }
];
export default dashRoutes;
