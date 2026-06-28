const formatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0
});

const numberFormatter = new Intl.NumberFormat("en-GB", {
  maximumFractionDigits: 1
});

const fields = {
  enquiries: document.querySelector("#enquiries"),
  bookingRate: document.querySelector("#bookingRate"),
  conversionRate: document.querySelector("#conversionRate"),
  avgValue: document.querySelector("#avgValue"),
  repeatRate: document.querySelector("#repeatRate"),
  missedRate: document.querySelector("#missedRate")
};

const output = {
  lostRevenue: document.querySelector("#lostRevenue"),
  consultations: document.querySelector("#consultations"),
  treatments: document.querySelector("#treatments"),
  missedRepeats: document.querySelector("#missedRepeats"),
  recoverable: document.querySelector("#recoverable"),
  mailtoResult: document.querySelector("#mailtoResult"),
  copySummary: document.querySelector("#copySummary")
};

function readNumber(input, fallback) {
  const value = Number(input.value);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

function calculate() {
  const enquiries = readNumber(fields.enquiries, 0);
  const bookingRate = readNumber(fields.bookingRate, 0) / 100;
  const conversionRate = readNumber(fields.conversionRate, 0) / 100;
  const avgValue = readNumber(fields.avgValue, 0);
  const repeatRate = readNumber(fields.repeatRate, 0) / 100;
  const missedRate = readNumber(fields.missedRate, 0) / 100;

  const consultations = enquiries * bookingRate;
  const treatments = consultations * conversionRate;
  const repeatOpportunities = treatments * repeatRate;
  const missedRepeats = repeatOpportunities * missedRate;
  const lostRevenue = missedRepeats * avgValue;
  const recoverable = lostRevenue * 0.35;

  return {
    enquiries,
    consultations,
    treatments,
    missedRepeats,
    lostRevenue,
    recoverable
  };
}

function buildSummary(result) {
  return [
    "Clinic follow-up recovery diagnosis",
    "",
    `New enquiries per month: ${numberFormatter.format(result.enquiries)}`,
    `Consultations booked: ${numberFormatter.format(result.consultations)}`,
    `Treatments started: ${numberFormatter.format(result.treatments)}`,
    `Repeat opportunities missed: ${numberFormatter.format(result.missedRepeats)}`,
    `Possible missed repeat-booking revenue: ${formatter.format(result.lostRevenue)}`,
    `Conservative recoverable estimate with a simple tracker: ${formatter.format(result.recoverable)}`,
    "",
    "Suggested next step: GBP 99 starter recovery tracker: daily queue, next-action dates, owners, overdue flags, value-at-risk, and message prompts."
  ].join("\n");
}

function update() {
  const result = calculate();
  const summary = buildSummary(result);

  output.lostRevenue.textContent = formatter.format(result.lostRevenue);
  output.consultations.textContent = numberFormatter.format(result.consultations);
  output.treatments.textContent = numberFormatter.format(result.treatments);
  output.missedRepeats.textContent = numberFormatter.format(result.missedRepeats);
  output.recoverable.textContent = formatter.format(result.recoverable);

  const subject = encodeURIComponent("Clinic follow-up recovery tracker diagnosis");
  const body = encodeURIComponent(`${summary}\n\nHi Shuowen,\n\nCan we discuss this setup?`);
  output.mailtoResult.href = `mailto:shuowenzhang1@gmail.com?subject=${subject}&body=${body}`;
}

Object.values(fields).forEach((input) => {
  input.addEventListener("input", update);
});

output.copySummary.addEventListener("click", async () => {
  const summary = buildSummary(calculate());
  try {
    await navigator.clipboard.writeText(summary);
    output.copySummary.textContent = "Copied";
    window.setTimeout(() => {
      output.copySummary.textContent = "Copy diagnosis";
    }, 1400);
  } catch {
    output.copySummary.textContent = "Copy unavailable";
    window.setTimeout(() => {
      output.copySummary.textContent = "Copy diagnosis";
    }, 1400);
  }
});

update();
