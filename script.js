let url_projeto = "https://desafio-15-dias-ab748-default-rtdb.firebaseio.com/";

let estaEditando =  false;

// LISTA AS TAREFAS ARMAZENADAS NO BANCO
function getLista() {
    let html = '';
    let listaDeTarefaSalvas = document.getElementById("listaDeTarefaSalvas");

    fetch(url_projeto + "tarefas.json").then((response => {
        
        if(response.status === 200) {
            response.json().then(dados => {
                let arrayListaTarefas = Object.entries(dados);
                    arrayListaTarefas.forEach(elemento => {
                        html += montarLista(elemento[1]);
                    });
                    listaDeTarefaSalvas.innerHTML = html;
            })
        }
    }));
};

function montarLista (tarefa) {

     return `<li id="'${tarefa.id}'"> 
                ${tarefa.titulo}
                ${tarefa.descricao}
            <button onclick="editarTarefa('${tarefa.id}')">Editar</button>
            <button onclick="deletarTarefa('${tarefa.id}')">Deletar</button>
        </li>`;
};
// edita uma tarefa
function editarTarefa(id) {
    if(!estaEditando) {
    let liParaEditar = document.getElementById(`'${id}'`);
        const html = `<div>
                            <div>
                                <label>Editar Título</label><br>
                                <input id="titulo" placeholder="título de tarefa"/>
                            </div>
                            <div>
                                <label>Editar Descrição</label><br>
                                <textarea id="descricao" placeholder="descrição da terafa"></textarea>    
                            </div>
                             <button onclick="salvarTarefa()">Editar</button>
                        </div>`;
        liParaEditar.innerHTML = html;
        estaEditando = true;
    };
};

function salvarTarefa () {
    alert("teste")
};



function deletarTarefa(id) {
    alert('d');
}


// FAZ UM REGISTRO NO BANCO DE DADOS
function criarTarefa () {

    let titulo = document.getElementById("titulo").value;
    let descricao = document.getElementById("descricao").value;
    let resposta = document.getElementById("mensagem");

    // OBJETO
    const tarefa = {
        id: new Date().toISOString(),
        titulo: titulo,
        descricao: descricao,
    };

    // ENVIO PARA O FIREBASE
    try {
        fetch(url_projeto + "tarefas.json", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'
            },
            body: JSON.stringify(tarefa),
        }).then( (response) => {
            console.log(response.status);
            
            if (response.status === 200) {
                resposta.innerHTML = `<b>Salvo com Sucesso</b>`;
            } else {
                resposta.innerHTML = `<b>Erro ao Salvar</b>`;

            }
        } );
    } catch (error) {
        console.log(error);
        resposta.innerHTML = `<i>${error}</i>`;
    }

};