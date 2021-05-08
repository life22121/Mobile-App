function accetRequestEmailOrPhone()//1
{
    $.ajax({
        url: request_url('accept-request-email-phone'),
        type: "get",
        data:
        {
            'tr_ref_id': localStorage.getItem('tr_ref_id')
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
            if (data.success.phone) {
                $('.acceptEmail').val(data.success.phone);
            } else {
                $('.acceptEmail').val(data.success.email);
            }
            localStorage.setItem('request-accept-amount', data.success.amount);
            localStorage.setItem('request-accept-currency-code', data.success.currency);
            localStorage.setItem('request-accept-currency-symbol', data.success.currencySymbol);
            localStorage.setItem('request-accept-currency-id', data.success.currency_id);
        }
        else
        {
            showErrorMessage(data.success.message);
            return false;
        }
    })
    .fail(function(error) {
        console.log(error);
    });
}

function requestPaymentReview()
{
    let accpetedAmount = $('#display').val();
    localStorage.setItem('request-accept-amount', accpetedAmount); //updating amount if changed by request acceptor from request-payment-confirm.html page
    let currency_id = localStorage.getItem('request-accept-currency-id');
    if (accpetedAmount)
    {

        $.ajax({
            url: request_url('request-accept-amount-limit-check'),
            type: "post",
            data:
            {
                '_token': localStorage.getItem('token'),
                'amount': accpetedAmount,
                'currency_id': currency_id,
                'user_id': localStorage.getItem('user_id')
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
            if (data.success.status == 200)
            {
                let redirect = $('.requestPaymentReview').attr('data-redirect'); //request-payment-review.html
                window.location.href = redirect;
            }
            else
            {
                let errorMessage = '';
                if (data.success.reason == "invalidCurrency")
                {
                    errorMessage = (window.localStorage.getItem('language') == 'fr') ? 'Vous n\'avez pas la monnaie demandée!' : data.success.message;
                }
                else if (data.success.reason == "insufficientBalance")
                {
                    errorMessage = (window.localStorage.getItem('language') == 'fr') ? "Désolé, pas assez de fonds pour effectuer l'opération!" : data.success.message;
                }
                else if (data.success.reason == "minLimit")
                {
                    errorMessage = (window.localStorage.getItem('language') == 'fr') ? `Montant minimal ${data.success.minLimit}` : data.success.message;
                }
                else if (data.success.reason == "minMaxLimit")
                {
                    errorMessage = (window.localStorage.getItem('language') == 'fr') ? `Montant minimal ${data.success.minLimit} and Montant maximale ${data.success.maxLimit}` : data.success.message;
                }
                showErrorMessage(errorMessage);
                $(window).scrollTop(0);
                return false;
            }
        })
        .fail(function(error) {
            console.log(error);
        });
    }
}

function getAcceptFeeDetails()
{
    let amount = localStorage.getItem('request-accept-amount');
    // amount = parseFloat(amount).toFixed(2);

    $.ajax({
        url: request_url('get-accept-fees-details'),
        type: "get",
        data:
        {
            'amount': amount,
            'currency_id': localStorage.getItem('request-accept-currency-id')
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
            $('.accpetedAmount').text(getMoneyFormat(data.success.currSymbol, getDecimalNumberFormat(amount)));
            $('.totalFees').text(getMoneyFormat(data.success.currSymbol, getDecimalNumberFormat(data.success.totalFees)));
            localStorage.setItem('totalFees', data.success.totalFees);
            $('.totalAmount').text(getMoneyFormat(data.success.currSymbol, getDecimalNumberFormat(data.success.totalAmount)));
        }
        else
        {
            showErrorMessage(data.success.message);
            return false;
        }
    })
    .fail(function(error) {
        console.log(error);
    });
}

function acceptRequestPaymentPay()
{
    let token = localStorage.getItem('token');
    let amount = localStorage.getItem('request-accept-amount');
    // console.log(amount);
    // return false;
    // amount = parseFloat(amount).toFixed(2);
    let currency_id = localStorage.getItem('request-accept-currency-id');
    let user_id = localStorage.getItem('user_id');
    let totalFees = localStorage.getItem('totalFees');

    if (amount)
    {
        $.ajax({
            url: request_url($('.acceptRequestPaymentPay').attr('action')),//accept-request-payment-pay
            type: "post",
            data:
            {
                '_token': token,
                'tr_ref_id': localStorage.getItem('tr_ref_id'),
                'tr_email_or_phone': localStorage.getItem('tr_email_or_phone'),
                'amount': amount,
                'currency_id': currency_id,
                'user_id': user_id,
                'totalFees': totalFees
            },
            dataType: 'json',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
                xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
                let acceptRequestPaymentPayLoaderText = (window.localStorage.getItem('language') == 'fr') ? 'Confirmant ...' : 'Confirming...';
                showSpinnerWithButtonDisabled(".acceptRequestPaymentPay", "#requestPaymentReview", acceptRequestPaymentPayLoaderText);
            },
        })
        .done(function(res)
        {
            if (res.status == true)
            {
                // console.log(res.requestAccptMailErrorMessage)
                if (res.requestAccptMailErrorMessage != undefined)
                {
                    localStorage.setItem('requestAccptMailErrorMessage', res.requestAccptMailErrorMessage);
                }
                let redirect = $('.acceptRequestPaymentPay').attr('data-redirect');
                window.location.href = redirect; //accept-request-money-success.html
            }
            else
            {
                localStorage.setItem('requestAccptValidationErrorMessage', res.requestAccptValidationErrorMessage);
                window.location.href = 'accept-money-email.html';
                return false;
            }
        })
        .fail(function(error) {
            console.log(error);
        });
    }
}