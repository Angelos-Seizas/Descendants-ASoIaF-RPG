let ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ΧΡΗΣΤΕΣ');

function doGet(){
  var template = HtmlService.createTemplateFromFile('login');
  template.message = '';
  return template.evaluate().setTitle('Descendants III - Σύνδεση');
}

function getUrl(){
  return ScriptApp.getService().getUrl();
}

function stringHash(str) {
  var hash = 0;
  if (str.length == 0) return hash;
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
}

// Function to handle HTTP POST requests. Used for the login system of the game.
function doPost(e){
  var userData = ss.getDataRange().getValues();
  for(var i=0; i<userData.length; i++) {
    if(userData[i][0]== e.parameter.username && userData[i][1] == stringHash(e.parameter.password)) {
      var output = HtmlService.createTemplateFromFile('Home');
      output.username = userData[i][0]
      return output.evaluate().setTitle('Descendants III - Αρχική');
    }else if(e.parameter.LogoutButton == 'Logout'){
      var template = HtmlService.createTemplateFromFile('login');
      template.message = ''
      return template.evaluate();
    }
  }
  // If password does not match, do not login
  var template = HtmlService.createTemplateFromFile('login');
  template.message = 'Σφάλμα: Το όνομα χρήστη ή ο κωδικός είναι λάθος';
  return template.evaluate().setTitle('Descendants III - Σύνδεση'); 
}

// Function to register a new user
function registerUser(username, password) {
  // Check if the username is already taken
  var usernames = ss.getRange('A:A').getValues().flat();

  if (usernames.includes(username)) {
    // Username is already taken, return an error message
    return { success: false, templateMessage: "Αυτό το όνομα χρήση υπάρχει ήδη. Διάλεξε ένα άλλο όνομα"};
  } else {
    // Hash the password
    hashedPassword = stringHash(password);

    // Append the username and hashed password to the ΧΡΗΣΤΕΣ sheet
    ss.appendRow([username, hashedPassword]);

    // Return a success message
    return { success: true, templateMessage: "Η εγγραφή ολοκληρώθηκε με επιτυχία!"};
  }
}
