const express = require('express');

const app = express();
const PORT = 3000;
let mysql = require('mysql2');
const con = mysql.createPool({
    host: "localhost",
    user: "admin",
    password: "Projeto@1234",
    database: "projeto",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middleware essencial para fazer o Express entender JSON no corpo (body) da requisição
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
      res.sendFile(__dirname + "/public/login.html");
})

app.get("/registro", (req, res) => {
    res.sendFile(__dirname + "/public/cadastro.html");
})

app.get("/dashboard/:id", (req, res) => {
    res.sendFile(__dirname + "/public/dashboard.html");           
});
 
app.get("/perfil/:id", (req, res) => {
    res.sendFile(__dirname + "/public/perfil.html");           
});


app.put('/editar/:id', (req, res) => {

    const {novoNome, novoEmail, novaProfissao} = req.body;
   
    
    let sql = "UPDATE projeto.usuarios SET nome = ?, email = ?, profissao = ? WHERE idUsuario = ?"
        con.query(sql, [novoNome, novoEmail, novaProfissao, req.params.id], function (err, result) {
             console.log(result)           
             console.log(err)
            if (err) {
               res.status(400).json({ erro: 'Erro interno do servidor.' });
            } else {
               res.status(200).json({ msg: 'Cadastrado com sucesso!' });
            }
        });  
       
   });  

app.post('/cadastrar', (req, res) => {
   

    // Os dados enviados chegam dentro de req.body
    const { nome, email, profissao, senha, senha2 } = req.body;

    if (!nome || !senha || !senha2 || !profissao) {
        return res.status(400).json({ erro: 'Campos incompletos.' });
   
    }

    if (senha !== senha2) {
        return res.status(400).json({ erro: 'Senhas não conferem.' });
    }

    let sql = "INSERT INTO projeto.usuarios (nome, email, senha, profissao, logado) VALUES (?,?,?,?,?)";
    
        con.query(sql,[nome, email, senha, profissao, true], function (err, result) {
            if (err || result == 0) {
              return  res.status(400).json({ erro: 'Erro interno do servidor.', err });
            } else {
              return res.status(200).json({"id" : result.insertId}) 
            }               
        }) 
             
    });


app.get("/usuario/:id", (req, res) => {

    if (!req.params.id) {
        return res.json({ erro: 'Usuario não logado.' });
    }

    let Sql = "SELECT * FROM projeto.usuarios WHERE idUsuario = ?"
    let sqlLiberaAcesso = "UPDATE projeto.usuarios SET logado = '1' WHERE idUsuario = ?"
    con.query(Sql, req.params.id , function (err, result) {
        if (result == 0) {
            return res.status(400).json({ erro: 'Erro interno do servidor.' });
        }
    
        con.query(sqlLiberaAcesso, req.params.id , function (err, acesso) {
                if (acesso == 0) {
                    res.status(400).json({ erro: 'Erro interno do servidor.' });
                }
                    if (err)
            return res.status(400).json({ erro: 'Erro interno do servidor.' });

            });

        
        res.send(JSON.stringify(result))

    });
     
}); 



app.post("/login", (req, res) => {
    
    const sql = "SELECT * FROM projeto.usuarios WHERE email = ? AND senha = ?";
    const sqlLiberaAcesso = ` UPDATE projeto.usuarios SET logado = 1 WHERE idUsuario = ? `;
    const {email, senha} = req.body;

    con.query( sql, [email, senha],
    function (err, result) {
        if (err) { console.log("Erro SELECT:", err); 
            return res.status(500).json({ erro: "Erro interno do servidor." }); 
        } 
        if (result.length === 0) { 
            return res.status(401).json({ erro: "E-mail ou senha incorretos." }); 
        } 

        const usuario = result[0]; console.log("Usuário encontrado:", usuario); // Libera o acesso 
        con.query( sqlLiberaAcesso, [usuario.idUsuario], 
       
            function (err, acesso) { 
             if (err) { console.log("Erro UPDATE:", err);
                return res.status(500).json({ erro: "Erro ao liberar acesso." }); 
             } 
                console.log("Acesso liberado:", acesso); 
                return res.json({ sucesso: true, idUsuario: usuario.idUsuario, nome: usuario.nome });
        }); 
    }); 
});


app.get("/usuarios/", (req, res) => {

    let Sql = "SELECT * FROM projeto.usuarios"
    con.query(Sql, function (err, result) {        
    if (err)
        res.status(400).json({ erro: 'Erro interno do servidor.' });
    
    if (result == 0) {
        res.status(400).json({ erro: 'Erro interno do servidor.' });
    }
        res.status(200).send(result); 
    });
}); 


app.delete("/deletar/:id", (req, res) => {

    if (!req.params.id) {
        return res.json({ erro: 'Usuario não logado.' });
    }

    let Sql = "DELETE FROM projeto.usuarios WHERE idUsuario = ?"
    con.query(Sql, req.params.id , function (err, result) {
        if (result == 0) {
            res.status(400).json({ erro: 'Erro interno do servidor.' });
        }

        res.status(200).json({ msg: 'Excluido com sucesso' });
        
    });
}); 

app.get("/logout/:id", (req, res) => {
    console.log("logout")
     const sqlLogout = ` UPDATE projeto.usuarios SET logado = 0 WHERE idUsuario = ? `;
      con.query( sqlLogout, [req.params.id],
         function (err, result) {
             if (err) { console.log("Erro :", err); 
                return res.status(500).json({ erro: "Erro interno do servidor." }); 
            } 
             console.log(result)
             if (result.length === 0) { 
                return res.status(401).json({ erro: "E-mail ou senha incorretos." }); 
            } else {
                return res.status(200).json({ msg: "Logout com sucesso" }); 
            }

    } ); 
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}/`);
});
