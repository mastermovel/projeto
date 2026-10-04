
function logar() {

    var json = {
        email: document.getElementById("email").value, 
        senha: document.getElementById("senha").value
    }
    
    fetch(`/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(json)
    })
    .then(response => response.json())
    .then(usuario => { 

        if (usuario.sucesso) {          
             window.location.href = "/dashboard/" + usuario.idUsuario;       
        } else { 
            console.log("Erro no login:", usuario.erro); 
             Swal.fire({
                title: 'ERRO!',
                text: " Erro ao logar: "+usuario.erro,
                icon: 'error',
                confirmButtonText: 'Ok'
            }) 
        } 
    })
    .catch(e => {
        console.log("Erro no login:", e); 
    });
}

function resetar() {
    console.log("Resetar")
    document.getElementById("email").value = "" 
    document.getElementById("senha").value = ""
}
      
    