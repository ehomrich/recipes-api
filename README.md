# Recipes API

API em Node.js para encontrar receitas a partir de ingredientes.

## Prerequisitos e dependências
Este projeto foi construído com as seguintes dependências:

- [Node](https://nodejs.org/en/download/) ^6.0.0
- [axios](https://www.npmjs.com/package/axios) ^0.18.0
- [dotenv](https://www.npmjs.com/package/dotenv) ^6.0.0
- [Express](https://www.npmjs.com/package/express) ^4.16.3

## Primeiros passos

Para obter uma cópia do projeto, clone este repositório executando o comando abaixo:


```shell
git clone https://github.com/ehomrich/recipes-api
cd recipes-api/
```

Insira sua chave de acesso à [API do Giphy](https://developers.giphy.com/docs/) em `config/.env.example` e renomeie o arquivo para `.env` (para maiores informações, consulte [Configuração](#configuração)).

Em seguida, você pode [instalar os pacotes localmente e executar o projeto](#executando-localmente) ou [construir e executar um container do Docker](#executando-via-docker).


### Executando localmente

Instale as dependências com o gerenciador de pacotes de sua preferência e execute a aplicação com os comandos abaixo:

```shell
# yarn
yarn install
yarn start

# npm
npm install
npm start
```

Faça uma requisição à `localhost:3000` e você deverá receber uma resposta como essa:

```json
{
  message: "Hello world!"
}
```

Para fazer uso da API, consulte a [referência](#referência-da-api).

### Executando via Docker

> Certifique-se de ter o [Docker](https://www.docker.com/get-docker) e o [Docker Compose](https://docs.docker.com/compose/install/#prerequisites) instalados em sua máquina.

Para auxiliar na utilização do Docker, o projeto disponibiliza os arquivos `Dockerfile` e `docker-compose.yml` na raiz do projeto..

Para construir a imagem do serviço, execute o comando:

```shell
docker-compose -f docker-compose.yml build
```

Após o término do processo, execute o projeto com o comando:

```shell
docker-compose -f docker-compose.yml up
```

## Configuração

O projeto depende de três variáveis armazenadas em um arquivo de ambiente (`.env`), no formato `VAR=valor`.

As variáveis são:
- `GIPHY_API`: URL da API de buscas do Giphy.
> Padrão: http://api.giphy.com/v1/gifs/search

- `GIPHY_API_KEY`: chave de acesso à API do Giphy. **Obrigatória**.
> Chaves podem ser solicitadas seguindo a documentação disponível em: https://developers.giphy.com/docs/

- `RECIPE_PUPPY_API`: URL da API pública do Recipe Puppy.
> Padrão: http://www.recipepuppy.com/api/

Um arquivo de modelo é dispnibilizado em `config/.env.example`. Basta criar uma cópia **na mesma pasta**, editar e renomear.

## Referência da API

A API do projeto possui apenas um endpoint:

### GET /recipes/

Este endpoint espera um parâmetro `i`, contendo uma lista de até 3 ingredientes, respeitando a seguinte chamada:

```
http://{HOST}/recipes/?i={ingredient_1},{ingredient_2},{ingredient_3}
```
> O parâmetro `i` deve possuir de 1 a 3 ingredientes.

A partir dos ingredientes informados, é realiza uma consulta à API do Recipe Puppy, e consultas à API do Giphy baseadas no título de cada receita retornada pelo Recipe Puppy.

**Exemplo:**

```
http://localhost:3000/recipes/?i=onions,garlic
```
A resposta desta requisição será semelhante à seguinte:

```json
{
   "keywords":[
      "onions",
      "garlic"
   ],
   "recipes":[
      {
         "title":"Roasted Garlic Grilling Sauce",
         "ingredients":[
            "garlic",
            "hot sauce",
            "onions"
         ],
         "link":"http://www.kraftfoods.com/kf/recipes/roasted-garlic-grilling-sauce-56344.aspx",
         "gif":"https://media1.giphy.com/media/Q4PcMC8apFXBm/giphy.gif"
      },
      {
         "title":"Steamed Mussels I",
         "ingredients":[
            "garlic",
            "mussels",
            "onions"
         ],
         "link":"http://allrecipes.com/Recipe/Steamed-Mussels-I/Detail.aspx",
         "gif":"https://media1.giphy.com/media/iix3nosdByWLm/giphy.gif"
      },
      ...
   ]
}
```

-----
#### Erros

Parâmetros `i` de entrada que não possuam de 1 a 3 ingredientes receberão como resposta o seguinte erro:

```json
{
  status: 400,
  error: "Invalid parameter",
  message: "Incorrectly formatted request or missing required parameters"
}
```

Problemas relacionados à indisponibilidade das APIs do Recipe Puppy e do Giphy, bem como falhas de autenticação e de processamento destes serviços gerarão respostas no formato acima.
