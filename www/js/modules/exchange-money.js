function showExchangeGetUserExistingWallatesDetails()
{
    var promiseObj = new Promise(function(resolve, reject)
    {
        $.ajax(
        {
            url: request_url('get-User-Wallets-WithActive-HasTransaction'),
            type: "get",
            data:
            {
                'user_id': localStorage.getItem('user_id')
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
                // console.log(data.success);
                let defaultWalletCurrencyId = data.success.defaultWalletCurrencyId; //
                let output = '';
                $.each(data.success.activeHasTransactionUserCurrencyList, function(index, data)
                {
                    output += `
                        <option value="${data.id}" ${defaultWalletCurrencyId == data.id ? 'selected="selected"': ''}>${data.code}</option>
                    `;
                });
                $('#fromWallet').html(output);
                let fromWallet = $("#fromWallet option:selected").text(); //
                $('#fromWallet-button span').text(fromWallet); //
                let balanceArray = [];
                balanceArray['token'] = localStorage.getItem('token');
                balanceArray['user_id'] = localStorage.getItem('user_id');
                balanceArray['fromWalletValue'] = $('.fromWallet option:selected').val();
                balanceArray['top_balance'] = $('#top-balance');
                balanceArray['showWalletBalance'] = $('.show-fromWallet-balance');
                balanceArray['showWallet'] = $('.show-fromWalletCode');
                // resolve(fromWalletValue, top_balance, showWalletBalance, showWallet, token, user_id);
                resolve(balanceArray);
            }
        }).fail(function(error)
        {
            reject(error);
            console.log(error);
        });
        // console.log("showExchangeGetUserExistingWallatesDetails request sent succesfully");
    });
    return promiseObj;
}

function getBalanceOfBothFromAndToWallets(getFromOrToCurrencyId, getTopOrBottomBalance, getFromOrToWalletBalance, getFromOrToWallet, getToken, getUserId)
{
    var promiseObj = new Promise(function(resolve, reject)
    {
        $.ajax(
        {
            url: request_url('getBalanceOfFromAndToWallet'),
            type: "post",
            data:
            {
                "_token": getToken,
                'currency_id': getFromOrToCurrencyId,
                'user_id': getUserId,
            },
            dataType: "json",
            beforeSend: function(xhr)
            {
                xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
                xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
            },
        })
        .done(function (response)
        {
            if (response.status == true)
            {
                if (getFromOrToCurrencyId !== '')
                {
                    getTopOrBottomBalance.show();
                    getFromOrToWalletBalance.html(getMoneyFormat(response.currencyCode, getDecimalNumberFormat(response.balance)));
                    getFromOrToWallet.html(response.currencyCode);
                }
                else
                {
                    getTopOrBottomBalance.hide();
                }
            }
            else
            {
                getTopOrBottomBalance.hide();
            }
            let getWalletsExceptSelectedFromWalletArray = [];
            getWalletsExceptSelectedFromWalletArray['fromWallet'] = getFromOrToCurrencyId;
            getWalletsExceptSelectedFromWalletArray['token'] = getToken;
            getWalletsExceptSelectedFromWalletArray['user_id'] = getUserId;
            resolve(getWalletsExceptSelectedFromWalletArray);
        }).fail(function(error)
        {
            reject(error);
            console.log(error);
        });
        // console.log("getBalanceOfBothFromAndToWallets request sent succesfully");
    });
    return promiseObj;
}

function getWalletsExceptSelectedFromWallet(fromWallet, token, user_id)
{
    var promiseObj = new Promise(function(resolve, reject)
    {
        $('#bottom-balance').hide();
        $('#toWallet-button span').text((window.localStorage.getItem('language') == 'fr') ? 'Sélectionnez Pour Portefeuille' : 'Select To Wallet');
        $("#toWallet").prepend(`<option value='' selected='selected'>${(window.localStorage.getItem('language') == 'fr') ? 'Sélectionnez Pour Portefeuille' : 'Select To Wallet'}</option>`);
        if (fromWallet)
        {
            $.ajax(
            {
                method: "POST",
                url: request_url('getWalletsExceptSelectedFromWallet'),
                dataType: "json",
                cache: false,
                data:
                {
                    "_token": token,
                    'currency_id': fromWallet,
                    'user_id': user_id,
                },
                beforeSend: function(xhr)
                {
                    xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
                    xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
                },
            })
            .done(function (data)
            {
                var output = '';
                output += `<option value="">${(window.localStorage.getItem('language') == 'fr') ? 'Sélectionnez Pour Portefeuille' : 'Select To Wallet'}</option>`;
                $.each(data.currencies, function(index, data)
                {
                    output += `
                        <option value="${data.id}" data-exchangeRate="${data.rate}" data-toWalletCode="${data.code}">${data.code}</option>
                    `;
                });
                $('#toWallet').html(output);
                localStorage.setItem('fromWalletValue', fromWallet);
                resolve();
            }).fail(function(error)
            {
                reject(error);
                console.log(error);
            });
        }
        // console.log("getWalletsExceptSelectedFromWallet request sent succesfully");
    });
    return promiseObj;
}

