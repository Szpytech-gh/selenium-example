import { WebDriver } from "selenium-webdriver";
import { MetaMask } from "./poms/MetaMask";


export async function importMetamaskExtension(
    driver: WebDriver,
    mnemonicKeys = "",
  ) {
    await leaveOnlyOneTab(driver);
  
    const extension = new MetaMask(driver);
    await extension.go();
    if (mnemonicKeys === "") {
      await extension.setupAccount();
    } else {
      await extension.setupAccount(mnemonicKeys);
    }
  }

  export async function leaveOnlyOneTab(driver: WebDriver) {
    const handles = await driver.getAllWindowHandles();
    if (handles.length <= 1) {
      return;
    }
    for (let index = 1; index < handles.length; index++) {
      const handle = handles[index];
      await driver.switchTo().window(handle);
      await driver.close();
    }
    await driver.switchTo().window(handles[0]);
  }