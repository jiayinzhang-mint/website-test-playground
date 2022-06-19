/**
 * @jest-environment puppeteer
 */

jest.setTimeout(100000);

describe("Task1", () => {
  beforeAll(async () => {
    // go to the website first
    const keyword = "mouse";
    const v = 1;
    await page.goto(`https://www.amazon.com/s?k=${keyword}&page=${v}`, {
      waitUntil: "networkidle0",
    });
  });

  it("test basic search slots", async () => {
    // analyze the results
    const r = await page.evaluate(() => {
      result = [];
      const tags = document.querySelectorAll(".s-result-list > div");
      tags.forEach((t) => {
        const item = {
          name:
            t &&
            t.querySelector(".a-section > h2") &&
            t.querySelector(".a-section > h2").textContent.trim(),
          price:
            t &&
            t.querySelector(".a-price > .a-offscreen") &&
            t.querySelector(".a-price > .a-offscreen").textContent,
        };

        if (item.name && item.price) {
          result.push(item);
        }
      });
      return result;
    });

    // ensure that the results are not empty
    expect(r.length > 5).toBeTruthy();
  });

  it("test brand filter", async () => {
    // select Logitech brand & submit request
    await page.waitForSelector("#p_89\\/\\Logitech > .a-list-item > a");
    await Promise.all([
      page.waitForNavigation(),
      page.click("#p_89\\/\\Logitech > .a-list-item > a"),
    ]);

    // analyze the results
    const r = await page.evaluate(() => {
      const tags = document.querySelectorAll(".s-result-list > div");
      const result = [...tags].map(
        (t) =>
          t &&
          t.querySelector(".a-section > h2") &&
          t.querySelector(".a-section > h2").textContent.trim()
      );
      return result;
    });

    // expect all brands to be Logitech
    expect(r).toEqual(
      expect.arrayContaining([expect.stringContaining("Logitech")])
    );
  });

  it("test price filter button", async () => {
    const keyword = "mouse";
    const v = 1;
    await page.goto(`https://www.amazon.com/s?k=${keyword}&page=${v}`, {
      waitUntil: "networkidle0",
    });

    // select "under $25"
    const [a] = await page.$x("//a[contains(., 'Under $25')]");
    if (a) {
      await Promise.all([page.waitForNavigation(), a.click()]);
    }

    // select "sort by high to low"
    await Promise.all([
      page.waitForNavigation(),
      await page.select("#s-result-sort-select", "price-desc-rank"),
    ]);

    // analyze the results
    const r = await page.evaluate(() => {
      const tags = document.querySelectorAll(".s-result-list > div");
      result = [];
      tags.forEach((t) => {
        const item =
          t &&
          t.querySelector(".a-price > .a-offscreen") &&
          t.querySelector(".a-price > .a-offscreen").textContent;

        if (Number(item)) {
          result.push(item);
        }
      });

      return result;
    });

    // expect the max price to be <=25
    expect(Math.max(r)).toBeLessThanOrEqual(25);

    // expect all price to be <=25
    r.forEach((e) => {
      expect(Number(e)).toBeLessThanOrEqual(25);
    });
  });

  it("test price filter input box", async () => {
    // fill in the price range (10-50)
    await page.type('input[name="low-price"]', "10");
    await page.type('input[name="high-price"]', "50");

    // ensure the submit button exists && submit request && wait for the results
    await page.waitForSelector(
      "#a-autoid-1 > .a-button-inner > .a-button-input"
    );
    await Promise.all([
      page.waitForNavigation(),
      page.click("#a-autoid-1 > .a-button-inner > .a-button-input"),
    ]);

    // select "sort by high to low"
    const r = await page.evaluate(() => {
      const tags = document.querySelectorAll(".s-result-list > div");
      result = [];
      tags.forEach((t) => {
        const item =
          t &&
          t.querySelector(".a-price > .a-offscreen") &&
          t.querySelector(".a-price > .a-offscreen").textContent;

        if (Number(item)) {
          result.push(item);
        }
      });

      return result;
    });

    // expect all price to be >=10 and <=50
    r.forEach((e) => {
      expect(Number(e)).toBeGreaterThanOrEqual(10);
      expect(Number(e)).toBeLessThanOrEqual(50);
    });
  });
});
