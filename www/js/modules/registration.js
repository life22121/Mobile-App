// flag for submit button disable/enable
let hasPhoneError = false;
let hasEmailError = false;
let isValidPhoneRegex = /^[\d-]*$/;

/**
 * [check submit button should be disabled or not]
 * @return {void}
*/
function enableDisableButton()
{
    // console.log(hasEmailError);
    if (!hasPhoneError && !hasEmailError) {
        $('#signUp').prop('disabled',false);
    } else {
        $('#signUp').prop('disabled',true);
    }
}

//Login page
function signIn()
{
    window.location.href = 'login.html';
}

function validateUserEmail(email)
{
    $.ajax({
        method: "POST",
        url: SITE_URL+"registration/duplicate-email-check",
        dataType: "json",
        data: {
            'email': email,
        }
    })
    .done(function(response)
    {
        emptyEmail(email);
        // console.log(response);
        if (response.status == true)
        {
            if (validateEmail(email))
            {
                $('#email-validation-error').addClass('error').html((window.localStorage.getItem('language') == 'fr') ? 'Le couriel a déja été pris en compte!' : response.fail).css("font-weight", "bold");
                hasEmailError = true;
                enableDisableButton();
            } else {
                $('#email-validation-error').html('');
            }
        }
        else if (response.status == false)
        {
            hasEmailError = false;
            enableDisableButton();
            $('#email-validation-error').html('');
        }
    })
    .fail(function(error)
    {
        console.log(error);
    });
}

/**
 * [checks whether email value is empty or not]
 * @return {void}
 */
function emptyEmail(email)
{
    if( email.length === 0 )
    {
        $('#email-validation-error').html('');
    }
}

//Custom Email Validation
function validateEmail(email)
{
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(email).toLowerCase()))
    {
        return true;
    }
    else
    {
        return false;
    }
}


function defaultCountryShortName()
{
    var promiseObj = new Promise(function(resolve, reject)
    {
        $.ajax(
        {
            url: request_url('registration/get-default-country-short-name'),
            type: "GET",
            dataType: 'json',
        })
        .done(function(res)
        {
            if (res.success.status == 200) {
                resolve(res.success.defaultCountryShortName);
            }
        })
        .fail(function(error)
        {
            console.log(error);
            reject();
        });
    });
    return promiseObj;
}

/*
intlTelInput
 */
function invokeIntelInputPlugin(countryShortName)
{
    $("#phone").intlTelInput(
    {
        separateDialCode: true,
        nationalMode: true,
        preferredCountries: [countryShortName],
        autoPlaceholder: "polite",
        placeholderNumberType: "MOBILE",
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/13.0.4/js/utils.js",
    });
    let countryData = $("#phone").intlTelInput("getSelectedCountryData");
    $('#defaultCountry').val(countryData.iso2);
    $('#carrierCode').val(countryData.dialCode);
    $("#phone").on("countrychange", function(e, countryData)
    {
        formattedPhone();
        $('#defaultCountry').val(countryData.iso2);
        $('#carrierCode').val(countryData.dialCode);
        checkInvalidAndDuplicatePhoneNumber($.trim($("#phone").val()), $.trim(countryData.dialCode));
    });
}

function checkInvalidAndDuplicatePhoneNumber(phoneVal, phoneData)
{
    let that = $("#phone");
    if ($.trim(that.val()) !== '')
    {
        if (!that.intlTelInput("isValidNumber") || !isValidPhoneRegex.test($.trim(that.val())))
        {
            $('#tel-validation-error').addClass('error')
            .html((window.localStorage.getItem('language') == 'fr') ? 'Veuillez entrer un numéro de téléphone international valide.' : 'Please enter a valid International Phone Number.')
            .css("font-weight", "bold");
            $('#phone-validation-error').hide();
            hasPhoneError = true;
            enableDisableButton();
        }
        else
        {
            $.ajax(
            {
                method: "POST",
                url: SITE_URL + "registration/duplicate-phone-number-check",
                dataType: "json",
                data:
                {
                    'phone': phoneVal,
                    'carrierCode': phoneData,
                }
            }).done(function(response)
            {
                if (response.status == true)
                {
                    $('#phone-validation-error').addClass('error')
                    .html((window.localStorage.getItem('language') == 'fr') ? 'Veuillez entrer un numéro de téléphone international valide.' : 'Please enter a valid International Phone Number.')
                    .css("font-weight", "bold");
                    hasPhoneError = true;
                    enableDisableButton();
                }
                else if (response.status == false)
                {
                    $('#phone-validation-error').html('');
                    hasPhoneError = false;
                    enableDisableButton();
                }
            }).fail(function(error)
            {
                console.log(error);
            });
            $('#tel-validation-error').html('');
            $('#phone-validation-error').show();
        }
    }
    else
    {
        $('#tel-validation-error').html('');
        $('#phone-validation-error').html('');
        hasPhoneError = false;
        enableDisableButton();
    }
}

