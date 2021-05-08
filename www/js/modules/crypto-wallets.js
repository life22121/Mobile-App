/**
 * Get user crypto wallets
 */
function getUserCryptoWallets()
{
    return new Promise((resolve, reject) =>
    {
        $.ajax(
        {
            url: request_url('crypto/get-user-crypto-wallets'),
            type: 'GET',
            data:
            {
                'user_id': window.localStorage.getItem('user_id')
            },
            dataType: 'json',
            beforeSend: function(xhr)
            {
                xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET');
                xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
                $('.loader').css('display', 'block'); //show loader
            },
        })
        .done(function(data)
        {
            $('.loader').css('display', 'none'); //hide loader
            $('#ptr').css('display', 'block'); //show page

            //show user's crypto wallet balances - starts
            var output = '';
            $.each(data.wallets, function(index, data)
            {
                // console.log(data);
                var defaultLabelText = (window.localStorage.getItem('language') == 'fr') ? 'Défaut' : 'Default';
                if (data.curr_status == 'Active')
                {
                    output += `<li style="height: 70px;">
                        <div>
                            <div class="feat_small_details">
                                <h4 style="font-size: 14px" class="currency">${data.is_default == 'Yes' ? data.curr_code + ' <span style="color: #fff;background-color: #6c757d;display: inline-block;padding: .25em .4em;font-size: 75%;font-weight: 700;line-height: 1;text-align: center;white-space: nowrap;vertical-align: baseline;border-radius: .25rem;">' + defaultLabelText + '</span>' : data.curr_code}
                                </h4>
                            </div>
                            <div class="feat_small_details currencyAmount" style="float: right;">
                                <h4 style="font-size: 14px">${data.balance}</h4>
                            </div>
                        </div>
                        <div>
                            <div class="feat_small_details currencyAmount" style="float: left;">
                                <h4 class="crypto-send" data-wallet-id="${data.wallet_id}" data-curr-code="${data.curr_code}" style="width: 100%;padding: 2px 10px 4px 10px;cursor: pointer;font-size: 16px;color: #FFFFFF;background-color: #232b47;
                                border-radius: 0px;border: none;cursor: pointer;">${(window.localStorage.getItem('language') == 'fr') ? 'Envoyer' : 'Send'}</h4>
                            </div>

                            <div class="feat_small_details currencyAmount" style="float: right;">
                                <h4 class="crypto-receive" data-wallet-id="${data.wallet_id}" data-curr-code="${data.curr_code}" style="width: 100%;padding: 2px 10px 4px 10px;cursor: pointer;font-size: 16px;color: #FFFFFF;background-color: #232b47;
                                border-radius: 0px;border: none;cursor: pointer;">${(window.localStorage.getItem('language') == 'fr') ? 'Recevoir' : 'Receive'}</h4>
                            </div>
                        </div>
                    </li>`;
                }
                else
                {
                    output += `<li style="height: 70px;">
                        <div>
                            <div class="feat_small_details">
                                <h4 style="font-size: 14px" class="currency">${data.is_default == 'Yes' ? data.curr_code + ' <span style="color: #fff;background-color: #6c757d;display: inline-block;padding: .25em .4em;font-size: 75%;font-weight: 700;line-height: 1;text-align: center;white-space: nowrap;vertical-align: baseline;border-radius: .25rem;">' + defaultLabelText + '</span>' : data.curr_code}
                                </h4>
                            </div>
                            <div class="feat_small_details currencyAmount" style="float: right;">
                                <h4 style="font-size: 14px">${data.balance}</h4>
                            </div>
                        </div>
                    </li>`;
                }
            });

            $('.features_list_detailed').html(output);
            //show user's crypto wallet balances - ends

            resolve();
        })
        .fail(function(error)
        {
            error.responseText.hasOwnProperty('message') == true ? alert(JSON.parse(error.responseText).message) : alert(error.responseText);
            reject(error);
            return false;
        });
    });
}

/**
 * Get crypto currency status
 * @param  cryotoCurrencyCode
 * @return status
 */
function getEnabledCurrenciesPreference()
{
    return new Promise((resolve, reject) =>
    {
        $.ajax(
        {
            url: request_url('crypto/get-enabled-currencies-preference'),
            type: "GET",
            data: {},
            dataType: 'json',
            beforeSend: function(xhr)
            {
                xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET');
                xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
            },
        })
        .done(function(res)
        {
            // console.log(res);
            resolve(res);
        })
        .fail(function(error)
        {
            error.responseText.hasOwnProperty('message') == true ? alert(JSON.parse(error.responseText).message) : alert(error.responseText);
            reject(error);
            return false;
        });
    });
}

