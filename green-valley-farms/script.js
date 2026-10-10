(function () {
  'use strict';

  const produceBoxes = document.querySelectorAll('input[name="produce"]');
  const qtyInput = document.getElementById('qty');
  const totalOutput = document.getElementById('order-total');

  function refreshTotal() {
    let sum = 0;
    produceBoxes.forEach((box) => {
      if (box.checked) {
        sum += Number(box.dataset.price);
      }
    });
    const qty = Number(qtyInput.value) || 0;
    totalOutput.textContent = (sum * qty).toFixed(2);
  }

  produceBoxes.forEach((box) => box.addEventListener('change', refreshTotal));
  qtyInput.addEventListener('input', refreshTotal);
  refreshTotal();

  const notesInput = document.getElementById('notes');
  const notesCount = document.getElementById('notes-count');

  function refreshNotesCount() {
    notesCount.textContent = Number(notesInput.maxLength) - notesInput.value.length;
  }
  notesInput.addEventListener('input', refreshNotesCount);
  refreshNotesCount();

  const form = document.getElementById('order-form');
  const statusEl = document.getElementById('order-status');
  const dialog = document.getElementById('order-dialog');
  const summaryBody = document.getElementById('order-summary-body');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const checkedBoxes = Array.from(produceBoxes).filter((box) => box.checked);
    if (checkedBoxes.length === 0) {
      statusEl.textContent = 'Please select at least one item before placing an order.';
      return;
    }
    statusEl.textContent = '';

    summaryBody.innerHTML = '';
    const data = new FormData(form);

    checkedBoxes.forEach((box) => {
      const row = document.createElement('tr');
      const th = document.createElement('th');
      th.scope = 'row';
      th.textContent = box.value;
      const td = document.createElement('td');
      td.textContent = qtyInput.value + ' unit(s)';
      row.append(th, td);
      summaryBody.appendChild(row);
    });

    ['customer-name', 'customer-phone', 'delivery', 'order-date', 'notes'].forEach((key) => {
      const value = data.get(key);
      if (!value) return;
      const row = document.createElement('tr');
      const th = document.createElement('th');
      th.scope = 'row';
      th.textContent = key;
      const td = document.createElement('td');
      td.textContent = value;
      row.append(th, td);
      summaryBody.appendChild(row);
    });

    const totalRow = document.createElement('tr');
    const totalTh = document.createElement('th');
    totalTh.scope = 'row';
    totalTh.textContent = 'Estimated total';
    const totalTd = document.createElement('td');
    totalTd.textContent = 'GHS ' + totalOutput.textContent;
    totalRow.append(totalTh, totalTd);
    summaryBody.appendChild(totalRow);

    dialog.showModal();
  });
})();
