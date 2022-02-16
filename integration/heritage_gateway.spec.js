import { webElems as hgws } from "../POM/heritage_gateway";
import { webElems as home } from "../POM/home_page";

import HeritageGatewayPage from "../POM/heritage_gateway";

const hgAction = new HeritageGatewayPage();

describe("Tests cover different functionalities across heritage gateway", () => {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce(
      "ai_session",
      "csrftoken",
      "warden",
      "ai_user"
    );
    cy.viewport(1600,1200);

  })

  it("@24541: HGWS: Historic England research records returns correctly from a search done in Heritage Gateway ", () => {

    cy.log("**** Verify if record is visible in search results ****");
    cy.hgsearch({ record: '221912'});
    cy.xpath(hgws.heDevRecordsLink).click();
    cy.xpath(`(//a[contains(text(), 'Monument Number 221912')])[2]`)
    .should('be.visible');

  });

  it("@24542: Expanding search results in HG returns with the first 5 records ordered in 3 columns", () => {

    cy.log("**** Verify if table have following column titles: Title, Location, Descrtiption ****");

    cy.hgsearch({ record: '221912'});
    cy.xpath(hgws.heDevRecordsLink).click();
    cy.xpath(`(//table)[30]`).should('be.visible');

    cy.log('**** check table contains correct headings and data from first row ****')
    cy.xpath(`(//table)[30]//th`).contains('Title').should('be.visible');
    cy.xpath(`(//table)[30]//td`).contains('Monument Number 221912').should('be.visible');
    cy.xpath(`(//table)[30]//th`).contains('Location').should('be.visible');
    cy.xpath(`(//table)[30]//th`).contains('Description').should('be.visible');
    cy.xpath(`(//table)[30]//td`).contains('Possible Bronze Age round barro...').should('be.visible');
  });

  it('an accessioned record in Warden does not display in the Heritage Gateway', () => {

    cy.log('**** visit URL for Warden accessioned record ****')
    cy.visit('https://www.heritagegateway.org.uk/Gateway-Stage/Results_Single.aspx?uid=027de798-5292-4bfa-9ef7-68764ec19375&resourceID=19192');

    cy.log('**** check the page heading is HER Accessioned ****')
    cy.get('strong').contains('HER Accessioned. ')
    .should('be.visible');

    cy.log('**** loop through element and check Accessioned organisation exists ****')
    cy.get('.resultBlockSingle').within(($el) => {

      for (let i = 0; i <= $el; i++) {
        expect($el[i].textContent).to.contain('Morley and Woodhouse')
      }
    });
  })

  it("@24328: HGWS: The information icon on the results page should take you to different page of information", () => {

    cy.hgsearch({ record: '221912'});

    cy.log("**** Click on information icon ****");
    cy.xpath(hgws.informationIcon).click({ force: true });

    cy.log("**** Verify if the information icon redirects you to information page ****");
    cy.xpath(hgws.informationPageTitle).should("be.visible");

  });

  it("@24689: HGWS: A single result returns the correct information", () => {

    cy.hgsearch({ record: '221912'});

    cy.xpath(hgws.heDevRecordsLink).click();
    cy.xpath(hgws.showAllSearchRecordsLink).click({ force: true });
    cy.xpath(hgws.firstRecordFromFullList).click();

    cy.log("**** Verify if record contains correct information ****");
    cy.xpath("//h1").contains("Historic England Research Records");
    cy.xpath("//h2").contains("Monument Number");
    cy.xpath("//strong").contains("Hob Uid: ");
    cy.xpath("//strong").contains("Location");
    cy.xpath("//strong").contains("Grid Ref");
    cy.xpath("//strong").contains("Summary");
    cy.xpath("//strong").contains("More information");
    cy.xpath("//strong").contains("Sources");
    cy.xpath("//strong").contains("Monument Types");
    cy.xpath("//strong").contains("Components and Objects");
    cy.xpath("//strong").contains("Related Records from other datasets");
    cy.xpath("//strong").contains("Related Warden Records");
    cy.xpath("//strong").contains("Related Activities");
  });

  it("@23616: HGWS: Searching for monuments in HG returns the same results in Warden", () => {
    let hobUid = "1626241";
    let location = "Devon";
    let descSum = "Part of a possible ditched";
    let descFull = "It is centred at SX 82980 64194";

    cy.log("**** Navigate to HG record ****");
    hgAction.navigateToHgRecord(hobUid);

    cy.log("***** Verify HG monument record ****");
    hgAction.verifyHgMonumentRecord(hobUid, location, descSum, descFull);
  });

  it("@23616: Monuments - HG returns the same results in Warden", () => {
    let hobUid = "1626241";
    let expDistrict = "Teignbridge";
    let expCounty = "Devon";
    let expCivParName = "Ipplepen";
    let expDescSum = "Part of a possible ditched";
    let expDescFull = "It is centred at SX 82980 64194";

    cy.log("**** Navigate to Warden *****");
    hgAction.navigateToWardenRecord(hobUid);
    //hgAction.verifyLabelId(hobUid);

    cy.log("**** Verify warden monument report data ****");
    hgAction.verifyWardenMonumentRecord(
      hobUid,
      expDistrict,
      expCounty,
      expCivParName,
      expDescSum,
      expDescFull
    );
  });

  it("@23617: HGWS: Searching for Aircrafts in HG returns the same results in Warden", () => {
    let hobUid = "1591016";
    let title = "<Name>";
    let location = "Hampshire";
    let location2 = "East Hampshire";
    let descSum = "Approximate crash site of aircraft T2574";
    let descFull = " 640 bundles of leaflets";

    cy.log("**** Navigate to HG record ****");
    hgAction.navigateToHgAircraftRecord(hobUid, title);

    cy.log("**** Verify HG aircraft record ****");
    hgAction.verifyHgAircraftRecord(
      hobUid,
      location,
      location2,
      descSum,
      descFull
    );
  });

  it("@23617: Aircrafts - HG returns the same results in Warden", () => {
    let hobUid = "1591016";
    let expCounty = "Hampshire";
    let expCivParName = "Whitehill";
    let expArea = "East Hampshire";
    let expDescSum = "Approximate crash site of aircraft T2574";
    let expDescFull =
      "640 bundles of leaflets were scattered in the Nanates area from 13,000 ft";

    cy.log("**** Navigate to Warden ****");
    hgAction.navigateToWardenRecord(hobUid);

    hgAction.verifyLabelPresent();
    cy.log("**** Verify warden aircraft record description ****");
    hgAction.verifyWardenAircraftRecord(
      hobUid,
      expCounty,
      expCivParName,
      expCounty,
      expDescSum,
      expDescFull
    );
  });

  it("@23618: HGWS: Searching for Maritime in HG returns the same results in Warden", () => {
    let hobUid = "911909";
    let title = "James Groves";
    let location = "East Sussex";
    let location2 = "Rother";

    let descSum = "Remains of the 1876 wreck";
    let descFull =
      "640 bundles of leaflets were scattered in the Nanates area from 13,000 ft";

    cy.log("**** Navigate to HG record ****");
    hgAction.navigateToHgMaritimeRecord(hobUid, title);

    cy.log("**** Verify HG maritime record ****");
    hgAction.verifyHgMaritimeRecord(
      hobUid,
      location,
      location2,
      descSum,
      descFull
    );
  });

  it("@23618: Maritime - HG returns the same results in Warden", () => {
    let hobUid = "911909";
    let title = "James Groves";
    let expCounty = "East Sussex";
    let expDisc = "Rother";
    let expDescSum = "Remains of the 1876 wreck";

    cy.log("**** Navigate to Warden *****");
    hgAction.navigateToWardenRecord(hobUid);
    hgAction.verifyLabelPresent();

    cy.log("**** Verify warden maritime record description ****");
    hgAction.verifyWardenMaritimeRecord(
      title,
      hobUid,
      expCounty,
      expDisc,
      expDescSum
    );
  });
});
