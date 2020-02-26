public class UserInformation {
	
    @AuraEnabled
    public static String getCurrentUserRoleId() {
        try {
            return UserInfo.getUserRoleId();
        } catch (Exception e) {
            throw new AuraHandledException('Line: ' + e.getLineNumber() + ' Message: ' + e.getMessage() + ' Cause: ' + e.getCause());
        }
    }
    
    @AuraEnabled
    public static Account getCurrentRecordDetails(Id recordId) {
        Account acc = [SELECT Id, NumberOfEmployees FROM Account WHERE id = :recordId];
        return acc;
    }
}