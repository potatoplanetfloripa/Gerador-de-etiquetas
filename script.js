/* ===============================
CONTROLE DE ABAS
=============================== */
function trocarAba(aba) {
  const abas = ['potato', 'novo', 'marmitas'];

  abas.forEach(nomeAba => {
    const conteudo = document.getElementById(`aba-${nomeAba}`);
    const botao = document.getElementById(`btn-${nomeAba}`);
    const ativa = nomeAba === aba;

    if (conteudo) conteudo.style.display = ativa ? 'block' : 'none';
    if (botao) botao.classList.toggle('aba-ativa', ativa);
  });
}

/* ===============================
GERADOR BASE
=============================== */
function gerarEtiquetaBase(containerId, etiquetaTextoId) {
  const container = document.getElementById(containerId);

  const tipo = container.querySelector('input[name="tipo"]:checked');
  const recheio = container.querySelector('input[name="recheio"]:checked');
  const finaisSelecionados = Array.from(container.querySelectorAll('input[name="final"]:checked'));
  const gramasSelecionadas = Array.from(container.querySelectorAll('input[name="gramas"]:checked'));
  const extrasInputs = container.querySelectorAll('input[type="number"][name^="extra"]');

  const textoExtra = container.querySelector('#textoExtra')?.value.trim();
  const posicaoTexto = container.querySelector('input[name="posicaoTexto"]:checked')?.value;

  // Tipo obrigatório apenas na Potato Planet
  if (containerId === 'aba-potato' && !tipo) {
    alert('Por favor, selecione Rosti ou Recheada.');
    return false;
  }

  // Recheio obrigatório nas duas abas
  if (!recheio) {
    alert('Por favor, selecione um recheio.');
    return false;
  }

  // EXTRAS
  let totalExtras = 0;
  const extrasText = [];

  extrasInputs.forEach(input => {
    const quantidade = parseInt(input.value) || 0;
    const nome = input.parentElement.querySelector('span')?.textContent.trim();

    if (quantidade > 0) {
      totalExtras += quantidade;
      const nomeTratado = nome ? nome.toLowerCase() : 'extra';
      extrasText.push(`${quantidade}x ${nomeTratado}`);
    }
  });

  if (totalExtras > 3) {
    alert('Você pode selecionar no máximo 3 unidades no total para os extras.');
    return false;
  }

  // FINAIS
  if (finaisSelecionados.length > 2) {
    alert('Você pode selecionar no máximo 2 finais.');
    return false;
  }

  // LINHAS DA ETIQUETA
  let linhasEtiqueta = [
    ...gramasSelecionadas.map(f => f.value),
    tipo ? tipo.value : '',
    recheio ? recheio.value : '',
    ...extrasText,
    ...finaisSelecionados.map(f => f.value)
  ];

  // TEXTO EXTRA
  if (textoExtra) {
    if (posicaoTexto === 'acima') {
      linhasEtiqueta.unshift(textoExtra);
    } else {
      linhasEtiqueta.push(textoExtra);
    }
  }

  // RENDER
  const etiquetaTexto = document.getElementById(etiquetaTextoId);

  etiquetaTexto.innerHTML = linhasEtiqueta
    .filter(Boolean)
    .map(linha => `<div>${linha}</div>`)
    .join('');

  return true;
}

/* ===============================
GERADORES ESPECÍFICOS
=============================== */
function gerarEtiqueta() {
  return gerarEtiquetaBase('aba-potato', 'etiquetaTexto');
}

function gerarEtiquetaNovo() {
  return gerarEtiquetaBase('aba-novo', 'etiquetaTextoNovo');
}


const MARMITAS = {
  'carne-vinho': {
    nome: 'Carne de panela ao\nmolho de vinho tinto',
    peso: 'Aprox. 490g'
  },
  'fricasse': {
    nome: 'Fricassê',
    peso: 'Aprox. 450g'
  },
  'parmegiana-frango': {
    nome: 'Parmegiana de frango',
    peso: 'Aprox. 450g'
  },
  'estrogonofe-frango': {
    nome: 'Estrogonofe de frango',
    peso: 'Aprox. 440g'
  },
  'frango-arroz-feijao': {
    nome: 'Frango grelhado,\narroz e feijão',
    peso: 'Aprox. 500g'
  },
  'penne-bolonhesa': {
    nome: 'Macarrão penne\ncom molho bolonhesa',
    peso: 'Aprox. 450g'
  },
  'estrogonofe-grao-bico': {
    nome: 'Estrogonofe de\ngrão de bico',
    peso: 'Aprox. 440g'
  },
  'carne-panela': {
    nome: 'Carne de panela',
    peso: 'Aprox. 490g'
  }
};

