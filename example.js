const puppeteer = require("puppeteer"); 

const fs = require('fs');

let browser;
(async () => {
  const searchQuery = "deals in florida";

  browser = await puppeteer.launch();
  const [page] = await browser.pages();
  await page.goto("https://www.google.com/", {waitUntil: "domcontentloaded"});
  await page.waitForSelector('input[aria-label="Search"]', {visible: true});
  await page.type('input[aria-label="Search"]', searchQuery);
  await Promise.all([
    page.waitForNavigation(),
    page.keyboard.press("Enter"),
  ]);
  await page.waitForSelector(".LC20lb", {visible: true});
  const searchResults = await page.$$eval(".LC20lb", els => 
    els.map(e => ({name: e.innerText, address: e.parentNode.href}))
   
  );
  fs.writeFile("books.json", JSON.stringify(searchResults), (err) => {
        if (err)
            console.log(err);
        else {
            console.log("File written successfully\n");
            console.log("The written has the following contents:");
            console.log(fs.readFileSync("books.txt", "utf8"));
        }
    });
 
  console.log(searchResults);

})()
  .catch(err => console.error(err))
  .finally(() => browser?.close())
;

  
