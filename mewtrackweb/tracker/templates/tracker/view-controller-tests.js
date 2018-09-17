/*
QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});
*/

var entityData1 =   [
                        { 
                            "tagCount": 0,
                            "name": "Sprocket",
                            "isContainer": false,
                            "uuid": "00e53a63-2780-4490-901e-efb5e66d3f36",
                            "location": "Bin1"
                        }, 
                        {
                            "tagCount": 0,
                            "name": "Maori",
                            "isContainer": true,
                            "uuid": "c7951337-6a63-4e4a-9bdf-932d9ad80566",
                            "location": "Bin2"
                        }
                    ]

QUnit.test( "Controller Data Refresh, Create Table Rows", function( assert ) {
    var entityTableBodyDiv = document.createElement("div");
    var addTagModalDiv = document.createElement("div");
    var controller = new entityTrackerController(entityTableBodyDiv, addTagModalDiv, function(){}, function(){});  
    controller.updateEntityData(entityData1);

    assert.ok(2 === entityTableBodyDiv.children.length, "There should be two table rows after updateEntityData is called.");
});

QUnit.test( "Controller Data Refresh, Check Row Cells", function( assert ) {
    var entityTableBodyDiv = document.createElement("div");
    var addTagModalDiv = document.createElement("div");
    var controller = new entityTrackerController(entityTableBodyDiv, addTagModalDiv, function(){}, function(){});  
    controller.updateEntityData(entityData1);

    assert.ok(entityData1[0].name === entityTableBodyDiv.children[0].children[0].innerText, "First cell should contain entity name.");
    assert.ok(entityData1[0].isContainer === entityTableBodyDiv.children[0].children[1].children[0].checked, "Second cell should contain a check box.");
    assert.ok(String(entityData1[0].tagCount) === entityTableBodyDiv.children[0].children[2].innerText, "Third cell should contain tag count.");
});

QUnit.test( "Add Tag To Entity Sequence", function( assert ) {
    var entityTableBodyDiv = document.createElement("div");
    var addTagModalDiv = document.createElement("div");

    testTagValue = "E12345678";

    callbackEntityUUID = null;
    calbackTagValue = null;

    var myAddTagServiceHandler = function(entityUUID, tagValue){
        callbackEntityUUID = entityUUID;
        calbackTagValue = tagValue;
    };

    var controller = new entityTrackerController(entityTableBodyDiv, addTagModalDiv, myAddTagServiceHandler, function(){}, function(){});  
    controller.updateEntityData(entityData1);

    //Call the add tag link:
    entityTableBodyDiv.children[0].children[5].children[0].onclick();

    //make the modal appear, Set the span value, the hidden field to the specific entity
    assert.ok("Scan the tag:" === addTagModalDiv.children[0].innerText, "Span value is set");

    addTagModalDiv.children[2].value = testTagValue;
    addTagModalDiv.children[3].onclick();

    assert.ok(entityData1[0].uuid === callbackEntityUUID, "Entity UUID callback value set correctly");
    assert.ok(testTagValue === calbackTagValue, "TagValue callback value set correctly");



});

QUnit.test( "Set Is Container Checkbox", function( assert ) {
    var entityTableBodyDiv = document.createElement("div");
    var addTagModalDiv = document.createElement("div");
    var controller = new entityTrackerController(entityTableBodyDiv, addTagModalDiv, function(){}, function(){});  
    controller.updateEntityData(entityData1);

    assert.ok(entityData1[0].isContainer === entityTableBodyDiv.children[0].children[1].children[0].checked, "Second cell should contain a check box.");
    assert.ok(entityData1[1].isContainer === entityTableBodyDiv.children[1].children[1].children[0].checked, "Second cell should contain a check box.");
});

QUnit.test( "Filter table to a location", function( assert ) {
    var entityTableBodyDiv = document.createElement("div");
    var addTagModalDiv = document.createElement("div");
    var controller = new entityTrackerController(entityTableBodyDiv, addTagModalDiv, function(){}, function(){});  
    controller.updateEntityData(entityData1);

    assert.ok(2 === entityTableBodyDiv.children.length);

    controller.filterListViewByLocation("Bin1");

    assert.ok(1 === entityTableBodyDiv.children.length);

});

QUnit.test( "Remove the table filter", function( assert ) {
    var entityTableBodyDiv = document.createElement("div");
    var addTagModalDiv = document.createElement("div");
    var controller = new entityTrackerController(entityTableBodyDiv, addTagModalDiv, function(){}, function(){});  
    controller.updateEntityData(entityData1);

    controller.filterListViewByLocation("Bin1");

    assert.ok(1 === entityTableBodyDiv.children.length);

    controller.clearListFilter();    

    assert.ok(2 === entityTableBodyDiv.children.length);

});








//TODO - Error Handling and NULLs
    //handled Null on constructor
    //Select a metric that doesn't exist in the data field
    //Set an update for data af
//Change div instrument name when metric name changes
//Toggle display of target metric