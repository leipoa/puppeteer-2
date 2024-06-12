Feature: Take A Ticket
    Scenario: Booking a ticket
        Given user is on "https://qamid.tmweb.ru/client/index.php"
        When user select 1 day
        When user take a ticket 3 row 4 sit
        Then user seen "Вы выбрали билеты:"