<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - StockDeps</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/inputmask/5.0.8/jquery.inputmask.min.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: "Poppins", sans-serif;
        }

        body {
            width: 100%;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #5372F0;
        }

        ::selection {
            color: #fff;
            background: #5372F0;
        }

        .wrapper {
            width: 380px;
            padding: 40px 30px 50px 30px;
            background: #fff;
            border-radius: 5px;
            text-align: center;
            box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.1);
        }

        .wrapper header {
            font-size: 35px;
            font-weight: 600;
        }

        .wrapper form {
            margin: 40px 0;
        }

        form .field {
            width: 100%;
            margin-bottom: 20px;
        }

        form .field.shake {
            animation: shake 0.3s ease-in-out;
        }

    

        form .field .input-area {
            height: 50px;
            width: 100%;
            position: relative;
        }

        form input {
            width: 100%;
            height: 100%;
            outline: none;
            padding: 0 45px;
            font-size: 18px;
            background: none;
            caret-color: #5372F0;
            border-radius: 5px;
            border: 1px solid #bfbfbf;
            border-bottom-width: 2px;
            transition: all 0.2s ease;
        }

        form .field input:focus,
        form .field.valid input {
            border-color: #5372F0;
        }

        form .field.shake input,
        form .field.error input {
            border-color: #dc3545;
        }

        .field .input-area i {
            position: absolute;
            top: 50%;
            font-size: 18px;
            pointer-events: none;
            transform: translateY(-50%);
        }

        .input-area .error-icon {
            right: 15px;
            color: #dc3545;
        }

        form input:focus~.icon,
        form .field.valid .icon {
            color: #5372F0;
        }

        form .field.shake input:focus~.icon,
        form .field.error input:focus~.icon {
            color: #bfbfbf;
        }

        form input::placeholder {
            color: #bfbfbf;
            font-size: 17px;
        }

        form .field .error-txt {
            color: #dc3545;
            text-align: left;
            margin-top: 5px;
        }

        form .field .error {
            display: none;
        }

        form .field.shake .error,
        form .field.error .error {
            display: block;
        }

        form .pass-txt {
            text-align: left;
            margin-top: -10px;
        }

        .wrapper a {
            color: #5372F0;
            text-decoration: none;
        }

        .wrapper a:hover {
            text-decoration: underline;
        }

        form input[type="submit"] {
            height: 50px;
            margin-top: 30px;
            color: #fff;
            padding: 0;
            border: none;
            background: #5372F0;
            cursor: pointer;
            border-bottom: 2px solid rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }

        form input[type="submit"]:hover {
            background: #2c52ed;
        }
    </style>
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
            <div class="pass-txt"><a href="#">Forgot password?</a></div>
            <input type="submit" value="Login">
        </form>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>

<script src="<?= url('assets/web/js/login.js') ?>" async></script>
<script src="<?= url('assets/app/js/funcoesAuxiliares.js') ?>"></script>