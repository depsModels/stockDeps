const switchTema = document.getElementById('darkmode-toggle');



switchTema.addEventListener('change', () => {
  if (switchTema.checked) {

    const now = new Date();
    const expireDate = new Date(now.getTime() + (365 * 24 * 60 * 60 * 1000)); // expira em 1 ano
    document.cookie = `darkmode=true; expires=${expireDate.toUTCString()}`;
    document.documentElement.classList.add('dark-mode');
  } else {

    const now = new Date();
    const expireDate = new Date(now.getTime() - (24 * 60 * 60 * 1000)); // expira em 1 dia
    document.cookie = `darkmode=false; expires=${expireDate.toUTCString()}`;
    document.documentElement.classList.remove('dark-mode');
  }
});

const darkModeCookie = document.cookie.split('; ').find(row => row.startsWith('darkmode='));
if (darkModeCookie) {
  const isDarkMode = darkModeCookie.split('=')[1] === 'true';
  if (isDarkMode) {

    switchTema.checked = true;
    document.documentElement.classList.add('dark-mode');
  }
}
