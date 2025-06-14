# 🚜 Projeto Agri Farm - Frontend

Bem-vindo ao frontend do projeto Agri Farm! Esta aplicação foi desenvolvida utilizando React e Vite, focada em fornecer uma interface moderna e responsiva para interagir com a API do Agri Farm.

## 🔗 Site em Produção (Deploy)

Uma versão deste frontend, conectada a uma API em produção, está disponível publicamente em:
**[https://incandescent-belekoy-48a605.netlify.app/](https://incandescent-belekoy-48a605.netlify.app/)**

## ✨ Tecnologias Principais

*   **React:** Biblioteca JavaScript para construir interfaces de usuário.
*   **Vite:** Ferramenta de build frontend de nova geração, extremamente rápida.
*   **Yarn / npm:** Gerenciadores de pacotes.

## 📋 Pré-requisitos

Antes de começar, garanta que você tenha o seguinte instalado em sua máquina:
*   [Node.js](https://nodejs.org/) (que inclui o npm)
*   [Yarn](https://classic.yarnpkg.com/en/docs/install) (opcional, se preferir usar Yarn)
*   **API Backend Rodando:** Para que o frontend funcione completamente, ele precisa se comunicar com a API backend. Você tem duas opções:
    1.  **Rodar a API Localmente:**
        *   Clone o repositório da API: [`https://github.com/matheusaraujo-dev/agri-farm-api`](https://github.com/matheusaraujo-dev/agri-farm-api)
        *   Siga as instruções no `README.md` do repositório da API para executá-la localmente.
    2.  **Usar a API Pública (para desenvolvimento/testes):**
        *   Se não desejar rodar a API localmente, você pode configurar o frontend para usar uma API pública de exemplo disponível em: `https://multlotto.com/extractta/api/`
        *   **Atenção:** Esta API pública é para fins de demonstração e pode não refletir todos os dados ou funcionalidades da API `agri-farm-api` original.

## ⚙️ Configuração do Ambiente

Após clonar o projeto frontend, você precisará configurar a variável de ambiente para que ele saiba onde encontrar a API.

1.  **Crie um arquivo `.env`** na raiz do projeto frontend.
    Você pode copiar o arquivo `.env.example` (se existir) ou criar um novo do zero.

    ```bash
    cp .env.example .env
    # ou crie um arquivo .env manualmente
    ```

2.  **Adicione a variável `VITE_BACKEND_API_URL`** ao arquivo `.env`:

    *   **Se estiver rodando a API localmente** (exemplo, se sua API local roda na porta 3000):
        ```env
        VITE_BACKEND_API_URL=http://localhost:3333/api
        ```
        (Ajuste a porta e o caminho base `/api` conforme a configuração da sua API backend local).

    *   **Se for usar a API pública de exemplo:**
        ```env
        VITE_BACKEND_API_URL=https://multlotto.com/extractta/api/
        ```

    **Importante:** O arquivo `.env` não deve ser enviado para o repositório Git (geralmente já está incluído no `.gitignore`).

## 🚀 Como Executar o Projeto Localmente

Com os pré-requisitos atendidos e o ambiente configurado:

1.  **Clone o Repositório do Frontend (se ainda não o fez):**
    Abra seu terminal e execute o comando:
    ```bash
    git clone https://github.com/matheusaraujo-dev/agri-farm/
    ```

2.  **Navegue até o Diretório do Projeto:**
    ```bash
    cd agri-farm
    ```
    (Se o seu repositório clonado tiver uma subpasta para o front, ex: `cd agri-farm/frontend`, ajuste conforme necessário).

3.  **Instale as Dependências:**
    Você pode usar Yarn ou npm. Escolha um dos comandos abaixo:

    *   Com Yarn:
        ```bash
        yarn install
        ```
    *   Com npm:
        ```bash
        npm install
        ```

4.  **Inicie o Servidor de Desenvolvimento:**
    Após a instalação das dependências, inicie o projeto:

    *   Com Yarn:
        ```bash
        yarn dev
        ```
    *   Com npm:
        ```bash
        npm run dev
        ```

5.  **Acesse a Aplicação:**
    Abra seu navegador e acesse `http://localhost:5173` ou `http://localhost:8080` (estas são as portas padrão do Vite, mas verifique o output no seu terminal, pois pode variar).

---

E pronto! O projeto frontend estará rodando localmente na sua máquina e se comunicando com a API configurada. 😊
