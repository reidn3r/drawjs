const jwt = require('jsonwebtoken');

const checkLogin = (req, res, next) => {
    /* 
        1. Verifica se o usuário está logado.
            1.1: Middleware usado para evitar que um usuário faça
            login mais de uma vez/faça registro enquanto está logado

            - Se logado, redireciona para funcionalidade principal.
            - Se não logado, deixa entrar na pagina de login/registro
    */
    const token = req.cookies.jwt;
    if(!token) return next();
    
    try{
        jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
            if(err){
                res.redirect('/login');
            }
            else{
                return res.status(200).redirect("/draw");
                // next();
            }
        });
        // next();
    }
    catch(err){
        res.status(401).redirect('/login');
    }
}

module.exports = checkLogin;
