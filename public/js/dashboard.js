const partes = window.location.pathname.split("/");
const id = partes[2];

carregarDados(id);

function carregarDados(idUsuario) {

fetch(`/usuario/${idUsuario}`)
    .then(response => {

        if (!response.ok) {
            throw new Error("Erro ao buscar usuário");
        }

        return response.json();
    })

    .then(usuario => {

        usuario = usuario[0];

        if (!usuario) {
            throw new Error("Usuário não encontrado");
        }

        if (usuario.logado == "0") {
            window.location.href = "/";
            return;
        } else {
            document.getElementById("nomeUsuario").textContent = usuario.nome;
            Swal.fire({
                title: 'Bem vindo!',
                text: 'Aguarde...',
                icon: 'success',
                confirmButtonText: 'Ok'
            })
        }  
    })
    .catch(error => {
        console.error("Erro:", error);
    });
}

function abrirMeuPerfil() {
    window.location.href = `/perfil/${id}`;
}

 function listarUsuarios() {

fetch("/usuarios/")
    .then(response => {

        if (!response.ok) {
            throw new Error("Erro ao buscar usuários");
        }
      
        return response.json()

    }).then(usuarios => {
        const divListar = document.getElementById("divListar");
        divListar.innerHTML = "";
        usuarios.forEach(usuario => {

            divListar.innerHTML += 
          ` <div class="card mb-12">
                    <div class="card-body">
                         

                        <h5 class="card-title">
                        Usuário
                        </h5>
                        
                        <p class="card-text">
                          Nome:  ${usuario.nome}
                        </p>

                        <p class="card-text">
                            E-mail: ${usuario.email}
                        </p>

                        <p class="card-text">
                            Profissão: ${usuario.profissao}
                        </p>
                    </div>
                </div>
                <br>
            `
        });
    })

    .catch(error => {
        console.error("Erro ao listar usuários:", error);
    });

}

function extrairId() {
    const partes = window.location.pathname.split("/");
    return partes[2];
}


function logout() {
    fetch(`/logout/${id}`)
    .then(response => {
               
        if (!response.ok) {
            throw new Error("Erro ao deslogar usuário");
        }

        return response.json();
    })
    .then(() => {
       Swal.fire({
                title: 'Logout com sucesso!',
                text: '',
                icon: 'success',
                confirmButtonText: 'Ok'
        })
        .then(okay => {
            if (okay) {
                window.location.href= "/"
            }      
        })
    })
    .catch(error => {
        console.error("Erro:", error);
    });
}
