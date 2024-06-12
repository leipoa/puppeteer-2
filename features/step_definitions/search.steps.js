const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const { Given, When, Then, Before, After } = require("cucumber");
const { putText, getText } = require("../../lib/commands.js");

Before(async function () {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();
  this.browser = browser;
  this.page = page;
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

Given("user is on {string}", async function (string) {
  return await this.page.goto(`${string}`);
});

When("user select {int} day", async function (int) {
  this.page.waitForSelector('[class="page-nav__day-week"]');
  await (await this.page.$$('[class="page-nav__day-week"]'))[int].click();
});

When("user take a ticket {int} row {int} sit", async function (int, int4) {
  console.log(int4);
  this.page.waitForSelector('[class="movie-seances__time-block"]');
  await this.page.click('[class="movie-seances__time-block"]');

  this.page.waitForSelector(`div > div:nth-child(${int}) > span`);
  await this.page.click(`div:nth-child(${int}) > span:nth-child(${int4})`);

  this.page.waitForSelector('[class="acceptin-button"]');
  this.page.click('[class="acceptin-button"]');

  this.page.waitForSelector('[class="ticket__check-title"]');
  this.page.waitForSelector('[class="acceptin-button"]');
  this.page.click('[class="acceptin-button"]');
});

Then("user seen {string}", async function (string) {
  console.log(string);
  await this.page.waitForSelector('[class="ticket__check-title"]');
  const title = await this.page.$eval(
    '[class="ticket__check-title"]',
    (link) => link.textContent
  );
  expect(title).contain("Вы выбрали билеты:");
});