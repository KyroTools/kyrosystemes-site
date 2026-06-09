document.addEventListener("DOMContentLoaded", () => {

    buildTable();

    document
        .getElementById("calculateBtn")
        .addEventListener("click", calculateVanSystem);

});

const equipments = [
  { id: "fridge", name: "Frigo à compression", power: 45 },
  { id: "led", name: "Éclairage LED", power: 8 },
  { id: "laptop", name: "Ordinateur portable", power: 60 },
  { id: "screen", name: "Écran externe", power: 30 },
  { id: "phone", name: "Téléphone", power: 10 },
  { id: "starlink", name: "Routeur Starlink", power: 55 },
  { id: "fan", name: "Ventilateur", power: 20 },
  { id: "heater", name: "Chauffage diesel", power: 15 },
  { id: "other", name: "Autres équipements", power: 100 }
];

const solarFactors = {
  summer: 4.0,
  mid: 3.0,
  all: 2.5,
  winter: 1.5
};

const drivingFactors = {
  daily: 0.70,
  every2: 0.85,
  occasional: 1.00,
  stationary: 1.20
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
          value="${eq.id === 'fridge' ? 5 : 2}"
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
    Math.ceil(storageWh / (12 * dod));

  /*
  ============================================
  Solaire
  ============================================
  */

  const solarFactor =
    solarFactors[season];

  const drivingFactor =
    drivingFactors[driving];

  const solarPower =
    Math.ceil(
      (totalWh / solarFactor) *
      drivingFactor /
      10
    ) * 10;

  const estimatedProduction =
    solarPower * solarFactor;

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

  document.getElementById("solarPower").textContent =
    solarPower + " Wc";

  document.getElementById("robustness").textContent =
    robustness;

  document.getElementById("robustness").className =
    "vps-metric-value " + robustnessClass;

  document.getElementById("analysis").innerHTML =
    "<strong>Analyse automatique :</strong><br><br>" +
    analysis.join("<br><br>");

  document.getElementById("results").style.display =
    "block";

  document.getElementById("results").scrollIntoView({
    behavior: "smooth"
  });
}