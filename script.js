let USER_LOGADO;
const BASE_URL = 'http://localhost:3000';
class Usuario {
  id;
  tipo;
  nome;
  dataNascimento;
  email;
  senha;
  candidaturas = [];

  constructor(id, tipo, nome, dataNascimento, email, senha, candidaturas) {
    this.id = id;
    this.tipo = tipo;
    this.nome = nome;
    this.dataNascimento = dataNascimento;
    this.email = email;
    this.senha = senha;
    this.candidaturas = candidaturas;
  }

}

class Candidaturas {
  idvaga;
  idcandidato;
  reprovado;

  constructor(idvaga, idcandidato, reprovado) {
    this.idvaga = idvaga;
    this.idcandidato = idcandidato;
    this.reprovado = reprovado;
  }
}

class Vaga {
  id;
  titulo;
  descricao;
  remuneracao;
  candidatos = [];

  constructor(id, titulo, descricao, remuneracao, candidatos) {
    this.id = id;
    this.titulo = titulo;
    this.descricao = descricao;
    this.remuneracao = remuneracao;
    this.candidatos = candidatos;
  }
}

//#region VALIDAR NOME

const validarNome = () => {
  const nomeInput = document.getElementById('nome-input');
  const nome = nomeInput.value;
  const nomeSplit = [...nome];
  
  
  const verificaNome = nomeSplit.some( c => c.toLowerCase() === c.toUpperCase() && c !== ' ');
  
  
  const nomeErro = document.getElementById('nome-erro');
  
  const ehValido = !verificaNome;
  ehValido ? nomeErro.classList.add('d-none') : nomeErro.classList.remove('d-none');
  
  return ehValido;
}
//#endregion VALIDAR NOME

//#region Validação Email
const validarEmail = () => {
  let emailDigitado = document.getElementById('email-input-registration').value;
  let listaCaracteres = emailDigitado.split(''); // [...emailDigitado]

  let emailSplit = emailDigitado.split('@');
  
  let possuiArroba = emailSplit.length > 1;

  let dominioEmail = possuiArroba ? emailSplit[1] : '';
  let dominioEmailSplit = dominioEmail.split('.');

  let possuiPontosNoDominio = dominioEmailSplit.length > 1;

  let possuiCaracteresEntrePontos = dominioEmailSplit.every( d => d.length > 1 );

  let comecaComLetra = listaCaracteres.length ? listaCaracteres[0].toUpperCase() !== listaCaracteres[0].toLowerCase() : false;

  let ehValido = possuiArroba && possuiPontosNoDominio && possuiCaracteresEntrePontos && comecaComLetra;

  // para setar o texto de erro em vermelho
  let erroEmail = document.getElementById('email-registration-error');
  erroEmail.setAttribute('class', ehValido ? 'd-none' : 'text-danger');

  return ehValido;
}
//#endregion Validação Email

//#region Validação Senha
const validarSenha = () => {
  let senhaDigitada = document.getElementById('password-input-registration').value;
  let listaCaracteres = senhaDigitada.split('');

  let letras = listaCaracteres.filter( char => char.toLowerCase() !== char.toUpperCase() );

  let possuiLetraMaiuscula = letras.some( l => l.toUpperCase() === l ); // "A".toUppercase() === "A"
  let possuiLetraMinuscula = letras.some( l => l.toLowerCase() === l );

  let possuiCharEspecial = listaCaracteres.some( char => char.toLowerCase() === char.toUpperCase() && isNaN(parseInt(char)) );
  let possuiNumero = listaCaracteres.some( char => char.toLowerCase() === char.toUpperCase() && !isNaN(parseInt(char)) );

  let possuiOitoCaracteres = senhaDigitada.length >= 8;

  let naoPossuiEspacos = !senhaDigitada.includes(' ');

  let ehValido = possuiOitoCaracteres && possuiLetraMaiuscula && possuiLetraMinuscula && 
      possuiCharEspecial && possuiNumero && naoPossuiEspacos;

  // para setar o texto de erro em vermelho
  let erroSenha = document.getElementById('password-registration-error');
  erroSenha.setAttribute('class', ehValido ? 'd-none' : 'text-danger');

  return ehValido;
}
//#endregion Validação Senha

