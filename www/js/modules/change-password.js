function updatePassword(oldPassword,password,passwordConfirmation)
{
    $.ajax(
    {
        url: request_url('update-password'),
        type: "POST",
        data:
        {
            '_token': localStorage.getItem('token'),
            'user_id': localStorage.getItem('user_id'),
            'oldPassword': oldPassword,
            'password': password,
            'passwordConfirmation': passwordConfirmation,
        },
        dataType: 'json',
        beforeSend: function(xhr)
        {
            xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
            xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
            let UpdateShowLoadingText = (window.localStorage.getItem('language') == 'fr') ? 'Mise à jour...' : 'Updating...';
            showSpinnerWithButtonDisabled(".updatePasswordSubmit", "#updateConfirmBtnText", UpdateShowLoadingText);
        },
    })
    .done(function(data)
    {
        if (data.success.status == 200) {
            showSuccessMessage((window.localStorage.getItem('language') == 'fr') ? 'Mot de passe mis à jour avec succès!' : data.success.message);
            $("#old_password").val("");
            $("#password").val("");
            $("#password_confirmation").val("");
            $(".spinner").hide();
            $("#updateConfirmBtnText").text('Update Password');
            $(".updatePasswordSubmit").attr("disabled", false);
        } else if (data.success.status == 401) {
            showErrorMessage((window.localStorage.getItem('language') == 'fr') ? 'Veuillez donner le mot de passe correct!' : data.success.message);
            $(".spinner").hide();
            $("#updateConfirmBtnText").text('Update Password');
            $(".updatePasswordSubmit").attr("disabled", false);
        } else {
            showErrorMessage((window.localStorage.getItem('language') == 'fr') ? 'Mot de passe non mis à jour!' : 'Password not updated');
            $(".spinner").hide();
            $("#updateConfirmBtnText").text('Update Password');
            $(".updatePasswordSubmit").attr("disabled", false);
        }
    })
    .fail(function(error)
    {
        console.log(error);
    });
}