const totalText = document.getElementById('total');
const valorInput = document.getElementById('valor');
const nomeInput = document.getElementById('nome');
const listaDespesas = document.getElementById('despesas');
const mensagem = document.getElementById('mensagem');

async function main() {
    const { total } = await fetch('/despesas/total').then(res => res.json());
    totalText.textContent = Number(total).toLocaleString('pt-br', { currency: 'BRL', style: 'currency' });
    carregaDespesas();
}

async function carregaDespesas() {
    const paginaDeDespesas = await fetch('/despesas').then(res => res.json());
    listaDespesas.innerHTML = (paginaDeDespesas.content ?? []).map(despesa => (`
        <li class="despesa"><span>${despesa.nome}</span>&nbsp;<span>${Number(despesa.valor).toLocaleString('pt-br', { currency: 'BRL', style: 'currency' })}</span></li>
    `)).join('');
}

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
        carregaDespesas();
        mensagem.style.display = 'none';
        return true;
    }

    mensagem.innerHTML = 'Algo deu errado, verifique os dados e tente novamente <br/>' + (data.map(i => i.message).join('<br/>'));
    mensagem.style.display = 'block';
});

main();