//#region Validação Data
const validarData = () => { 
  let inputData = document.getElementById('date-input-registration');
  let dataDigitada = inputData.value;

  adicionarMascaraData(inputData, dataDigitada);

  let dataConvertida = moment(dataDigitada, 'DDMMYYYY');

  let dezoitoAnosAtras = moment().diff(dataConvertida, 'years') >= 18;

  // comparações de data - date1.isBefore(date2)  /  date1.isAfter(date2)  /  date1.isSameOrBefore(date2)  /  date1.isSameOrAfter(date2)
  let dataAnteriorHoje = dataConvertida.isBefore(moment());

  let ehValido = dataConvertida.isValid() && dataAnteriorHoje && dezoitoAnosAtras && dataDigitada.length === 10; // 10/05/2001

  // para setar o texto de erro em vermelho
  let erroData = document.getElementById('date-registration-error');
  erroData.setAttribute('class', ehValido ? 'd-none' : 'text-danger');

  return ehValido;
}

const adicionarMascaraData = (input, data) => {
  let listaCaracteres = [...data];
  
  let listaFiltrada = listaCaracteres.filter(c => !isNaN(parseInt(c)));
  if(listaFiltrada && listaFiltrada.length) {
      let dataDigitada = listaFiltrada.join('');

      const { length } = dataDigitada;

      switch(length) { 
          case 0: case 1: case 2:
              input.value = dataDigitada; 
              break;
          case 3: case 4:
              input.value = `${dataDigitada.substring(0, 2)}/${dataDigitada.substring(2, 4)}`;
              break;
          default:
              input.value = `${dataDigitada.substring(0, 2)}/${dataDigitada.substring(2, 4)}/${dataDigitada.substring(4, 8)}`;
      }
  }
}
//#endregion Validação Data


const alternarClasses = (elemento, ...classes) => {
  classes.forEach( classe => {
    elemento.classList.toggle(classe);
  });
}

const irPara = (origem, destino) => {
  const elementoOrigem = document.getElementById(origem);
  const elementoDestino = document.getElementById(destino);

  alternarClasses(elementoOrigem, 'd-none', 'd-flex');
  alternarClasses(elementoDestino, 'd-none', 'd-flex');
}

const validarCadastro = (event) => {
  let cadastroValido = validarData() && validarEmail() && validarSenha() && validarNome();
  cadastroValido ? alert('Cadastro realizado com sucesso!') : alert('Erro! Confira os campos de cadastro!');

  if(cadastroValido) {
    cadastrarUsuario(event);
    irPara('registration', 'login')
  }
}

const cadastrarUsuario = async () => {
  const campoTipo = document.getElementById('user-type').value
  const campoNome = document.getElementById("nome-input").value;
  const campoData = document.getElementById("date-input-registration").value;
  const campoEmail = document.getElementById("email-input-registration").value;
  const campoSenha = document.getElementById("password-input-registration").value;
  const nomeFormatado = campoNome.split(' ').map( nome => nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase() ).join(' ');
  const usuario = new Usuario (null, campoTipo, nomeFormatado, campoData, campoEmail, campoSenha, []);
  try {
    const response = await axios.post(`${BASE_URL}/usuarios`, usuario);
    let idUser = response.data.id;
    usuario.id = idUser;

    document.getElementById('user-type').value = '';
    document.getElementById("nome-input").value = '';
    document.getElementById("date-input-registration").value = '';
    document.getElementById("email-input-registration").value = '';
    document.getElementById("password-input-registration").value = '';
    
  } catch (error) {
    const msg = 'Erro ao cadastrar usuário!';
    alert(msg)
    console.log(msg, error)
  }
}

