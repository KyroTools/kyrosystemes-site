// ------------------------------------------------------
// Google Analytics (désactivé en environnement local)
// ------------------------------------------------------

(function () {

    const isLocal =
        location.hostname === "localhost" ||
        location.hostname === "127.0.0.1";

    if (isLocal) {
        console.log("Mode local : Google Analytics désactivé.");
        return;
    }

    // Création de dataLayer
    window.dataLayer = window.dataLayer || [];

    window.gtag = function () {
        dataLayer.push(arguments);
    };

    // Consentement par défaut
    gtag("consent", "default", {
        analytics_storage: "denied"
    });

    // Chargement de Google Analytics
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-EXJCCGRF1M";
    document.head.appendChild(script);

    // Initialisation
    gtag("js", new Date());

    gtag("config", "G-EXJCCGRF1M", {
        anonymize_ip: true
    });

})();