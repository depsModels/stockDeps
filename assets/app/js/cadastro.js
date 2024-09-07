const form = document.getElementById('form');
const nomeCompleto = document.getElementById('nome-completo');
const email = document.getElementById('email');
const celular = document.getElementById('celular');
const uf = document.getElementById('uf');
const cpf = document.getElementById('cpf');
const cidade = document.getElementById('cidade');
const bairro = document.getElementById('bairro');

form.addEventListener('submit', e => {
e.preventDefault();
checkInputs();
});

function checkInputs() {
const nomeCompletoValue = nomeCompleto.value.trim();
const emailValue = email.value.trim();
const celularValue = celular.value.trim();
const ufValue = uf.value.trim();
const cpfValue = cpf.value.trim();
const cidadeValue = cidade.value.trim();
const bairroValue = bairro.value.trim();

if (nomeCompletoValue === '') {
setErrorFor(nomeCompleto, 'Nome não pode ficar em branco');
} else {
setSuccessFor(nomeCompleto);
}

if (emailValue === '') {
setErrorFor(email, 'Email não pode ficar em branco');
} else if (!isEmail(emailValue)) {
setErrorFor(email, 'Email inválido');
} else {
setSuccessFor(email);
}

if (celularValue === '') {
setErrorFor(celular, 'Celular não pode ficar em branco');
} else {
setSuccessFor(celular);
}

if (ufValue === '') {
setErrorFor(uf, 'UF não pode ficar em branco');
} else {
setSuccessFor(uf);
}

if (cpfValue === '') {
setErrorFor(cpf, 'CPF não pode ficar em branco');
} else if (validarCPF(cpfValue) === false) {
setErrorFor(cpf, 'CPF inválido');
} else {
setSuccessFor(cpf);
}

if (cidadeValue === '') {
setErrorFor(cidade, 'Cidade não pode ficar em branco');
} else {
setSuccessFor(cidade);
}

if (bairroValue === '') {
setErrorFor(bairro, 'Bairro não pode ficar em branco');
} else {
setSuccessFor(bairro);
}
}

function setErrorFor(input, message) {
const formControl = input.parentElement;
const small = formControl.querySelector('small');
formControl.className = 'form-control error';
small.innerText = message;
}

function setSuccessFor(input) {
const formControl = input.parentElement;
formControl.className = 'form-control success';
}

function isEmail(email) {
return /^(([^<>()\.,;:\s@"]+(.[^<>()\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/.test(email);}

function validarCPF(cpf) {
	cpf = cpf.replace(/[^\d]+/g,'');
	
	if(cpf == '') return false;
	
	// Elimina CPFs invalidos conhecidos
	if (cpf.length != 11 || 
	  cpf == "00000000000" || 
	  cpf == "11111111111" || 
	  cpf == "22222222222" || 
	  cpf == "33333333333" || 
	  cpf == "44444444444" || 
	  cpf == "55555555555" || 
	  cpf == "66666666666" || 
	  cpf == "77777777777" || 
	  cpf == "88888888888" || 
	  cpf == "99999999999")
		  return false;
		  
	// Valida 1o digito
	add = 0;
	for (i=0; i < 9; i ++)
	  add += parseInt(cpf.charAt(i)) * (10 - i);
	  rev = 11 - (add % 11);
	  if (rev == 10 || rev == 11)
		rev = 0;
	  if (rev != parseInt(cpf.charAt(9)))
		return false;
		  
	// Valida 2o digito
	add = 0;
	for (i = 0; i < 10; i ++)
	  add += parseInt(cpf.charAt(i)) * (11 - i);
	rev = 11 - (add % 11);
	if (rev == 10 || rev == 11)
	  rev = 0;
	if (rev != parseInt(cpf.charAt(10)))
	  return false;
	  
	return true;
  }
  