const voltarCadastro = () => {
  const campoTipo = document.getElementById('user-type').value = '';
  const campoNome = document.getElementById("nome-input").value = '';
  const campoData = document.getElementById("date-input-registration").value = '';
  const campoEmail = document.getElementById("email-input-registration").value = '';
  const campoSenha = document.getElementById("password-input-registration").value = '';

  irPara('registration', 'login')
}

const validarLogin = async () => {	
  const emailDigitado = document.getElementById('email-input-login').value;
  const senhaDigitada = document.getElementById('password-input-login').value;
  try {
    const response = await axios.get(`${BASE_URL}/usuarios?email=${emailDigitado}`);

    const user = response.data[0];

    const validarSenha = user.senha === senhaDigitada;
    if(validarSenha) {
      USER_LOGADO = user;
      document.getElementById('email-input-login').value = '';
      document.getElementById('password-input-login').value = '';
      const ulVagas = document.getElementById('lista-vagas');
      ulVagas.textContent = '';
      listaVagas();
      irPara('login', 'vagas');
    } else {
      alert('Senha incorreta');
    }
  } catch (error) {
    const msg = 'Email incorreto';
    alert(msg);
    console.log(msg, error);
  }
}


const esqueceuSenha = async () => {
  try {
    const email = prompt('Digite seu e-mail');
    alert('Pesquisando aguarde...');
    const response = await axios.get(`${BASE_URL}/usuarios?email=${email}`);

    const senhaRecuparada = response.data[0].senha;

    alert(`Sua senha é: ${senhaRecuparada}`);
  } catch (error) {
    const msg = 'Email não encontrado';
    alert(msg);
    console.log(msg, error);
  }
}

const validarCadastroVaga = async (event) => {
  const cadastroValido = validarTitulo() && validarDescricao() && validarRemuneracao();

  try {
    if(cadastroValido) {
      const titulo = document.getElementById('titulo-input-registration').value;
      const descricao = document.getElementById('descricao-input-registration').value;
      const remuneracao = document.getElementById('remuneracao-input-registration').value;

      const vaga = new Vaga(null, titulo, descricao, remuneracao, []);

      const response = await axios.post(`${BASE_URL}/vagas`, vaga);
      let idVaga = response.data.id;
      vaga.id = idVaga;
      alert('Vaga cadastrada com sucesso!');
      
      const ulVagas = document.getElementById('lista-vagas');
      ulVagas.textContent = '';
      listaVagas();

      irPara('registrationVagas', 'vagas');
      document.getElementById('titulo-input-registration').value = '';
      document.getElementById('descricao-input-registration').value = '';
      document.getElementById('remuneracao-input-registration').value = '';
    } else {
      alert('Erro! Confira os campos de cadastro!');
    }
  } catch (error) {
    const msg = 'Erro ao cadastrar vaga!';
    alert(msg);
    console.log(msg, error);
  }
}

const validarTitulo = () => {
  const titulo = document.getElementById('titulo-input-registration').value;
  const errorTitulo = document.getElementById('titulo-erro-registration');
  const tituloSplit = [...titulo];

  const valid =  tituloSplit.length >= 5;

  valid ? errorTitulo.classList.add('d-none') : errorTitulo.classList.remove('d-none');

  return valid;
}

const validarDescricao = () => {
  const descricao = document.getElementById('descricao-input-registration').value;
  const errordescricao = document.getElementById('descricao-erro-registration');
  const descricaoSplit = [...descricao];

  const valid =  descricaoSplit.length >= 5;

  valid ? errordescricao.classList.add('d-none') : errordescricao.classList.remove('d-none');

  return valid;
}

const validarRemuneracao = () => {
  const inputRemuneracao = document.getElementById('remuneracao-input-registration');
  const remuneracao = document.getElementById('remuneracao-input-registration').value;


  const errorremuneracao = document.getElementById('remuneracao-registration-error');
  maskRemunaracao(inputRemuneracao, remuneracao);

  const remuneracaoSplit = [...remuneracao];

  const valid =  remuneracaoSplit.length >= 2;

  valid ? errorremuneracao.classList.add('d-none') : errorremuneracao.classList.remove('d-none');
  

  return valid;

}

