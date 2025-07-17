const form = document.getElementById('expense-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date');
const expenseList = document.getElementById('expense-list');
const totalDisplay = document.getElementById('total');
const monthSelect = document.getElementById('month-select');
const currentMonthLabel = document.getElementById('current-month-label');

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value.trim());
  const date = dateInput.value;

  if (!description || isNaN(amount) || amount <= 0 || !date) {
    alert("Please enter valid description, amount, and date.");
    return;
  }

  const expense = {
    id: Date.now(),
    description,
    amount,
    date
  };

  expenses.push(expense);
  saveExpenses();
  updateMonthOptions();
  updateExpenseList();
  form.reset();
});

function getMonthKey(dateStr) {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function updateMonthOptions() {
  const months = [...new Set(expenses.map(e => getMonthKey(e.date)))].sort().reverse();
  monthSelect.innerHTML = months.map(m => {
    const [year, month] = m.split("-");
    const monthName = new Date(`${m}-01`).toLocaleString('default', { month: 'long' });
    return `<option value="${m}">${monthName} ${year}</option>`;
  }).join("");

  if (!monthSelect.value && months.length > 0) {
    monthSelect.value = months[0];
  }

  updateExpenseList();
}

function updateExpenseList() {
  const selectedMonth = monthSelect.value;
  const filtered = expenses.filter(e => getMonthKey(e.date) === selectedMonth);

  expenseList.innerHTML = '';
  let total = 0;

  filtered.forEach(exp => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${exp.description} - ₹${exp.amount.toFixed(2)} <small>(${exp.date})</small>
      <button class="delete-btn" onclick="deleteExpense(${exp.id})">X</button>
    `;
    expenseList.appendChild(li);
    total += exp.amount;
  });

  totalDisplay.textContent = total.toFixed(2);

  const [year, month] = selectedMonth.split("-");
  const label = new Date(`${selectedMonth}-01`).toLocaleString('default', { month: 'long', year: 'numeric' });
  currentMonthLabel.textContent = label;
}

function deleteExpense(id) {
  expenses = expenses.filter(e => e.id !== id);
  saveExpenses();
  updateMonthOptions();
  updateExpenseList();
}

monthSelect.addEventListener('change', updateExpenseList);

// Init
updateMonthOptions();
