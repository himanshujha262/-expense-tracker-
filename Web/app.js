const API_URL = "http://localhost:8080/api/transactions";

const table = document.getElementById("transactionTable");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const balanceEl = document.getElementById("balance");

const form = document.getElementById("transactionForm");
const noteInput = document.getElementById("note");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const dateInput = document.getElementById("date");

let chart = null;

async function loadTransactions() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    table.innerHTML = "";

    let income = 0;
    let expense = 0;

    data.forEach(t => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${t.date}</td>
        <td>${t.note}</td>
        <td>₹${t.amount}</td>
        <td>${t.type}</td>
        <td>
          <button class="delete-btn" onclick="deleteTransaction('${t.id}')">
            Delete
          </button>
        </td>
      `;

      table.appendChild(row);

      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    });

    incomeEl.textContent = `₹${income}`;
    expenseEl.textContent = `₹${expense}`;
    balanceEl.textContent = `₹${income - expense}`;

    renderChart(income, expense);

  } catch (error) {
    console.error("Error loading transactions:", error);
  }
}

async function addTransaction(e) {
  e.preventDefault();

  const transaction = {
    note: noteInput.value,
    amount: Number(amountInput.value),
    type: typeInput.value,
    date: dateInput.value
  };

  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaction)
    });

    form.reset();
    loadTransactions();

  } catch (error) {
    console.error("Error adding transaction:", error);
  }
}

async function deleteTransaction(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadTransactions();
  } catch (error) {
    console.error("Error deleting transaction:", error);
  }
}

function renderChart(income, expense) {
  const ctx = document.getElementById("expenseChart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Income", "Expense"],
      datasets: [
        {
          data: [income, expense]
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          labels: { color: "#e2e8f0" }
        }
      }
    }
  });
}

form.addEventListener("submit", addTransaction);

loadTransactions();