const maskRemunaracao = (input, value) => {
  let listaCaracteres = [...value];
  
  let listaFiltrada = listaCaracteres.filter(c => !isNaN(parseInt(c)));
  if(listaFiltrada && listaFiltrada.length) {
      let dataDigitada = listaFiltrada.join('');

      const { length } = dataDigitada;

      switch(length) { 
          case 0: case 1: case 2:
              input.value = `R$ ${dataDigitada}`; 
              break;
      }
  }
}

const listaVagas = async() => {
  const CLASS_UL = "py-4 px-5 container";
  const CLASS_BUTTON = "d-flex p-3 w-100 border border-dark rounded align-items-center justify-content-between btn-hover-vagas"
  const STYLE_BUTTON = "background: transparent; outline: none; border: none;";
  const CLASS_SPAN = "fw-normal";
  const CLASS_P = "fw-bold m-0";

  try {
    const response = await axios.get(`${BASE_URL}/vagas`);

    if(response.data.length == 0) {
      const ulVagas = document.getElementById('lista-vagas');
      const h2 = document.createElement('h2');
      h2.textContent = 'Nenhuma vaga cadastrada';
      h2.setAttribute('class', 'text-center');

      ulVagas.appendChild(h2);
    }

    response.data.forEach( elemento => {
      const ul = document.getElementById('lista-vagas');
      const spanTitulo = document.createElement('span');
      spanTitulo.textContent = elemento.titulo;
      spanTitulo.setAttribute('class', CLASS_SPAN);

      const pTitulo = document.createElement('p');
      pTitulo.textContent = 'Titulo: ';
      pTitulo.setAttribute('class', CLASS_P);
      pTitulo.append(spanTitulo);

      const spanRemuneracao = document.createElement('span');
      spanRemuneracao.textContent = elemento.remuneracao;
      spanRemuneracao.setAttribute('class', CLASS_SPAN);

      const pRemuneracao = document.createElement('p');
      pRemuneracao.textContent = 'Remuneração: ';
      pRemuneracao.setAttribute('class', CLASS_P);
      pRemuneracao.append(spanRemuneracao);

      const button = document.createElement('button');
      const idVaga = elemento.id;
      button.setAttribute('id', idVaga)
      button.setAttribute('class', CLASS_BUTTON);
      button.setAttribute('style', STYLE_BUTTON);
      button.setAttribute('onclick', 'abrirDetalhes(event)');
      button.append(pTitulo, pRemuneracao);


      const li = document.createElement('li');
      li.appendChild(button);
      li.setAttribute('class', 'mt-3');

      ul.appendChild(li);
      ul.setAttribute('class', CLASS_UL);
    });
    
    const btnTrabalhador = document.getElementById('btn-vagas-trabalhador');
    const btnRecrutador = document.getElementById('btn-vagas-recrutador');
    if(USER_LOGADO.tipo == 'trabalhador') {
      btnRecrutador.classList.remove('d-flex');
      btnRecrutador.classList.add('d-none');
      btnTrabalhador.classList.remove('d-none');
      btnTrabalhador.classList.add('d-flex');
    }
    if(USER_LOGADO.tipo == 'recrutador') {
      btnTrabalhador.classList.remove('d-flex');
      btnTrabalhador.classList.add('d-none');
      btnRecrutador.classList.remove('d-none');
      btnRecrutador.classList.add('d-flex');
    }

  } catch (error) {
    const msg = 'Erro ao listar vagas!';
    alert(msg);
    console.log(msg, error);
  }
}

