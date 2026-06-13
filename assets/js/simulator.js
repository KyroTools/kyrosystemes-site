document.addEventListener("DOMContentLoaded", () => {

  buildTable();

  document
    .getElementById("calculateBtn")
    .addEventListener("click", calculateVanSystem);

});

const equipments = [
  { id: "fridge", name: "Frigo à compression", power: 45, hours: 5 },
  { id: "led", name: "Éclairage LED", power: 10, hours: 3 },
  { id: "laptop", name: "Ordinateur portable", power: 50, hours: 4 },
  { id: "screen", name: "Écran externe", power: 30, hours: 4 },
  { id: "phone", name: "Chargeur de téléphone", power: 15, hours: 2 },
  { id: "starlink", name: "Routeur Starlink", power: 55, hours: 8 },
  { id: "fan", name: "Ventilateur", power: 20, hours:4 },
  { id: "heater", name: "Chauffage diesel", power: 25, hours: 8 },
  { id: "water_pump", name: "Pompe à eau", power: 25, hours:1 },
  { id: "electric_water_heater", name: "Chauffe-eau électrique (6L)", power: 200, hours:3 },
  { id: "induction_cooker", name: "Plaque à induction (1000W)", power: 1000, hours:1 },
  { id: "other", name: "Autres équipements", power: 100, hours:1 }
];

const solarFactors = {
  summer: 4.0,
  mid: 3.0,
  all: 2.5,
  winter: 1.5
};

const drivingFactors = {
  daily: 1, // 1h de conduite par jour
  every2: 0.5, // 30min de conduite par jour
  occasional: 0.25, // 15min/jour
  stationary: 0.1 // très faible production en conduite
};


