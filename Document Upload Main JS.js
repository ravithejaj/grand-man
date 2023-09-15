function addMessageToOnPostSave(executionContext) {
    var formContext = executionContext.getFormContext();
    if (formContext.ui.getFormType() != 1) {
        return;
    }
    formContext.data.entity.addOnPostSave(AssignRecord);
}

function AssignRecord(executionContext) {

    debugger;
    Xrm.Utility.showProgressIndicator("Please wait, the record is being created and assign to the appropriate team..")
    var formContext = executionContext.getFormContext();

    var recordId = formContext.data.entity.getId();
    recordId = recordId.replace("{", "").replace("}", "");

    var req = new XMLHttpRequest();
    req.open("POST", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/new_documentuploads(" + recordId + ")/Microsoft.Dynamics.CRM.new_DocumentUploadAssigntoaTeam", true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("Accept", "application/json");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200 || this.status === 204) {
                var result = JSON.parse(this.response);
                // Return Type: mscrm.new_DocumentUploadAssigntoaTeamResponse
                // Output Parameters
                var isassigned = result["IsAssigned"]; // Edm.Boolean

                if (isassigned) {
                    CheckIfMemberIsValid(formContext, recordId);
                }
                else {
                    alert("Error occured while assigning the record to the appropriate team. Please contact administrator.")
                }

            } else {
                console.log(this.responseText);
                Xrm.Utility.closeProgressIndicator();
            }
        }
    };
    req.send();

}

function CheckIfMemberIsValid(formContext, recordId) {

    var req = new XMLHttpRequest();
    req.open("POST", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/new_documentuploads(" + recordId + ")/Microsoft.Dynamics.CRM.new_DocumentUploadCheckifUserinTeams", true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("Accept", "application/json");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200 || this.status === 204) {
                var result = JSON.parse(this.response);
                console.log(result);
                // Return Type: mscrm.new_DocumentUploadCheckifUserinTeamsResponse
                // Output Parameters
                var isuserinteams = result["IsUserInTeams"]; // Edm.Boolean

                if (!isuserinteams) {
                    alert("The record has been successfully generated, but you do not belong to the relevant team for this document type. As a result, you won't have access to this record.")

                    Xrm.Utility.closeProgressIndicator();

                    RefreshForm(formContext, recordId);
                }

                Xrm.Utility.closeProgressIndicator();

                formContext.data.refresh(true);

            } else {
                console.log(this.responseText);
            }
        }
    };
    req.send();
}

function RefreshForm(formContext, recordId) {

    formContext.data.refresh(true).then(function () {

        var entityFormOptions = {};
        entityFormOptions["entityName"] = "new_documentupload";
        entityFormOptions["entityId"] = recordId;

        // Open the form
        Xrm.Navigation.openForm(entityFormOptions);

    }, function () { // do nothing

    });
}