let idDetalhe;
const abrirDetalhes = async (event) => {
  idDetalhe = event.target.id;
  try {
    const response = await axios.get(`${BASE_URL}/vagas?id=${idDetalhe}`);
    const vaga = response.data[0];

    setTimeout(() => {
      irPara('vagas', 'detalhe-vagas');
    }, 500);
    
    const spanTituloVaga = document.getElementById('span-titulo-vaga');
    spanTituloVaga.textContent = vaga.titulo;

    const spanDescricaoVaga = document.getElementById('span-descricao-vaga');
    spanDescricaoVaga.textContent = vaga.descricao;

    const spanRemuneracaoVaga = document.getElementById('span-remuneracao-vaga');
    spanRemuneracaoVaga.textContent = vaga.remuneracao;

    const STYLE_LI_CANDITADOS = "d-flex justify-content-between border border-dark py-2 ps-2 pe-4";
    const STYLE_SPAN_DATA = "py-2";

    const ulTrabalhador = document.getElementById('lista-candidatos-vaga');
    ulTrabalhador.textContent = '';

    const ulRecrutador = document.getElementById('lista-candidatos-vaga-recrutador');
    ulRecrutador.textContent = '';

    const divTrabalhador = document.getElementById('candidatos-trabalhador');

    const divRecrutador = document.getElementById('candidatos-recrutador');

    if(vaga.candidatos.length == 0) {
      ulTrabalhador.textContent = 'Não há candidatos para esta vaga';
      ulRecrutador.textContent = 'Não há candidatos para esta vaga';
    }

    if(USER_LOGADO.tipo == 'trabalhador') {
      divRecrutador.classList.remove('d-flex');
      divRecrutador.classList.add('d-none');
      divTrabalhador.classList.remove('d-none');
      divTrabalhador.classList.add('d-flex');
      
      const divButtonsTrabalhador = document.getElementById('divBtnTrabalhador')

      vaga.candidatos.forEach(candidato => {
        const spanNome = document.createElement('span');
        const spanDataNacimento = document.createElement('span');
        const li = document.createElement('li');

        spanNome.textContent = candidato.nome;
        spanNome.setAttribute('class', STYLE_SPAN_DATA)
        spanNome.setAttribute('id', candidato.nome);
        spanDataNacimento.textContent = candidato.dataNascimento;
        spanDataNacimento.setAttribute('class', STYLE_SPAN_DATA);
        li.append(spanNome, spanDataNacimento);
        li.setAttribute('class', STYLE_LI_CANDITADOS);
        ulTrabalhador.appendChild(li);
      });

      const DIVBTN_STYLE = "py-3 w-100 d-flex justify-content-between";
      const BTN_VOLTAR_STYLE = "btn btn-secondary py-1 px-4";
      const BTN_CANCELAR_STYLE = "btn btn-danger py-1 px-4";
      const BTN_CANDIDATAR_STYLE = "btn btn-dark py-1 px-4";

      const divBtn = document.createElement('div');
      divBtn.setAttribute('class', DIVBTN_STYLE);
      const btnVoltar = document.createElement('button');
      btnVoltar.setAttribute('class', BTN_VOLTAR_STYLE);
      btnVoltar.textContent = 'Voltar';
      btnVoltar.setAttribute('onclick', 'irPara("detalhe-vagas", "vagas")');

      let newArrayCandidaturas = USER_LOGADO.candidaturas.find(elemento => elemento.idvaga == idDetalhe);
      if(newArrayCandidaturas) {
        const btnCancelarCandidatura = document.createElement('button');
        btnCancelarCandidatura.setAttribute('id', 'btn-cancelar-candidatura');
        btnCancelarCandidatura.setAttribute('class', BTN_CANCELAR_STYLE);
        btnCancelarCandidatura.textContent = 'Cancelar Candidatura';
        btnCancelarCandidatura.setAttribute('onclick', 'cancelarCandidatura()');
        if(newArrayCandidaturas.reprovado == true) {
          const spanUser = document.getElementById(USER_LOGADO.nome);
          spanUser.setAttribute('class', 'text-danger py-2');
      
          btnCancelarCandidatura.disabled = true;
        } else {
          btnCancelarCandidatura.disabled = false;
        }
        divBtn.append(btnVoltar, btnCancelarCandidatura);
        divButtonsTrabalhador.textContent = '';
        divButtonsTrabalhador.appendChild(divBtn);
      } else {
        const btnCandidatar = document.createElement('button');
        btnCandidatar.setAttribute('id', 'btn-candidatar');
        btnCandidatar.setAttribute('class', BTN_CANDIDATAR_STYLE);
        btnCandidatar.textContent = 'Candidatar-se';
        btnCandidatar.setAttribute('onclick', 'candidatarVaga()');
        divBtn.append(btnVoltar, btnCandidatar);
        divButtonsTrabalhador.textContent= '';
        divButtonsTrabalhador.appendChild(divBtn);
      }
    }

    if(USER_LOGADO.tipo == 'recrutador') {
      divTrabalhador.classList.remove('d-flex');
      divTrabalhador.classList.add('d-none');
      divRecrutador.classList.remove('d-none');
      divRecrutador.classList.add('d-flex');

    const STYLE_BTN_REPROVAR = "btn btn-danger";

    const candidaturas = await getCandidaturas();  

    vaga.candidatos.forEach( async (candidato) => {
      console.log(vaga.candidatos);
      let idButton = `btn-reprova-${candidato.id}`
      const spanNome = document.createElement('span');
      const spanDataNacimento = document.createElement('span');
      const btnReprovar = document.createElement('button');
      const li = document.createElement('li');
      btnReprovar.setAttribute('id', idButton)
      btnReprovar.setAttribute('class', STYLE_BTN_REPROVAR);
      btnReprovar.textContent = 'Reprovar';
      btnReprovar.setAttribute('onclick', 'reprovarCandidato(event)');

      
      spanNome.textContent = candidato.nome;
      spanNome.setAttribute('id', `candidato-${candidato.id}`)
      spanNome.setAttribute('class', STYLE_SPAN_DATA)
      spanDataNacimento.textContent = candidato.dataNascimento;
      spanDataNacimento.setAttribute('class', STYLE_SPAN_DATA);
      li.append(spanNome, spanDataNacimento, btnReprovar);

      candidaturas.data.forEach( element => {
        if(element.idvaga == idDetalhe && element.idcandidato == candidato.id) {
          if(element.reprovado == true) {
            btnReprovar.setAttribute('disabled', '');
            spanNome.setAttribute('class', 'text-danger py-2');
          }
        }
      });

      li.setAttribute('class', STYLE_LI_CANDITADOS);
    
      ulRecrutador.appendChild(li);
    });
    }
  } catch (error) {
    const msg = 'Erro ao carregar detalhes da vaga';
    console.log(msg, error);
  }
}

