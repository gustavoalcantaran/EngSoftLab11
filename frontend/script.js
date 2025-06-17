const apiUrl = 'http://127.0.0.1:5000/tarefas';
// Função para carregar tarefas
async function loadTarefa() {
    const response = await fetch(apiUrl);
    const tarefas = await response.json();
    const tarefaList = document.getElementById('tarefa-list');
    tarefaList.innerHTML = '';
    tarefas.forEach(tarefa => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${tarefa.descricao}
            <button onclick="deleteTarefa(${tarefa.id})">Excluir</button>
            <button onclick="editTarefa(${tarefa.id},
'${tarefa.descricao}')">Editar</button>
    `;
        tarefaList.appendChild(li);
    });
}
// Função para adicionar tarefa
async function addTarefa() {
    const descricao = document.getElementById('tarefa-input').value;
    await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descricao }),
    });
    document.getElementById('tarefa-input').value = '';
    loadTarefa();
}
// Função para deletar tarefa
async function deleteTarefa(id) {
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    loadTarefa();
}
// Função para editar uma tarefa
async function editTarefa(id, currentDescricao) {
    const newDescricao = prompt("Edite a tarefa:", currentDescricao);
    if (newDescricao !== null) {
        await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ descricao: newDescricao }),
        });
        loadTarefa();
    }
}
// Inicialização
document.getElementById('add-tarefa-button').addEventListener('click',
addTarefa);
loadTarefa();

const produtos = [
    { id: 1, descricao: "Caneta", preco: 2.50 },
    { id: 2, descricao: "Borracha", preco: 1.75 },
    { id: 3, descricao: "Régua", preco: 3.00 }
];

let itensNota = [];

function atualizarLista() {
    const ul = document.getElementById('itens-nota');
    ul.innerHTML = '';
    let total = 0;
    itensNota.forEach(item => {
        const produto = produtos.find(p => p.id === item.id);
        const subtotal = produto.preco * item.quantidade;
        total += subtotal;
        const li = document.createElement('li');
        li.textContent = `${item.quantidade}x ${produto.descricao} - R$ ${subtotal.toFixed(2)}`;
        ul.appendChild(li);
    });
    document.getElementById('total').textContent = total.toFixed(2);
}

document.getElementById('adicionar-item').onclick = function() {
    const select = document.getElementById('produto');
    const id = parseInt(select.value);
    const quantidade = parseInt(document.getElementById('quantidade').value);

    if (!quantidade || quantidade < 1) return;

    let item = itensNota.find(i => i.id === id);
    if (item) {
        item.quantidade += quantidade;
    } else {
        itensNota.push({ id, quantidade });
    }
    atualizarLista();
};

document.getElementById('finalizar-compra').onclick = function() {
    const dataEmissao = document.getElementById('data').textContent;
    let total = 0;
    const itens = itensNota.map(item => {
        const produto = produtos.find(p => p.id === item.id);
        const subtotal = produto.preco * item.quantidade;
        total += subtotal;
        return {
            id: produto.id,
            descricao: produto.descricao,
            preco_venda: produto.preco,
            quantidade: item.quantidade
        };
    });

    const notaFiscal = {
        data_emissao: dataEmissao,
        total: total.toFixed(2)
    };

    const notaFiscalItens = itens;

    baixarJSON(notaFiscal, "Nota Fiscal.json");
    baixarJSON(notaFiscalItens, "NotaFiscalItem.json");
};

function baixarJSON(obj, nomeArquivo) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj, null, 2));
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", nomeArquivo);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}