function formattedPhone()
{
    if ($('#phone').val != '')
    {
        let p = $('#phone').intlTelInput("getNumber").replace(/-|\s/g, "");
        $("#formattedPhone").val(p);
    }
}
/*
intlTelInput
*/

/**
 * [checkMerchantUserRoleExistence]
 * @returns role
 */
function checkMerchantUserRoleExistence()
{
    $.ajax(
    {
        url: request_url('check-merchant-user-role-existence'),
        type: 'GET',
        data: {},
        dataType: 'json',
    })
    .done(function(response)
    {
        // console.log(response);
        let options = {
            user : '',
            merchant : ''
        };
        if (response.status == 200) {
            if (response.checkUserRole != null && response.checkMerchantRole == null) {
                options.user = (window.localStorage.getItem('language') == 'fr') ? 'Utilisateur' : 'User';
                delete options.merchant;
            }
            else if (response.checkMerchantRole != null && response.checkUserRole == null) {
                options.merchant = (window.localStorage.getItem('language') == 'fr') ? 'Marchande' : 'Merchant';
                delete options.user;
            }
            else if (response.checkUserRole != null && response.checkMerchantRole != null) {
                options.user = (window.localStorage.getItem('language') == 'fr') ? 'Utilisateur' : 'User';
                options.merchant = (window.localStorage.getItem('language') == 'fr') ? 'Marchande' : 'Merchant';
            }
        }
        $.each(options, function(val, text) {
            $('#userType').append($('<option></option>').val(val).html(text));
        });
    })
    .fail(function(error)
    {
        console.log(error);
    });
}

// Sign Up Request
// function signUpRequest(url, type, element, redirectUrl = 1)
function signUpRequest(url, type, element, redirectUrl)
{
    let signUpShowLoadingText = '';
    let signUpHideLoadingText = '';

    let getLang = window.localStorage.getItem('language');
    if (getLang == 'fr') {
        signUpShowLoadingText = 'S\'enregistrer...';
        signUpHideLoadingText = 'S\'inscrire';
    } else {
        signUpShowLoadingText = 'Signing Up...';
        signUpHideLoadingText = 'Sign Up';
    }
    // console.log(signUpShowLoadingText);

    $.ajax(
    {
        url: request_url(url),
        type: type,
        data: element,
        dataType: 'json',
        beforeSend: function() {
            $('#signIn').hide();
            showSpinnerWithButtonDisabled("#signUp", "#signUpText", signUpShowLoadingText);
        },
    })
    .done(function(data)
    {
        // console.log(data.success);
        if (data.success.status == 200)
        {
            // console.log(data.success.reason)

            var successMessage;
            var createWalletFailedMessage;
            if(typeof(data.success.reason) != "undefined")
            {
                if (data.success.reason == 'email_verification')
                {
                    successMessage = 'Nous vous avons envoyé un code d\'activation. Vérifiez votre e-mail et cliquez sur le lien pour le vérifier.';
                    window.localStorage.setItem('successMessage', (window.localStorage.getItem('language') == 'fr') ? successMessage : data.success.message);
                }
                else if (data.success.reason == 'create-wallet-address-failed') //block io address creation failed error message
                {
                    successMessage = null;
                    createWalletFailedMessage = 'Votre compte est limité à 10 adresses par réseau. Veuillez consulter https://block.io/pricing pour consulter les limites du compte et passer à un plan plus approprié.';
                    window.localStorage.setItem('create-wallet-address-failed-message', (window.localStorage.getItem('language') == 'fr') ? createWalletFailedMessage : data.success.message);
                }
            }
            else
            {
                successMessage = 'Inscription réussie!';
                window.localStorage.setItem('successMessage', (window.localStorage.getItem('language') == 'fr') ? successMessage : data.success.message);
            }
            if (redirectUrl != '') window.location.replace(redirectUrl);
        }
        else
        {
            $('#signIn').show();
            hideSpinnerWithButtonEnabled("#signUp", "#signInText", signUpHideLoadingText);
            showErrorMessage((window.localStorage.getItem('language') == 'fr') ? 'Impossible de terminer l\'inscription' : 'Cannot complete the registration!');
            return false;
        }
    })
    .fail(function()
    {
        $('#signIn').show();
        hideSpinnerWithButtonEnabled("#signUp", "#signInText", signUpHideLoadingText);
        showErrorMessage((window.localStorage.getItem('language') == 'fr') ? 'Impossible de terminer l\'inscription' : 'Cannot complete the registration!');
        return false;
    });
}
