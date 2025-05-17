document.getElementById("dashboardForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const newCustomers = parseInt(document.getElementById("newCustomers").value);
  const revenue = parseInt(document.getElementById("revenue").value);
  const callsBefore = parseInt(document.getElementById("callsBefore").value);
  const callsAfter = parseInt(document.getElementById("callsAfter").value);

  let result = `<h2>Ergebnisse</h2>`;
  result += `<p>Neukunden: ${newCustomers}</p>`;
  result += `<p>Umsatz: ${revenue} €</p>`;

  if (callsBefore && callsAfter) {
    const difference = callsBefore - callsAfter;
    result += `<p>Telefonaufkommen reduziert um ${difference} Anrufe</p>`;
  }

  document.getElementById("result").innerHTML = result;
});
