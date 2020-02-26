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
      var roleId = await getCurrentUserRoleId(); //Calls apex class and gets the ID of the role currently viewing the record.
      var recordDetails = await getCurrentRecordDetails({
        recordId: this.recordId
      }); //Gets the details of the record currently being viewed.

      //If the role is CEO and the number of employees on the account is over 5000, display the field 'NumberOfEmployees'.
      switch (roleId) {
        case "00E3z000002I435EAC":
          if (recordDetails.NumberOfEmployees > 5000) {
            this.fields.includes("NumberOfEmployees")
              ? null //If this.fields already includes NumberOfEmployees, don't push it. (Prevents duplicates)
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
