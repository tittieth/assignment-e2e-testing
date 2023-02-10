beforeEach(() => {
  cy.visit("/");
});

describe("Check all components on first page", () => {
  it("have all the components", () => {
    cy.get("input").should("exist");
    cy.get("button").contains("Sök").should("exist");
  });
});

describe("The inputfield", () => {
  it("should be able to type", () => {
    cy.get("input").type("Balto").should("have.value", "Balto");
  });

  it("should show a text when there is no searchresults", () => {
    cy.get("input").type(" ").should("have.value", " ");
    cy.get("button").click();

    cy.get("#movie-container > p").should("be.visible");
    cy.get("p").contains("Inga sökresultat att visa").should("exist");
  });
});

describe("Test the real API", () => {
    it("should get correct movies", () => {
        cy.get("input").type("Pinocchio").should("have.value", "Pinocchio")
        cy.get("button").click();

        cy.get("#movie-container").should("exist");
        cy.get(".movie > h3").should("exist");
        cy.get(".movie > img").should("exist");
        cy.get("h3").contains("Pinocchio").should("exist");
        cy.get(".movie").should("have.length", 10);
    })
})

describe("Show correct HTML", () => {
  it("should add a div, h3 and img", () => {
    cy.intercept("GET", "http://omdbapi.com/*", { fixture: "OmdbResponse" }).as(
      "apiCall"
    );
    cy.get("input").type("Balto").should("have.value", "Balto");
    cy.get("button").click();
    cy.wait("@apiCall");

    cy.get("#movie-container").should("exist");
    cy.get(".movie > h3").should("exist");
    cy.get(".movie > img").should("exist");
    cy.get("h3").contains("Balto").should("exist");
  });
});

describe("Get correct data", () => {
  it("should get mockdata", () => {
    cy.intercept("GET", "http://omdbapi.com/*", { fixture: "OmdbResponse" }).as(
      "apiCall"
    );

    cy.get("input").type("Askungen");
    cy.get("button").click();
    cy.wait("@apiCall");

    cy.get("h3").contains("Askungen").should("exist");
    cy.get("h3").filter(':contains("Askungen")').should("have.length", 1);
  });

  it("should get mockdata with correct url", () => {
    cy.intercept("GET", "http://omdbapi.com/*", { fixture: "OmdbResponse" }).as(
      "apiCall"
    );

    cy.get("input").type("Balto");
    cy.get("button").click();

    cy.wait("@apiCall").its("request.url").should("contain", "Balto");
  });
});

describe("Test for errors ", () => {
  it("should get error", () => {
    cy.intercept("GET", "http://omdbapi.com/*", {
      fixture: "emptyResponse",
    }).as("apiCall");

    cy.get("input").type("Balto");
    cy.get("button").click();
    cy.wait("@apiCall");

    cy.get("#movie-container > p").should("be.visible");
    cy.get("p").contains("Inga sökresultat att visa").should("exist");
    cy.get(".movie").should("not.exist");
  });
});
