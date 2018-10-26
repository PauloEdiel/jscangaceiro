class NegociacaoController {

  constructor() {

    const $ = document.querySelector.bind(document);
    this._inputData = $('#data');
    this._inputQuantidade = $('#quantidade');
    this._inputValor = $('#valor');


    this._negociacoes = new Bind(
      new Negociacoes(),
      new NegociacoesView('#negociacoes'),
      'adiciona', 'esvazia'
    );

    this._mensagem = new Bind(
      new Mensagem(),
      new MensagemView('#mensagemView'),
      'texto'
    );
  }

  adiciona(event) {
    try {

      event.preventDefault();
      this._negociacoes.adiciona(this._criaNegociacao());
      this._mensagem.texto = 'Negociação adicionada com sucesso';
      this._limpaFormulario();

    } catch (err) {

      console.log(err);
      console.log(err.stack);

      if (err instanceof DataInvalidaException) {

        this._mensagem.texto = err.message;

      } else {
        this._mensagem.texto = "Um erro aconteceu entre em contato com suporte";
      }

    }
  }

  _limpaFormulario() {

    this._inputData.value = '';
    this._inputQuantidade.value = 1;
    this._inputValor.value = 0.0
    this._inputData.focus();
  }

  _criaNegociacao() {

    return new Negociacao(
      DateConverter.paraData(this._inputData.value),
      parseInt(this._inputQuantidade.value),
      parseFloat(this._inputValor.value)
    );
  }
  apaga() {

    this._negociacoes.esvazia();
    this._mensagem.texto = 'Negociações apagadas com sucesso !';
  }

  importarNegociacoes() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'negociacoes/cemana');
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          JSON.parse(xhr.responseText).map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor)).
          forEach(negociacao => this._negociacoes.adiciona(negociacao));
          this._mensagem.texto = 'negociações importadas com sucesso';


        } else {
          console.log(JSON.parse(xhr.responseText));
          console.log("Não foi possível obter as negociações da semana");

        }
      }
    };
    xhr.send();
  }
}