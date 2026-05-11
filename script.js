/* ===============================
CONTROLE DE ABAS
=============================== */
function trocarAba(aba) {
const abaPotato = document.getElementById('aba-potato');
const abaNovo = document.getElementById('aba-novo');

const btnPotato = document.getElementById('btn-potato');
const btnNovo = document.getElementById('btn-novo');

if (aba === 'potato') {
abaPotato.style.display = 'block';
abaNovo.style.display = 'none';

```
btnPotato.classList.add('aba-ativa');
btnNovo.classList.remove('aba-ativa');
```

} else {
abaPotato.style.display = 'none';
abaNovo.style.display = 'block';

```
btnNovo.classList.add('aba-ativa');
btnPotato.classList.remove('aba-ativa');
```

}
}

/* ===============================
GERADOR BASE (REUTILIZÁVEL)
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

// LINHAS
let linhasEtiqueta = [
...gramasSelecionadas.map(f => f.value),
tipo.value,
recheio.value,
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

/* ===============================
IMPRESSÃO
=============================== */
function imprimirEtiqueta(tipo = 'potato') {
const gerou = tipo === 'novo' ? gerarEtiquetaNovo() : gerarEtiqueta();

if (!gerou) return;

const etiquetaId = tipo === 'novo' ? 'etiquetaNovo' : 'etiqueta';
const etiquetaDiv = document.getElementById(etiquetaId);

etiquetaDiv.style.display = 'flex';

setTimeout(() => {
window.print();
}, 200);
}

/* ===============================
CONTROLE DE EXTRAS (GLOBAL)
=============================== */
function controlarExtras() {
const extrasInputs = document.querySelectorAll('input[type="number"][name^="extra"]');

let totalSelecionado = 0;

extrasInputs.forEach(input => {
totalSelecionado += parseInt(input.value) || 0;
});

extrasInputs.forEach(input => {
const valorAtual = parseInt(input.value) || 0;

```
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
```

});
}

/* ===============================
BOTÕES MOBILE (EXTRAS)
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
