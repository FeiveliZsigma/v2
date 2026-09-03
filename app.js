const welcomePage =
    document.getElementById("welcomePage");

const mainPage =
    document.getElementById("mainPage");


/* =========================
   MAIN PAGE BUTTON
========================= */

document
    .getElementById("mainPageButton")
    .addEventListener("click", function () {

        welcomePage.classList.remove("active");

        mainPage.classList.add("active");

        window.scrollTo(0, 0);

    });


/* =========================
   BACK BUTTON
========================= */

document
    .getElementById("backButton")
    .addEventListener("click", function () {

        mainPage.classList.remove("active");

        welcomePage.classList.add("active");

        window.scrollTo(0, 0);

    });
