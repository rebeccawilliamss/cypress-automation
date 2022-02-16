class ManageDataPage {
  constructor() {}

  selectFromResTree(leafName) {
    return cy
      .xpath(
        `(//div[@class="resource-editor-tree"]/ul/li)[1]/ul/li/a/span[text()='${leafName}']/..`
      )
      .click();
  }

  selectChildFromResTree(leafName, subLeafName) {
    return cy.xpath(
      `(//div[@class="resource-editor-tree"]/ul/li)[1]/ul/li/a/span[text()='${leafName}']/../../ul/div/li//span[text()='${subLeafName}']`
    )
    .click();
  }

  getTextFromInput(inputTitle) {
    return cy
      .get("label")
      .contains(inputTitle)
      .parent()
      .find("input")
      .invoke("val");
  }

  verifySubLeaf(leafName, expectedNodes) {
    return cy
      .get("a.jstree-anchor")
      .contains(`${leafName}`)
      .parent()
      .parent()
      .children("ul.jstree-children")
      .within(($el) => {
        for (let i = 0; i < expectedNodes.length; i++) {
          cy.get("span").contains(`${expectedNodes[i]}`).should("be.visible");
        }
      });
  }

  getNodeValueFromSelectedLabel(leafName) {
    return cy
      .get(webElems.resourceEditorTreeLeaf)
      .contains(leafName)
      .parent()
      .parent()
      .find("ul")
      .find("div")
      .find("li")
      .find("a")
      .find("strong")
      .find("div")
      .find("span")
      .should("be.visible")
      .invoke("text");
  }

  getNodeValueFromSelectedSubLeaf(leafTitle, expectedNodeValue) {
    cy.wait(3000)
      .get('[role="treeitem card-treeitem"]')
      .eq(leafTitle)
      .children()
      .within(($el) => {
        cy.wait(2000)
          .get("span")
          .contains(expectedNodeValue)
          .should("contain", expectedNodeValue);
      });
  }

  iterateThroughObject(obj) {
    for (let i = 0; i < obj.length; i++) {
      console.log(obj[i]);
    }
  }

  selectFromDDL(ddlTitle, option) {
    return cy
      .xpath(`//label[text()='${ddlTitle}']/../div/div/a/span/b`)
      .click({ force: true })
      .xpath(`//div[@class="select2-result-label" and text()='${option}']/..`)
      .click();
  }

  //Type into small dropdown field function
  typeInFieldAndSelectOptionSmall(label, text, option){
    return cy
      .xpath(`//label[text()='${label}']/../div/div/a/span/b`)
      .click()
      .xpath(`//div[@class='select2-search']/input`)
      .type(text, { force: true })
      .get('.select2-result-label').contains(option).parent().click();
  }

  selectAssociatedOptionFromDDL(ddlTitle, option) {
    return cy
      .xpath(`//label[text()='${ddlTitle}']/../div/div/a/span/b`)
      .click()
      .xpath(
        `(//div[@class="select2-result-label"]/div/div)[1]/div/span[text()='${option}']/../../..`)
      .click();
  }

  selectFromFatArrowDDL(ddlTitle, option) {
    return cy
      .get(".form-group")
      .find("label")
      .contains(ddlTitle)
      .parent()
      .find(".select2-choices")
      .click({ force: true })
      .get(".select2-result-label")
      .contains(option)
      .parent()
      .click();
  }

  //Type into big dropdown field function
  typeInFieldAndSelectOptionBig(label, text, option){
    return cy
    .xpath(`//label[text()='${label}']/../div/div/ul/li/input`)
    .type(text)
    .get('.select2-result-label')
    .contains(option)
    .click();
  }

  typeIntoIFrame(text) {
    cy.get("iframe").its("0.contentDocument").its("body").type(text);
  }

  typeIntoField(inputTitle, text) {
    return cy
      .xpath(`//label[text()='${inputTitle}']/../div/input`)
      .clear()
      .type(`${text}`);
  }

  typeIntoDateField(inputTitle, text) {
    return cy
      .get("label")
      .contains(inputTitle)
      .parent()
      .find("input")
      .clear()
      .type(text);
  }

}
const webElems = {
  createMonResource: '[aria-label="Create resource - Monuments"]',
  resourceEditorTree: ".resource-editor-tree",
  resourceEditorTreeLeaf: '[data-bind="text: card.model.name"]',
  treeItemCard: '[role="treeitem card-treeitem"]',
  ddlSelectedOption: ".select2-chosen",
};

export default ManageDataPage;
export { webElems };
