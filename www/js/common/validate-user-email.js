function isValidEmailAddress(emailAddress)
{
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
}

function getStringAfterPlusSymbol(str)
{
    return str.split('+')[1];
}

function emailPhoneValidationCheck(emailOrPhone, sendOrRequestSubmitButton, type)
{
    emailOrPhone = emailOrPhone.trim();
    let processedBy = $('#email').attr('data-processedBy');
    if (emailOrPhone && emailOrPhone.length != 0)
    {
        let message = '';
        if (processedBy == "email")
        {
            // console.log('by email only');
            if (isValidEmailAddress(emailOrPhone))
            {
                if (type === 'send-money')
                {
                    message = (window.localStorage.getItem('language') == 'fr') ? `Transférer de l'argent vers ${emailOrPhone}` : `Transfer money to ${emailOrPhone}`;
                }
                else if (type === 'request-money')
                {
                    message = (window.localStorage.getItem('language') == 'fr') ? `Demander de l'argent à ${emailOrPhone}` : `Request money to ${emailOrPhone}`;
                }
                sendOrRequestSubmitButton.attr("disabled", false);
                $('.emailValidateMessageDiv').show();
                $('.emailText').text(message);
                $('.emailOrPhoneError').html('');
            }
            else
            {
                sendOrRequestSubmitButton.attr("disabled", true);
                $('.emailValidateMessageDiv').hide();
                $('.emailOrPhoneError').html((window.localStorage.getItem('language') == 'fr') ? 'S\'il vous plaît entrer email valide (ex: user@gmail.com)' : 'Please enter valid email (ex: user@gmail.com)');
                // return false
            }
        }
        else if (processedBy == "phone")
        {
            // console.log('by phone only');
            if (emailOrPhone.charAt(0) != "+" || !$.isNumeric(getStringAfterPlusSymbol(emailOrPhone)))
            {
                $('.emailOrPhoneError').html((window.localStorage.getItem('language') == 'fr') ? 'Veuillez entrer un téléphone valide (ex: +12015550123)' :
                'Please enter valid phone (ex: +12015550123)');
                sendOrRequestSubmitButton.attr("disabled", true);
            }
            else
            {
                sendOrRequestSubmitButton.attr("disabled", false);
                $('.emailOrPhoneError').html('');
            }
        }
        else if (processedBy == "email_or_phone")
        {
            // console.log('by email or phone only');
            if (isValidEmailAddress(emailOrPhone))
            {
                if (type === 'send-money')
                {
                    message = (window.localStorage.getItem('language') == 'fr') ? `Transférer de l'argent vers ${emailOrPhone}` : `Transfer money to ${emailOrPhone}`;
                }
                else if (type === 'request-money')
                {
                    message = (window.localStorage.getItem('language') == 'fr') ? `Demander de l'argent à ${emailOrPhone}` : `Request money to ${emailOrPhone}`;
                }
                $('.emailValidateMessageDiv').show();
                $('.emailText').text(message);
                $('.emailOrPhoneError').html('');
                sendOrRequestSubmitButton.attr("disabled", false);
            }
            else if (emailOrPhone.charAt(0) != "+" || !$.isNumeric(getStringAfterPlusSymbol(emailOrPhone)))
            {
                $('.emailOrPhoneError').html((window.localStorage.getItem('language') == 'fr') ? 'Veuillez entrer un email valide (ex: utilisateur@gmail.com) ou un téléphone (ex: +12015550123)' :
                'Please enter valid email (ex: user@gmail.com) or phone (ex: +12015550123)');
                sendOrRequestSubmitButton.attr("disabled", true);
                $('.emailValidateMessageDiv').hide();
            }
            else
            {
                $('.emailValidateMessageDiv').hide();
                $('.emailOrPhoneError').html('');
                sendOrRequestSubmitButton.attr("disabled", false);
            }
        }
    }
    else
    {
        $('.emailValidateMessageDiv').hide();
        $('.emailOrPhoneError').html('');
        sendOrRequestSubmitButton.attr("disabled", false);
    }
}

// Send Money & Request Money - Check User Email
function checkUserEmailValidite(endpoint, type, receiverEmail, transactionType, redirectUrl, cuv)
{
    $.ajax(
    {
        url: request_url(endpoint), //send-money-confirm
        type: type,
        data:
        {
            '_token': window.localStorage.getItem('token'),
            'user_id': window.localStorage.getItem('user_id'),
            'receiverEmail': receiverEmail,
        },
        dataType: 'json',
        beforeSend: function(xhr)
        {
            xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
            xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
        },
    }).done(function(data)
    {
        if (data.success.status == 200)
        {
            cuv(data.success);
            if (transactionType == 'sendMoney')
            {
                onSendMoneyDetails();
            }
            else if (transactionType == 'requestMoney')
            {
                onRequestMoneyDetails();
            }
        }
        else
        {
            $('.emailValidateMessageDiv').hide();
            if (transactionType == 'sendMoney')
            {
                if (data.success.reason == "own-email")
                {
                     showErrorMessage((window.localStorage.getItem('language') == 'fr') ? 'Vous ne pouvez pas vous envoyer d’argent!' : data.success.message)
                }
                else if (data.success.reason == "suspended")
                {
                    showErrorMessage((window.localStorage.getItem('language') == 'fr') ? 'Le destinataire est suspendu!' : data.success.message)
                }
                else if (data.success.reason == "inactive")
                {
                     showErrorMessage((window.localStorage.getItem('language') == 'fr') ? 'Le destinataire est inactif!' : data.success.message)
                }
                return false;
            }
            else if (transactionType == 'requestMoney')
            {
                if (data.success.reason == "own-email")
                {
                    showErrorMessage((window.localStorage.getItem('language') == 'fr') ? 'Vous ne pouvez pas demander de l\'argent à vous-même!' : data.success.message)
                }
                else if (data.success.reason == "suspended")
                {
                    showErrorMessage((window.localStorage.getItem('language') == 'fr') ? 'Le destinataire est suspendu!' : data.success.message)
                }
                else if (data.success.reason == "inactive")
                {
                     showErrorMessage((window.localStorage.getItem('language') == 'fr') ? 'Le destinataire est inactif!' : data.success.message)
                }
                return false;
            }

        }
    }).fail(function(error)
    {
        console.log(error);
    });
}