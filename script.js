let url_projeto = "https://desafio-15-dias-ab748-default-rtdb.firebaseio.com";

let estaEditando =  false;

// LISTA AS TAREFAS ARMAZENADAS NO BANCO (R)
function getLista() {
    let html = "";
    let listaDeTarefaSalvas = document.getElementById("listaDeTarefaSalvas");

    fetch(url_projeto + "/tarefas.json").then((response => {
        
        if(response.status === 200) {
            response.json().then(dados => {
                let arrayListaTarefas = Object.entries(dados);
                    arrayListaTarefas.forEach(elemento => {
                        html += montarLista(elemento[1], elemento[0]);
                    });
                        listaDeTarefaSalvas.innerHTML = html;
            })
        }

    }))

    };


function montarLista (tarefa, idBanco) {

     return `<li class="tarefa" id="'${tarefa.id}'"> 
                ${tarefa.titulo}
                ${tarefa.descricao}
            <button class="btn_edi" onclick="editarTarefa('${tarefa.id}', '${idBanco}')">Editar</button>
            <button class="btn_del" onclick="deletarTarefa('${idBanco}')">Deletar</button>
        </li>`;
};

// EDITAR TAREFA (U)
function editarTarefa(id, idBanco) {
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
                             <button onclick="salvarTarefa('${idBanco}')">Confirmar</button>
                             <button onclick="cancelarEdit()">Cancelar</button>
                        </div>`;
        liParaEditar.innerHTML = html;
        estaEditando = true;
    };
};

function salvarTarefa (idBanco) { 
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;

      // OBJETO
    const tarefa = {
        id: new Date().toISOString(),
        titulo: titulo,
        descricao: descricao,
    };

    // ENVIO ALTERAÇÃO PARA FIREBASE
        fetch(url_projeto + `/tarefas/${idBanco}.json`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'
            },
            body: JSON.stringify(tarefa),
        }).then(response => {
            if(response.status === 200) {
                estaEditando = false;
                getLista();
            
            }
        });
};


function deletarTarefa(idBanco) {

    const confirme = confirm("Tem certeza que deseja deletar esta tarefa?");
    if(confirme) {

        fetch(url_projeto + `/tarefas/${idBanco}.json`, {
         method: 'DELETE',
        }).then(response => {
            if(response.status === 200) {
                getLista();
            };
        });
    };

};


// FAZ UM REGISTRO NO BANCO DE DADOS (C)
function criarTarefa () {

    let titulo = document.getElementById("titulo").value;
    let descricao = document.getElementById("descricao").value;
    let resposta = document.getElementById("mensagem");

    if(titulo.length <= 0 || descricao.length <= 0) { // verifica se os inputs contem informações
        resposta.innerHTML = `<b>input vazio</b>`;
    } else {

        // OBJETO
        const tarefa = {
            id: new Date().toISOString(),
            titulo: titulo,
            descricao: descricao,
        };

        // ENVIO PARA O FIREBASE
        try {
            fetch(url_projeto + "/tarefas.json", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'
                },
                body: JSON.stringify(tarefa),
            }).then( (response) => {
                console.log(response.status);
                
                if (response.status === 200) {
                    resposta.innerHTML = `<b>Salvo com Sucesso</b>`;
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);// recarrega tela após registro da terafa no banco
                } else {
                    resposta.innerHTML = `<b>Erro ao Salvar</b>`;

                }
            } );
        } catch (error) {
            console.log(error);
            resposta.innerHTML = `<i>${error}</i>`;
        }
    };
};

// recarrega a tela caso o usuário não queira editar a tarefa mais
function cancelarEdit() {
        window.location.reload();
}
