/**
 * @jest-environment puppeteer
 */

jest.setTimeout(100000);

describe("Test2", () => {
  beforeAll(async () => {
    await page.goto(
      `https://www.amazon.com/Wireless-COCNI-Computer-noiseless-Ergonomic/dp/B09DYLXT3C/ref=sr_1_1_sspa?crid=2KGFJDI3KID6X&keywords=mouse&qid=1655567655&refinements=p_n_feature_thirty_browse-bin%3A486288011&rnid=405901011&s=pc&sprefix=%2Caps%2C677&sr=1-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUFZQ0UzV1RPOElCWU4mZW5jcnlwdGVkSWQ9QTA0NzQwMDAyMjZUNlpQRDRZTjExJmVuY3J5cHRlZEFkSWQ9QTAyNDU4NzkzSEVLTUtOWTVRMFdEJndpZGdldE5hbWU9c3BfYXRmJmFjdGlvbj1jbGlja1JlZGlyZWN0JmRvTm90TG9nQ2xpY2s9dHJ1ZQ==`,
      {
        waitUntil: "networkidle0",
      }
    );
  });

  it("test add to cart & redirect to login page", async () => {
    // click "add to cart" button & wait for page to redirect
    await page.waitForSelector("#add-to-cart-button");
    await Promise.all([
      page.waitForNavigation(),
      page.click("#add-to-cart-button"),
    ]);

    // click "proceed"
    await page.waitForSelector('input[name="proceedToRetailCheckout"]');
    await Promise.all([
      page.waitForNavigation(),
      page.click('input[name="proceedToRetailCheckout"]'),
    ]);

    // verify if the sign-in page presents
    const r = await page.evaluate(() => {
      return document.body.innerHTML.search("Sign-In");
    });

    expect(r).toBeGreaterThan(0);
  });
});
