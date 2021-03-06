// finalDraft function was created using:
// https://gist.github.com/mderazon/9655893
// it was written by Michael DeRazon:
// https://gist.github.com/mderazon

function finalDraft() {
  var ss = SpreadsheetApp.openById("********");
  Logger.log(ss.getName());
  var sheets = ss.getSheets();
  var sheet = sheets[0];
  // append ".csv" extension to the sheet name
  fileName = sheet.getName() + ".csv";
  // convert all available sheet data to csv format
  var csvFile = convertRangeToCsvFile_(fileName, sheet);
  // create draft from csv
  makeDraft(csvFile, ss)
}

function convertRangeToCsvFile_(csvFileName, sheet) {
  // get available data range in the spreadsheet
  var activeRange = sheet.getDataRange();
  var data = activeRange.getValues();
  var csvFile = undefined;

  // loop through the data in the range and build a string with the csv data
  if (data.length > 1) {
    var csv = "";
    for (var row = 0; row < data.length; row++) {
      for (var col = 0; col < data[row].length; col++) {
        if (data[row][col].toString().indexOf(",") != -1) {
          data[row][col] = "\"" + data[row][col] + "\"";
        }
      }

      // join each row's columns
      // add a carriage return to end of each row, except for the last one
      if (row < data.length-1) {
        csv += data[row].join(",") + "\r\n";
      }
      else {
        csv += data[row];
      }
    }
    csvFile = csv;
  }
  return csvFile;
}

function makeDraft(data, ss) {
  
  // Split into lines
  var allRows = data.split("\n")
  
  var subject = "Please provide feedback"
  
  var messages = [
        "1Hi $name,\n\nLorem ipsum dolor sit amet LINK, consectetur adipiscing elit. Fusce sed.\n\nThank you,\nIstvan\n-- \nIstvan Erdo\nCustomer Relations @samebug\nhttps://samebug.io",
        "2Hi $name,\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sed.\n\nThank you,\nIstvan\n-- \nIstvan Erdo\nCustomer Relations @samebug\nhttps://samebug.io",
        "3Hi $name,\n\nLorem ipsum dolor sit amet LINK, consectetur adipiscing elit LINK. Fusce sed.\n\nThank you,\nIstvan\n-- \nIstvan Erdo\nCustomer Relations @samebug\nhttps://samebug.io",
        "4Hi $name,\n\nLorem ipsum dolor sit amet LINK, consectetur adipiscing elit. Fusce sed.\n\nThank you,\nIstvan\n-- \nIstvan Erdo\nCustomer Relations @samebug\nhttps://samebug.io"
  ]
  
  // Loop through all rows
  allRows.map(function(line, key) {
    if(key === 0) return
  
    var cell = line.trim().split(",")
  
    var userId = cell[0]
    var displayName = cell[1]    
    var name = cell[2]
    var email = cell[3]
    var templateNumber = cell[4]
    var search = cell[5]
    var letterSent = cell[6]
    
    var hasName = name && name !== ""
    
    // Use first name as displayname
    if(hasName) {
      var fullName = name.split(" ")

      displayName = fullName ? fullName[0] : displayName
    }
    
    // Put X if no email
    if(email === "NULL"){ 
      addCustomValue('Sheet1', userId, "X", ss)
      return
    }

    //Return if already written email to the user
    if(letterSent != "") return
    
    //Return if no user ID
    if(userId === "") return
    
    //Set and personalise messages
    var template = messages[templateNumber * 1 - 1]
    .replace("$name", displayName)
    .replace(/LINK/g, search)
    
    GmailApp.createDraft(email, subject, template)
    
    // Add date stamp to registered_users sheet
    addCustomValue('Sheet1', userId, Utilities.formatDate(new Date(), "GMT+1", "yyyy/MM/dd"), ss)
  })
}

// The following code was created with the help of Stack Overflow question
// https://stackoverflow.com/questions/13327069/search-spreadsheet-column-for-text-in-a-string-and-return-a-result-in-another-co
// Question by user1783229:
// https://stackoverflow.com/users/1783229/user1783229
// Answer by Serge insas:
// https://stackoverflow.com/users/1368381/serge-insas

function addCustomValue(sheetNamestr, searchKeystr, writeValstr, ss) {
  
  // Get all data
  var sheet = ss.getSheetByName(sheetNamestr)
  var ssdata = sheet.getDataRange().getValues()
  
  // Loop through the data
  for (n=0; n<ssdata.length; ++n) {
    // Rewrite value
    if (ssdata[n][1-1].toString()==searchKeystr){ 
      ssdata[n][7-1] = writeValstr
    }
  }
  sheet.getRange(1,1,ssdata.length,ssdata[0].length).setValues(ssdata)
}
