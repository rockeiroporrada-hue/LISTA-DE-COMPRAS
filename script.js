let itens = JSON.parse(localStorage.getItem("itens")) || [];
let orcamento = parseFloat(localStorage.getItem("orcamento")) || 0;

document.getElementById("btnSalvar").addEventListener("click", salvarOrcamento);
document.getElementById("btnAdicionar").addEventListener("click", adicionarItem);

function salvarOrcamento() {
  const campo = document.getElementById("orcamento");
  orcamento = parseFloat(campo.value) || 0;
  localStorage.setItem("orcamento", orcamento);
  atualizar();
}

function adicionarItem() {
  const produto = document.getElementById("produto").value.trim();
  const qtd = parseFloat(document.getElementById("qtd").value);
  const valorInput = document.getElementById("valor").value;
  const valor = valorInput ? parseFloat(valorInput) : null;
  const categoria = document.getElementById("categoria").value;

  if (!produto || !qtd) {
    alert("Informe pelo menos Produto e Quantidade");
    return;
  }

  itens.push({
    produto,
    qtd,
    valor,
    categoria,
    comprado: false
  });

  salvar();
  limparCampos();
}

function limparCampos() {
  document.getElementById("produto").value = "";
  document.getElementById("qtd").value = "";
  document.getElementById("valor").value = "";
}

function definirValor(index, valorDigitado) {
  const valor = parseFloat(valorDigitado);
  if (!isNaN(valor)) {
    itens[index].valor = valor;
    salvar();
  }
}

function marcar(index) {
  itens[index].comprado = !itens[index].comprado;
  salvar();
}

function excluirItem(index) {
  itens.splice(index, 1);
  salvar();
}

function salvar() {
  localStorage.setItem("itens", JSON.stringify(itens));
  atualizar();
}

function atualizar() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  let total = 0;

  itens.forEach((i, idx) => {
    const subtotal = i.valor !== null ? i.qtd * i.valor : 0;
    if (i.valor !== null) total += subtotal;

    const li = document.createElement("li");
    if (i.comprado) li.classList.add("comprado");

    let valorHtml;
    if (i.valor === null) {
      valorHtml = `
        <input 
          type="number" 
          placeholder="Digite o valor" 
          step="0.01"
          onblur="definirValor(${idx}, this.value)"
        >
      `;
    } else {
      valorHtml = `${i.qtd} x R$ ${i.valor.toFixed(2)} = R$ ${subtotal.toFixed(2)}`;
    }

    li.innerHTML = `
      <span>
        <input type="checkbox" ${i.comprado ? "checked" : ""} onchange="marcar(${idx})">
        [${i.categoria}] ${i.produto} - ${valorHtml}
      </span>
      <span class="excluir" onclick="excluirItem(${idx})">❌</span>
    `;

    lista.appendChild(li);
  });

  document.getElementById("total").innerText = total.toFixed(2);
  document.getElementById("totalFooter").innerText = total.toFixed(2);
  document.getElementById("saldo").innerText = (orcamento - total).toFixed(2);
  document.getElementById("orcamento").value = orcamento || "";
}

atualizar();
