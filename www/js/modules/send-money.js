/*
|--------------------------------------------------------------------------
| Send Money starts here
|--------------------------------------------------------------------------
 */

//get Current System Language
let systemCurrentLang = window.localStorage.getItem('language');

// Send Money - Next
function sendMoneyNext(endpoint, type, receiverEmailOrPhone, transactionType, redirectUrl)
{
    // console.log(receiverEmailOrPhone)
    if (isValidEmailAddress(receiverEmailOrPhone)) {
        checkUserEmailValidite(endpoint, type, receiverEmailOrPhone, transactionType, redirectUrl, function(data)
        {
            if (data)
            {
                window.localStorage.setItem('sendingEmailOrPhone', receiverEmailOrPhone);
                let sendMoneyAmountSectionTitle = (systemCurrentLang == 'fr') ? 'Envoyer le montant' : 'Send Amount';
                navigateTo('sendMoneyAmountSection', sendMoneyAmountSectionTitle, 'sendMoneyBlock');
            }
        });
    }
    else
    {
        checkSendMoneyUserPhoneValidite(receiverEmailOrPhone, transactionType);
    }
}

function checkSendMoneyUserPhoneValidite(receiverEmailOrPhone, transactionType)
{
    $.ajax(
    {
        url: request_url('send-money-phone-check'),
        type: "POST",
        data:
        {
            '_token': window.localStorage.getItem('token'),
            'user_id': window.localStorage.getItem('user_id'),
            'receiverPhone': receiverEmailOrPhone,
        },
        dataType: 'json',
        beforeSend: function(xhr)
        {
            xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
            xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
        },
    })
    .done(function(data)
    {
        // console.log(data);

        if (data.success.status == 200)
        {
            window.localStorage.setItem('sendingEmailOrPhone', receiverEmailOrPhone);

            let sendMoneyAmountSectionTitle = (systemCurrentLang == 'fr') ? 'Envoyer le montant' : 'Send Amount';
            navigateTo('sendMoneyAmountSection', sendMoneyAmountSectionTitle, 'sendMoneyBlock');

            if (transactionType == 'sendMoney')
            {
                onSendMoneyDetails();
            }
        }
        else
        {
            // console.log(data.success.message);
            $('.emailValidateMessageDiv').hide();
            if (transactionType == 'sendMoney')
            {
                if (data.success.status == 404) {
                    showErrorMessage((window.localStorage.getItem('language') == 'fr') ? 'S\'il vous plaît définir votre numéro de téléphone en premier!' : data.success.message)
                    return false;
                } else {

                    if (data.success.reason == "own-phone")
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
            }
        }
    })
    .fail(function(error)
    {
        console.log(error);
    });
}

function onSendMoneyDetails()
{
    let url = 'get-send-money-currencies';
    forSendMoneyCurrency(url, "GET", function(datas)
    {
        // console.log(datas.currencies);

        let output = '';

        //setting multilingual empty select text
        // let selectCurrencyText = (systemCurrentLang == 'fr') ? 'Sélectionnez la devise' : 'Select Currency';
        // output += `<option value="">${selectCurrencyText}</option>`;
        $.each(datas.currencies, function(index, data)
        {
            output += `
                <option value="${data.id}" ${data.is_default == "Yes" ? 'selected="selected"': ''}>${data.code}</option>
            `;
        });
        $('#sendCurrency').html(output);

        let sendCurrency = $("#sendCurrency option:selected").text();//
        $('#sendCurrency-button span').text(sendCurrency);//
    });
}

// Send Money - Currencies
function forSendMoneyCurrency(url, type, smc)
{
    $.ajax(
    {
        url: request_url(url), //api-route : get-send-money-currencies
        type: type,
        data:
        {
            'user_id': window.localStorage.getItem('user_id')
        },
        dataType: 'json',
        beforeSend: function(xhr)
        {
            xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET');
            xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
        },
    })
    .done(function(data)
    {
        if (data.success.status == 200)
        {
            smc(data.success);
        }
        else
        {
            showErrorMessage(data.success.message)
            return false;
        }
    })
    .fail(function(error)
    {
        navigator.notification.alert((window.localStorage.getItem('language') == 'fr') ? 'Une erreur s\'est produite lors de la compréhension de la demande!' : 'There was an error understanding the request!');
        return false;
    });
}

// Send Money - Review
function sendMoneyReview(url, type, element)
{
    // console.log(element);
    $.ajax(
    {
        url: request_url(url), //api-route : check-send-money-amount-limit
        type: type,
        data: element + "&user_id=" + window.localStorage.getItem('user_id') + "",
        dataType: 'json',
        beforeSend: function(xhr)
        {
            xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
            xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
        },
    })
    .done(function(data)
    {
        if (data.success.status == 200)
        {
            localStorage.setItem('sendingAmount', data.success.sendAmount);
            localStorage.setItem('sendingCurrency', data.success.sendCurrency);
            localStorage.setItem('sendingCurrencySymbol', data.success.currSymbol);
            localStorage.setItem('sendingFees', data.success.totalFees);
            $('.receiverEmailConfirmation').text((systemCurrentLang == 'fr') ? `Vous envoyez de l'argent à ${window.localStorage.getItem('sendingEmailOrPhone')}` : `You are sending money to ${window.localStorage.getItem('sendingEmailOrPhone')}`);

            $('.transferAmount').text(getMoneyFormat(data.success.currSymbol, data.success.sendAmountDisplay));
            $('.totalFees').text(getMoneyFormat(data.success.currSymbol, data.success.totalFeesDisplay));
            $('.totalAmount').text(getMoneyFormat(data.success.currSymbol, data.success.totalAmountDisplay));

            let sendMoneyReviewSectionTitle = (systemCurrentLang == 'fr') ? 'Révision et transfert' : 'Review & Transfer';
            navigateTo('sendMoneyReviewSection', sendMoneyReviewSectionTitle, 'sendMoneyAmountSection');
        }
        else
        {
            let errorMessage = '';
            if (data.success.reason == "insufficientBalance")
            {
                errorMessage = (systemCurrentLang == 'fr') ? "Désolé, pas assez de fonds pour effectuer l'opération!" : data.success.message;
            }
            else if (data.success.reason == "minLimit")
            {
                errorMessage = (systemCurrentLang == 'fr') ? `Montant minimal ${data.success.minLimit}` : data.success.message;
            }
            else if (data.success.reason == "minMaxLimit")
            {
                errorMessage = (systemCurrentLang == 'fr') ? `Montant minimal ${data.success.minLimit} and Montant maximale ${data.success.maxLimit}` : data.success.message;
            }
            showErrorMessage(errorMessage);
            $(window).scrollTop(0);
            return false;
        }
    })
    .fail(function(error)
    {
        navigator.notification.alert((systemCurrentLang == 'fr') ? 'Une erreur s\'est produite lors de la compréhension de la demande' : 'There was an error understanding the request');
        return false;
    });
}

//Send Money - Pay
function sendMoneyPay()
{
    let note = $('#notes').val();
    if (note != '')
    {
        $.ajax(
        {
            url: request_url($('.sendMoneyPay').attr('action')),
            type: "POST",
            data:
            {
                '_token': localStorage.getItem('token'),
                'user_id': localStorage.getItem('user_id'),
                'emailOrPhone': localStorage.getItem('sendingEmailOrPhone'),
                'amount': localStorage.getItem('sendingAmount'),
                'currency_id': localStorage.getItem('sendingCurrency'),
                'totalFees': localStorage.getItem('sendingFees'),
                'note': note
            },
            dataType: 'json',
            beforeSend: function(xhr)
            {
                xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
                xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
                let sendMoneyPayShowLoadingText = (systemCurrentLang == 'fr') ? 'Confirmation...' : 'Confirming...';
                showSpinnerWithButtonDisabled(".sendMoneyPay", "#sendMoneyReview", sendMoneyPayShowLoadingText);
            },
        })
        .done(function(res)
        {
            if (res.status == true)
            {
                localStorage.setItem('tr_ref_id', res.tr_ref_id);
                if (res.sendMoneyMailErrorMessage != undefined)
                {
                    localStorage.setItem('sendMoneyMailErrorMessage', res.sendMoneyMailErrorMessage);
                }
                let redirect = $('.sendMoneyPay').attr('data-redirect');
                window.location.href = redirect;
            }
            else
            {
                // console.log(res.sendMoneyValidationErrorMessage);
                localStorage.setItem('sendMoneyValidationErrorMessage', res.sendMoneyValidationErrorMessage);
                window.location.href = 'send-money-email.html';
                return false;
            }
        })
        .fail(function(error)
        {
            console.log(error);
        });
    }
}
/*
|--------------------------------------------------------------------------
| Send Money ends here
|--------------------------------------------------------------------------
 */