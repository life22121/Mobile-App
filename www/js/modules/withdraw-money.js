/*
|--------------------------------------------------------------------------
| Payout Money starts here
|--------------------------------------------------------------------------
 */

//new
function checkPayoutSettings()
{
    var promiseObj = new Promise(function(resolve, reject)
    {
        $.ajax(
        {
            url: request_url('check-payout-settings'),
            type: "GET",
            data:
            {
                'user_id': window.localStorage.getItem('user_id'),
            },
            beforeSend: function(xhr)
            {
                xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET');
                xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
            },
        })
        .done((res)=>
        {
            // console.log(res);
            if (res.status == 200)
            {
                if (res.payoutSettings <= 0)
                {
                    swal({
                        title: `${(window.localStorage.getItem('language') == 'fr') ? 'Erreur!' : 'Error!'}`,
                        text: `${(window.localStorage.getItem('language') == 'fr') ? 'Aucun paramètre de paiement existe!' : 'No Payout Setting Exists!'}`,
                        type: "error"
                    }, function()
                    {
                        window.location.replace('profile.html');
                    });
                    event.preventDefault();
                    resolve(false);
                }
                else
                {
                    resolve(true);
                }
            }
        })
        .fail((error)=>
        {
            reject();
            console.log(error);
        });
    });
    return promiseObj;
}


// Payout - Get Payment Methods - returns promise object
function getWithdrawalPaymentMethods()
{
    var promiseObj = new Promise(function(resolve, reject)
    {
        $.ajax(
        {
            url: request_url('get-withdraw-payment-method'),
            type: "GET",
            data:
            {
                'user_id': localStorage.getItem('user_id'),
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
                // console.log(data.success.paymentmethod);

                let paymentOutput = '';
                if (data.success.paymentmethod != 0)
                {
                    $.each(data.success.paymentmethod, function(index, data)
                    {
                        paymentOutput += `
                            <option value="${data.id}" data-paymentMethodId=${data.paymentMethodId}>${data.paymentMethod}(${data.paymentMethodCredential})</option>
                        `;
                    });
                }
                else
                {
                    paymentOutput += `<option value="">${(window.localStorage.getItem('language') == 'fr') ? 'Sélectionnez le mode de paiement' : 'Select Payment Method'}</option>`;
                }
                $('#paymentmethod').html(paymentOutput);

                //Show First Payment Method Selected Text
                let paymentmethod = $("#paymentmethod option:first").text();
                $('#paymentmethod-button span').text(paymentmethod);

                //Pass Payment Method Id to promise resolve
                var paymentMethodId = $('option:first', '#paymentmethod').attr('data-paymentMethodId');
                resolve(paymentMethodId);
            }
        })
        .fail(function(error)
        {
            reject(error);
            console.log(error);
        });
        // console.log("Get Withdrawal PaymentMethods request sent succesfully");
    });
    return promiseObj;
}

// Payout - Get Currencies based on Payment Method - returns promise object
function getWithdrawalCurrenciesBasedOnSelectedPaymentMethod(paymentMethodId)
{
    var promiseObj = new Promise(function(resolve, reject)
    {
        $.ajax(
        {
            url: request_url('get-withdraw-currencies-based-on-payment-method'),
            type: "GET",
            data:
            {
                'user_id': window.localStorage.getItem('user_id'),
                'paymentMethodId': paymentMethodId,
            },
            dataType: 'json',
            beforeSend: function(xhr)
            {
                xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET');
                xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
            },
        }).done(function(data)
        {
            if (data.success.status == 200)
            {
                // console.log(data.success);
                var datas = data.success.currencies;
                var output = '';
                if (datas != 0)
                {
                    $.map(datas, function(value, index)
                    {
                        output += `<option value="${value.id}" ${value.default_wallet == 'Yes' ? 'selected="selected"': ''}>${value.code}</option>`; //pm_v2.3
                    });
                }
                else
                {
                    output+=`<option value="">${(window.localStorage.getItem('language') == 'fr') ? 'Sélectionnez la devise' : 'Select Currency'}</option>`;
                }
                $('#withdrawCurrency').html(output);

                let withdrawCurrency = $("#withdrawCurrency option:selected").text();
                $('#withdrawCurrency-button span').text(withdrawCurrency);
                resolve();
            }
        })
        .fail(function(error)
        {
            reject(error);
            console.log(error);
        });
        // console.log("Get Withdrawal Currencies Based On Selected PaymentMethod request sent succesfully");
    });
    return promiseObj;
}