/**
 * Get crypto currency status
 * @param  cryotoCurrencyCode
 * @return status
 */
function getCryptoCurrencyStatus(cryotoCurrencyCode)
{
    return new Promise((resolve, reject) =>
    {
        $.ajax(
        {
            url: request_url('crypto/get-crypto-currency-status'),
            type: "GET",
            data:
            {
                'cryptoCurrencyCode': cryotoCurrencyCode,
            },
            dataType: 'json',
            beforeSend: function(xhr)
            {
                xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET');
                xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
            },
        })
        .done(function(res)
        {
            // console.log(res);
            resolve(res.status);
        })
        .fail(function(error)
        {
            error.responseText.hasOwnProperty('message') == true ? alert(JSON.parse(error.responseText).message) : alert(error.responseText);
            reject(error);
            return false;
        });
    });
}

/**
 * Redirect to crypto send & receive page
 * @param  redirect page
 * @return
 */
function redirectToCryptoSendReceive(redirect, currCode)
{
    if (networkState() == 'none')
    {
        onOffline();
        $(window).scrollTop(0);
    }
    else
    {
        onOnline();

        // Check user is suspended or not
        if (window.localStorage.getItem('user-status') == 'Suspended')
        {
            userIsSuspended();
            $('.ui-content').hide();
            $(window).scrollTop(0);
        }
        else
        {
            // OPTIONAL CHECK BELOW - This is already added during profile/dashboard page load
            // Get enabled currencies preference
            getEnabledCurrenciesPreference().then((res) =>
            {
                if (res['status'] == 200)
                {
                    showEnabledCurrenciesPreferenceDiv(res['message']);
                    $('.ui-content').hide();
                    $(window).scrollTop(0);
                    return false;
                }
                else
                {
                    // OPTIONAL CHECK BELOW - ALTHOUGH THE BUTTON HAS BEEN REMOVED IF CRYPTO CURRENCY IS INACTIVE, THIS BELOW CHECK IS DONE IS USER SOMEHOW ENABLES IT FROM INSPECT (BROWSER)
                    // Get crypto currency is inactive or not
                    getCryptoCurrencyStatus(currCode).then((status) =>
                    {
                        if (status == 200)
                        {
                            checkCryptoCurrencyStatus(currCode);
                            $('.ui-content').hide();
                            $(window).scrollTop(0);
                            return false;
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
                }
                window.location.replace(redirect);
            })
            .catch(error => {
                console.log(error);
            });
        }
    }
}

/**
 * Get User Crypto Address
 * @param  walletId
 * @param  currCode
 * @return address
 */
function getUserCryptoAddress(type, walletId, currCode)
{
    $.ajax(
    {
        url: request_url('crypto/get-user-crypto-wallet-address'),
        type: "GET",
        data:
        {
            'wallet_id': walletId,
        },
        dataType: 'json',
        beforeSend: function(xhr)
        {
            xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET');
            xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
        },
    })
    .done(function(res)
    {
        // console.log(res);
        if (res.status == 200)
        {
            window.localStorage.setItem('sender-wallet-address', res['wallet-address']);
            window.localStorage.setItem('crypto-currency-code', currCode);

            if (type === 'send')
            {
                redirectToCryptoSendReceive('crypto-send.html', currCode);
            }
            else if (type === 'receive')
            {
                redirectToCryptoSendReceive('crypto-receive.html', currCode);
            }
        }
    })
    .fail(function(error)
    {
        error.responseText.hasOwnProperty('message') == true ? alert(JSON.parse(error.responseText).message) : alert(error.responseText);
        return false;
    });
}

// Crypto Send
$(document).on('click', '.crypto-send', function()
{
    const walletId = $(this).data('wallet-id');
    const currCode = $(this).data('curr-code');
    getUserCryptoAddress('send', walletId, currCode)
});

// Crypto Receive
$(document).on('click', '.crypto-receive', function()
{
    const walletId = $(this).data('wallet-id');
    const currCode = $(this).data('curr-code');
    getUserCryptoAddress('receive', walletId, currCode);
});



