import React, { Component } from 'react';

import QRCode from 'qrcode.react';

import if_header2 from 'assets/img/if-header2.png';

export default class CertificateSample extends Component {
  render() {
    return (
      <div id="certificate_content">
        <div id="certificate_logo"> <img src={if_header2} alt="IF Header" /></div>
        <div id="certificate_titulo"><strong>Certificado</strong></div>
        <div id="certificate_texto">
          <p>
          Certificamos que <strong>{this.props.data.nome}</strong> participou do minicurso com tema "<strong>{this.props.data.titulo}</strong>" do Instituto Federal de Educação, Ciência e Tecnologia do Sudeste
de Minas Gerais – Câmpus Barbacena, realizado no dia <strong>{this.props.data.dataDoCurso}</strong>, perfazendo um total de #Duracao#.
              </p>
        </div>
        <div id="certificate_data"> 25 de Abril de 2019</div>
        <div id="certificate_qr"><QRCode value={this.props.data.chave}></QRCode></div>
        <div id="certificate_ass">
        <div>Chave do certificado: asd21d12d12d211d212</div>
          <div>Assinado por: asdasas1d21d21</div>
        </div>
      </div>
    );
  }
}
