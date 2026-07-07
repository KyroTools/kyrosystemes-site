// ------------------------------------------------------
// Google Analytics 4
// Désactivé en environnement local
// Gestion du consentement cookies (RGPD)
// ------------------------------------------------------

(function () {

    // Désactivation en local
    const hostname = window.location.hostname;

    const isLocal =
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname === "";

    if (isLocal) {
        console.log("Google Analytics désactivé en environnement local.");
        return;
    }


    // --------------------------------------------------
    // Initialisation Google Consent Mode
    // --------------------------------------------------

    window.dataLayer = window.dataLayer || [];

    function gtag() {
        dataLayer.push(arguments);
    }

    window.gtag = gtag;


    // Consentement par défaut :
    // aucune collecte avant acceptation utilisateur
    gtag("consent", "default", {
        analytics_storage: "denied",
        ad_storage: "denied",
        wait_for_update: 500
    });


    // --------------------------------------------------
    // Chargement de Google Analytics
    // --------------------------------------------------

    const script = document.createElement("script");

    script.async = true;
    script.src =
        "https://www.googletagmanager.com/gtag/js?id=G-EXJCCGRF1M";

    document.head.appendChild(script);


    // --------------------------------------------------
    // Configuration GA4
    // --------------------------------------------------

    gtag("js", new Date());

    gtag("config", "G-EXJCCGRF1M", {

        // anonymisation IP
        anonymize_ip: true,

        // évite d'envoyer des données avant consentement
        send_page_view: true

    });


    console.log("Google Analytics initialisé.");

})();