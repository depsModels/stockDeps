const BASE_URL = 'https://stockdeps.com';

// Valida login
const form_login = $("#form-login");
form_login.on("submit", function (e) {
    e.preventDefault();

    const serializedData = form_login.serialize();

    $.ajax({
        type: "POST",
        url: `${BASE_URL}/login`,
        data: serializedData,
        dataType: "json",
        success: function (response) {
            if (response.type === 'error') {
                exibirMensagemTemporariaErro(response.message);
                return;
            }
            if (response.type === 'warning') {
                exibirMensagemTemporariaAviso(response.message);
                return;
            }
            if (response.type === 'success') {
                if (response.user === 'Admin') {
                    window.location.href = `${BASE_URL}/adm`;
                    return;
                }
                window.location.href = `${BASE_URL}/app`;
                return;
            }
        },
        error: function (xhr, status, error) {
            console.error("Erro no AJAX:", error);
            exibirMensagemTemporariaErro("Erro ao processar a solicitação.");
        }
    });
});
