<!DOCTYPE html>
<!-- Created By CodingLab - www.codinglabweb.com -->
<html lang="pt-br" dir="ltr">

<head>
  <meta charset="UTF-8">
  <!---<title> Responsive Registration Form | CodingLab </title>--->
  <link rel="stylesheet" href="<?= url('assets/app/css/styleSassCadastro.css') ?>">
  <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.0/css/line.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body>
  <div class="container">
    <div class="d-flex justify-content-around py-5">
      <div class="title">Cadastrar cliente </div>
      <div class="tema">
        <input type="checkbox" id="darkmode-toggle" />
        <label for="darkmode-toggle">
          <svg version="1.1" class="sun" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 496 496" style="enable-background:new 0 0 496 496;" xml:space="preserve">

            <rect x="152.994" y="58.921" transform="matrix(0.3827 0.9239 -0.9239 0.3827 168.6176 -118.5145)" width="40.001" height="16" />
            <rect x="46.9" y="164.979" transform="matrix(0.9239 0.3827 -0.3827 0.9239 71.29 -12.4346)" width="40.001" height="16" />
            <rect x="46.947" y="315.048" transform="matrix(0.9239 -0.3827 0.3827 0.9239 -118.531 50.2116)" width="40.001" height="16" />

            <rect x="164.966" y="409.112" transform="matrix(-0.9238 -0.3828 0.3828 -0.9238 168.4872 891.7491)" width="16" height="39.999" />

            <rect x="303.031" y="421.036" transform="matrix(-0.3827 -0.9239 0.9239 -0.3827 50.2758 891.6655)" width="40.001" height="16" />

            <rect x="409.088" y="315.018" transform="matrix(-0.9239 -0.3827 0.3827 -0.9239 701.898 785.6559)" width="40.001" height="16" />

            <rect x="409.054" y="165.011" transform="matrix(-0.9239 0.3827 -0.3827 -0.9239 891.6585 168.6574)" width="40.001" height="16" />
            <rect x="315.001" y="46.895" transform="matrix(0.9238 0.3828 -0.3828 0.9238 50.212 -118.5529)" width="16" height="39.999" />
            <path d="M248,88c-88.224,0-160,71.776-160,160s71.776,160,160,160s160-71.776,160-160S336.224,88,248,88z M248,392
				c-79.4,0-144-64.6-144-144s64.6-144,144-144s144,64.6,144,144S327.4,392,248,392z" />
            <rect x="240" width="16" height="72" />
            <rect x="62.097" y="90.096" transform="matrix(0.7071 0.7071 -0.7071 0.7071 98.0963 -40.6334)" width="71.999" height="16" />
            <rect y="240" width="72" height="16" />

            <rect x="90.091" y="361.915" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 -113.9157 748.643)" width="16" height="71.999" />
            <rect x="240" y="424" width="16" height="72" />

            <rect x="361.881" y="389.915" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 397.8562 960.6281)" width="71.999" height="16" />
            <rect x="424" y="240" width="72" height="16" />
            <rect x="389.911" y="62.091" transform="matrix(0.7071 0.7071 -0.7071 0.7071 185.9067 -252.6357)" width="16" height="71.999" />>
          </svg>
          <svg version="1.1" class="moon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 49.739 49.739" style="enable-background:new 0 0 49.739 49.739;" xml:space="preserve">
            <path d="M25.068,48.889c-9.173,0-18.017-5.06-22.396-13.804C-3.373,23.008,1.164,8.467,13.003,1.979l2.061-1.129l-0.615,2.268
       c-1.479,5.459-0.899,11.25,1.633,16.306c2.75,5.493,7.476,9.587,13.305,11.526c5.831,1.939,12.065,1.492,17.559-1.258v0
       c0.25-0.125,0.492-0.258,0.734-0.391l2.061-1.13l-0.585,2.252c-1.863,6.873-6.577,12.639-12.933,15.822
       C32.639,48.039,28.825,48.888,25.068,48.889z M12.002,4.936c-9.413,6.428-12.756,18.837-7.54,29.253
       c5.678,11.34,19.522,15.945,30.864,10.268c5.154-2.582,9.136-7.012,11.181-12.357c-5.632,2.427-11.882,2.702-17.752,0.748
       c-6.337-2.108-11.473-6.557-14.463-12.528C11.899,15.541,11.11,10.16,12.002,4.936z">
          </svg>
        </label>
      </div>
      <a href="<?= url() ?>">
        <button class="botao-voltar">Voltar</button>
      </a>

    </div>

    <form id="form-cadastro" method="POST" name="cadastro" action="">

      <div class="form-row d-flex px-4 py-5">
        <div class="col m-3 ">
        <label for="nome-completo">Nome completo</label>
        <input type="text" class="form-control" placeholder="Nome completo" id="nome-completo" name="name" />


        <label for="email">Email</label>
        <input type="email" class="form-control" placeholder="exemplo@email.com" id="email" name="email" />

        

          <label for="cpf">CPF</label>
          <input type="text" class="form-control" placeholder="000.000.000-00" id="cpf" name="cpf" />



          <label for="bairro">Bairro</label>
          <input type="text" class="form-control" placeholder="Informe o bairro" id="bairro" name="bairro" />

        </div>
        <div class="col m-3">
         
        <label for="celular">Celular</label>
          <input type="number" class="form-control" placeholder="Digite o número do celular" id="celular" name="celular" />



          <span class="details">UF</span>
          <select class="details form-control" id="uf" name="uf">
            <option value="">Selecione a UF</option>
            <option value="AC">Acre</option>
            <option value="AL">Alagoas</option>
            <option value="AP">Amapá</option>
            <option value="AM">Amazonas</option>
            <option value="BA">Bahia</option>
            <option value="CE">Ceará</option>
            <option value="DF">Distrito Federal</option>
            <option value="ES">Espirito Santo</option>
            <option value="GO">Goiás</option>
            <option value="MA">Maranhão</option>
            <option value="MS">Mato Grosso do Sul</option>
            <option value="MT">Mato Grosso</option>
            <option value="MG">Minas Gerais</option>
            <option value="PA">Pará</option>
            <option value="PB">Paraíba</option>
            <option value="PR">Paraná</option>
            <option value="PE">Pernambuco</option>
            <option value="PI">Piauí</option>
            <option value="RJ">Rio de Janeiro</option>
            <option value="RN">Rio Grande do Norte</option>
            <option value="RS">Rio Grande do Sul</option>
            <option value="RO">Rondônia</option>
            <option value="RR">Roraima</option>
            <option value="SC">Santa Catarina</option>
            <option value="SP">São Paulo</option>
            <option value="SE">Sergipe</option>
            <option value="TO">Tocantins</option>
          </select>


          <label for="cidade">Cidade</label>
          <input type="text" class="form-control" placeholder="Informe a cidade" id="cidade" name="cidade" />


          <div class="button ">
            <input type="submit" value="Registre">
          </div>

          <div id="message"></div>

        </div>
      </div>
   

        
        
    
    </form>

  </div>

  <script src="<?= url('assets/app/js/tema.js') ?>"></script>
</body>

</html>

<script type="text/javascript" async>
  const form = document.querySelector("#form-cadastro");
  const message = document.querySelector("#message");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const dataClient = new FormData(form);
    const data = await fetch("<?= url("cadastro"); ?>", {
      method: "POST",
      body: dataClient,
    });
    const client = await data.json();
    console.log(client);
    if (client) {
      message.innerHTML = client.message;

      message.classList.add("message");
      message.classList.remove("success", "warning", "error");
      message.classList.add(`${client.type}`);
    }
  });
</script>