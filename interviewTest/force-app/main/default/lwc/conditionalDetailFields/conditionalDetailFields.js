import { LightningElement, api, track } from "lwc";
import getCurrentUserRoleId from "@salesforce/apex/UserInformation.getCurrentUserRoleId";
import getCurrentRecordDetails from "@salesforce/apex/UserInformation.getCurrentRecordDetails";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class ConditionalDetailFields extends LightningElement {
  @api recordId; //The ID of the record being viewed. (Assigned by the LWC on its own.)
  @api objectApiName; //The API name of the object the LWC is currently on. (Assigned by the LWC on its own.)
  @track fields = []; //The fields that will be pushed / spliced depending on conditional statements.

  async connectedCallback() {
    try {
      var roleId = await getCurrentUserRoleId();
      var recordDetails = await getCurrentRecordDetails({
        recordId: this.recordId
      });

      //If the role is CEO and the number of employees on the account is over 5000, display the field 'NumberOfEmployees'.
      switch (roleId) {
        case "00E3z000002I435EAC":
          if (recordDetails.NumberOfEmployees > 5000) {
            this.fields.includes("NumberOfEmployees")
              ? null
              : this.fields.push("NumberOfEmployees");
          }
          break;
      }
    } catch (error) {
      this.generateStatus("Error", error.body.message);
    }
  }

  generateStatus(status, message) {
    console.log(message);
    const evt = new ShowToastEvent({
      title: status,
      message: message,
      variant: status
    });
    this.dispatchEvent(evt);
  }
}
