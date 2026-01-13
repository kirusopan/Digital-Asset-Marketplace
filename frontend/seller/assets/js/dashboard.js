// Counter Animation
document.querySelectorAll(".stat-value").forEach((el) => {
  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = el.textContent.includes("$")
        ? "$" + target.toLocaleString()
        : target.toFixed(1);
      clearInterval(timer);
    } else {
      el.textContent = el.textContent.includes("$")
        ? "$" + Math.floor(current).toLocaleString()
        : current.toFixed(1);
    }
  }, 16);
});

// Sales Chart
const ctx = document.getElementById("salesChart");
if (ctx) {
  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Sales",
          data: [1200, 1900, 1500, 2200, 1800, 2400, 2100],
          borderColor: "#6366f1",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          tension: 0.4,
          fill: true,
          borderWidth: 3,
          pointRadius: 6,
          pointBackgroundColor: "#6366f1",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointHoverRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: 12,
          borderRadius: 8,
          titleColor: "#fff",
          bodyColor: "#fff",
          callbacks: {
            label: function (context) {
              return "$" + context.parsed.y.toLocaleString();
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
            drawBorder: false,
          },
          ticks: {
            callback: function (value) {
              return "$" + value;
            },
          },
        },
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
        },
      },
    },
  });
}
