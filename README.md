# Blog

Este projeto teve como objetivo criar um Blog de notícias em que haveria uma navegação intuitiva, armazenamento das informações em um banco de dados e a possibilidade de fácil execução para excluir ou inserir novas notícias. 

<br>

## Tecnologias utilizadas:

<br>

1. Front-End:

    - HTML5
    - CSS3
    - Framework Bootstrap

<br>

2. Back-End:

    - Node.JS
    - Framework Express.JS
    - Banco de dados não relacional MongoDB       

<br>

### Página Inicial
---

<br>

A página inicial é constituida por:

- um _header_ contendo um campo de pesquisa para buscar notícias com base nas palavras chaves inseridas e um botão direcionador ao painel administrador das notícias

- um _body_ contendo inicialmente em destaque a última notícia cadastrada, as notícias anteriores e as cinco mais lidas de todo o histórico  

Clicando em qualquer notícia, serás encaminhado à página individual das notícias   

![index-edit](https://user-images.githubusercontent.com/80423723/214064219-b0c686ab-8a26-4407-b138-2d77d31a4a60.gif)

<br>

### Página Individual da Notícia
---

<br>

Na página individual há o já citado, _header_ seguido, em destaque, da imagem de capa da notícia e seu conteúdo textual. Ao lado do conteúdo também se faz presente novamente o campo das notícias mais lidas.

![noticia-single-edit](https://user-images.githubusercontent.com/80423723/214064465-2d2ca413-77e9-4476-bf25-26e1628c540c.gif)

<br>

### Página de Busca
---

<br>

Após inserir palavras chaves para realizar a busca de notícias haverá uma página contendo o número de notícias encontradas, em que as palavras digitadas coincidem com as dos títulos, além das próprias notícias listadas.

![busca-edit](https://user-images.githubusercontent.com/80423723/214064571-f8dad708-956a-4b6a-98af-990de0c1b2d4.gif)

<br>

### Painel Administrador de Notícias
---

<br>

Ao clicar no botão _Painel_ presente no _Header_ serás direcionado à página de login. Logo após de inserir o login e senha será carregada a página de gerenciamento das notícias. 

Nesta é possível observar então campos para inserir o título, realizar o upload da imagem, digitar o conteúdo e escolher alguma categoria que a notícia se encaixe.

Abaixo destes campos há a listagem das notícias já cadastradas, onde é possível executar a exclusão de alguma em específico.

![admin-panel-edit](https://user-images.githubusercontent.com/80423723/214064728-a8452920-44bb-4a27-9be3-7a2b6ff20a73.gif)
