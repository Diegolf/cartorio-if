/*eslint-disable*/
import React from "react";
import {
  Card,
  CardTitle,
  CardBody,
  CardHeader,
  Input,
  Row,
  Col,
  FormFeedback
} from "reactstrap";

import Button from "components/CustomButton/CustomButton.jsx";

class AdministratorPainel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      certificados: []
    };
  }

  componentDidMount() { // For acessado pelo sidebar
    if (this.props.tipoConta !== 'administrador') {
      console.log(this.props.tipoConta);
      this.props.history.replace('/');
    }
  }

  render() {
    return (
      <div className="content">
        <Row>
          <Col md={12}>
            <Card>
              <CardHeader>
                <CardTitle>Lista de certificados a serem assinados</CardTitle>
                <hr />
              </CardHeader>
              <CardBody>
                <h2>Nenhum certificado a ser assinado</h2>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AdministratorPainel;