function gerarEtiquetaMarmita() {
  const selecionada = document.querySelector('#aba-marmitas input[name="marmita"]:checked');

  if (!selecionada) {
    alert('Por favor, selecione uma marmita.');
    return false;
  }

  const marmita = MARMITAS[selecionada.value];
  const etiquetaTexto = document.getElementById('etiquetaTextoMarmitas');
  const observacao = document.getElementById('observacaoMarmita')?.value.trim();
  const posicaoObservacao = document.querySelector('#aba-marmitas input[name="posicaoObservacaoMarmita"]:checked')?.value;

  const blocoObservacao = observacao
    ? `<div class="marmita-observacao">${observacao}</div>`
    : '';

  etiquetaTexto.innerHTML = `
    ${posicaoObservacao === 'acima' ? blocoObservacao : ''}
    <div class="marmita-nome">${marmita.nome.replace(/\n/g, '<br>')}</div>
    <div class="marmita-peso">${marmita.peso}</div>
    ${posicaoObservacao === 'abaixo' ? blocoObservacao : ''}
  `;

  return true;
}

/* ===============================
IMPRESSÃO
=============================== */
function imprimirEtiqueta(tipo = 'potato') {
  let gerou;
  let etiquetaId;

  if (tipo === 'novo') {
    gerou = gerarEtiquetaNovo();
    etiquetaId = 'etiquetaNovo';
  } else if (tipo === 'marmitas') {
    gerou = gerarEtiquetaMarmita();
    etiquetaId = 'etiquetaMarmitas';
  } else {
    gerou = gerarEtiqueta();
    etiquetaId = 'etiqueta';
  }

  if (!gerou) return;

  document.body.dataset.etiquetaImpressao = etiquetaId;
  const etiquetaDiv = document.getElementById(etiquetaId);
  etiquetaDiv.style.display = 'flex';

  setTimeout(() => {
    window.print();
  }, 200);
}

/* ===============================
CONTROLE DE EXTRAS
=============================== */
function controlarExtras() {
  const extrasInputs = document.querySelectorAll('input[type="number"][name^="extra"]');

  let totalSelecionado = 0;

  extrasInputs.forEach(input => {
    totalSelecionado += parseInt(input.value) || 0;
  });

  extrasInputs.forEach(input => {
    const valorAtual = parseInt(input.value) || 0;

    if (totalSelecionado >= 3 && valorAtual === 0) {
      input.disabled = true;
    } else {
      input.disabled = false;

      const maxPermitido = 3 - (totalSelecionado - valorAtual);
      input.max = maxPermitido >= 0 ? maxPermitido : 0;

      if (valorAtual > input.max) {
        input.value = input.max;
      }
    }
  });
}

/* ===============================
BOTÕES DOS EXTRAS
=============================== */
function alterarExtra(botao, delta) {
  const container = botao.parentElement;
  const input = container.querySelector('input[type="number"]');

  let valor = parseInt(input.value) || 0;
  valor += delta;

  if (valor < 0) valor = 0;

  const extrasInputs = document.querySelectorAll('input[type="number"][name^="extra"]');
  let total = 0;

  extrasInputs.forEach(i => {
    if (i !== input) {
      total += parseInt(i.value) || 0;
    }
  });

  if (valor + total > 3) return;

  input.value = valor;

  controlarExtras();
}

function limparExtra(botao) {
  const container = botao.parentElement;
  const input = container.querySelector('input[type="number"]');

  input.value = 0;

  controlarExtras();
}

/* ===============================
INIT
=============================== */
window.addEventListener('DOMContentLoaded', () => {
  controlarExtras();

  const extrasInputs = document.querySelectorAll('input[type="number"][name^="extra"]');

  extrasInputs.forEach(input => {
    input.addEventListener('input', controlarExtras);
  });
});
