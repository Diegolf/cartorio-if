import React from "react";
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";

import icons from "variables/icons";

class Icons extends React.Component {
  
  componentDidMount(){ // For acessado pelo sidebar
    if (window.web3 && this.props.tipoLogin === 'padrao' && !this.props.visitante) {
      this.props.history.push('/metamaskloggedout');
    }
  }

  componentDidUpdate() { // For acessado diretamente pela barra de endereços
    if (window.web3 && this.props.tipoLogin === 'padrao' && !this.props.visitante) {
      this.props.history.push('/metamaskloggedout');
    }
  }
  
  render() {
    return (
      <div className="content">
        <Row>
          <Col md={12}>
            <Card className="demo-icons">
              <CardHeader>
                <CardTitle>100 Awesome Nucleo Icons</CardTitle>
                <p className="card-category">
                  Handcrafted by our friends from{" "}
                  <a href="https://nucleoapp.com/?ref=1712">NucleoApp</a>
                </p>
              </CardHeader>
              <CardBody className="all-icons">
                <div id="icons-wrapper">
                  <section>
                    <ul>
                      {icons.map((prop, key) => {
                        return (
                          <li key={key}>
                            <i className={"nc-icon " + prop.name} />
                            <p>{prop.name}</p>
                            <em>{prop.content}</em>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Icons;
