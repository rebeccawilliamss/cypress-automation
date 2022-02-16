import { webElems as home} from '../POM/home_page'
import { webElems as managedata } from '../POM/managedata_page'
import ManageDataPage from '../POM/managedata_page';

const action = new ManageDataPage();

describe('Create resource functionalities',function(){


    beforeEach(()=>{

        Cypress.Cookies.preserveOnce('ai_session', 'csrftoken','warden','ai_user');
        cy.viewport(1600, 1200);
    })

    before(()=>{

        cy.log('**** Log in to application ****');
        cy.visit('/');
        cy.viewport(1600, 1200)
        cy.login({ username: '/', password: '/'});

        cy.log('**** Navigate to create Monument record ****');
        cy.xpath(home.manageDataBtn).invoke('removeAttr','target').click();
        cy.get(managedata.createMonResource).click({ force: true });
    })

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('@13329: Resource editor tree is visible', () => {
        cy.log('********** Verify if resource editor tree is visible **********');
        cy.get(managedata.resourceEditorTree).should('be.visible');

    })

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('@25996: Associated Parent Monument can be added to new resource', () => {

        cy.log('**** Select associated parent monument ****');
        action.selectFromResTree('Associated Parent Monument');
        action.typeInFieldAndSelectOptionSmall('Parent_Monument','/','/');

        cy.get('button').contains('Add').click({force: true});

        cy.log('**** Verify if associated parent document has been added ****');
        action.getNodeValueFromSelectedLabel('Associated Parent Monument')
        .then($text=>{
            console.log($text);
            cy.get(managedata.ddlSelectedOption).invoke('text').should('contain',$text);
            cy.get(managedata.ddlSelectedOption).invoke('text');
        })

        cy.reload();
        action.selectFromResTree('Primary Reference Number ');
        action.getNodeValueFromSelectedLabel('Primary Reference Number')
        .then($text=>{
            cy.get('.page-header').find('span').invoke('text').should('contain',$text);
        })

        cy.log('********** Delete created record **********');
        cy.get('button').contains('Delete this record').click();
    })
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('@14477: Add a primary reference number to the new monument', () => {

        cy.log('********** Add primary reference number **********');
        action.selectFromResTree('Primary Reference Number ');
        cy.get('button').contains('Add').click().wait(2000);

        cy.log('********** Verify if hobUid and resourceId inputs have been populated **********');
        action.getTextFromInput('ResourceID').then($val=>{
            cy.log('Value from input :', $val);
            cy.url().should('contain',$val);
        })
        action.getTextFromInput('HobUid').then($val=>{
            cy.get('.page-header').find('span').invoke('text').should('contain',$val);
        })

        cy.log('********** Delete created record **********');
        cy.get('button').contains('Delete this record').click();
    })
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('@19743: Asset name can be assigned to a Monument', () => {

        cy.log('********** Select asset name from resource editor tree, type name and select name type option **********');
        action.selectFromResTree('Asset Name');
        action.selectFromDDL('Name Type','Primary');
        action.typeIntoField('Name','Test Monument');
        cy.get('button').contains('Add').click().wait(500);

        cy.log('********** Verify if asset has been added **********');
        action.verifySubLeaf('Asset Name',['Name','Test Monument']);
    })
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('@19745: Add a former or alternative name to the Asset Name card', () => {
        cy.log('********** Select asset name from resource editor tree, type name and select "former" as a name type option **********');
        action.selectFromResTree('Asset Name');
        action.typeIntoField('Name','Test to be deleted');
        action.selectFromDDL('Name Type','Former');
        cy.get('button').contains('Add').click().wait(1000);

        cy.log('********** Verify if asset has been added **********');
        action.verifySubLeaf('Asset Name',['Name','Test to be deleted']);
    })
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('@19753-@26021-@26022: The Location button is responsive and adressess/latitude/longitude can be added to the record', () => {

        cy.log('********** Select locations from resource editor tree **********');
        action.selectFromResTree('Locations');

        cy.log('********** Click add button. Verify if expected options are present **********');
        cy.get('button').contains('Add').click().wait(1000);
        cy.get('.card-summary-section').within($table=>{
            cy.get('span')
            cy.get('span').within($rec=>{
                cy.contains('Map')
                cy.contains('Map References')
                cy.contains('Related Areas')
                cy.contains('Locational Descriptions')
                cy.contains('Addresses')
                cy.contains('Latitude/Longitude')
                cy.contains('Named Locations')
                cy.contains('Spatial Metadata')
            })

        })

        cy.log('********** Populate addresses **********')
        action.selectChildFromResTree('Locations','Addresses').click();
        action.selectFromDDL('Address Status','Primary');
        action.typeIntoField('Town or City','Andover');
        action.typeIntoField('Number in Road or Street','100');
        action.typeIntoField('Road or Street Name','Andover Road');
        action.typeIntoField('Locality','/');
        action.typeIntoField('Postal Code','/');
        cy.get('button').contains('Add').click().wait(1000);

        cy.log('********** Verify if addresses have been added **********');
        action.verifySubLeaf('Addresses',['Address Status','Primary']);

        cy.log('Populate latitude/longitude fields');
        action.selectChildFromResTree('Locations','Latitude/Longitude').click();
        action.selectFromDDL('Latitude Hemisphere','N');
        action.typeIntoField('Latitude Degrees','51');
        action.typeIntoField('Latitude Minutes','12');
        action.typeIntoField('Latitude Seconds','20');
        action.selectFromDDL('Longitude Hemisphere','W');
        action.typeIntoField('Longitude Degrees','001');
        action.typeIntoField('Longitude Minutes','30');
        action.typeIntoField('Longitude Seconds','25');
        action.typeIntoField('Height','10');
        action.selectFromDDL('Height Qualifier','General Depth');
        cy.get('button').contains('Add').click().wait(1000);

        cy.log('********** Verify if latitude/longitude have been added **********');
        action.verifySubLeaf('Latitude/Longitude',['Latitude Hemisphere','N']);
    })

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    it('@26020-@26023-@19749: Locational description can be added', () => {

        cy.log('********** Select "Locational Descriptions" from resource editor tree **********');
        action.selectChildFromResTree('Locations','Locational Descriptions').click();
        action.selectFromDDL('Location Description Type','Summary');
        action.typeIntoIFrame('This is a test monument located in Andover')
        cy.get('button').contains('Add').click();

        cy.log('********** Verify if locational description has been added **********');
        action.verifySubLeaf('Locational Description',['Type','Summary']);

        cy.log('********** Select "Named Locations" from resource editor tree **********');
        action.selectChildFromResTree('Locations','Named Locations').click();
        cy.get('button').contains('Add').click().wait(3000);

        cy.log('********** Populate necessary fields for Named Location **********');
        action.typeIntoField('Named Location Name','Test name');
        action.typeIntoField('Named Location Latitude','51°12′20″N');
        action.typeIntoField('Named Location Longitude','25');
        cy.get('button').contains('Save edit').click().wait(2000);

        cy.log('********** Verify if named location has been added **********');
        action.verifySubLeaf('Named Location',['Name','Test name']);

    })

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    it('@26024: Spatial metadata can be added to the record', () => {

        cy.log('********** Select "Spatial Metadata" from resource editor tree and populate necessary fields **********');
        action.selectChildFromResTree('Locations','Spatial Metadata').click();
        action.selectFromDDL('Capture Scale','1:10000');
        action.typeIntoField('Created By','John Travolta');
        action.typeIntoDateField('Created Date','12/11/2020');
        action.selectFromDDL('Spatial Accuracy Qualifier','1');
        action.selectFromDDL('Coordinate System','OSGB36');
        action.typeIntoField('Current Base Map','Streets');
        action.typeIntoField('Updated By','John Travolta');
        action.typeIntoDateField('Updated Date','12/11/2020');
        action.typeIntoField('Authorised By','John Travolta');
        action.typeIntoDateField('Authorised Date','12/11/2020');
        action.selectFromDDL('AMIE shape','Approx');
        action.typeIntoField('Notes','Test notes');
        cy.get('button').contains('Add').click().wait(2000);

        cy.log('********** Verify if spatial metadata has been added **********');
        action.verifySubLeaf('Spatial Metadata',['Capture Scale','1:10000']);

    })

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('@19748: Specify location using the gazetteer and zoom tools', () => {

        cy.log('********** Select Map from resource editor tree **********');
        cy.viewport(1600,1200);
        action.selectChildFromResTree('Locations','Map').click();

        cy.log('********** Search for ANDOVER using map input **********');
        cy.wait(5000);
        cy.get('.mapboxgl-ctrl-geocoder--input')
        .type("ANDOVER");
        cy.get('.mapboxgl-ctrl-geocoder--suggestion').first().click();

        cy.log('********** Verify if element is present inside map **********');
        cy.wait(3000);
        cy.get('.mapboxgl-canvas').parent().find('div').should('be.visible');

    })

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    it('@13844: Validation message for invalid coords', () => {

        cy.log('********** Select Map References from resource editor tree **********');
        action.selectChildFromResTree('Locations','Map References').click();

        cy.log('********** Type incorrect center point map reference **********');
        cy.get('[placeholder="Enter the centre point map reference of the resource."]').type('123123123');
        cy.get('button').contains('Add').click()

        cy.log('********** Verify if validation note is same as expected **********');
        cy.get('.widget-wrapper').find('[data-bind="text: errorMessage"]').invoke('text')
        .should('eq','Input coordinate did not pass validation.  Please check it is in one of the approved formats and try again.');
    })

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('@26018-@17560-@13808: Valid coordinate can be added to the Map References node', () => {

        cy.log('********** Select Map References from resource editor tree **********');
        cy.viewport(1600,1200);
        action.selectChildFromResTree('Locations','Map References').click();

        cy.log('********** Type correct centre point map reference **********');
        cy.get('[placeholder="Enter the centre point map reference of the resource."]').type('SU3454145277');
        cy.get('button').contains('Add').click({force : true});
        cy.wait(10000);

        cy.log('********** Verify if map reference has been added **********');
        action.verifySubLeaf('Map References',['OSGB Grid Reference','SU3454145277']);

        cy.reload();
        cy.wait(6000);

        cy.log('********** Verify all necessary fields for map reference **********');
        cy.xpath('//h3[text()="Related Areas"]/..').within(()=>{

            cy.wait(3000);
            cy.xpath('(//dd[contains(text(), "Test Valley")])[1]').then($districtName => {
                let districtName = $districtName.text();
                expect(districtName).to.contain('Test Valley');
            })

            cy.xpath('(//dd[contains(text(), "Hampshire")])[1]').then($districtName => {
                let districtName = $districtName.text();
                expect(districtName).to.contain('Hampshire');
            })


            cy.xpath('(//dd[contains(text(), "Andover")])[1]').then($districtName => {
                let districtName = $districtName.text();
                expect(districtName).to.contain('Andover');
            })

        })

        action.selectFromResTree('Locations');
        action.selectChildFromResTree('Locations','Related Areas').click();

        cy.log('********** Verify if all labels have been added below Related Areas option **********');
        cy.get('a.jstree-anchor').contains('Related Areas').parent().parent().children('ul.jstree-children').within($el=>{
            cy.get('span').contains("Andover").should('exist');
            cy.get('span').contains("Hampshire").should('exist');
            cy.get('span').contains("Test Valley").should('exist');
        })
    })

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    it('@13328: Asset description field should display the cancel edit, add and delete buttons.', () => {

        cy.log('**** Select Asset Descriptions from resource editor tree ****');
        action.selectFromResTree('Asset Descriptions');
        cy.wait(2000);

        cy.log('**** Add test asset description *****')
        action.selectFromDDL('Asset_Description_Type','Full');
        action.typeIntoIFrame("Test asset description");
        cy.get('button').contains('Add').click().wait(5000);

        cy.log('**** Check if save and edit and delete buttons are present ****')
        action.typeIntoIFrame('test');

        cy.get('.install-buttons').within(($el) => {
            for(var i=0; i<=0; i++) {
                expect($el[i].textContent).to.contain('Delete this record')
                expect($el[i].textContent).to.contain('Cancel edit')
                expect($el[i].textContent).to.contain('Save edit')
            }
        })

        cy.log('**** Verify the card has been added ****')
        action.verifySubLeaf('Asset Descriptions',['Asset_Description_Type', 'Full']);
    })

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    it('@26025: Sources data can be added to the record',() => {

        cy.log('********** Select Sources from resource editor tree and populate necessary fields **********')
        action.selectFromResTree('Sources');
        action.typeIntoField('Source Number','2');
        action.typeInFieldAndSelectOptionSmall('Source or Source Type','Spec Pap Palaeontol','Spec Pap Palaeontol');
        action.typeIntoField('Source Details','Test');
        action.typeIntoField('Page(s)','1-5');
        action.typeIntoField('Figs.','3');
        action.typeIntoField('Plates','Test');
        action.typeIntoField('Vol(s)','2');
        cy.get('button').contains('Add').click().wait(2000);

        cy.log('********** Verify if sources have been added **********')
        action.verifySubLeaf('Sources',['Source Number','2']);
    })

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    it('@26026: Construction data can be added to the record',() => {

        cy.log('********** Select construction phase and type from resource editor tree and populate fields **********')
        action.selectFromResTree('Construction Phase and Type');
        action.selectFromFatArrowDDL('Period','21st Century');
        action.typeIntoField('From Date','20/10/2020');
        action.typeIntoField('To Date','20/10/2020');
        action.typeIntoField('Display Date','20/10/2021');
        action.selectFromFatArrowDDL('Monument Type','Agricultural Building');
        action.selectFromFatArrowDDL('Evidence','Physical Evidence');
        action.selectFromFatArrowDDL('Main Construction Material','MAN MADE MATERIAL');
        action.selectFromFatArrowDDL('Covering Material','EARTH MIX');
        action.selectFromFatArrowDDL('Construction Method','Production Methods');
        action.selectFromFatArrowDDL('Construction Technique','Construction Techniques');
        action.typeIntoField('Construction Description','Type - Summary');
        cy.get('button').contains('Add').click().wait(2000);

        cy.log('********** Verify if construction phase and type has been added **********')
        action.verifySubLeaf('Construction Phase and Type',['Period','21st Century']);
    })

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    it('@26027: Use Phase data can be added to the record', () => {

        cy.log('********** Select Use Phases from resource tree editor and populate fields **********')
        action.selectFromResTree('Use Phase(s)');
        action.selectFromFatArrowDDL('Period','21st Century');
        action.selectFromFatArrowDDL('Functional Type','Agricultural Building')
        action.selectFromFatArrowDDL('Evidence','Physical Evidence')
        action.typeIntoField('From Date','20/10/2020');
        action.typeIntoField('To Date','20/10/2021');
        action.typeIntoField('Display Date','20/10/2021');
        action.typeIntoField('Use_Phase_Description','Test');
        action.selectFromDDL('Use_Phase_Description_Type','Summary');
        cy.get('button').contains('Add').click().wait(2000);

        cy.log('********** Verify if use phases have been added **********')
        action.verifySubLeaf('Use Phase(s)',['Period','21st Century']);
    })

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    it('@26028: Components and Objects data can be added to the record',() => {

        cy.log('********** Select Components and Objects from resource editor tree **********');
        action.selectFromResTree('Components and Objects');
        action.selectFromFatArrowDDL('Period','21st Century');
        action.typeIntoField('From date','20/10/2020');
        action.typeIntoField('To Date','20/10/2021');
        action.typeIntoField('Display Date','20/10/2021');

        cy.get('label').contains('Associated construction').parent().find('b').click()
        .get('.select2-result-label').click();
        cy.get('label').contains('Associated use').parent().find('b').click()
        .get('.select2-result-label').click();

        action.selectFromFatArrowDDL('Addition','ENTRANCE');
        action.selectFromFatArrowDDL('Main Material(s)','BRICK');
        action.selectFromFatArrowDDL('Covering Building Material(s)','MORTAR');
        action.selectFromFatArrowDDL('Component Monument Typ','Agricultural Building');
        action.selectFromFatArrowDDL('Object Type','AGRICULTURE AND SUBSISTENCE');
        action.selectFromFatArrowDDL('Object Material','Animal');
        action.typeIntoField('Addition_Phase_Description','Test');
        action.selectFromDDL('Addition_Phase_Description_Type','Summary');
        cy.get('button').contains('Add').click().wait(2000);

        cy.log('********** Verify if components and objects have been added **********');
        action.verifySubLeaf('Components and Objects',['Period','21st Century']);
    })

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    it('@26038: Cross references to other datasets can be added to a record', () => {

        cy.log('********** Select cross references to other datasets and populate fields **********');
        action.selectFromResTree('Cross References to other datasets');
        action.selectFromDDL('External Cross Reference Source','AIP Record Number');
        action.typeIntoField('External Cross Reference Number','1234567890');
        action.typeIntoField('External Cross Reference Notes','Test');
        cy.get('button').contains('Add').click().wait(2000);

        cy.log('********** Verify if cross references have been added **********');
        action.verifySubLeaf('Cross References to other datasets',['External Cross Reference Source','AIP Record Number']);
    })

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    it('@13809-@26040: Associated organisations can have multiple roles',() => {

        cy.log('********** Select Associated Organisations from resource editor tree and populate fields **********');
        action.selectFromResTree('Associated Organisations');
        cy.wait(3000);
        action.typeInFieldAndSelectOptionBig('Organisation','CG Searle and Son','CG Searle and Son');
        cy.focused().type('{esc}');
        action.selectFromFatArrowDDL('Organisation Role','Aerial Surveyor');
        action.selectFromFatArrowDDL('Organisation Role','Annotator');
        action.typeIntoField('Organisation Role From Date','2000-12-06');
        action.typeIntoField('Organisation Role To Date','2025/12/13');
        action.selectFromDDL('Organisation Role Date Precision','C');
        cy.focused().type('{esc}');
        cy.get('button').contains('Add').click({force: true}).wait(2000);

        cy.log('********** Verify if associated organisations have been added **********');
        action.verifySubLeaf('Associated Organisations',['Organisation','CG Searle and Son']);
    })

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    it('@13780: Associated person can have many roles', () => {

        cy.log('********** Select Associated People from resource editor tree and populate fields **********');
        action.selectFromResTree('Associated People');
        action.typeInFieldAndSelectOptionBig('Person','LUKE','LUKE GRIMSON');
        cy.focused().type('{esc}');
        action.selectAssociatedOptionFromDDL('Affiliated Organisation','CG Searle and Son');
        action.selectFromFatArrowDDL('Person Role','Aircraft Crew');
        action.selectFromFatArrowDDL('Person Role','Air Photograph Interpreter');
        cy.focused().type('{esc}');
        action.typeIntoField('Person Role From Date','2020-11-02');
        action.typeIntoField('Person Role To Date','2021-11-02');
        action.selectFromDDL('Person Role Date Precision','C');
        cy.get('button').contains('Add').click({force: true}).wait(2000);

        cy.log('********** Verify if Associated People have been added **********');
        action.verifySubLeaf('Associated People',['Person','LUKE GRIMSON']);
    })

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    it('@26039: Records without a name should have the HobUid as the name',() => {

        cy.log('********** Select Related Warden Monuments from resource editor tree and populate fields **********');
        action.selectFromResTree('Related Warden Monuments');
        cy.wait(2000);
        action.selectFromDDL('Relationship type','General association');
        action.typeInFieldAndSelectOptionBig('Associated_Monuments','1329621','1329621');
        cy.get('button').contains('Add').click({force: true}).wait(2000);

        cy.log('********** Verify if Related Warden Monuments have been added **********');
        action.verifySubLeaf('Related Warden Monuments',['Associated_Monuments','1329621']);
    })

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    it('@26043: Related Activity data can be added to the record',() => {

        cy.log('******* Select Related NRHE Activities from resource editor tree and populate fields **********');
        action.selectFromResTree('Related NRHE Activities');
        action.selectFromDDL('Associated_Activities','Primary, WISBECH ST MARY','Primary, WISBECH ST MARY');
        action.selectFromDDL('Activity Type','INTRUSIVE EVENT');
        action.typeIntoField('Start Date','2020-11-02');
        action.typeIntoField('End Date','2021-11-02');
        cy.get('button').contains('Add').click({force: true}).wait(2000);

        cy.log('********** Verify if Related NRHE Activities have been added **********');
        action.verifySubLeaf('Related NRHE Activities',['Associated_Activities','Primary, WISBECH ST MARY']);
    })

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    it('@26044: HE Archives data can be added to the record', () => {

        cy.log('********** Select Associated HE Archives from resource editor tree and populate fields **********');
        action.selectFromResTree('Associated HE Archives');
        action.typeIntoField('Object Number','2');
        action.typeIntoField('Object Title','Test Archive');
        action.typeIntoField('Comments','Test');
        cy.get('button').contains('Add').click({force: true}).wait(2000);

        cy.log('********** Verify if Associated HE Archives have been added **********');
        action.verifySubLeaf('Associated HE Archives',['Object Number','2']);

    })

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    it('@26045: Area status data can be added to the record',() => {

        cy.log('********** Select Area Status from resource editor tree and populate fields **********');
        action.selectFromResTree('Area Status');
        action.selectFromDDL('Area Status','Conservation Area');
        action.typeIntoDateField('From Date','2020-11-02');
        cy.focused().type('{esc}');
        action.typeIntoDateField('To Date','2021-11-02');
        cy.focused().type('{esc}');
        action.typeIntoField('Reference ','Test');
        cy.get('button').contains('Add').click({force: true}).wait(2000);

        cy.log('********** Verify if Area status have been added **********');
        action.verifySubLeaf('Area Status',['Area Status','Conservation Area']);
    })

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    it('@26046: Land use data can be added to the record',() => {

        cy.log('********** Select Land Use from resource editor tree **********');
        action.selectFromResTree('Land Use');
        action.selectFromDDL('Land Use Classification','Coastland');
        action.typeIntoDateField('Assessment Date','2020-11-02');
        cy.focused().type('{esc}');
        cy.get('button').contains('Add').click({force: true}).wait(2000);

        cy.log('********** Verify if Land Use have been added **********');
        action.verifySubLeaf('Land Use',['Land Use Classification','Coastland']);
    })

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    it('@26047: Condition Survey',() => {

        cy.log('********** Select Condition Survey from resource editor tree and populate fields**********');
        action.selectFromResTree('Condition Survey');
        action.selectFromDDL('Survey Type','Building Survey');
        action.typeIntoDateField('Survey From Date','2020-11-02');
        action.typeIntoDateField('Survey To Date','2021-11-02');
        action.selectFromDDL('Condition on Survey','Good');
        action.selectFromDDL('Site Survey Condition','B');
        action.selectFromDDL('Type of Access','Interior Access');
        action.selectFromDDL('Level of Occupancy','Partially Occupied');

        action.selectFromFatArrowDDL('Threats','Deterioration');
        cy.focused().type('{esc}')
        action.selectFromFatArrowDDL('Threats','Collapse');
        cy.focused().type('{esc}');
        action.selectFromDDL('Proportion of Site at Risk','<10%');
        action.selectFromDDL('Level of Risk to Site','Medium');
        action.typeInFieldAndSelectOptionBig('Surveyor','CG Searle and Son','CG Searle and Son');
        cy.focused().type('{esc}');
        cy.get('button').contains('Add').click({force: true}).wait(2000);

        cy.log('********** Verify if Condition Survey has been added **********');
        action.verifySubLeaf('Condition Survey',['Survey Type','Building Survey']);
    })

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    it('@13815: The user can add multiple related resources',() => {

        cy.log('********** Select Related Resources from resource editor tree **********');
        cy.get('.jstree-container-ul').children().eq('1').children('a').find('i').click({force: true});
        cy.wait(2000);
        cy.xpath("//button[contains(text(),'Add Related Resources')]").click({force: true}).wait(2000);

        cy.get('.select2-choices').click({force: true})
        .get('.select2-result-label').contains('Conservation and the Transport and Works Act 1992').parent().click();
        cy.get('.select2-result-label').contains('History of photography : a bibliography of books').parent().click();
        cy.focused().type('{esc}');
        cy.get('button').contains('Add').click({force: true}).wait(2000);

        cy.log('********** Verify the table contains expected values **********');
        cy.get('table').find('span').contains('Conservation and the Transport and Works Act 1992');
        cy.get('table').find('span').contains('History of photography : a bibliography of books');
    })

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    it('@13816: The user can delete a related resource',() => {

        cy.log('********** Verify if table is present **********');
        cy.get('table').should('be.visible').find('span').contains('Conservation and the Transport and Works Act 1992').click();

        cy.log('********** Verify if delete btn is selected **********');
        cy.get('button').contains('Delete Selected').click({force: true}).wait(1000);

        cy.log('********** Verify the resource has been deleted from the table **********');
        cy.get('table').find('span').contains('Conservation and the Transport and Works Act 1992').should('not.exist');

    })

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    it.skip('@14109: User can make a copy of a resource',() => {

        cy.log('********** Copy resource **********');
        cy.get('.col-xs-12.col-sm-8').children('a').find('i').click();
        cy.get('.panel-body').first().children('ul').children('li').find('.menu-item-title').contains(' Copy Resource ').find('i').click({force: true});

        cy.log('********** Check if resource is succesfully copied **********');
        cy.get('h4').contains('Resource Successfully Copied.').should('be.visible');
        cy.get('button').contains('OK').click();
    })

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    it('@14110: Admin users can delete existing records.', () => {

        cy.log('********** Delete resource **********');
        cy.wait(1000);

         cy.get('h1').find('span').then($hobUid=>{
            cy.get('.col-xs-12.col-sm-8').children('a').find('i').click();
            cy.get('.panel-body').first().children('ul').children('li').find('.menu-item-title').contains(' Delete Resource ').find('i').click({force: true});
            cy.get('button').contains('OK').click();
            cy.wait(3000);
            cy.get('.col-xs-12.col-sm-4').children().find('span').contains('Search').parent().parent().find('i').click({force:true});
            cy.get(".select2-input.select2-default").type($hobUid.text());
        })

        cy.get('#select2-result-label-3').parent().click();

        cy.log('**** Verify if results are 0 - after delete resource we expect that number of resource will be equal to 0 ****')
        cy.get('.search-title').invoke('text').should('eq','Results: 0');
        //cy.xpath('//span[contains(text(),"Logout")]/../../..').click();
    })


})
