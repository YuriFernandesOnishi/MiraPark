# MiraPark

MiraPark é um aplicativo mobile desenvolvido em **React Native** e **Expo**, pensado para facilitar o gerenciamento de garagens e veículos ativos de forma simples e intuitiva. Ele permite cadastrar usuários, listar veículos em tempo real e acompanhar entradas na garagem, tudo em um design moderno inspirado no conceito visual do Pokémon **Miraidon**, que serviu de referência para a paleta de cores e o estilo do logo do app.

---

## Download

A build de teste interno Android está disponível para download:

[Download MiraPark APK](https://expo.dev/accounts/yurionishi/projects/MiraPark/builds/cfb850e6-772f-4625-b000-0d593a5c51f7)

> Para instalar APKs fora da Play Store, habilite a instalação de apps de fontes desconhecidas no seu dispositivo.

---

## Funcionalidades

### Tela Inicial

* Apresenta o logo do app e botões para Login e Registro.
* Interface limpa, cores escuras com destaque em roxo, inspiradas no Pokémon Miraidon.

### Login

* Autenticação de usuários por email e senha.
* Armazenamento seguro do token de acesso usando **AsyncStorage**.
* Redirecionamento automático para a lista de veículos ativos após login.

### Registro

* Criação de contas com nome, email e senha.
* Feedback imediato sobre sucesso ou erro do cadastro.

### Lista de Veículos

* Exibe veículos ativos com placa, data e horário de entrada.
* Atualização via pull-to-refresh.
* Layout responsivo, respeitando safe areas e a navbar inferior personalizada.

---

## Tecnologias

* **React Native** com **Expo Router**
* **TypeScript**
* **EAS Build e EAS Update** para builds e atualizações OTA
* **AsyncStorage** para persistência local
* **Axios** para comunicação com API
* Componentes UI reutilizáveis (botões, formulários, navbar)
* Design baseado em cores escuras e roxo vibrante, inspirado no conceito de Miraidon.

---

## Conceito Visual

O logo do MiraPark e a paleta de cores foram inspirados no Pokémon Miraidon. O design combina linhas modernas e um estilo tecnológico, refletindo um app que é funcional, rápido e visualmente atrativo, mantendo simplicidade e clareza.

---

## Estrutura do Projeto

* `app/` → Rotas e telas principais
* `components/` → Componentes reutilizáveis de UI e formulários
* `services/` → Serviços de API e lógica de comunicação com backend
* `hooks/` → Hooks personalizados, como `useAuth`
* `assets/` → Logos, ícones, imagens e fontes

---

## Como Testar

1. Baixe o APK do link acima.
2. Instale no dispositivo Android.
3. Abra o app e registre um usuário ou faça login.
4. Teste as funcionalidades principais: cadastro, login e visualização de veículos ativos.

> Alterações em JS, estilos ou assets podem ser atualizadas rapidamente via OTA usando **EAS Update**, sem necessidade de gerar um APK novo.

---
