import { webElems as home } from "../POM/home_page";
import { webElems as login } from "../POM/login_page";
import { webElems as search } from "../POM/search_page";

class HeritageGatewayPage {
  constructor() {}
  navigateToHgRecord() {

    cy.visit('/');
    cy.viewport(1600, 1200);
    cy.xpath(home.cookiesBtn).click();

  navigateToHgAircraftRecord() {

    cy.visit('/');
    cy.viewport(1600, 1200);
    cy.xpath(home.cookiesBtn).click();
  }

  navigateToHgMaritimeRecord() {

    cy.visit('/');
    cy.viewport(1600, 1200);
    cy.xpath(home.cookiesBtn).click();
  }


  verifyHgMonumentRecord(...params) {
    cy.scrollTo("bottom");
    cy.wait(2000);

    cy.xpath("//h2").then(($header) => {
      let hobUidFromHeader = $header.text();
      expect(hobUidFromHeader).to.contain(params[0]);
    });

    cy.xpath("(//tr)[4]/td").then(($loc) => {
      let locationFromP = $loc.text();
      expect(locationFromP).to.contain(params[1]);
    });

    cy.xpath("(//tr)[6]/td/p").then(($descSum) => {
      let descSumFromP = $descSum.text();
      expect(descSumFromP).to.contain(params[2]);
    });

    cy.xpath("(//tr)[7]/td/p").then(($descFull) => {
      let descFullFromP = $descFull.text();
      expect(descFullFromP).to.contain(params[3]);
    });
  }

  verifyHgAircraftRecord(...params) {
    cy.xpath("(//tr)[3]/td").then(($hobUid) => {
      let hobUidFromHeader = $hobUid.text();
      expect(hobUidFromHeader).to.contain(params[0]);
    });

    cy.xpath("(//tr)[4]/td").then(($loc) => {
      let locationFromP = $loc.text();
      expect(locationFromP).to.contain(params[1]);
      expect(locationFromP).to.contain(params[2]);
    });

    cy.xpath("(//tr)[6]/td").then(($descSum) => {
      let descSumFromP = $descSum.text();
      expect(descSumFromP).to.contain(params[3]);
    });

    cy.xpath("(//tr)[7]/td").then(($descFull) => {
      let descFullFromP = $descFull.text();
      expect(descFullFromP).to.contain(params[4]);
    });
  }

  verifyHgMaritimeRecord(...params) {
    cy.xpath("(//tr)[3]/td").then(($hobUid) => {
      let hobUidFromHeader = $hobUid.text();
      expect(hobUidFromHeader).to.contain(params[0]);
    });

    cy.xpath("(//tr)[4]/td").then(($loc) => {
      let locationFromP = $loc.text();
      expect(locationFromP).to.contain(params[1]);
      expect(locationFromP).to.contain(params[2]);
    });

    cy.xpath("(//tr)[6]/td").then(($descSum) => {
      let descSumFromP = $descSum.text();
      expect(descSumFromP).to.contain(params[3]);
    });
  }

  navigateToWardenRecord(hobUid) {

    cy.visit("/");
    cy.viewport(1600,1200);
    cy.login({ username: '/', password: '/' });

    cy.xpath(search.searchTabNavBar).click();

    cy.log("****Search for HobUid****");
    cy.xpath(search.resultsNumber)
      .should("be.visible")
      .should(($elem) => {
        expect($elem).to.not.contain("undefined");
      })
      .then(() => {
        cy.xpath(search.findAResourceInput).type(hobUid);
        cy.xpath(`(//span[contains(text(), '${hobUid}')])[2]`).contains(hobUid).click();
      });
  }

  verifyLabelId(hobUid) {
    cy.xpath(`//h1//span[contains(text(), '${hobUid}')]`).then(($record) => {
      let recordId = $record.text();
      expect(recordId).to.contain(hobUid);
    });
  }

  verifyLabelPresent() {
    cy.wait(4000);
    cy.xpath("(//h3/a/span)[1]").should("be.visible");
  }

  verifyWardenMonumentRecord(...params) {
    cy.visit("/");
    cy.wait(5000);

    cy.xpath(`((//div[@class="rp-report-tile"])[1]/dl/dd)[1]`).then(
      ($hobuid) => {
      let hobuid = $hobuid.text()
      expect(hobuid).to.contain(params[0])
    }
  );

    cy.xpath('((//div[@class="rp-report-tile"])[5]/dl/dd)[1]').then(
      ($districtName) => {
        let districtName = $districtName.text();
        expect(districtName).to.contain(params[2]);
      }
    );

    cy.xpath('((//div[@class="rp-report-tile"])[4]/dl/dd)[1]').then(
      ($countyName) => {
        let countyName = $countyName.text();
        expect(countyName).to.contain(params[3]);
      }
    );

    cy.xpath('((//div[@class="rp-report-tile"])[6]/dl/dd)[1]').then(
      ($civParName) => {
        let civParName = $civParName.text();
        expect(civParName).to.contain(params[1]);
      }
    );

    cy.xpath('(//div[@class="rp-report-tile"])[7]/dl/dd/p').then(($des) => {
      let des = $des.text();
      expect(des).to.contain(params[4]);
    });

    cy.xpath('((//div[@class="rp-report-tile"])[8]/dl/dd/p)[2]').then(
      ($full) => {
        let full = $full.text();
        expect(full).to.contain(params[5]);
      }
    );
  }

  verifyWardenAircraftRecord(...params) {
    cy.visit("/");
    cy.xpath('((//div[@class="rp-report-tile"])[1]/dl/dd)[1]').then(
      ($hobUid) => {
        let wardenHobUid = $hobUid.text();
        expect(wardenHobUid).to.contain(params[0]);
      }
    );

    cy.get(".scroll-y").scrollTo("bottom");

    cy.xpath('((//div[@class="rp-report-tile"])[9]/dl/dd)[1]').then(
      ($countyName) => {
        let countyName = $countyName.text();
        expect(countyName).to.contain(params[1]);
      }
    );

    cy.xpath('((//div[@class="rp-report-tile"])[10]/dl/dd)[1]').then(
      ($areaName) => {
        let areaName = $areaName.text();
        expect(areaName).to.contain(params[2]);
      }
    );

    cy.xpath('((//div[@class="rp-report-tile"])[8]/dl/dd)[1]').then(
      ($civParName) => {
        let civParName = $civParName.text();
        expect(civParName).to.contain(params[3]);
      }
    );

    cy.xpath('((//div[@class="rp-report-tile"])[2]/dl/dd)[2]').then(($summ) => {
      let summ = $summ.text();
      expect(summ).to.contain(params[4]);
    });

    cy.xpath('((//div[@class="rp-report-tile"])[3]/dl/dd)[2]').then(($full) => {
      let full = $full.text();
      expect(full).to.contain(params[5]);
    });
  }

  verifyWardenMaritimeRecord(...params) {
    cy.visit(
      "/"
    );
    cy.wait(6000);
    cy.get(".scroll-y").scrollTo("bottom");
    cy.xpath('((//div[@class="rp-report-tile"])[1]/dl/dd)[1]').then(($name) => {
      let wardenHobUid = $name.text();
      expect(wardenHobUid).to.contain(params[0]);
    });

    cy.xpath('((//div[@class="rp-report-tile"])[2]/dl/dd)[1]').then(
      ($hobUid) => {
        let hobUid = $hobUid.text();
        expect(hobUid).to.contain(params[1]);
      }
    );

    //7 change for 14
    cy.get(".scroll-y").scrollTo("bottom");

    cy.xpath('((//div[@class="rp-report-tile"])[14]/dl/dd)[1]').then(
      ($countyName) => {
        let countyName = $countyName.text();
        expect(countyName).to.contain(params[2]);
      }
    );

    cy.xpath('((//div[@class="rp-report-tile"])[15]/dl/dd)[1]').then(
      ($discName) => {
        let discName = $discName.text();
        expect(discName).to.contain(params[3]);
      }
    );

    cy.xpath('((//div[@class="rp-report-tile"])[4]/dl/dd)[2]').then(($summ) => {
      let summ = $summ.text();
      expect(summ).to.contain(params[4]);
    });
  }
}
const webElems = {
  searchInput: '//input[@id="ctl01_ContentPlaceHolder1_txtFreeText"]',
  submitBtn: '//input[@type="submit"]',
  heDevRecordsLink: `(//a[contains(text(), '/ (DEV)')])[1]`,
  heDevRecordsDesc:
    '(//td[contains(text(),"This")])[2]',
  resultsNumberForArchesStage:
    '((//div[@id="ctl00_ContentPlaceHolder1_TabContainer1_TabPanel1_Accordion3"]/div)[7]/table/tbody/tr/td)[2]/strong',
  searchResultRow:
    '//div[@id="ctl00_ContentPlaceHolder1_TabContainer1_TabPanel1_ctl196_resourceBlock19192"]/div/span/table/tbody/tr',
  tableHeaderNamedTitle:
    '(//div[@id="ctl00_ContentPlaceHolder1_TabContainer1_TabPanel1_ctl196_resourceBlock19192"]/div/span/table/tbody/tr)[1]/th[1]',
  tableHeaderNamedLocation:
    '(//div[@id="ctl00_ContentPlaceHolder1_TabContainer1_TabPanel1_ctl196_resourceBlock19192"]/div/span/table/tbody/tr)[1]/th[2]',
  tableHeaderNamedDescription:
    '(//div[@id="ctl00_ContentPlaceHolder1_TabContainer1_TabPanel1_ctl196_resourceBlock19192"]/div/span/table/tbody/tr)[1]/th[3]',
  locValForFirstSearchResRow:
    '((//div[@id="ctl00_ContentPlaceHolder1_TabContainer1_TabPanel1_ctl196_resourceBlock19192"]/div/span/table/tbody/tr)[2]/td)[2]',
  desValForFirstSearchResRow:
    '((//div[@id="ctl00_ContentPlaceHolder1_TabContainer1_TabPanel1_ctl196_resourceBlock19192"]/div/span/table/tbody/tr)[2]/td)[3]',
  firstSearchResRowLink:
    '(//div[@id="ctl00_ContentPlaceHolder1_TabContainer1_TabPanel1_ctl196_resourceBlock19192"]/div/span/table/tbody/tr)[2]/td/a',
  locationParagraphInRecordDescription: "((//table)[2]/tbody/tr)[3]/td",
  summaryParagraphInRecordDescription: "((//table)[2]/tbody/tr)[5]/td",
  informationIcon: '//img[@alt="About Historic England research records (DEV)"]/..',
  informationPageTitle: '//span[@class="title" and contains(text()," (DEV)")]',
  showAllSearchRecordsLink:
    '//strong/a[contains(text()," (DEV)")]',
  // firstRecordFromFullList: '(//a[contains(text(),"Monument Number")])[1]',
  firstRecordFromFullList: "(//span/table/tbody/tr/td/a)[1]",
};

export default HeritageGatewayPage;
export { webElems };
