import { WebDriver, By, until, Key } from "selenium-webdriver";

const timeOut = 60000;

export async function appendText(
  driver: WebDriver,
  elementXpath: string,
  text: string
) {
  await waitForElement(driver, elementXpath);
  const element = await driver.findElement(By.xpath(elementXpath));
  await element.sendKeys(text);
}

export async function waitForElement(
  driver: WebDriver,
  xpath: string,
  timeout = timeOut
) {
  await driver.wait(until.elementLocated(By.xpath(xpath)), timeout);
}

export function buildDataTestIdXpath(dataTestId: string) {
    return `//*[@data-testid='${dataTestId}']`;
  }

  export async function clearTextManual(driver: WebDriver, elementXpath: string) {
    await waitForElement(driver, elementXpath);
    const inputField = await driver.findElement(By.xpath(elementXpath));
    while ((await inputField.getAttribute("value")) !== "") {
      await inputField.sendKeys(Key.BACK_SPACE);
    }
    await driver.sleep(500);
  }

  export async function clickElement(driver: WebDriver, xpath: string) {
    await waitForElement(driver, xpath);
    const element = await driver.findElement(By.xpath(xpath));
    await driver.wait(until.elementIsVisible(element), timeOut);
    await driver.wait(until.elementIsEnabled(element), timeOut);
    await element.click();
  }

  export async function doActionInDifferentWindow(
    driver: WebDriver,
    fn: (driver: WebDriver) => void,
  ) {
    await waitForNewWindow(driver, 10000, 500);
    let handle = await (await driver).getAllWindowHandles();
    let iterator = handle.reverse().entries();
  
    let value = iterator.next().value;
    while (value) {
      await driver.switchTo().window(value[1]);
  
      try {
        await fn(driver);
        break;
      } catch (error) {}
      value = iterator.next().value;
    }
    handle = await (await driver).getAllWindowHandles();
    iterator = handle.entries();
    value = iterator.next().value;
    await driver.switchTo().window(value[1]);
    return;
  }

  export async function waitForNewWindow(
    driver: WebDriver,
    timeout: number,
    retryInterval: number,
  ): Promise<void> {
    const currentWindowHandle = await driver.getWindowHandle();
  
    const startTime = Date.now();
    let elapsedTime = 0;
  
    while (elapsedTime < timeout) {
      const windowHandles = await driver.getAllWindowHandles();
      if (
        windowHandles.length > 1 &&
        windowHandles.includes(currentWindowHandle)
      ) {
        return;
      }
  
      await driver.sleep(retryInterval);
      elapsedTime = Date.now() - startTime;
    }
  
    throw new Error(`Timed out waiting for new window to appear.`);
  }

  export async function isDisplayed(driver: WebDriver, elementXpath: string) {
    try {
      await waitForElement(driver, elementXpath, 4000);
      return await (
        await driver.findElement(By.xpath(elementXpath))
      ).isDisplayed();
    } catch (Error) {
      return false;
    }
  }

  export async function scrollIntoView(driver: WebDriver, xpath: string) {
    await waitForElement(driver, xpath);
    const element = await driver.findElement(By.xpath(xpath));
    await driver.executeScript(
      'arguments[0].scrollIntoView({ behavior: "smooth" });',
      element,
    );
    await driver.wait(until.elementIsVisible(element), timeOut);
  }

  export async function waitForElementVisible(
    driver: WebDriver,
    xpath: string,
    timeout = timeOut,
  ) {
    await waitForElement(driver, xpath, timeout);
    const element = await driver.findElement(By.xpath(xpath));
    await driver.wait(until.elementIsVisible(element), timeout);
  }

  export async function writeText(
    driver: WebDriver,
    elementXpath: string,
    text: string,
  ) {
    await waitForElement(driver, elementXpath);
    await (await driver.findElement(By.xpath(elementXpath))).clear();
    const input = await driver.findElement(By.xpath(elementXpath));
    await driver.executeScript("arguments[0].value = '';", input);
    await (await driver.findElement(By.xpath(elementXpath))).sendKeys(text);
  }