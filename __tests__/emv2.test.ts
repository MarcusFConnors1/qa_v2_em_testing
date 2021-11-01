import { EmployeeManager, Employee } from "./pageObjects/EmployeeManager";

import * as employees from "./dataAndReq3Response/employees.json";

import * as searchData from "./dataAndReq3Response/searchData.json"

describe("employee manager v2", () => {
  const page = new EmployeeManager({ browser: "chrome" });
  beforeEach(async () => {
    await page.navigate();
  });
  afterAll(async () => {
    await page.driver.quit();
  });  
  // ============================================================================================
  // new code
  // ============================================================================================
  // I figured I would try another forEach loop here to search for more than one thing with another json file.
  searchData.forEach((employeeSearch) => {
    test("Searching narrows the list", async () => {
      let originalList = await page.getEmployeeList();
      await page.searchFor(employeeSearch);
      let resultList = await page.getEmployeeList();
      // took a screenshot to verify what is being searched, can comment it out if you don't want.
      await page.takeScreenshot(`Screenshots/SearchResult-${Date.now()}`);
      // edited this to just be .toBeGreaterThan
      expect(originalList.length).toBeGreaterThan(resultList.length);
    });
  });
  test("Screenshotting people with title 'Screenshot'", async () =>{
    // using the searchFor method from EmployeeManager.ts
    await page.searchFor("Screenshot");
    // using take Screenshot method from EmployeeManager, with the path sending it to my Screenshots folder.
    // using date.now shows current date in milliseconds, but can show when test was taken
    await page.takeScreenshot(`Screenshots/Screenshot-${Date.now()}`);
  })
// Being honest, I did not think of this implementation of a .foreach until I saw the solution.
// Though now knowing the right direction to start this the rest of it came easier as MOST was already good,
// just had to change the delete path to newEmployee.name.
  employees.forEach((newEmployee) => {
      test("Can add and delete an employee", async () => {
      await page.addEmployee(newEmployee);
      let employee = await page.getCurrentEmployee();
      // screenshotting this to make sure it is going through, can comment it out if you don't want. 
      await page.takeScreenshot(`Screenshots/NewEmployee-${Date.now()}`);
      expect(employee.name).toEqual(newEmployee.name);
      expect(employee.phone).toEqual(newEmployee.phone);
      expect(employee.email).toEqual(newEmployee.email);
      expect(employee.title).toEqual(newEmployee.title);
      await page.deleteEmployee(newEmployee.name);
      let employeeList = await page.getEmployeeList();
      expect(employeeList).not.toContain(newEmployee.name);
    });
  });
});
