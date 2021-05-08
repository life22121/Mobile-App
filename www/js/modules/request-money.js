/*
|--------------------------------------------------------------------------
| Request Money starts here
|--------------------------------------------------------------------------
 */

//get Current System Language
let systemCurrentLang = window.localStorage.getItem('language');

// Request Money - Next
function requestMoneyNext(endpoint, type, receiverEmailOrPhone, transactionType, redirectUrl)
{
    if (isValidEmailAddress(receiverEmailOrPhone)) {
        checkUserEmailValidite(endpoint, type, receiverEmailOrPhone, transactionType, redirectUrl, function(data)
        {
            if (data) {
                let requestMoneyAmountSectionTitle = (systemCurrentLang == 'fr') ? 'Entrer le montant' : 'Request Amount';
                navigateTo('requestMoneyAmountSection', requestMoneyAmountSectionTitle, 'requestMoneyBlock');
            }
        });
    }
    else
    {
        checkRequestMoneyUserPhoneValidite(receiverEmailOrPhone, transactionType);
    }
}

function checkRequestMoneyUserPhoneValidite(receiverEmailOrPhone, transactionType)
{
    $.ajax(
    {
        url: request_url('request-money-phone-check'),
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
            let requestMoneyAmountSectionTitle = (systemCurrentLang == 'fr') ? 'Entrer le montant' : 'Request Amount';
            navigateTo('requestMoneyAmountSection', requestMoneyAmountSectionTitle, 'requestMoneyBlock');
            if (transactionType == 'requestMoney')
            {
                onRequestMoneyDetails();
            }
        }
        else
        {
            $('.emailValidateMessageDiv').hide();
            if (transactionType == 'requestMoney')
            {
                if (data.success.status == 404) {
                    showErrorMessage((window.localStorage.getItem('language') == 'fr') ? 'S\'il vous plaît définir votre numéro de téléphone en premier!' : data.success.message)
                    return false;
                } else {
                    if (data.success.reason == "own-phone")
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
        }
    })
    .fail(function(error)
    {
        console.log(error);
    });
}

function onRequestMoneyDetails()
{
    var url = 'get-request-currency';
    forRequestMoneyCurrency(url,"GET",function(datas)
    {
        var defaultWalletCurrencyId = datas.defaultWalletCurrencyId;//
        var datas = datas.currencies;
        var output='';
        // let selectCurrencyText = (systemCurrentLang == 'fr') ? 'Sélectionnez la devise' : 'Select Currency';
        // output+=`<option value="">${selectCurrencyText}</option>`;
        $.each(datas,function(index,data)
        {
            output+=`
                <option value="${data.id}" ${defaultWalletCurrencyId == data.id ? 'selected="selected"': ''} data-currSymbol="${data.symbol}">${data.code}</option>
            `;
        });
        $('#requestCurrency').html(output);

        let requestCurrency = $("#requestCurrency option:selected").text();//
        $('#requestCurrency-button span').text(requestCurrency);//
    });
}

// Request Money - Currencies
function forRequestMoneyCurrency(url, type, rmc)
{
    $.ajax(
    {
        url: request_url(url),
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
            rmc(data.success);
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

// Request Money - Review
function requestMoneyReview(element, currSymbol)
{
    let email = '';
    let requestAmount = '';
    let requestCurrency = '';
    $.each(element, function(i, field)
    {
        if (field.name == "email")
        {
            email = field.value;
        }
        else if (field.name == "requestCurrency")
        {
            requestCurrency = field.value;
        }
        else if (field.name == "requestAmount")
        {
            requestAmount = field.value;
            // requestAmount     = parseFloat(requestAmount).toFixed(2);
        }
    });
    localStorage.setItem('requestEmailOrPhone', email);
    localStorage.setItem('requestCurrency', requestCurrency);
    localStorage.setItem('requestCurrencySymbol', currSymbol);
    localStorage.setItem('requestAmount', requestAmount);

    // console.log(localStorage);
    $('.requestCreatedAmount').text(getMoneyFormat(currSymbol, getDecimalNumberFormat(requestAmount)));

    let requestMoneyAmountSectionTitle = (systemCurrentLang == 'fr') ? 'Demande et examen' : 'Request & Review';
    navigateTo('requestMoneyReviewSection', requestMoneyAmountSectionTitle, 'requestMoneyAmountSection');
}

//Request Money - Pay
function requestMoneyPay()
{
    let note = $('#notes').val();
    if (note != '')
    {
        $.ajax(
        {
            url: request_url($('.requestMoneyPay').attr('action')), //request-money-pay
            type: "post",
            data:
            {
                '_token': localStorage.getItem('token'),
                'user_id': localStorage.getItem('user_id'),
                'emailOrPhone': localStorage.getItem('requestEmailOrPhone'),
                'amount': localStorage.getItem('requestAmount'),
                'currencyId': localStorage.getItem('requestCurrency'),
                'note': note
            },
            dataType: 'json',
            beforeSend: function(xhr)
            {
                xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
                xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
                let requestMoneyPayShowLoadingText = (systemCurrentLang == 'fr') ? 'Confirmation...' : 'Confirming...';
                showSpinnerWithButtonDisabled(".requestMoneyPay", "#requestMoneyReview", requestMoneyPayShowLoadingText);
            },
        })
        .done(function(res)
        {
            // console.log(data.success);
            if (res.status == true)
            {
                localStorage.setItem('tr_ref_id', res.tr_ref_id);
                if (res.requestMoneyMailErrorMessage != undefined)
                {
                    localStorage.setItem('requestMoneyMailErrorMessage', res.requestMoneyMailErrorMessage);
                }
                let redirect = $('.requestMoneyPay').attr('data-redirect');
                window.location.replace(redirect);
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
| Request Money ends here
|--------------------------------------------------------------------------
 */