function buildTable() {

  const tbody = document.getElementById("equipment-body");

  equipments.forEach(eq => {

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${eq.name}</td>
      <td>${eq.power}</td> 
      <td>
        <input
          type="number"
          min="0"
          value="1"
          id="${eq.id}_qty">
      </td>
      <td>
        <input
          type="number"
          min="0"
          step="0.5"
          value="${eq.hours}"
          id="${eq.id}_hours">
      </td>
    `;

    tbody.appendChild(row);

  });
}

function calculateVanSystem() {

  let totalWh = 0;
  let equipmentData = [];

  equipments.forEach(eq => {

    const qty =
      parseFloat(document.getElementById(eq.id + "_qty").value) || 0;

    const hours =
      parseFloat(document.getElementById(eq.id + "_hours").value) || 0;

    const wh = eq.power * qty * hours;

    totalWh += wh;

    equipmentData.push({
      name: eq.name,
      wh: wh
    });
  });

  const autonomy =
    parseInt(document.getElementById("autonomy").value);

  const batteryType =
    document.getElementById("battery").value;

  const season =
    document.getElementById("season").value;

  const driving =
    document.getElementById("driving").value;

  /*
  ============================================
  Batterie
  ============================================
  */

  const dod =
    batteryType === "lithium" ? 0.80 : 0.50;

  const storageWh =
    totalWh * autonomy;

  const batteryAh =
    Math.ceil(storageWh / (12 * dod*10)) * 10;

  /*
  ============================================
  Solaire
  ============================================
  */

  const solarFactor =
    solarFactors[season];

  const drivingFactor =
    drivingFactors[driving];

  /*const solarPower =
    Math.ceil(
      (totalWh / solarFactor) *
      drivingFactor /
      10
    ) * 10;*/
   const solarEfficiency= 0.8;
   const drivingEfficiency=0.8;
    const solarPower =
    document.getElementById("solarPower").value;

  const estimatedSolarProduction =
    solarPower * solarFactor *solarEfficiency;
  
  const estimatedDrivingProduction= 250 * drivingFactor * drivingEfficiency; 

  const estimatedProduction =
    (estimatedSolarProduction + estimatedDrivingProduction) ;

  const ratio =
    estimatedProduction / totalWh;

  /*
  ============================================
  Robustesse
  ============================================
  */

  let robustness = "";
  let robustnessClass = "";

  if (ratio < 1.1) {
    robustness = "Faible";
    robustnessClass = "robust-low";
  } else if (ratio < 1.4) {
    robustness = "Moyen";
    robustnessClass = "robust-medium";
  } else {
    robustness = "Bon";
    robustnessClass = "robust-good";
  }

  /*
  ============================================
  Analyse automatique
  ============================================
  */

  equipmentData.sort((a, b) => b.wh - a.wh);

  let analysis = [];

  if (equipmentData[0].wh > totalWh * 0.30) {
    analysis.push(
      "Votre consommation est principalement dominée par <strong>" +
      equipmentData[0].name +
      "</strong>."
    );
  }

  const teleworkWh =
    equipmentData.find(e => e.name === "Ordinateur portable").wh +
    equipmentData.find(e => e.name === "Écran externe").wh +
    equipmentData.find(e => e.name === "Routeur Starlink").wh;

  if (teleworkWh > totalWh * 0.35) {
    analysis.push(
      "Le télétravail représente une part importante de votre consommation énergétique quotidienne."
    );
  }

  if (season === "winter") {
    analysis.push(
      "Les performances des panneaux solaires sont fortement réduites en hiver. Une marge supplémentaire reste recommandée."
    );
  }

  if (driving === "stationary") {
    analysis.push(
      "Votre usage stationnaire implique une forte dépendance au stockage batterie et à la production solaire."
    );
  }

  if (autonomy >= 3) {
    analysis.push(
      "L'autonomie demandée nécessite une capacité de stockage importante afin de couvrir plusieurs jours sans recharge."
    );
  }

  if (batteryType === "lead") {
    analysis.push(
      "La technologie plomb impose une profondeur de décharge plus limitée et nécessite généralement une capacité plus importante qu'une batterie lithium."
    );
  }

  if (robustness === "Faible") {
    analysis.push(
      "Le système proposé dispose de peu de marge face aux variations d'usage et aux conditions météorologiques réelles."
    );
  }

  if (robustness === "Moyen") {
    analysis.push(
      "Le dimensionnement présente une marge raisonnable pour un usage courant."
    );
  }

  if (robustness === "Bon") {
    analysis.push(
      "Le système bénéficie d'une réserve confortable pour absorber les variations d'ensoleillement et de consommation."
    );
  }

  /*
  ============================================
  Affichage
  ============================================
  */

  document.getElementById("dailyWh").textContent =
    Math.round(totalWh) + " Wh";

  document.getElementById("batteryAh").textContent =
    batteryAh + " Ah";

  document.getElementById("production").textContent =
    estimatedProduction + " Wh";

  document.getElementById("robustness").textContent =
    robustness;

  document.getElementById("robustness").className =
    "vps-metric-value " + robustnessClass;

  document.getElementById("analysis").innerHTML =
    "<strong>Analyse automatique :</strong><br><br>" +
    analysis.join("<br><br>");

  document.getElementById("results").style.display =
    "block";

  document.getElementById("feedback-section").style.display =
    "block";

  document.getElementById("results").scrollIntoView({
    behavior: "smooth"
  });

  /*
============================================
Google Analytics
============================================
*/

  if (typeof gtag === "function") {

    gtag("event", "simulation_calculated", {

      simulator_type: "van_electrical",

      battery_type: batteryType,

      autonomy_days: autonomy

    });

  }
}

document
  .getElementById("feedbackForm")
  .addEventListener("submit", submitFeedback);

function submitFeedback(event) {

  event.preventDefault();

  const email = document.getElementById("q5").value.trim();

  if (email !== "") {

    const emailValid =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailValid) {

      alert("Email invalide");

      return;

    }
  }

  const formUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSemOclsY50AGrp1XqlXsYTYspm6lSAzh_IJLZwMxJkW7kQnyA/formResponse";

  const formData = new FormData();

  const useful =
    document.querySelector(
      'input[name="q1"]:checked'
    )?.value || "";

  formData.append(
    "entry.1019787936",
    useful
  );

  const selectedFeatures =
    Array.from(
      document.querySelectorAll(
        'input[name="q2"]:checked'
      )
    )
      .map(el => el.value)

  if (
    document.getElementById(
      "feature_other_check"
    ).checked
  ) {
    formData.append("entry.64429553.other_option_response", document.getElementById(
      "feature_other_text"
    ).value);

  }

  selectedFeatures.forEach(value => {
    formData.append("entry.64429553", value);
  });

  formData.append(
    "entry.971859063",
    document.getElementById("q3").value
  );

  const status =
    document.querySelector(
      'input[name="q4"]:checked'
    )?.value || "";

  formData.append(
    "entry.517472067",
    status
  );

  formData.append(
    "entry.1066571812",
    document.getElementById("q5").value
  );

  fetch(formUrl, {

    method: "POST",

    mode: "no-cors",

    body: formData

  })
    .then(() => {
      const form =
        document.getElementById("feedbackForm");

      const success =
        document.getElementById("feedbackSuccess");

      form.style.display = "none";

      success.style.display = "block";

      if (typeof gtag === "function") {

        gtag(
          "event",
          "feedback_submitted"
        );

      }

      document
        .getElementById("feedbackForm")
        .reset();

    })
    .catch(() => {

      document.getElementById(
        "feedbackMessage"
      ).innerHTML =
        "Une erreur est survenue.";

    });

}

document
  .getElementById("feature_other_check")
  .addEventListener("change", function () {

    document.getElementById(
      "feature_other_text"
    ).style.display =
      this.checked ? "block" : "none";

  });