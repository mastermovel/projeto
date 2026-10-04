function cadastrar() {
    fetch(`/cadastrar`,{
    method: "POST",
        headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
    nome: document.getElementById("usuario").value,
    email: document.getElementById("email").value, 
    profissao: document.getElementById("profissao").value,
    senha: document.getElementById("senha").value,
    senha2: document.getElementById("senha2").value})
}).then(response => response.json())

    .then((resp) => {
        console.log(resp)
        Swal.fire({
            title: 'Cadastrado!',
            text: "Cadastrado com sucesso",
            icon: 'success',
            confirmButtonText: 'Ok'
        }).then(okay => {
            if (okay) {
                window.location.href= "/dashboard/"+resp.id
            }      
    })
    
}).catch(error => {
        console.log(error);
    });
}



function resetar() {
    document.getElementById("usuario").value = ""
    document.getElementById("email").value = "" 
    document.getElementById("profissao").value = ""
    document.getElementById("senha").value = ""
    document.getElementById("senha2").value = ""
}    