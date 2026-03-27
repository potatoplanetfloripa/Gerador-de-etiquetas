function gerarEtiqueta() {
  const tipo = document.querySelector('input[name="tipo"]:checked');
  const recheio = document.querySelector('input[name="recheio"]:checked');
  const finaisSelecionados = Array.from(document.querySelectorAll('input[name="final"]:checked'));
  const gramasSelecionadas = Array.from(document.querySelectorAll('input[name="gramas"]:checked'));
  const extrasInputs = document.querySelectorAll('input[type="number"][name^="extra"]');

  if (!tipo || !recheio) {
    alert('Por favor, selecione um tipo e um recheio.');
    return false;
  }

  // Monta extras
  let totalExtras = 0;
  const extrasText = [];

  extrasInputs.forEach(input => {
    const quantidade = parseInt(input.value) || 0;
    const nome = input.parentElement.querySelector('span').textContent.trim();

    if (quantidade > 0) {
      totalExtras += quantidade;
      extrasText.push(`${quantidade}x ${nome.toLowerCase()}`);
    }
  });

  if (totalExtras > 3) {
    alert('Você pode selecionar no máximo 3 unidades no total para os extras.');
    return false;
  }

  if (finaisSelecionados.length > 2) {
    alert('Você pode selecionar no máximo 2 finais.');
    return false;
  }

  // Monta linhas para exibir na etiqueta
  const linhasEtiqueta = [
    ...gramasSelecionadas.map(f => f.value),
    tipo.value,
    recheio.value,
    ...extrasText,
    ...finaisSelecionados.map(f => f.value)
  ];

  // Atualiza o conteúdo da etiqueta no HTML
  const etiquetaTexto = document.getElementById('etiquetaTexto');
  etiquetaTexto.innerHTML = linhasEtiqueta
    .filter(Boolean)
    .map(linha => `<div>${linha}</div>`)
    .join('');

  return true;
}

function imprimirEtiqueta() {
  const gerou = gerarEtiqueta();
  if (gerou) {
    const etiquetaDiv = document.getElementById('etiqueta');
    etiquetaDiv.style.display = 'flex';

    setTimeout(() => {
      window.print();
    }, 200);
  }
}

// Limita extras a no máximo 3 unidades no total
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

window.addEventListener('DOMContentLoaded', () => {
  controlarExtras();
  const extrasInputs = document.querySelectorAll('input[type="number"][name^="extra"]');
  extrasInputs.forEach(input => {
    input.addEventListener('input', controlarExtras);
  });
});


// ===============================
// NOVAS FUNÇÕES (BOTÕES MOBILE)
// ===============================

function alterarExtra(botao, delta) {
  const container = botao.parentElement;
  const input = container.querySelector('input[type="number"]');

  let valor = parseInt(input.value) || 0;
  valor += delta;

  if (valor < 0) valor = 0;

  // calcula total sem o atual
  const extrasInputs = document.querySelectorAll('input[type="number"][name^="extra"]');
  let total = 0;

  extrasInputs.forEach(i => {
    if (i !== input) {
      total += parseInt(i.value) || 0;
    }
  });

  // impede passar de 3 no total
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
