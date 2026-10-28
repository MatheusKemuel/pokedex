# Pokédex
Projeto de estudo desenvolvido com HTML, CSS e JavaScript, 
utilizando a PokéAPI para consultar informações sobre Pokémon.

## Funcionalidades
- Listagem dos 151 Pokémon da primeira geração na tela inicial.
- Pesquisa por nome ou número.
- Filtro por tipo.
- Dropdown de filtros em telas menores.
- Modal com detalhes do pokémon, como, imagem, nome, descrição,
habilidades, tipo, peso e altura.
- Alternância entre imagens da versão normal para a versão shiny.
- Navegação entre Pokémon pelos botões Previous e Next dentro do modal.
- Layout responsivo.

## Tecnologias

  - HTML5
  - CSS3
  - JavaScript
  - PokéAPI

## Como executar

1. Baixe ou clone o repositório.
2. Abra a pasta no VSCode.
3. Execute o index.html com a extensão Live Server, 
ou abra o arquivo index.html com o navegador pelo explorador de arquivos.

## Estrutura do projeto

    pokedex/
    ├── assets/         # Imagens e ícones
    ├── css/
    │   └── style.css   # Estilos e responsividade
    ├── js/
    │   └── script.js   # API, cards, pesquisa, filtros e modal
    ├── index.html      # Estrutura da página
    └── README.md       # Documentação


## Como funciona

### Caregamento dos pokémon

 O JavaScript consulta a PokéAPI e guarda os Pokémon carregados no array `todosPokemons()`. A função `mostraPokemon()` cria os cards.



![alt text](<Captura de tela 2026-10-28 161249-1.png>)




### Pesquisa 

 A pesquisa consulta a API pelo nome ou número informado e exibe o pokémon encontrado.


![alt text](<Captura de tela 2026-10-28 161235.png>)



### Filtro

 Os filtros usam os dados armazenados em todosPokemon.
 O método `filter` seleciona os Pokémon, enquanto `some` verifica se algum dos seus tipos corresponde ao escolhido.


![alt text](<Captura de tela 2026-10-28 161242.png>)



### Modal 

 Ao clicar em um card, o site usa seu data-id para consultar os dados. A função preencherModal atualiza as informações antes de abrir o dialog, então o modal ja abre com os dados atualizados.


![alt text](<Captura de tela 2026-10-28 161258.png>)


### Navegação no modal

Os botões **Previous** e **Next** exibem o Pokémon anterior ou o próximo
sem fechar o modal. A navegação segue a ordem dos IDs de 1 a 151,
independentemente do filtro selecionado na listagem.

- `pokemonAtualId` guarda o ID do Pokémon exibido.
- `carregarPokemonModal()` consulta os dados na API e utiliza
  `preencherModal()` para atualizar as informações e a imagem.
- `carregandoModal` impede novas buscas simultâneas durante a troca.
- `atualizarBotoesModal()` desabilita os dois botões durante o carregamento,
  o Previous no ID 1 e o Next no ID 151.

Ao abrir um card, seu ID se torna o ponto de partida da navegação.
Se uma pesquisa abrir um Pokémon com ID acima de 151, os dois botões
ficam desabilitados, pois a navegação está limitada à primeira geração.

Se a consulta falhar, um alerta informa o erro e o ID atual é preservado.
Ao terminar a tentativa, os botões são atualizados para permitir uma nova
ação. Cada troca bem-sucedida começa com a imagem normal do Pokémon;
o botão shiny continua disponível quando há uma imagem dessa versão.

### Versão shiny

 O botão alterna entre front_default e front_shiny, que são os end-points das imagens normal e shiny respectivamente.

### API utilizada 

 - /pokemon/{id ou nome}/ — dados, imagens, tipos e estatísticas.
 - /pokemon-species/{id ou nome}/ — descrições da espécie.

 **Documentação: https://pokeapi.co/docs/v2**

### Programação assíncrona

O carregamento dos dados utiliza Promises com `.then()` e funções
com `async/await`.

O `await` permite aguardar uma resposta antes de executar uma
operação que depende dela, como preencher e abrir o modal.

### Manipulação do DOM

Os elementos da página são selecionados com `querySelector()` e
`querySelectorAll()`.

Para atualizar a interface, são utilizados:

- `createElement()`: cria elementos, como cards e opções do dropdown.
- `append()`: adiciona os elementos à página.
- `textContent`: atualiza textos.
- `innerHTML`: insere a estrutura HTML dos cards e das badges.
- `replaceChildren()`: remove os cards antes de exibir novos resultados.
- `classList.toggle()`: destaca o filtro selecionado.
- `style.width`: ajusta as barras das estatísticas.


### Eventos e delegação de eventos

O método `addEventListener()` registra interações do usuário:

- `click`: seleção de cards, filtros, limpeza da seleção e navegação
  pelos botões Previous e Next do modal.
- `submit`: envio do formulário de pesquisa.
- `change`: alteração do tipo selecionado no dropdown.

O método `preventDefault()` impede que o formulário recarregue a página.