function getAmountFromGive()
{
    let token = localStorage.getItem('token');
    let user_id = localStorage.getItem('user_id');
    let amount = $('#sendDisplay').val();
    let fromWallet = $('.fromWallet option:selected').val();
    let toWallet = $('.toWallet option:selected').val();
    let fromWalletCode = $('#fromWallet-button span').html();
    let toWalletCode = $('#toWallet-button span').html();
    if (toWallet && fromWalletCode)
    {
        $.ajax(
        {
            url: request_url('get-currencies-exchange-rate'),
            type: "post",
            dataType: 'json',
            data:
            {
                '_token': token,
                'toWallet': toWallet,
                'fromWallet': fromWallet,
                'fromWalletCode': fromWalletCode,
                'user_id': user_id,
                'amount': amount,
            },
            beforeSend: function(xhr)
            {
                xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
                xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
            },
        })
        .done(function (response)
        {
            // console.log(response);
            if (response.success.status == 200)
            {
                if (amount != '' && $.isNumeric(amount))
                {
                    $('.div_exchange_rate').show();
                    $('.exchange_rate').html(`<span style="font-weight: bold;"> ${(window.localStorage.getItem('language') == 'fr') ?
                    'Taux de change:' : 'Exchange rate:'} </span> 1 ${fromWalletCode} = ${response.success.toWalletRateHtml} ${toWalletCode}`);
                    $('.div_get_amount').show();
                    $('.getAmount').html(response.success.getAmountMoneyFormat);
                    localStorage.setItem('toWalletValue', toWallet); //fixed
                    localStorage.setItem('toWalletRate', response.success.toWalletRate);
                    localStorage.setItem('toWalletCode', response.success.toWalletCode);
                    localStorage.setItem('toWalletSymbol', response.success.toWalletSymbol);
                }
                else
                {
                    hideExchangeRateGetAmountDiv();
                }
            }
            else
            {
                // console.log(response.success.status);
                return false;
            }
        }).fail(function(error)
        {
            console.log(error);
        });
    }
}

