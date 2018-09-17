//View controllers for HTML instrument pages

function isDomElement(obj){
    if(obj == null || obj.innerHTML === undefined)
        return false;
    return true;
};

function hideElement(el){
    el.style.display = 'none';  
    
}

function unhideElement(el){
    el.style.display = 'inline'; 
}

var LIST_ALL_SENTINAL = "*";

/*
            <span>Scan to tag: </span><br>
            <input id="inputEntityUUID" type="hidden" name="EntityUUID">
            <input id="inputTagValue" = type="text" name="TagValue"><br>
            <input type="submit" name="AddTag">
*/
function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
function entityTrackerController(entityTableBodyDiv, entityTagModalDiv, addTagCallBack, setContainerAttribute) {
    if(!isDomElement(entityTableBodyDiv) || !isDomElement(entityTagModalDiv))
        throw "You must initialize the controller with valid dom element objects";
    if(!isFunction(addTagCallBack)) {
        throw "You must provide a valid addTagCallBack function.";
    }
    if(!isFunction(setContainerAttribute)) {
        throw "You must provide a valid setContainerAttribute function.";
    }
    
    var myThis = this; // preserve context within object methods.
    var _entityTableBodyDiv = entityTableBodyDiv;
    var _entityTagModalDiv = entityTagModalDiv;
    var _addTagCallBack = addTagCallBack;    
    var _setContainerAttribute = setContainerAttribute;
    var CELL_CLASS_NAME = "divTableCell";
    var _currentEntityData = "";
    myThis.locationFilter = LIST_ALL_SENTINAL; //Set a default sentinal value to show all entities


    function formatSecondsString(seconds){
        DIGITS_TO_DISPLAY = 2;
        var s = seconds + "";
        while (s.length < DIGITS_TO_DISPLAY) s = "0" + s;
        return s;
    }

    function createTableCell(cellText){
        
        var tableCellDiv = document.createElement("div");
        var styleAttribute = document.createAttribute("class");
        styleAttribute.value = CELL_CLASS_NAME;
        tableCellDiv.setAttributeNode(styleAttribute);
        tableCellDiv.appendChild(tableCellDiv.ownerDocument.createTextNode(cellText));

        return tableCellDiv;
    }

    function createAddTagTableCell(entityUUID){
            var tableCellDiv = document.createElement("div");
            var styleAttribute = document.createAttribute("class");
            styleAttribute.value = CELL_CLASS_NAME;
            tableCellDiv.setAttributeNode(styleAttribute);

            var addTagLink = document.createElement("a");
            var link = document.createTextNode("Add Tag");
            addTagLink.appendChild(link);
            tableCellDiv.appendChild(addTagLink);

            addTagLink.addTagPtr = myThis.openAddTagModal; // wire the call back to this controller
            var onclickFunction = "this.addTagPtr('" + entityUUID + "');";
            
            addTagLink.setAttribute('onclick', onclickFunction);
            return tableCellDiv;
    }

    function createContainerTableCell(entityUUID, isContainer){
            //<input type="checkbox" name="vehicle" value="Bike">
            var tableCellDiv = document.createElement("div");
            var styleAttribute = document.createAttribute("class");
            styleAttribute.value = CELL_CLASS_NAME;
            tableCellDiv.setAttributeNode(styleAttribute);

            var isContainerCheckbox = document.createElement("input");
            var typeAttribute = document.createAttribute("type");
            typeAttribute.value = "checkbox";
            isContainerCheckbox.setAttributeNode(typeAttribute);

            if(isContainer){
                isContainerCheckbox.setAttributeNode(document.createAttribute("checked"));
            }

            tableCellDiv.appendChild(isContainerCheckbox);

            isContainerCheckbox.setContainer = myThis.setContainerSubmitHandler; // wire the call back to this controller
            var onclickFunction = "this.setContainer('" + entityUUID + "');";
            
            isContainerCheckbox.setAttribute('onclick', onclickFunction);
            return tableCellDiv;            
    }

    function createTableRow(entityUUID, name, tagCount, lastLocation, lastCheckinTime, isContainer){

        var ROW_CLASS_NAME = "divTableRow";
        var tableRowDiv = document.createElement("div");
        var styleAttribute = document.createAttribute("class");
        styleAttribute.value = ROW_CLASS_NAME;
        tableRowDiv.setAttributeNode(styleAttribute);
        tableRowDiv.appendChild(createTableCell(name));
        tableRowDiv.appendChild(createContainerTableCell(entityUUID, isContainer));
        tableRowDiv.appendChild(createTableCell(tagCount));
        tableRowDiv.appendChild(createTableCell(lastLocation));
        tableRowDiv.appendChild(createTableCell(lastCheckinTime));
        tableRowDiv.appendChild(createAddTagTableCell(entityUUID));


        return tableRowDiv;
    }

    function refreshTable(){

        //clear the table
        while(_entityTableBodyDiv.firstChild)
            _entityTableBodyDiv.removeChild(_entityTableBodyDiv.firstChild);


        //  _entityTableBodyDiv.appendChild(_instReadoutDiv.ownerDocument.createTextNode(selectedMetric.value.toFixed(INST_DECIMAL_PRECISION)));

        for(var i=0;i<_currentEntityData.length;i++){
            if(myThis.locationFilter == _currentEntityData[i].location){
                _entityTableBodyDiv.appendChild(createTableRow(_currentEntityData[i].uuid, _currentEntityData[i].name, _currentEntityData[i].tagCount, _currentEntityData[i].location, _currentEntityData[i].lastCheckin, _currentEntityData[i].isContainer));
            }
            else if (myThis.locationFilter == LIST_ALL_SENTINAL) {
                _entityTableBodyDiv.appendChild(createTableRow(_currentEntityData[i].uuid, _currentEntityData[i].name, _currentEntityData[i].tagCount, _currentEntityData[i].location, _currentEntityData[i].lastCheckin, _currentEntityData[i].isContainer));
            }
        }
    }

    this.addTagModalSubmitHandler = function(entityUUID){
        _addTagCallBack(entityUUID, _entityTagModalDiv.children[2].value);
        hideElement(_entityTagModalDiv);
    }

    this.setContainerSubmitHandler = function(entityUUID){
        _setContainerAttribute(entityUUID, this.checked);
    }

    this.openAddTagModal = function(entityUUID){
        //clear the modal
        while(_entityTagModalDiv.firstChild)
            _entityTagModalDiv.removeChild(_entityTagModalDiv.firstChild);    
        
        var spanInstructions = document.createElement("span");
        spanInstructions.innerText = "Scan the tag:";
        var elBr = document.createElement("br");

        var tagInput = document.createElement("input");
        tagInput.setAttribute("type", "text");
        tagInput.setAttribute("name", "tagValue");
        tagInput.setAttribute("id", "tagValue");

        var submitButton = document.createElement("input");
        submitButton.setAttribute("type", "submit");
        submitButton.setAttribute("name", "submitButton");
        submitButton.setAttribute("id", "submitButton");

        submitButton.submitTagPtr = myThis.addTagModalSubmitHandler; // wire the call back to this controller
        var onclickFunction = "this.submitTagPtr('" + entityUUID + "');";
        submitButton.setAttribute('onclick', onclickFunction);

        _entityTagModalDiv.appendChild(spanInstructions);
        _entityTagModalDiv.appendChild(elBr);
        _entityTagModalDiv.appendChild(tagInput);
        _entityTagModalDiv.appendChild(submitButton);

        unhideElement(_entityTagModalDiv);
        tagInput.focus();
    }



    this.updateEntityData = function(entityData) {
        _currentEntityData = entityData; //metricData;
        refreshTable();
        //populateMenu();
    };

    this.filterListViewByLocation = function(location) {
        myThis.locationFilter = location;
        refreshTable();
    };

    this.clearListFilter = function() {
        myThis.locationFilter = LIST_ALL_SENTINAL;
        refreshTable();
    };



};


