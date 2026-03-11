# Publicar Tower Tactics na Google Play Store

Guia dos passos para publicar o jogo na loja Android.

---

## 1. Conta no Google Play Console

1. Acesse [Google Play Console](https://play.google.com/console) e entre com sua conta Google.
2. **Taxa única:** pague a taxa de registro de desenvolvedor (cerca de US$ 25, uma vez).
3. Aceite o Acordo de Distribuição e preencha dados do desenvolvedor (nome, e-mail, etc.).

---

## 2. Criar o app na Play Console

1. Em **Todos os apps** → **Criar app**.
2. Preencha:
   - **Nome do app:** Tower Tactics
   - **Idioma padrão:** Português (Brasil) ou o que preferir
   - **Tipo:** Aplicativo ou Jogo (escolha **Jogo**)
   - **Gratuito ou pago:** Gratuito (ou pago, conforme seu modelo)
3. Declare se o app usa anúncios (sim/não) e confirme as políticas.

---

## 3. Assinatura do app (keystore)

O Android exige que o app de release seja assinado. Você precisa de um **keystore** (só um por app; guarde e faça backup).

### 3.1 Gerar o keystore (uma vez)

No terminal, na pasta do projeto:

```bash
cd android/app
keytool -genkey -v -keystore tower-tatics-release.keystore -alias tower-tatics -keyalg RSA -keysize 2048 -validity 10000
```

- Defina uma **senha** e guarde em local seguro.
- Preencha nome, organização, etc. (podem ser fictícios para uso pessoal).

**Importante:** não commite o arquivo `.keystore` no Git. Ele já está ignorado em `android/.gitignore`.

### 3.2 Configurar assinatura no Android

Crie o arquivo `android/keystore.properties` (não commitar; já está no `.gitignore`):

```properties
storePassword=SUA_SENHA_DO_KEYSTORE
keyPassword=SUA_SENHA_DA_KEY
keyAlias=tower-tatics
storeFile=tower-tatics-release.keystore
```

O `android/app/build.gradle` já está configurado para usar esse arquivo. Se `keystore.properties` existir e o keystore estiver em `android/app/tower-tatics-release.keystore`, o build de release será assinado automaticamente.

---

## 4. Preparar versão e build

1. **Atualizar versão** em `android/app/build.gradle`:
   - `versionCode`: inteiro que aumenta a cada publicação (ex.: 3 → 4).
   - `versionName`: string visível para o usuário (ex.: `"1.0.3"`).

2. **Build do projeto web + sync:**

   ```bash
   yarn build:android
   ```

3. **Gerar o Android App Bundle (AAB)** — formato exigido pela Play Store:

   ```bash
   cd android
   ./gradlew bundleRelease
   ```

   O AAB sai em: `android/app/build/outputs/bundle/release/app-release.aab`.

---

## 5. Conteúdo obrigatório na Play Console

Antes de enviar o AAB, preencha:

### 5.1 Painel do app

- **Listagem da loja:** título, descrição curta, descrição longa, screenshots (pelo menos 2).
- **Ícone:** 512×512 px (PNG, 32 bits).
- **Grátis/produto:** se for pago, configurar preço e países.

### 5.2 Política e conformidade

- **Política de privacidade:** URL pública (obrigatório se houver login, Firebase, analytics).
- **Formulário sobre dados do app:** declarar coleta de dados (Firebase, login Google, etc.).
- **Público-alvo e faixa etária:** questionário de conteúdo e idade.
- **Política do app:** aceitar políticas da Google (anúncios, etc., se aplicável).

### 5.3 Configuração do app

- **Assinatura do app:** na primeira vez, a Play Console pode pedir para você fazer upload do keystore ou usar “Enrollment do Google Play” (gerenciado pela Google). Se você já assinou com seu keystore, envie o AAB assinado; a Google usa essa assinatura a partir daí.

---

## 6. Enviar o AAB

1. No menu do app: **Produção** (ou **Testes** → teste interno/fechado) → **Criar nova versão**.
2. **Fazer upload** do arquivo `app-release.aab`.
3. Preencher **Notas da versão** (o que mudou nesta versão).
4. Revisar resumo e clicar em **Revisar e enviar** (ou **Iniciar implantação**).

A revisão da Google costuma levar de algumas horas a alguns dias.

---

## 7. Checklist rápido

- [ ] Conta Play Console paga e dados do desenvolvedor preenchidos
- [ ] App criado (nome, tipo Jogo, gratuito/pago)
- [ ] Keystore criado e guardado em segurança
- [ ] `keystore.properties` configurado (fora do Git)
- [ ] `build.gradle` com `signingConfigs.release` e `buildTypes.release.signingConfig`
- [ ] `versionCode` e `versionName` atualizados
- [ ] `yarn build:android` e `./gradlew bundleRelease` executados com sucesso
- [ ] Listagem (textos, ícone 512×512, screenshots)
- [ ] URL de política de privacidade
- [ ] Formulário de dados e público-alvo preenchidos
- [ ] AAB enviado e versão em revisão

---

## Links úteis

- [Play Console](https://play.google.com/console)
- [Documentação: Publicar apps Android](https://support.google.com/googleplay/android-developer/answer/9859152)
- [Requisitos para a listagem](https://support.google.com/googleplay/android-developer/answer/9859152#zippy=%2Cantes-de-publicar)
