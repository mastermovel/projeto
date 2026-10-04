const partes = window.location.pathname.split("/");
const id = partes[2];
carrregarDados(id)
      
function carrregarDados(idUsuario) {
        fetch(`/usuario/${idUsuario}`)
      .then(response => response.json())
        .then(usuario => {
           
            if (null == usuario)
                window.location.href = "/"

        usuario = usuario[0];

        if (usuario.logado == "0")
            window.location.href = "/"

            document.getElementById("nomeUsuario").textContent = usuario.nome;
            document.getElementById("idEditar").value = usuario.idUsuario;
            document.getElementById("emailEditar").value = usuario.email
            document.getElementById("nomeEditar").value = usuario.nome;
            document.getElementById("profissaoEditar").value = usuario.profissao;

        })
        .catch(error => {
            ///window.location.href = "/"

            console.log(error)
        });
}

function excluir() {
        fetch(`/deletar/${id}`,{
            method: "DELETE"})
            .then(response => response.json())
            .then(usuario => {

        Swal.fire({
            title: 'Excluido!',
            text: usuario.msg,
            icon: 'success',
            confirmButtonText: 'Ok'
        }).then(okay => {
            if (okay) {
                window.location.href= "/"
            }      
        })
    }).catch(error => {
         console.error(error);
      });
    }

function editar() {
    fetch(`/editar/${id}`,{
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                { 
                    novoNome: document.getElementById("nomeEditar").value,
                    novoEmail: document.getElementById("emailEditar").value, 
                    novaProfissao: document.getElementById("profissaoEditar").value
                }
            )
    })
    .then(response => response.json())
    .then(response => {
        if (response.erro == null) {
            Swal.fire({
                title: 'Atualizado!',
                text: document.getElementById("nomeEditar").value+ " Atualizado com sucesso",
                icon: 'success',
                confirmButtonText: 'Ok'
            }) 
        } else {
            Swal.fire({
                title: 'ERRO!',
                text: " Erro ao atualizar",
                icon: 'error',
                confirmButtonText: 'Ok'
            }) 
        }
        
    }).catch(error => {
        console.log(error);
    });
}
