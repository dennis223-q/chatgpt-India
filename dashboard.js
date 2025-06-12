fetch('/admin/logs')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('log-container');
    data.logs.forEach(log => {
      const div = document.createElement('div');
      div.textContent = log;
      container.appendChild(div);
    });
  });
