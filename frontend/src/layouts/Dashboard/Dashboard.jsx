import React from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Switch, Redirect } from "react-router-dom";

import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.jsx";

import NotificationAlert from "react-notification-alert";

import dashboardRoutes from "routes/dashboard.jsx";

import { abi, enderecoContrato } from 'contracts/cartorio.js';
import { web3, tipoLogin } from "services/web3.js";

var ps;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: "black",
      activeColor: "warning",
      cartorio: '', // instância do contrato
      tipoLogin: '', // metamask, padrao
      conta: '', // Endereço da conta
      tipoConta: '', // root, administrador, autorizado, visitante
      visitante: false
    }
  }

  async componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.refs.mainPanel);
      document.body.classList.toggle("perfect-scrollbar-on");
    }

    const cartorio = await new web3.eth.Contract(JSON.parse(abi), enderecoContrato);
    const contas = await web3.eth.getAccounts();
    let tipoConta;

    if (tipoLogin === 'metamask') {
      const isAutorizado = await cartorio.methods.isAutorizado(contas[0]).call();

      if (isAutorizado) {
        tipoConta = 'autorizado';
      } else {
        const administrador = await cartorio.methods.administrador().call();

        if (administrador === contas[0]) {
          tipoConta = 'administrador';
        } else {
          const root = await cartorio.methods.root().call();

          if (root === contas[0]) {
            tipoConta = 'root';
          } else {
            tipoConta = 'visitante';
          }
        }
      }

    } else { // Conta padrão
      tipoConta = 'visitante';
    }

    this.setState({ cartorio, tipoLogin: tipoLogin, conta: contas[0], tipoConta });

  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
      document.body.classList.toggle("perfect-scrollbar-on");
    }
  }
  componentDidUpdate(e) {
    if (e.history.action === "PUSH") {
      this.refs.mainPanel.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
  }
  handleActiveClick = (color) => {
    this.setState({ activeColor: color });
  }
  handleBgClick = (color) => {
    this.setState({ backgroundColor: color });
  }
  continuarComoVisitante() {
    this.setState({ visitante: true });
  }

  // place= "tl", "tc", "tr", "bl", "bc", "br" # type: "primary", "info", "success", "danger", "warning"
  notify({ message, time = 7, place = "tr", type = "info", icon = "nc-icon nc-bell-55" }) { // 
    let options = {
      place: place,
      message: (
        <div>
          {message}
        </div>
      ),
      type: type,
      icon: icon,
      autoDismiss: time
    };
    this.refs.notificationAlert.notificationAlert(options);
    const tamanhoarray = this.refs.notificationAlert.state.notifyTR.length;
    const id = this.refs.notificationAlert.state.notifyTR[tamanhoarray - 1].key;
    return id;
  }

  notifyDismiss(id) {
    const notificacoes = this.refs.notificationAlert.state.notifyTR;
    for (let c = 0; c < notificacoes.length; c++) {
      if (notificacoes[c].key === id) {
        notificacoes[c].props.toggle();
        return;
      }
    }
  }

  render() {
    return (
      <div className="wrapper">
        <Sidebar
          {...this.props}
          tipoConta={this.state.tipoConta}
          routes={dashboardRoutes}
          bgColor={this.state.backgroundColor}
          activeColor={this.state.activeColor}
        />
        <div className="main-panel" ref="mainPanel">
          <Header {...this.props} tipoConta={this.state.tipoConta} />
          <NotificationAlert ref="notificationAlert" />
          <Switch>
            {dashboardRoutes.map((prop, key) => {
              if (prop.pro) {
                return null;
              }
              if (prop.redirect) {
                return <Redirect from={prop.path} to={prop.pathTo} key={key} />;
              }
              return (
                <Route path={prop.path}
                  render={({ history }) =>
                    <prop.component
                      web3={web3}
                      history={history}
                      {...this.state}
                      funcoes={{
                        continuarComoVisitante: (prop.path === '/metamaskloggedout' ? this.continuarComoVisitante.bind(this) : ''),
                        notify: this.notify.bind(this),
                        notifyDismiss: this.notifyDismiss.bind(this)
                      }}
                    />}
                  key={key}
                />
              );
            })}
          </Switch>
          <Footer fluid />
        </div>
        <FixedPlugin
          bgColor={this.state.backgroundColor}
          activeColor={this.state.activeColor}
          handleActiveClick={this.handleActiveClick}
          handleBgClick={this.handleBgClick}
        />
      </div>
    );
  }
}

export default Dashboard;
