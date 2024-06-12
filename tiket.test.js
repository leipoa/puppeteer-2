const { clickElement, putText, getText } = require("./lib/commands.js");
const { selectDateTime, orderTickets } = require("./lib/util.js");

let page;
let tomorrow = "nav.page-nav > a:nth-child(2)";
let weekLater = "nav.page-nav > a:nth-child(7)";
let movieTime = "[data-seance-id='177']";      
let ticketHint = "p.ticket__hint";
let confirmingText = "Покажите QR-код нашему контроллеру для подтверждения бронирования.";

beforeEach(async () => {
  page = await browser.newPage();
  await page.goto("http://qamid.tmweb.ru/client/index.php");
  await page.setDefaultNavigationTimeout(0);
});

afterEach(() => {
  page.close();
});

describe("Cinema tests", () => {
  test("One ticket for Movie tomorrow", async () => {
    let row = 7;
    let seat = 5;
    await selectDateTime(page, tomorrow, movieTime);
    await orderTickets(page, row, seat);
    const actual = await getText(page, ticketHint);
    expect(actual).toContain(confirmingText);
  }, 90000);

  test("Ticket for Movie if seat is taken already", async () => {
    let row = 7;
    let seat = 5;
    await expect(async () => {
      await selectDateTime(page, tomorrow, movieTime);
      await orderTickets(page, row, seat);
    }).rejects.toThrowError("Seat(s) is taken");
  });

  test("Several tickets for Movie tomorrow", async () => {
    let row = 8;
    let seat1 = 3;
    let seat2 = 4;
    await selectDateTime(page, tomorrow, movieTime);
    await orderTickets(page, row, seat1, seat2);
    const actual = await getText(page, ticketHint);
    expect(actual).toContain(confirmingText);
  }, 90000);

  test("Tickets for Movie week later", async () => {
    let row = 6;
    let seat1 = 1;
    let seat2 = 2;
    let seat3 = 3;
    let seat4 = 4;
    await selectDateTime(page, weekLater, movieTime);
    await orderTickets(page,  row, seat1, seat2, seat3, seat4);
    const actual = await getText(page, ticketHint);
    expect(actual).toContain(confirmingText);
  }, 90000);

  test("Check if the place is taken after ordering ", async () => {
    let row = 2;
    let seat = 6;
    await selectDateTime(page, weekLater, movieTime);
    await orderTickets(page, row, seat);
    await page.goto("http://qamid.tmweb.ru/client/index.php");
    await selectDateTime(page, weekLater, movieTime);
    const classExist = await page.$eval(
      `div.buying-scheme__wrapper > div:nth-child(${row}) > span:nth-child(${seat})`,
      (el) => el.classList.contains("buying-scheme__chair_taken")
    );
    expect(classExist).toEqual(true);
  },90000);
});