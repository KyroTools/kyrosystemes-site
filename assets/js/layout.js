async function loadNav() {
  const response = await fetch("/includes/nav.html");
  const html = await response.text();

  document.getElementById("nav-container").innerHTML = html;

}

async function loadFooter() {
  const response = await fetch("/includes/footer.html");
  const html = await response.text();
  document.getElementById("footer-container").innerHTML = html;

}

function initializePage() {
    const nav = document.getElementById("nav");
    const burger = document.getElementById("navBurger");

    if (!nav || !burger) {
        console.log("Menu mobile non initialisé");
        return;
    }

    burger.addEventListener("click", () => {

        nav.classList.toggle("open");
    });


}


async function initLayout() {

  await loadNav();
  await loadFooter();

  initializePage();

}