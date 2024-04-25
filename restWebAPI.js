const soap = require("strong-soap").soap;

// Define the URL to the SOAP Web API service
const WSDL_URL = "https://teensmeet-83ba9bcf1c20.herokuapp.com/iclock/WebAPIService.asmx?wsdl";

// Set timeout to 10 seconds (10000 milliseconds)
const options = {
  timeout: 10000,
};

// Function to add an employee via the SOAP Web API
const addEmployee = (employeeData) => {
  return new Promise((resolve, reject) => {
    soap.createClient(WSDL_URL, options, (err, client) => {
      if (err) {
        reject(`SOAP client creation failed: ${err.message}`);
        return;
      }

      client.AddEmployee(employeeData, (err, result) => {
        if (err) {
          reject(`SOAP call failed: ${err.message}`);
        } else {
          resolve(result);
        }
      });
    });
  });
};

module.exports = { addEmployee };
