import { By, WebDriver } from "selenium-webdriver";
import { DriverBuilder } from "../utils/Driver";
import { importMetamaskExtension } from "../utils/Handlers";
import { clickElement, waitForElement, waitForElementVisible } from "../utils/Helper";

jest.setTimeout(30000); // Increase Jest timeout if needed
let driver: WebDriver;

describe("Microapps Prod UI wallet tests", () => {
  beforeAll(async () => {
    driver = await DriverBuilder.getInstance();
    await importMetamaskExtension(driver);
  });

  test("Run Selenium test", async () => {
    driver = await DriverBuilder.getInstance();

    await driver.get("https://www.sushi.com/swap");

    const BTN_CONNECT_WALLET = "//*[@testdata-id='connect-button' and contains(@class, 'bg-secondary')]";
    const BTN_CONNECT_METAMASK = "//*[@role='menuitem' and contains(., 'MetaMask')]";

    await waitForElement(driver, BTN_CONNECT_WALLET);
    await clickElement(driver, BTN_CONNECT_WALLET);

    await waitForElementVisible(driver, BTN_CONNECT_METAMASK);
    await clickElement(driver, BTN_CONNECT_METAMASK);
    await driver.sleep(60000);
  });

  afterAll(async () => {
    await driver.quit();
    DriverBuilder.destroy();
  });
});
