function StartLeadDialog(grdSelectedItemIds) {
    ///<summary>
    /// Function to pop Lead dialog on click of a custom button
    ///</summary>
    var entityId;
	var dialogGuid="8604A4C3-5075-436A-9683-BD2A722001A9";
    if (grdSelectedItemIds.length > 0)
        entityId = grdSelectedItemIds[0];
    else
        entityId = Xrm.Page.data.entity.getId();
    var url = Xrm.Page.context.getServerUrl() + "cs/dialog/rundialog.aspx?DialogId={"+ dialogGuid +"}&EntityName=lead&ObjectId=" + entityId;
    window.open(url, "mywindow", "location=0,resizable=1,status=1,scrollbars=1, width=600,height=400");
}
