/* ============================================================
   ŞİMŞEK WELLNESS — Kalori, BMI & Makro Hesaplayıcı
   Formüller: Mifflin-St Jeor (BMR), aktivite çarpanlı TDEE,
   BMI, ideal kilo aralığı (BMI 18.5–24.9), su ihtiyacı (33 ml/kg).
   WhatsApp numarası js/main.js içindeki WHATSAPP_NUMBER'dan alınır.
   ============================================================ */

(() => {
  const form = document.getElementById("calcForm");
  const placeholder = document.getElementById("calcPlaceholder");
  const output = document.getElementById("calcOutput");
  let macroChart = null;
  let lastResult = null;

  const GOALS = {
    lose: { label: "Kilo Vermek İçin Hedef", text: "Kilo Verme", delta: -500 },
    keep: { label: "Kilonuzu Korumak İçin", text: "Kilomu Koruma", delta: 0 },
    gain: { label: "Kilo Almak İçin Hedef", text: "Kilo Alma", delta: +400 },
  };

  // Hedefe göre protein ihtiyacı (g / kg)
  const PROTEIN_PER_KG = { lose: 2.0, keep: 1.6, gain: 1.8 };

  const fmt = (n) => Math.round(n).toLocaleString("tr-TR");

  function bmiCategory(bmi) {
    if (bmi < 18.5) return { text: "Zayıf", cls: "low" };
    if (bmi < 25) return { text: "Normal", cls: "ok" };
    if (bmi < 30) return { text: "Fazla Kilolu", cls: "warn" };
    return { text: "Obez", cls: "high" };
  }

  function calculate() {
    const gender = form.cgender.value;
    const age = parseFloat(document.getElementById("cage").value);
    const height = parseFloat(document.getElementById("cheight").value);
    const weight = parseFloat(document.getElementById("cweight").value);
    const activity = parseFloat(document.getElementById("cactivity").value);
    const goal = form.cgoal.value;

    // Mifflin-St Jeor
    const bmr = gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

    const tdee = bmr * activity;

    // Hedef kalori (sağlık için 1.200 kcal altına inmiyoruz)
    const goalCal = Math.max(tdee + GOALS[goal].delta, 1200);

    // Makrolar: protein kg başına, yağ %27, kalan karbonhidrat
    const proteinG = PROTEIN_PER_KG[goal] * weight;
    const fatG = (goalCal * 0.27) / 9;
    const carbG = Math.max((goalCal - proteinG * 4 - fatG * 9) / 4, 0);

    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);
    const idealLow = 18.5 * heightM * heightM;
    const idealHigh = 24.9 * heightM * heightM;
    const waterL = weight * 0.033;

    return { gender, age, height, weight, goal, bmi, bmr, tdee, goalCal, proteinG, carbG, fatG, idealLow, idealHigh, waterL };
  }

  function render(r) {
    const cat = bmiCategory(r.bmi);

    document.getElementById("rBmi").textContent = r.bmi.toFixed(1).replace(".", ",");
    const chip = document.getElementById("rBmiCat");
    chip.textContent = cat.text;
    chip.className = "bmi-chip " + cat.cls;

    // BMI 14–40 aralığını ölçek üzerinde %0–100'e eşle
    const pos = Math.min(Math.max((r.bmi - 14) / (40 - 14), 0.02), 0.98) * 100;
    document.getElementById("bmiMarker").style.left = pos + "%";

    document.getElementById("rBmr").textContent = fmt(r.bmr);
    document.getElementById("rTdee").textContent = fmt(r.tdee);
    document.getElementById("rGoal").textContent = fmt(r.goalCal);
    document.getElementById("rGoalLabel").textContent = GOALS[r.goal].label;

    document.getElementById("rProt").textContent = fmt(r.proteinG) + " g";
    document.getElementById("rCarb").textContent = fmt(r.carbG) + " g";
    document.getElementById("rFat").textContent = fmt(r.fatG) + " g";

    document.getElementById("rIdeal").textContent = fmt(r.idealLow) + " – " + fmt(r.idealHigh) + " kg";
    document.getElementById("rWater").textContent = r.waterL.toFixed(1).replace(".", ",") + " litre";

    drawChart(r);

    placeholder.hidden = true;
    output.hidden = false;

    if (window.innerWidth < 860) {
      output.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function drawChart(r) {
    const wrap = document.querySelector(".macro-chart");
    if (typeof Chart === "undefined") {
      wrap.style.display = "none"; // CDN yüklenemezse gram listesi yeterli
      return;
    }
    const data = [Math.round(r.proteinG), Math.round(r.carbG), Math.round(r.fatG)];
    if (macroChart) {
      macroChart.data.datasets[0].data = data;
      macroChart.update();
      return;
    }
    macroChart = new Chart(document.getElementById("macroChart"), {
      type: "doughnut",
      data: {
        labels: ["Protein", "Karbonhidrat", "Yağ"],
        datasets: [{
          data,
          backgroundColor: ["#78be20", "#f5821f", "#2f9dd0"],
          borderWidth: 3,
          borderColor: "#ffffff",
          hoverOffset: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: "62%",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed.toLocaleString("tr-TR")} g`,
            },
          },
        },
      },
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    lastResult = calculate();
    render(lastResult);
  });

  /* ---------- Sonuçları WhatsApp'a gönder ---------- */
  document.getElementById("waShare").addEventListener("click", () => {
    if (!lastResult) return;
    const r = lastResult;
    const cat = bmiCategory(r.bmi);
    const genderText = r.gender === "male" ? "Erkek" : "Kadın";

    let text = "Merhaba! Web sitenizdeki hesaplama aracını kullandım.\n\n";
    text += `👤 ${genderText}, ${r.age} yaş — ${r.height} cm, ${r.weight} kg\n`;
    text += `🎯 Hedefim: ${GOALS[r.goal].text}\n\n`;
    text += `📊 BMI: ${r.bmi.toFixed(1).replace(".", ",")} (${cat.text})\n`;
    text += `🔥 BMR: ${fmt(r.bmr)} kcal | TDEE: ${fmt(r.tdee)} kcal\n`;
    text += `🍽️ Hedef kalori: ${fmt(r.goalCal)} kcal/gün\n`;
    text += `🥩 Protein ${fmt(r.proteinG)} g • 🍚 Karbonhidrat ${fmt(r.carbG)} g • 🥑 Yağ ${fmt(r.fatG)} g\n\n`;
    text += "Bu sonuçları birlikte değerlendirmek ve ücretsiz vücut analizi randevusu almak istiyorum.";

    const number = typeof WHATSAPP_NUMBER !== "undefined" ? WHATSAPP_NUMBER : "905550070269";
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, "_blank");
  });
})();