//exchangeSubmit
function exchangeSubmit() //also does exchange Amount Limit Check
{
    let token = localStorage.getItem('token');
    var amount = $('#sendDisplay').val();
    var fromWalletDropdown = $('#fromWallet-button span').html();
    var toWalletDropdown = $('#toWallet-button span').html();
    if (amount != '' && fromWalletDropdown != '&nbsp;' && toWalletDropdown != '&nbsp;')
    {
        $('#fromWalletValidate').hide();
        $('#toWalletValidate').hide();
        $('#amountExchangeValidate').hide();
        var toWalletDropdownValue = $('#toWallet option:selected').val();
        var fromWalletDropdownValue = $('#fromWallet option:selected').val();
        if (amount)
        {
            $.ajax(
            {
                url: request_url('exchange-review'),
                type: "post",
                data:
                {
                    '_token': token,
                    'amount': amount,
                    'currency_id': fromWalletDropdownValue,
                    'user_id': localStorage.getItem('user_id')
                },
                dataType: 'json',
                beforeSend: function(xhr)
                {
                    xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
                    xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
                },
            })
            .done(function (data)
            {
                if (data.success.status == 200)
                {
                    localStorage.setItem('fromWalletCode', fromWalletDropdown);
                    localStorage.setItem('amount', amount);
                    performExchangeReview();
                }
                else
                {
                    let errorMessage = '';
                    if (data.success.reason == "noHasTransaction")
                    {
                        errorMessage = (window.localStorage.getItem('language') == 'fr') ? `La devise ${data.success.currencyCode} limite de frais est inactive` : data.success.message;
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
                    else if (data.success.reason == "emptyFeesLimit")
                    {
                        errorMessage = (window.localStorage.getItem('language') == 'fr') ? `Veuillez vérifier la limite de frais pour la devise ${data.success.emptyFeesLimitCurrCode}` : data.success.message;
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
    }
}

function performExchangeReview()
{
    let token = localStorage.getItem('token');
    let amount = localStorage.getItem('amount');
    let fromWalletValue = localStorage.getItem('fromWalletValue');
    let toWalletRate = localStorage.getItem('toWalletRate');
    let toWalletCode = localStorage.getItem('toWalletCode');
    let toWalletSymbol = localStorage.getItem('toWalletSymbol');
    $.ajax(
    {
        url: request_url('review-exchange-details'),
        type: "post",
        data:
        {
            '_token': token,
            'amount': amount, //for 8 decimal places
            'fromWalletValue': fromWalletValue,
            'toWalletRate': toWalletRate,
            'user_id': localStorage.getItem('user_id')
        },
        dataType : 'json',
        beforeSend: function(xhr)
        {
            xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
            xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
        },
    })
    .done(function (data)
    {
        // console.log(data.success);
        if (data.success.status == 200)
        {
            $('.fWalletAmount').text(getMoneyFormat(data.success.fCurrencyCode, getDecimalNumberFormat(amount)));
            $('.fromCurrencyCode').text(data.success.fCurrencyCode);
            $('.toWalletAmount').text(getMoneyFormat(toWalletCode, getDecimalNumberFormat(data.success.convertedAmnt)));
            $('.toCurrencyCode').text(toWalletCode);
            $('.fromCurrencyRate').text('1');
            $('.toCurrencyRate').text(data.success.toWalletRateHtml);
            $('.dcurrencyAmount').text(getMoneyFormat(data.success.fCurrencySymbol, getDecimalNumberFormat(amount)));
            $('.totalFees').text(getMoneyFormat(data.success.fCurrencySymbol, data.success.totalFeesHtml));
            $('.totalAmount').text(getMoneyFormat(data.success.fCurrencySymbol, getDecimalNumberFormat(data.success.totalAmount)));
            localStorage.setItem('totalFees', data.success.totalFees);
            localStorage.setItem('fromWalletAmount', amount);
            localStorage.setItem('fromWalletSymbol', data.success.fCurrencySymbol);
            localStorage.setItem('toWalletAmount', data.success.convertedAmnt);
            localStorage.setItem('toWalletRateHtml', data.success.toWalletRateHtml);
            let exchangeMoneyAmountSectionTitle = (window.localStorage.getItem('language') == 'fr') ? 'Examen et échange' : 'Review & Exchange';
            navigateTo('exchangeMoneyReview', exchangeMoneyAmountSectionTitle, 'exchangeMoneyBlock');
        }
    }).fail(function(error)
    {
        console.log(error);
    });
}

function exchangeMoneyComplete()
{
    $.ajax(
    {
        url: request_url($('.exchangeMoneyComplete').attr('action')), //api_route - exchange-money-complete
        type: "post",
        dataType: 'json',
        data:
        {
            '_token': localStorage.getItem('token'),
            'user_id': localStorage.getItem('user_id'),
            'fromWalletValue': localStorage.getItem('fromWalletValue'),
            'toWalletValue': localStorage.getItem('toWalletValue'), //fixed
            'toWalletAmount': localStorage.getItem('toWalletAmount'),
            'toWalletExchangeRate': localStorage.getItem('toWalletRate'),
            'fromWalletAmount': localStorage.getItem('fromWalletAmount'),
            'totalFees': localStorage.getItem('totalFees'),
            'fromWalletCode': localStorage.getItem('fromWalletCode'),
        },
        beforeSend: function(xhr)
        {
            xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
            xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
        },
    })
    .done(function (res)
    {
        if (res.status == true)
        {
            // console.log(data.success);
            let redirect = $('.exchangeMoneyComplete').attr('data-redirect');
            window.location.href = redirect;
        }
        else
        {
            localStorage.setItem('exchangeMoneyValidationErrorMessage', res.exchangeMoneyValidationErrorMessage);
            window.location.href = 'exchange-money.html';
        }
    }).fail(function(error)
    {
        console.log(error);
    });
}

function ifAmountEmptyHideFeesElseShow()
{
    let amount = $('#sendDisplay').val();
    let fromWallet = $('.fromWallet option:selected').val();
    if (amount && fromWallet)
    {
        $('#wallet-fees').show();
    }
    else
    {
        $('#wallet-fees').hide();
    }
}

function hideExchangeRateGetAmountDiv()
{
    $('.div_exchange_rate').hide();
    $('.div_get_amount').hide();
    $('.exchange_rate').html('');
}