// Payout - Review
function withdrawMoneyReview(paymentMethodId, element)
{
    $.ajax(
    {
        url: request_url('get-withdraw-details-with-amount-limit-check'),
        type: "GET",
        data: element + "&user_id=" + window.localStorage.getItem('user_id') + "&paymentMethodId=" + paymentMethodId + "",
        dataType: 'json',
        beforeSend: function(xhr)
        {
            xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET');
            xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
        },
    }).done(function(data)
    {
        // console.log(data.success);
        if (data.success.status == 200)
        {
            // console.log(data.success);
            localStorage.setItem('withdrawAmount', data.success.amount);
            localStorage.setItem('withdrawFees', data.success.totalFees);
            localStorage.setItem('withdrawCurrencyId', data.success.currency_id);
            localStorage.setItem('withdrawCurrencySymbol', data.success.currSymbol);
            localStorage.setItem('payout_setting_id', data.success.payout_setting_id);
            $('.paymentmethodName').text(data.success.type);
            $('.totalFees').text(getMoneyFormat(data.success.currSymbol, data.success.totalHtml));
            $('.dcurrencyAmount').text(getMoneyFormat(data.success.currSymbol, getDecimalNumberFormat(data.success.amount)));
            $('.totalAmount').text(getMoneyFormat(data.success.currSymbol, getDecimalNumberFormat(data.success.totalAmount)));
            if (data.success.type == 'Bank')
            {
                $("#payment_method_logo").html(`<img class="" src="${SITE_URL.replace('api/','')}/public/images/payment_gateway/bank.jpg" class="img-responsive" style="max-width: 130px; margin:auto" />`);
                $('.bankDetails').show();
                $('.account_name').text(data.success.account_name);
                $('.account_number').text(data.success.account_number);
                $('.swift_code').text(data.success.swift_code);
                $('.bank_name').text(data.success.bank_name);
                $('.loginFrom2').css('margin-top', '-75px');
            }
            else
            {
                if (data.success.type == 'Paypal')
                {
                    $("#payment_method_logo").html(`<img class="" src="${SITE_URL.replace('api/','')}/public/images/payment_gateway/paypal.jpg" class="img-responsive" style="max-width: 130px; margin:auto" />`);
                }
                $('.bankDetails').hide();
                $('.loginFrom2').css('margin-top', '-42px');
            }
            let payoutMoneyAmountSectionTitle = (window.localStorage.getItem('language') == 'fr') ? 'Examen et paiement' : 'Review & Payout';
            navigateTo('withdrawReviewSection', payoutMoneyAmountSectionTitle, 'withdrawMoneyBlock');
        }
        else
        {
            let errorMessage = '';
            if (data.success.reason == "insufficientBalance")
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
    }).fail(function(error)
    {
        console.log(error);
    });
}

// Payout - Success
function withdrawMoneyPay()
{
    $.ajax(
    {
        url: request_url($('.withdrawMoneyPay').attr('action')), //withdraw-money-pay
        type: "post",
        data:
        {
            '_token': localStorage.getItem('token'),
            'user_id': localStorage.getItem('user_id'),
            'amount': localStorage.getItem('withdrawAmount'),
            'totalFees': localStorage.getItem('withdrawFees'),
            'currency_id': localStorage.getItem('withdrawCurrencyId'),
            'payout_setting_id': localStorage.getItem('payout_setting_id'),
        },
        dataType: 'json',
        beforeSend: function(xhr)
        {
            xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
            xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
        },
    }).done(function(res)
    {
        if (res.status == true)
        {
            let redirect = $('.withdrawMoneyPay').attr('data-redirect');
            window.location.href = redirect;
        }
        else
        {
            // console.log(res.withdrawalValidationErrorMessage);
            localStorage.setItem('withdrawalValidationErrorMessage', res.withdrawalValidationErrorMessage);
            window.location.href = 'withdraw-money.html';
            return false;
        }

    }).fail(function(error)
    {
        console.log(error);
    });
}
/*
|--------------------------------------------------------------------------
| Payout Money ends here
|--------------------------------------------------------------------------
 */