# 🗳️ Simulação Eleitoral Brasileira 2026

## 🎯 Objetivo

Criar uma simulação interativa do cenário hipotético das eleições presidenciais brasileiras de 2026, com três candidatos competindo pela preferência dos eleitores. A simulação será exibida por meio de uma interface web, permitindo a visualização dinâmica do processo eleitoral.

---

## 🗺️ Cenário

A simulação será dividida entre 3 candidatos à presidência:

- **Luiz Inácio Lula da Silva (Lula)**
- **Jair Messias Bolsonaro (Bolsonaro)**
- **Arthur Moledo do Val (Arthur do Val)**

Cada candidato começa com uma quantidade definifinida pelo usuário.

---

## 📜 Regras da Simulação

- **🎨 Identificação Visual**: Cada candidato é representado por uma cor específica: Lula vermelho, Bolsonaro verde e Arthur do Val azul.
- **🔁 Interação entre Eleitores e Cidadãos**: Durante a simulação, cidadãos podem ser convertidos pelos eleitores de cada presidente.
- **🏁 Critério de Vitória**: O grupo de eleitores com maior número ao final do tempo total de duração da simulação, será o vencedor.
- **🏁 Critério de Desempate**: Se dois ou mais grupos de eleitores empaterem, será adicionado 10 segundos na duração da simulação até desempatar.

---

## 📜 Eventos aleatórios

- **🔁 Eleitores virando sem partido (cidadão)**: Entre 1/4 e 1/2 da duração total da simulação, existe a possibilidade aleatória de um eleitor tornar-se cidadão.
- **🔁 Conversão entre eleitores**: Após todos os cidadãos estarem convertidos, existe a possibilidade dos eleitores se converterem entre os candidatos.

---

## 💻 Tecnologias Utilizadas

- HTML
- CSS
- JavaScript

---

## 💻 Biblioteca Utilizada

- AgentScript

## [agentScript](https://agentscript.org)

## Link para acesso do projeto

[Projeto eleição](https://gustavo-enrick.github.io/proj-eng-software/)

## ⚙️ Instalação Local

Para instalar o projeto localmente, siga os passos:

```bash
git clone https://github.com/seu-usuario/proj-eng-software.git
cd proj-eng-software
```

Baixar a extensão **Live Server** e iniciar no arquivo **index.html**.
