// Inputs:
// groupDN, string    -> Active Directory Group
// computerCN, string -> Active Directory Object, in this case it is computer object

System.log("Group DN : " + groupDN);
System.log("Computer DN : " + computerDN);

// Get AD Config from Configuration Element
var adConfig = System.getModule("com.umitdemirtas.configElement").getConfigurationElement('ad');

// Active Directory host and credentials
var host = adConfig.getAttributeWithKey('host') ? adConfig.getAttributeWithKey('host').value : "";
var port = adConfig.getAttributeWithKey('port') ? adConfig.getAttributeWithKey('port').value : "";
var username = adConfig.getAttributeWithKey('username') ? adConfig.getAttributeWithKey('username').value : "";
var password = adConfig.getAttributeWithKey('password') ? adConfig.getAttributeWithKey('password').value : "";

// Check status of the AD Object
var addStatus = false;

// LDAP connection object
var ldapClient = null;

try {
    ldapClient = LdapClientFactory.newLdapClient(host, port, username, password, false); // Port is 389
  
    var groupEntry = ldapClient.getEntry(groupDN); // Get group entry
    if (groupEntry) {
        var members = groupEntry.getAttributeValues('member'); // Members of group
        var modification = [new LdapModification(LdapModificationType.ADD, 'member', computerDN)]; // Create modification for ADD operation

        ldapClient.modify(groupDN, modification); // Add GroupDN and modification
        addStatus = true;
    }
} finally {
    if (ldapClient != null) { ldapClient.close(); }
}

return addStatus;