const candidatarVaga = async () => {
  try {
    
    const responsePostCandidatura = await adicionarCandidatura();

    const adicionarCandidaturaUsuario = await adicionarNoUsuario(responsePostCandidatura.data);

    const adicionarCandidatoNasVagas = await adicionarUserNasVagas();
    
    alert('Candidatura realizada com sucesso!');
    irPara('detalhe-vagas', 'vagas');
  } catch (error) {
    const msg = 'Erro ao candidatar vaga';
    alert(msg);
    console.log(msg, error);
  }
}

const adicionarCandidatura = async () => {
  const candidaturas = new Candidaturas(idDetalhe, USER_LOGADO.id, false);
  try {
    const responsePostCandidatura = await axios.post(`${BASE_URL}/candidaturas`, candidaturas);
    return responsePostCandidatura;
  } catch (error) {
    const msg = 'Erro ao adicionar candidatura';
    alert(msg);
    console.log(msg, error);
  }
}

const adicionarNoUsuario = async (objCandidatura) => {
  const { candidaturas } = USER_LOGADO;
  candidaturas.push(objCandidatura);
  try {
    const UserAlterado = {
      id: USER_LOGADO.id,
      tipo: USER_LOGADO.tipo,
      nome: USER_LOGADO.nome,
      dataNascimento: USER_LOGADO.dataNascimento,
      email: USER_LOGADO.email,
      senha: USER_LOGADO.senha,
      candidaturas: candidaturas
    }

    const response = await axios.put(`${BASE_URL}/usuarios/${USER_LOGADO.id}`, UserAlterado);
    return response
  } catch (error) {
    const msg = 'Erro ao adicionar candidatura no usuario';
    alert(msg);
    console.log(msg, error);
  }
}

