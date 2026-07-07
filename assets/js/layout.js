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

async function initializePage() {
document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("navToggle");
  const nav = document.getElementById("nav");

  btn.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

});

}

async function initLayout() {

    await loadNav();
    await loadFooter();

    initializePage();

}