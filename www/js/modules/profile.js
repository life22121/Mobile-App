function getUserDefaultWalletUpdatedBalance()
{
    return new Promise((resolve, reject) =>
    {
        $.ajax(
        {
            url: request_url('get-default-wallet-balance'),
            type: "get",
            data:
            {
                'user_id': window.localStorage.getItem('user_id'),
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
            $('.profileDiv').css('display', 'block'); //show page

            if (data.success.status == 200)
            {
                // console.log(data.success);
                $(".av_blance").text(data.success.defaultWalletBalance);
                resolve(data.success.status);
            }
        })
        .fail(function(error)
        {
            reject(error);
            error.responseText.hasOwnProperty('message') == true ? alert(JSON.parse(error.responseText).message) : alert(error.responseText);
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
        if (res.status == 200)
        {
            $('.dashboard-crypto-div').remove();
        }
        else
        {
            $('.dashboard-exchange-money-div').after( `<li class="dashboard-crypto-div">
                <a href="#" class="crypto-wallets" data-transition="slidefade">
                    <div class="home-icon"><img src="images/icons/m-crypto.png" alt="" title="" /></div>
                    <h4 style="font-size: 14px;color: #232323">${(window.localStorage.getItem('language') == 'fr') ? 'Crypto' : 'Crypto'}</h4>
                </a>
            </li>`);
        }
    })
    .fail(function(error)
    {
        error.responseText.hasOwnProperty('message') == true ? alert(JSON.parse(error.responseText).message) : alert(error.responseText);
        return false;
    });
}