const adicionarUserNasVagas = async () => {

  try {
    let vaga = await getVagaById(idDetalhe);
    const { id, titulo, descricao, remuneracao, candidatos } = vaga.data;

    candidatos.push({
      id: USER_LOGADO.id,
      nome: USER_LOGADO.nome,
      dataNascimento: USER_LOGADO.dataNascimento,
      email: USER_LOGADO.email
    })

    const vagaAlterada = {
      id: id,
      titulo: titulo,
      descricao: descricao,
      remuneracao: remuneracao,
      candidatos: candidatos
    }
    const response = await axios.put(`${BASE_URL}/vagas/${id}`, vagaAlterada);
    console.log(response);
    return response;
  } catch (error) {
    const msg = 'Erro ao adicionar candidato nas candidaturas da vaga';
    alert(msg);
    console.log(msg, error);
  }
}

const getVagaById = (idVaga) => {
  try {
    const response = axios.get(`${BASE_URL}/vagas/${idVaga}`);
    return response;
  } catch (error) {
    const msg = 'Erro ao buscar vaga';
    alert(msg);
    console.log(msg, error);
  }

}

const reprovarCandidato = async (event) => {
  const idBtn = event.target.id;
  const idCandidaturaUser = idBtn.split('-')[2];

  const objCandidatura = await axios.get(`${BASE_URL}/candidaturas/${idCandidaturaUser}`);
  const objCandidatoAlterado = {
    idvaga: objCandidatura.data.idvaga,
    idcandidato: objCandidatura.data.idcandidato,
    reprovado: true,
    id: objCandidatura.data.id
  }

  const response = await axios.put(`${BASE_URL}/candidaturas/${idCandidaturaUser}`, objCandidatoAlterado);
  const getCandidato = await getUserById(objCandidatoAlterado.idcandidato);
  
  getCandidato.data.candidaturas.forEach(candidatura => {
    if(candidatura.id == objCandidatoAlterado.id) {
      candidatura.reprovado = true;
    }
  });

  const candidatoAlterado = {
    id: getCandidato.data.id,
    tipo: getCandidato.data.tipo,
    nome: getCandidato.data.nome,
    dataNascimento: getCandidato.data.dataNascimento,
    email: getCandidato.data.email,
    senha: getCandidato.data.senha,
    candidaturas: getCandidato.data.candidaturas
  }
  
  const responseAlterarCandidato = await axios.put(`${BASE_URL}/usuarios/${getCandidato.data.id}`, candidatoAlterado);

  document.getElementById(idBtn).disabled = true;
  document.getElementById(`candidato-${idCandidaturaUser}`).setAttribute('class', 'text-danger py-2');
  console.log('teste reprovar');
}

