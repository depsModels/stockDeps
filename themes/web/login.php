<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/inputmask/5.0.8/jquery.inputmask.min.js"></script>
    <link rel="stylesheet" href="<?= url('assets/web/css/globals.css') ?>">
    <link rel="stylesheet" href="<?= url('assets/web/css/login.css') ?>">
    <!-- Ícone do site -->
    <link rel="icon" href="<?= url('assets/web/images/logos/logo-without-background.png') ?>" type="image/png" />
    <title>Login - StockDeps</title>

</head>

<body>
    <div class="wrapper">
        <header>Login</header>
        <form id="form-login" method="POST">
            <div class="field user">
                <div class="input-area">
                    <input type="text" class="form-control" placeholder="Usuário" name="username">
                    <i class="icon fas fa-envelope"></i>
                    <i class="error error-icon fas fa-exclamation-circle"></i>
                </div>
            </div>
            <div class="field password">
                <div class="input-area">
                    <input type="password" class="form-control" id="password" name="password" placeholder="Senha">
                    <i class="icon fas fa-lock"></i>
                    <i class="error error-icon fas fa-exclamation-circle"></i>
                </div>
            </div>
            <input type="submit" value="Login">
        </form>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>

<script src="<?= url('assets/web/js/login.js') ?>" async></script>
<script src="<?= url('assets/app/js/funcoesAuxiliares.js') ?>"></script>