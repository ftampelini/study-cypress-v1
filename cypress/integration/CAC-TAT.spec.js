/// <reference types="Cypress" />
import "../support/commands.js";

describe("Central de Atendimento ao Cliente TAT", function () {
  const THREE_SECONDS_IN_MS = 3000;

  beforeEach(function () {
    cy.visit("src/index.html");
  });

  it("CT 01 - Verifica o título da aplicação.", function () {
    cy.title().should("be.equal", "Central de Atendimento ao Cliente TAT");
  });

  it("CT 02 - Preenche os campos obrigatórios e envia o formulário.", function () {
    cy.clock();
    cy.get("#firstName").type("Felipe");
    cy.get("#lastName").type("Caferro Tampelini");
    cy.get("#email").type("felipetampelini@gmail.com");
    cy.get("#phone").type("44997256970");
    cy.get("#product").should("be.enabled").select("cursos").type("Cursos");
    cy.get("input[value=elogio]").check().should("have.checked");
    cy.get("#email-checkbox").check();
    cy.get("#open-text-area")
      .should("be.visible")
      .type("Belo curso, obrigado! Buscando conhecimento.", { delay: 0 });
    cy.contains("button", "Enviar").click();
    cy.get(".success").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".success").should("not.be.visible");
  });

  it("CT 03 - Exibe mensagem de erro ao submeter o formulário com um email com formatação inválida.", function () {
    cy.clock()
    cy.get("#email").type("felipetampelini@gmail-com");
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS)
    cy.get(".error").should("not.be.visible");

  });

  it("CT 04 - Verificar valor não numérico informado no campo de telefone.", function () {
    cy.get("#phone").type("isso-nao-e-numero").should("have.value", "");
  });

  it("CT 05 - Exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário.", function () {
    cy.clock()
    cy.get("#firstName").type("Felipe");
    cy.get("#lastName").type("Caferro Tampelini");
    cy.get("#email").type("felipetampelini@gmail.com");
    cy.get("#phone-checkbox").check();
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS)
    cy.get(".error").should("not.be.visible");
  });

  it("CT 06 - Preenche e limpa os campos nome, sobrenome, email e telefone.", function () {
    cy.get("#firstName")
      .type("Felipe")
      .should("have.value", "Felipe")
      .clear()
      .should("have.value", "");
    cy.get("#lastName")
      .type("Caferro Tampelini")
      .should("have.value", "Caferro Tampelini")
      .clear()
      .should("have.value", "");
    cy.get("#email")
      .type("felipetampelini@gmail.com")
      .should("have.value", "felipetampelini@gmail.com")
      .clear()
      .should("have.value", "");
    cy.get("#phone")
      .type("44997256970")
      .should("have.value", "44997256970")
      .clear()
      .should("have.value", "");
  });

  it("CT 07 - Exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios.", function () {
    cy.clock()
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS)
    cy.get(".error").should("not.be.visible");
  });

  it("CT 08 - Envia o formuário com sucesso usando um comando customizado.", function () {
    cy.fillMandatoryFieldsAndSubmit();
  });

  it("CT 09 - Seleciona um produto (YouTube) por seu texto.", function () {
    cy.get("#product")
      .should("be.enabled")
      .select("youtube")
      .should("have.value", "youtube");
  });

  it("CT 10 - Seleciona um produto (Mentoria) por seu texto.", function () {
    cy.get("#product")
      .should("be.enabled")
      .select("mentoria")
      .should("have.value", "mentoria");
  });

  it("CT 11 - Seleciona um produto (Blog) por seu texto.", function () {
    cy.get("#product")
      .should("be.enabled")
      .select("blog")
      .should("have.value", "blog");
  });

  it('CT 12 - Marca o tipo de atendimento "Feedback".', function () {
    cy.get("input[value=feedback]").check().should("have.checked");
  });

  it("CT 13 - Marca cada tipo de atendimento.", function () {
    cy.get('input[name="atendimento-tat"]')
      .should("have.length", 3)
      .each(function ($radio) {
        cy.wrap($radio).check();
        cy.wrap($radio).should("be.checked");
      });
  });

  it("CT 14 - Marca ambos checkboxes, depois desmarca o último.", function () {
    cy.get('input[type="checkbox"]')
      .as("checkboxes")
      .each(function ($checkbox) {
        cy.wrap($checkbox).check().should("be.checked");
      });
    cy.get("#phone-checkbox").uncheck().should("not.be.checked");
  });

  it("CT 15 - Seleciona um arquivo da pasta fixtures e valida nome do arquivo.", function () {
    cy.get('input[type="file"]')
      .should("not.have.value")
      .selectFile("cypress/fixtures/example.json")
      .should(function (input) {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });

  it("CT 16 - Seleciona um arquivo simulando um drag-and-drop e valida o nome do arquivo.", function () {
    cy.get('input[type="file"]')
      .should("not.have.value")
      .selectFile("cypress/fixtures/example.json", { action: "drag-drop" })
      .should(function (input) {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });

  it("CT 17 - Seleciona um arquivo utilizando uma fixture para a qual foi dada um alias.", function () {
    cy.fixture("example.json").as("sampleFile");
    cy.get('input[type="file"]')
      .should("not.have.value")
      .selectFile("@sampleFile")
      .should(function (input) {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });

  it("CT 18 - Verifica que a política de privacidade abre em outra aba sem a necessidade de um clique", function () {
    cy.get("#privacy a")
      .should("have.attr", "target", "_blank")
      .invoke("removeAttr", "target");
  });

  it("CT 19 - Acessa a página da política de privacidade removendo o target e então clicando no link.", function () {
    cy.get("#privacy a")
      .should("have.attr", "target", "_blank")
      .invoke("removeAttr", "target")
      .should("not.have.attr", "target", "_blank")
      .click();
  });

  it("CT 20 - Testa a página da política de privacidade de forma independente.", function () {
    cy.get("#privacy a")
      .should("have.attr", "target", "_blank")
      .invoke("removeAttr", "target")
      .should("not.have.attr", "target", "_blank")
      .click();
    cy.title().should(
      "be.equal",
      "Central de Atendimento ao Cliente TAT - Política de privacidade"
    );
  });
});