const getUserById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/usuarios/${id}`)
    return response;
  } catch (error) {
    const msg = 'Erro ao buscar usuario por id';
    console.log(msg, error);
  }
}

const excluirVaga = async () => {
  console.log('idDetalhe ->', idDetalhe);
  try {
    const pegaCandidaturas = await getCandidaturas();
    let idVagasCandidatura = [];
    let idCandidatosVaga = [];
    let idVaga;

    for(const i of pegaCandidaturas.data){
      if(i.idvaga == idDetalhe){
        idVaga = i.idvaga;
        idVagasCandidatura.push(i.id);
        idCandidatosVaga.push(i.idcandidato);
      }
    }

    const deletarVagas = await axios.delete(`${BASE_URL}/vagas/${idDetalhe}`);

    idVagasCandidatura.forEach(async (elemento) => {
      try {
        const deletarCandidatos = await axios.delete(`${BASE_URL}/candidaturas/${elemento}`);
      } catch (error) {
        const msg = 'Erro ao deletar candidaturas';
        alert(msg);
        console.log(msg, error);
      }
    });
  
    const deletarVagaDoCandidato = await deletarVagaCandidato(idCandidatosVaga, idVaga);


    const ul = document.getElementById('lista-vagas');
    ul.textContent = '';
    listaVagas();
    setTimeout(() => {
      irPara('detalhe-vagas', 'vagas');
    }, 1000);   
  } catch (error) {
    const msg = 'Erro ao deletar vaga';
    alert(msg);
    console.log(msg, error);
  }
}

const getCandidaturas = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/candidaturas`);
    return response;
  } catch (error) {
    const msg = 'Erro ao buscar candidaturas';
    alert(msg);
    console.log(msg, error);
  }
}

const deletarVagaCandidato = async (idCandidato, idVaga) => {
  try {
    idCandidato.forEach(async (elemento) => {
      try {
          idUser = elemento;
          let response = await axios.get(`${BASE_URL}/usuarios/${idUser}`);
          let candidato = response.data;

          let newCandidaturaUser = candidato.candidaturas.filter(candidatura => candidatura.idvaga != idVaga );

          const candidatoAlterado = {
            id: candidato.id,
            tipo: candidato.tipo,
            nome: candidato.nome,
            dataNascimento: candidato.dataNascimento,
            email: candidato.email,
            senha: candidato.senha,
            candidaturas: newCandidaturaUser
          }

          let responsePut = await axios.put(`${BASE_URL}/usuarios/${candidato.id}`, candidatoAlterado);
        } catch (error) {
          const msg = 'Erro ao deletar vaga do candidato';
          alert(msg);
          console.log(msg, error);
        }
      });
  } catch (error) {
    const msg = 'erro ao deletar vaga das candidaturas do usuário';
    alert(msg);
    console.log(msg, error);
  }
}

const cancelarCandidatura = async () => {
  let candidatura = USER_LOGADO.candidaturas.find(elemento => elemento.idvaga == idDetalhe);
  
  let newArrayCandidatura = USER_LOGADO.candidaturas.filter(elemento => elemento.id != candidatura.id);

  const newUserLogado = {
    id: USER_LOGADO.id,
    tipo: USER_LOGADO.tipo,
    nome: USER_LOGADO.nome,
    dataNascimento: USER_LOGADO.dataNascimento,
    email: USER_LOGADO.email,
    senha: USER_LOGADO.senha,
    candidaturas: newArrayCandidatura
  }

  USER_LOGADO = newUserLogado;
  try {
    const deleteCandidaturaResponse = await axios.delete(`${BASE_URL}/candidaturas/${candidatura.id}`);
    const updateUserCandidaturaResponse = await axios.put(`${BASE_URL}/usuarios/${USER_LOGADO.id}`, newUserLogado);

    const objVaga = await getVagaById(idDetalhe);

    const newObjVaga = {
      id: objVaga.data.id,
      titulo: objVaga.data.titulo,
      descricao: objVaga.data.descricao,
      remuneracao: objVaga.data.remuneracao,
      candidatos: objVaga.data.candidatos.filter(elemento => elemento.id != USER_LOGADO.id)
    }

    const updateVagaCandidatosResponse = await axios.put(`${BASE_URL}/vagas/${idDetalhe}`, newObjVaga);
    alert('Candidatura cancelada com sucesso!');
    irPara('detalhe-vagas', 'vagas')
  } catch (error) {
    const msg = 'Erro ao cancelar candidatura';
    alert(msg);
    console.log(msg, error);
  }
}