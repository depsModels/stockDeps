const navbarToggle = document.querySelector(".navbar-toggler");
const navbarCollapse = document.querySelector(".collapse.navbar-collapse");
const closeButton = document.querySelector(".close-button");

function updateButtonVisibility() {
  if (window.innerWidth < 992) { // 992px é a largura padrão do Bootstrap para o ponto de quebra do menu hamburguer
    if (navbarCollapse.classList.contains("show")) {
      closeButton.style.display = "block";
    } else {
      closeButton.style.display = "none";
    }
  } else {
    closeButton.style.display = "none";
  }
}

navbarToggle.addEventListener("click", () => {
  navbarCollapse.classList.toggle("show");
  updateButtonVisibility();
});

closeButton.addEventListener("click", () => {
  navbarCollapse.classList.remove("show");
  closeButton.style.display = "none";
});

// Adicione um ouvinte de redimensionamento da janela
window.addEventListener("resize", updateButtonVisibility);

// Chame a função para verificar a visibilidade inicial do botão
updateButtonVisibility();
