//Sign Up page
function signUp()
{
    window.location.href = 'sign-up.html';
}

function HideErrorMsgAndDisplaySuccessMessageErrorIfAnyElseHideIt()
{
    var successMessage = window.localStorage.getItem('successMessage');
    var userInactiveMessage = window.localStorage.getItem('user-inactive-message');
    var createWalletAddressFailedMessage = window.localStorage.getItem('create-wallet-address-failed-message');
    if (successMessage != null)
    {
        $('.errorDiv').css('display', 'none');
        showSuccessMessage(successMessage);
        setTimeout(function() {
            window.localStorage.removeItem('successMessage');
        }, 1300);
    }
    else if (userInactiveMessage != null)
    {
        showErrorMessage(userInactiveMessage);
        setTimeout(function() {
            window.localStorage.removeItem('user-inactive-message');
        }, 1300);
    }
    else if (createWalletAddressFailedMessage != null)
    {
        showErrorMessage(createWalletAddressFailedMessage);
        setTimeout(function() {
            window.localStorage.removeItem('create-wallet-address-failed-message');
        }, 1300);
    }
    else
    {
        $('.errorDiv').css('display', 'none');
        $(".successDiv").css('display', 'none');
    }
}

/**
 * [onChangeLangVal]
 * @returns promise Object
 */
function checkSystemLoginVia(onChangeLangVal)
{
    var promiseObj = new Promise(function(resolve, reject)
    {
        $.ajax(
        {
            url: request_url('check-login-via'),
            type: 'GET',
            data: {},
            dataType: 'json',
        })
        .done(function(response)
        {
            // console.log(response);
            if (response.loginVia == "email_or_phone")
            {
                if (onChangeLangVal != null) {
                    $('#email').attr("placeholder", (onChangeLangVal == 'fr') ? 'Veuillez entrer votre email ou votre téléphone' : 'Please enter your email or phone');
                } else {
                    $('#email').attr("placeholder", (window.localStorage.getItem('language') == 'fr') ? 'Veuillez entrer votre email ou votre téléphone' : 'Please enter your email or phone');
                }
            }
            else if (response.loginVia == "email_only")
            {
                if (onChangeLangVal != null) {
                    $('#email').attr("placeholder", (onChangeLangVal == 'fr') ? 'S\'il vous plaît entrer votre email' : 'Please enter your email');
                } else {
                    $('#email').attr("placeholder", (window.localStorage.getItem('language') == 'fr') ? 'S\'il vous plaît entrer votre email' : 'Please enter your email');
                }
            }
            else if (response.loginVia == "phone_only")
            {
                if (onChangeLangVal != null) {
                    $('#email').attr("placeholder", (onChangeLangVal == 'fr') ? 'S\'il vous plaît entrez votre téléphone' : 'Please enter your phone');
                } else {
                    $('#email').attr("placeholder", (window.localStorage.getItem('language') == 'fr') ? 'S\'il vous plaît entrez votre téléphone' : 'Please enter your phone');
                }
            }
            resolve(onChangeLangVal);
        })
        .fail(function(error)
        {
            reject(error);
            console.log(error);
        });
        // console.log("checkSystemLoginVia...");
    });
    return promiseObj;
}

//change language
function changelanguage(val)
{
    window.localStorage.setItem('language',val);

    // console.log(val);
    checkSystemLoginVia(val)
    .then(lang =>
    {
        console.log(lang);
        setlanguage(lang); //must be a promise //located at laguage.js file
    })
    .catch(error => {
        console.log(error);
    });

    $('.signIn').text((window.localStorage.getItem('language') == 'fr') ? 'Se connecter' : 'Sign In');
    $('.signUp').text((window.localStorage.getItem('language') == 'fr') ? 'S\'inscrire' : 'Sign Up');
}

// Login Request
function performLoginRequest(url, type, element = 1, redirectUrl = 1)
{
    $('.signIn').append(`<i class="spinner fa fa-spinner fa-spin" style="display: none;"></i> <span id="signInText">${(window.localStorage.getItem('language') == 'fr') ? 'Se connecter' : 'Sign In'}</span>`);
    let signInShowLoadingText = '';
    let signInHideLoadingText = '';
    let getLang = window.localStorage.getItem('language');
    if (getLang == 'fr') {
        signInShowLoadingText = 'Connectez-vous...';
        signInHideLoadingText = 'Se connecter';
    } else {
        signInShowLoadingText = 'Signing In...';
        signInHideLoadingText = 'Sign In';
    }

    $.ajax(
    {
        url: request_url(url), //api.php - login
        type: type,
        data: element,
        dataType: 'json',
        beforeSend: function() {
            $('#signUp').hide();
            showSpinnerWithButtonDisabled("#signIn", "#signInText", signInShowLoadingText);
        },
    })
    .done(function(data)
    {
        if (data.response.status == 201)
        {
            $('#signUp').show();
            hideSpinnerWithButtonEnabled("#signIn", "#signInText", signInHideLoadingText);
            showSuccessMessage(data.response.message);
        }
        else
        {
            // console.log(data.response['user-status'] == "Inactive");
            // return 0;

            if (data.response['user-status'] == "Inactive")
            {
                hideSpinnerWithButtonEnabled("#signIn", "#signInText", signInHideLoadingText);
                showErrorMessage((window.localStorage.getItem('language') == 'fr') ? 'Votre compte est inactif. Veuillez réessayer plus tard!' : data.response.message);
                $('#signUp').show();
            }
            else
            {
                window.localStorage.setItem('token', data.response.token);
                window.localStorage.setItem('user_id', data.response.user_id);
                window.localStorage.setItem('username', data.response.first_name + ' ' + data.response.last_name);
                window.localStorage.setItem('email', data.response.email);
                window.localStorage.setItem('defaultCountry', data.response.defaultCountry);
                // console.log(data.response.formattedPhone);
                // console.log(typeof data.response.formattedPhone);

                if (data.response.formattedPhone != null)
                {
                    window.localStorage.setItem('formattedPhone', data.response.formattedPhone);
                }
                window.localStorage.setItem('picture', data.response.picture);
                window.localStorage.setItem('user-status', data.response['user-status']);
                if (redirectUrl != '') window.location.replace(redirectUrl);
            }
        }
    })
    .fail(function(error)
    {
        $('#signUp').show();
        hideSpinnerWithButtonEnabled("#signIn", "#signInText", signInHideLoadingText);
        showErrorMessage((window.localStorage.getItem('language') == 'fr') ? 'Impossible de se connecter avec les informations d\'identification fournies!' : 'Unable to login with provided credentials!');
        return false;
    });
}