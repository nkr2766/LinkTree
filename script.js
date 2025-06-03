const linksDiv = document.getElementById('links');
const addLinkBtn = document.getElementById('add-link');
const generateBtn = document.getElementById('generate');
const downloadBtn = document.getElementById('download');
const resetBtn = document.getElementById('reset');
const linkTreeSection = document.getElementById('link-tree');
const formSection = document.getElementById('form-section');
const displayLinks = document.getElementById('display-links');
const displayName = document.getElementById('display-name');
const displayImage = document.getElementById('display-image');
const themeToggle = document.getElementById('theme-toggle');
const bgColorInput = document.getElementById('bg-color');
const linkColorInput = document.getElementById('link-color');
const fontSelect = document.getElementById('font-select');

function addLinkRow(platform = '', url = '') {
  const row = document.createElement('div');
  row.className = 'row g-2 align-items-end mb-2 link-row';
  row.innerHTML = `
    <div class="col-md-4">
      <input type="text" class="form-control platform" placeholder="Platform" value="${platform}">
    </div>
    <div class="col-md-6">
      <input type="text" class="form-control url" placeholder="URL" value="${url}">
    </div>
    <div class="col-md-2 text-end">
      <button class="btn btn-danger btn-sm remove-link"><i class="fas fa-trash-alt"></i></button>
    </div>`;
  row.querySelector('.remove-link').addEventListener('click', () => row.remove());
  linksDiv.appendChild(row);
}

function generateLinkTree() {
  const name = document.getElementById('name').value.trim();
  const imageUrl = document.getElementById('profile-pic').value.trim();
  const bgColor = bgColorInput.value;
  const linkColor = linkColorInput.value;
  const fontFamily = fontSelect.value;
  const links = [];
  linksDiv.querySelectorAll('.link-row').forEach(row => {
    const platform = row.querySelector('.platform').value.trim();
    const url = row.querySelector('.url').value.trim();
    if (platform && url) links.push({ platform, url });
  });
  if (!links.length) {
    alert('Please add at least one link.');
    return;
  }
  displayLinks.innerHTML = '';
  links.forEach(l => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerHTML = `<a href="${l.url}" target="_blank">${l.platform}</a>`;
    displayLinks.appendChild(li);
  });
  displayName.textContent = name ? `${name}'s Links` : 'My Links';
  if (imageUrl) {
    displayImage.src = imageUrl;
    displayImage.style.display = 'block';
  } else {
    displayImage.style.display = 'none';
  }
  linkTreeSection.style.backgroundColor = bgColor;
  linkTreeSection.style.fontFamily = fontFamily;
  displayLinks.querySelectorAll('a').forEach(a => {
    a.style.color = linkColor;
  });
  const data = { name, imageUrl, links, bgColor, linkColor, fontFamily };
  localStorage.setItem('linkTreeData', JSON.stringify(data));
  formSection.classList.add('d-none');
  linkTreeSection.classList.remove('d-none');
}

function resetForm() {
  formSection.classList.remove('d-none');
  linkTreeSection.classList.add('d-none');
}

function downloadLinkTree() {
  const data = JSON.parse(localStorage.getItem('linkTreeData') || '{}');
  if (!data.links || !data.links.length) return;
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${data.name || 'LinkTree'}</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<style>
body { background-color: ${data.bgColor || '#ffffff'}; font-family: ${data.fontFamily || 'inherit'}; }
a { color: ${data.linkColor || '#0d6efd'}; }
</style>
</head>
<body class="p-4">
<h2>${data.name || ''}</h2>
${data.imageUrl ? `<img src="${data.imageUrl}" style="width:150px;height:150px;object-fit:cover;" class="rounded-circle mb-3">` : ''}
<ul class="list-group">
${data.links.map(l => `<li class="list-group-item"><a href="${l.url}" target="_blank">${l.platform}</a></li>`).join('')}
</ul>
</body>
</html>`;
  const blob = new Blob([html], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'linktree.html';
  a.click();
}

function loadFromStorage() {
  const data = JSON.parse(localStorage.getItem('linkTreeData') || '{}');
  if (data.name) document.getElementById('name').value = data.name;
  if (data.imageUrl) document.getElementById('profile-pic').value = data.imageUrl;
  if (data.bgColor) bgColorInput.value = data.bgColor;
  if (data.linkColor) linkColorInput.value = data.linkColor;
  if (data.fontFamily) fontSelect.value = data.fontFamily;
  if (data.links && data.links.length) {
    data.links.forEach(l => addLinkRow(l.platform, l.url));
  } else {
    addLinkRow();
  }
}

function toggleTheme() {
  if (themeToggle.checked) {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('bg-light');
  } else {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('bg-light');
  }
  localStorage.setItem('darkMode', themeToggle.checked ? '1' : '0');
}

addLinkBtn.addEventListener('click', () => addLinkRow());
generateBtn.addEventListener('click', generateLinkTree);
downloadBtn.addEventListener('click', downloadLinkTree);
resetBtn.addEventListener('click', resetForm);
themeToggle.addEventListener('change', toggleTheme);

window.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  if (localStorage.getItem('darkMode') === '1') {
    themeToggle.checked = true;
    toggleTheme();
  }
});
