<h1 align="center">drawJS📖</h1>

<p align="center">📝 Projeto desenvolvido em Javascript (Node.js) e Python (Pandas, Tensorflow, Numpy e Opencv), composto por uma rede-neural convolucional treinada segundo aprendizado supervisionado, embarcada em um servidor, que é capaz de receber entradas do usuário, servir ao modelo matemático e devolver a resposta ao usuário. </p>

<hr>
  
### 💻 Tecnologias
Principais dependências utilizadas:
- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/en/api.html)
- [Socket.io](https://socket.io/pt-br/docs/v4/)
- [Sequelize](https://sequelize.org/api/v6/identifiers)
- [Jimp](https://www.npmjs.com/package/jimp)
- [TensorFlow.js](https://js.tensorflow.org/api/latest/?hl=pt-br&_gl=1*1b1gojl*_ga*MTU1NDA3NzMwMy4xNjczMTAzODg3*_ga_W0YLR4190T*MTY4MjQzNDUyNS4yMy4wLjE2ODI0MzQ5OTUuMC4wLjA.)
- [TensorFlow](https://www.tensorflow.org/api_docs/python/tf)
- [Pandas](https://pandas.pydata.org/docs/reference/index.html)
- [Numpy](https://numpy.org/doc/stable/reference/)
- [OpenCV](https://docs.opencv.org/4.x/)

### Rotas
- requisição GET em '/': 
    * Renderiza a página inicial
- requisição GET em '/login': 
    * Renderiza a página de login
- requisição POST em '/login': 
    * Processa os dados de login. Se não houver erros, é redirecionado para /draw
- requisição GET em '/registro': 
    * Renderiza a página de registro
- requisição POST em '/registro': 
    * Processa os dados de registro. Se não houver erros, é redirecionado para /login
- requisição GET em '/draw':
    * Se logado, renderiza a página de esboços.
    * Funcionamento:
        * Usuário fornece dados de entrada
        * Um evento é emitido pelo cliente, contendo dados da imagem desenhada.
        * Servidor recebe o evento e os dados da imagem
        * A imagem é pré-processada:
            * É realizado a inversão de cores;
            * Dilatação: Convolução útil para aumentar área dos traços desenhados;
            * Conversão dos canais da imagem (3 canais são transformados em apenas 1);
            * Centralização dos valores de cada píxel entre -1 e 1;
            * Transformação do dado, array se transforma em tensor de dimensões (1, size, size, 1), onde size é o tamanho da imagem, assim como a rede neural foi treinada.
        * O tensor é processado pela rede-neural, e assim duas saídas são geradas:
            * Descrição: Descrição do desenho;
            * Probabilidade: Probabilidade de acerto da classificação da rede-neural.
<hr>
  <p align="center">
  <img src=https://github.com/reidn3r/drawjs/blob/master/public/src/to_readme/gif-drawjs.gif alt="animated" />
  </p>
### Requisitos:
Necessário ter Git e Node instalado  


### ⌨️ Rodando o servidor:
```bash
# Clone este repositório
$ git clone https://github.com/reidn3r/drawjs

# Acesse a pasta do projeto no terminal/cmd
$ cd drawjs

# Instale as dependências
$ npm install

#Crie um arquivo com o nome '.env' na raíz do diretório do projeto. Nele, deve ser definido algumas variáveis de ambiente
   # variável PORT: deve ser associado um número inteiro, é a porta onde está rodando o servidor
   # variável IMGSIZE: Inteiro de valor 64
   # variável MODEL_PATH: Variável que aponta pro modelo (arquivo .json) tensorflow 
   # variável CLASSES: Nome do arquivo .json (dentro de LabelEncoder) contendo as classes em pt-br 


    #Variáveis de configuração do banco de dados RELACIONAL
    # variável DB_NAME: Nome do banco de dados
    # variável DB_USER: Usuário do banco de dados
    # variável DB_PW: Senha de acesso ao banco de dados
    # variável DB_DIALECT: mysql ou pg ou mssql
    # variável DB_PORT: Porta do banco de dados
    # variável DB_HOST: localhost 

   # variável SECRET: hash útil para criação do token de acesso no login 

# Execute a aplicação em modo de desenvolvimento
$ npm run dev
