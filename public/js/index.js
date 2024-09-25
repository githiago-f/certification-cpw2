const totalText = document.getElementById('total');
const valorInput = document.getElementById('valor');
const nomeInput = document.getElementById('nome');
const listaDespesas = document.getElementById('despesas');
const mensagem = document.getElementById('mensagem');

// Carrega a página
async function main() {
    // carrega o total
    const { total } = await fetch('/despesas/total').then(res => res.json());
    // atualiza o total das despesas e insere em BRL
    totalText.textContent = Number(total).toLocaleString('pt-br', { currency: 'BRL', style: 'currency' });
    carregaDespesas();
}

async function carregaDespesas() {
    const paginaDeDespesas = await fetch('/despesas').then(res => res.json());

    // atualiza a lista de despesas
    listaDespesas.innerHTML = (paginaDeDespesas.content ?? [])
        .map(despesa => (`
            <li class="despesa">
                <span>${despesa.nome}</span>&nbsp;
                <span>${Number(despesa.valor).toLocaleString('pt-br', { currency: 'BRL', style: 'currency' })}</span>
            </li>
        `))
    .join('');
}

// cria nova despesa
document.getElementById("novaDespesa").addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await fetch('/despesas', { 
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ valor: Number(valorInput.value.replace(',', '.')), nome: nomeInput.value })
    });
    const data = await res.json();

    if(res.status === 201) {
        pagina = 0;
        valorInput.value = '';
        nomeInput.value = '';
        mensagem.style.display = 'none';
        // chama a atualização da página
        main();
        return true;
    }

    mensagem.innerHTML = 'Algo deu errado, verifique os dados e tente novamente <br/>' + (data.map(i => i.message).join('<br/>'));
    mensagem.style.display = 'block';
});

main();
