/*
|--------------------------------------------------------------------------
| Crypto Send starts here
|--------------------------------------------------------------------------
 */

/**
 * Show crypto currency warning texts
 * @param  cryptoCurrencyCode
 * @return warning texts
 */
function showCryptoSendWarningTexts(cryptoCurrencyCode)
{
    var cryptoSendAmountWithdrawanWarningTextA = (window.localStorage.getItem('language') == 'fr') ? 'Le montant retiré / envoyé doit au moins être' : 'The amount withdrawn/sent must at least be';
    var cryptoSendAmountWithdrawanWarningTextB1 = (window.localStorage.getItem('language') == 'fr') ? 'Veuillez garder au moins' : 'Please keep at least';
    var cryptoSendAmountWithdrawanWarningTextB2 = (window.localStorage.getItem('language') == 'fr') ? 'pour les frais de réseau' : 'for network fees';
    var cryptoSendAmountWithdrawanWarningTextC = (window.localStorage.getItem('language') == 'fr') ? 'Autorisé jusqu\'à 8 décimales' : 'Allowed upto 8 decimal places';
    if (cryptoCurrencyCode == 'DOGE' || cryptoCurrencyCode == 'DOGETEST')
    {
        $('#amount').after(`<p style="color: #6c757d!important;display: block;margin-top: .25rem;font-size: 90%;font-weight: 400;"><b>*${cryptoSendAmountWithdrawanWarningTextA} 2 ${cryptoCurrencyCode}.</b></p>
        <p style="color: #6c757d!important;display: block;margin-top: .25rem;font-size: 90%;font-weight: 400;"><b>*${cryptoSendAmountWithdrawanWarningTextB1} 1 ${cryptoCurrencyCode} ${cryptoSendAmountWithdrawanWarningTextB2}.</b></p>
        <p style="color: #6c757d!important;display: block;margin-top: .25rem;font-size: 90%;font-weight: 400;"><b>*${cryptoSendAmountWithdrawanWarningTextC}.</b></p><br/>
        `);
    }
    else if (cryptoCurrencyCode == 'BTC' || cryptoCurrencyCode == 'BTCTEST')
    {
        $('#amount').after(`<p style="color: #6c757d!important;display: block;margin-top: .25rem;font-size: 90%;font-weight: 400;"><b>*${cryptoSendAmountWithdrawanWarningTextA} 0.00002 ${cryptoCurrencyCode}.</b></p>
        <p style="color: #6c757d!important;display: block;margin-top: .25rem;font-size: 90%;font-weight: 400;"><b>*${cryptoSendAmountWithdrawanWarningTextB1} 0.0002 ${cryptoCurrencyCode} ${cryptoSendAmountWithdrawanWarningTextB2}.</b></p>
        <p style="color: #6c757d!important;display: block;margin-top: .25rem;font-size: 90%;font-weight: 400;"><b>*${cryptoSendAmountWithdrawanWarningTextC}.</b></p><br/>
        `);
    }
    else if (cryptoCurrencyCode == 'LTC' || cryptoCurrencyCode == 'LTCTEST')
    {
        $('#amount').after(`<p style="color: #6c757d!important;display: block;margin-top: .25rem;font-size: 90%;font-weight: 400;"><b>*${cryptoSendAmountWithdrawanWarningTextA} 0.0002 ${cryptoCurrencyCode}.</b></p>
        <p style="color: #6c757d!important;display: block;margin-top: .25rem;font-size: 90%;font-weight: 400;"><b>*${cryptoSendAmountWithdrawanWarningTextB1} 0.0001 ${cryptoCurrencyCode} ${cryptoSendAmountWithdrawanWarningTextB2}.</b></p>
        <p style="color: #6c757d!important;display: block;margin-top: .25rem;font-size: 90%;font-weight: 400;"><b>*${cryptoSendAmountWithdrawanWarningTextC}.</b></p><br/>
        `);
    }
}

// Crypto Send - Review
function cryptoSendReview(cryptoCurrencyCode, amount, endPoint, type, element)
{
    // console.log(cryptoCurrencyCode, amount, endPoint, type, element);
    // return;

    if (cryptoCurrencyCode == null || amount == null)
    {
        window.location.replace('profile.html');
    }

    var cryptoSendMinAmntErrText = (window.localStorage.getItem('language') == 'fr') ? 'Le montant minimum doit être' : 'The minimum amount must be';
    if ((cryptoCurrencyCode == 'DOGE' || cryptoCurrencyCode == 'DOGETEST') && amount < 2)
    {
        // TODO: translation
        showErrorMessage(`${cryptoSendMinAmntErrText} 2 ${cryptoCurrencyCode}`);
        $(window).scrollTop(0);
        return false;
    }
    else if ((cryptoCurrencyCode == 'BTC' || cryptoCurrencyCode == 'BTCTEST') && amount < 0.00002)
    {
        // TODO: translation
        showErrorMessage(`${cryptoSendMinAmntErrText} 0.00002 ${cryptoCurrencyCode}`);
        $(window).scrollTop(0);
        return false;
    }
    else if ((cryptoCurrencyCode == 'LTC' || cryptoCurrencyCode == 'LTCTEST') && amount < 0.0002)
    {
        // TODO: translation
        showErrorMessage(`${cryptoSendMinAmntErrText} 0.0002 ${cryptoCurrencyCode}`);
        $(window).scrollTop(0);
        return false;
    }
    else
    {
        var showCryptoNextText = (window.localStorage.getItem('language') == 'fr') ? 'Prochain' : 'Next';

        $.ajax(
        {
            url: request_url(endPoint),
            type: type,
            data: element + "&user_id=" + window.localStorage.getItem('user_id') + "",
            dataType: 'json',
            beforeSend: function(xhr)
            {
                xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
                xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
                var showCryptoNextText = (window.localStorage.getItem('language') == 'fr') ? 'Révision...' : 'Reviewing...';
                showSpinnerWithButtonDisabled(".crypto-send-review", ".crypto-send-review-text", showCryptoNextText);
            },
        })
        .done(function(res)
        {
            // console.log(res);
            // return;

            if (res.status == 200)
            {
                $('#crypto-send-receiver-address-amount-section').hide();

                // Display data
                $('#crypto-send-review-section').show();

                //Get receiver address from form element - starts
                var elementData = element.split("&");
                var cryptoSendReviewObj={};
                for(var key in elementData)
                {
                    cryptoSendReviewObj[elementData[key].split("=")[0]] = elementData[key].split("=")[1];
                }
                const receiverAddress = cryptoSendReviewObj.receiverAddress;
                //Get receiver address from form element - ends
                $('.crypto-send-receiver-address').text((window.localStorage.getItem('language') == 'fr') ? `Vous êtes sur le point d'envoyer ${window.localStorage.getItem('crypto-currency-code')} à ${receiverAddress}` :
                `You are about to send ${window.localStorage.getItem('crypto-currency-code')} to ${receiverAddress}`);
                $('.crypto-send-amount').text(getMoneyFormat(res['currency-symbol'], res.amount));
                $('.crypto-send-network-fee').text(getMoneyFormat(res['currency-symbol'], res['network-fee']));
                $('.crypto-send-total').text(getMoneyFormat(res['currency-symbol'], res.total));

                // Store data (for success page) and success function
                window.localStorage.setItem('crypto-send-receiver-address', receiverAddress);
                window.localStorage.setItem('crypto-send-amount', res.amount);
                window.localStorage.setItem('crypto-send-currency-id', res['currency-id']);
                window.localStorage.setItem('crypto-send-currency-symbol', res['currency-symbol']);
                window.localStorage.setItem('crypto-send-end-user-id', res['end-user-id']);
                window.localStorage.setItem('crypto-send-network-fee', res['network-fee']);

                //
                var cryptoSendReviewSectionTitle = (window.localStorage.getItem('language') == 'fr') ? `Envoyer ${cryptoCurrencyCode} La revue` : `Send ${cryptoCurrencyCode} Review`;
                navTitleStack.push((window.localStorage.getItem('language') == 'fr') ? `Envoyer ${cryptoCurrencyCode}` : `Send ${cryptoCurrencyCode}`);
                navigateTo('crypto-send-review-section', cryptoSendReviewSectionTitle, 'crypto-send-receiver-address-amount-section');
            }
            else
            {
                var errorMessage = '';
                switch (res.reason)
                {
                    case "invalid-address":
                        errorMessage = (window.localStorage.getItem('language') == 'fr') ? `Récipient invalide ${cryptoCurrencyCode} adresse` : res.message;
                        break;

                    case "own-address":
                        errorMessage = (window.localStorage.getItem('language') == 'fr') ? `Ne peut pas être envoyé ${cryptoCurrencyCode} à sa propre adresse!` : res.message;
                        break;

                    case "insufficient-balance":
                        errorMessage = (window.localStorage.getItem('language') == 'fr') ? `Frais de réseau ${res['network-fee']} et montant ${res.amount} dépasse votre ${cryptoCurrencyCode} équilibre` : res.message;
                        break;

                    case "validation-error":
                    case "exception-error":
                        errorMessage = res.message;
                        break;
                }
                hideSpinnerWithButtonEnabled(".crypto-send-review", ".crypto-send-review-text", showCryptoNextText);
                showErrorMessage(errorMessage);
                $(window).scrollTop(0);
                return false;
            }
        })
        .fail(function(error)
        {
            hideSpinnerWithButtonEnabled(".crypto-send-review", ".crypto-send-review-text", showCryptoNextText);
            error.responseText.hasOwnProperty('message') == true ? showErrorMessage(JSON.parse(error.responseText).message) : showErrorMessage(error.responseText);
            $(window).scrollTop(0);
            return false;
        });
    }
}

//Crypto Send - Confirm
function cryptoSendConfirm()
{
    var cryptoSendConfirmFailText = (window.localStorage.getItem('language') == 'fr') ? 'Confirmer' : 'Confirm';
    $.ajax(
    {
        url: request_url($('.crypto-send-confirm').attr('action')), //crypto/send/confirm
        type: "POST",
        data:
        {
            '_token': window.localStorage.getItem('token'),
            'user_id': window.localStorage.getItem('user_id'),
            'cryptoCurrencyCode': window.localStorage.getItem('crypto-currency-code'),
            'senderAddress': window.localStorage.getItem('sender-wallet-address'),
            'receiverAddress': window.localStorage.getItem('crypto-send-receiver-address'),
            'amount': window.localStorage.getItem('crypto-send-amount'),
            'currencyId': window.localStorage.getItem('crypto-send-currency-id'),
            'currencySymbol': window.localStorage.getItem('crypto-send-currency-symbol'),
            'networkFee': window.localStorage.getItem('crypto-send-network-fee'),
            'endUserId': window.localStorage.getItem('crypto-send-end-user-id'),
        },
        dataType: 'json',
        beforeSend: function(xhr)
        {
            xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
            xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
            var cryptoSendConfirmloadingText = (window.localStorage.getItem('language') == 'fr') ? 'Confirmation...' : 'Confirming...';
            showSpinnerWithButtonDisabled(".crypto-send-confirm", ".crypto-send-confirm-text", cryptoSendConfirmloadingText);
        },
    })
    .done(function(res)
    {
        // console.log(res); return;

        if (res.status == 200)
        {
            // console.log('200');
            window.localStorage.setItem('crypto-send-recommended-confirmations', res['recommended-confirmations']);
            window.location.href = $('.crypto-send-confirm').attr('data-redirect');
        }
        else
        {
            // Remove crypto local storage values - from client
            window.localStorage.removeItem('crypto-send-receiver-address');
            window.localStorage.removeItem('crypto-send-amount');
            window.localStorage.removeItem('crypto-send-currency-id');
            window.localStorage.removeItem('crypto-send-currency-symbol');
            window.localStorage.removeItem('crypto-send-end-user-id');
            window.localStorage.removeItem('crypto-send-network-fee');

            // console.log('401');
            hideSpinnerWithButtonEnabled(".crypto-send-confirm", ".crypto-send-confirm-text", cryptoSendConfirmFailText);
            if (res.reason == "crypto-send-insufficient-balance")
            {
                window.localStorage.setItem('crypto-send-insufficient-balance-error', res.reason);
                window.localStorage.setItem('crypto-send-insufficient-balance-error-message', res.message);
                window.location.replace('crypto-send.html');
            }
            else if (res.reason == "demo-site-error")
            {
                window.localStorage.setItem('crypto-send-demo-site-error', res.reason);
                window.localStorage.setItem('crypto-send-demo-site-error-message', (window.localStorage.getItem('language') == 'fr') ? 'Crypto Envoyer n\'est pas possible sur le site de démonstration.' : res.message);
                window.location.replace('crypto-send.html');
            }
            else if (res.reason == "withdrawal-error" || res.reason == "exception-error")
            {
                showErrorMessage(res.message);
                $(window).scrollTop(0);
                return false;
            }
        }
    })
    .fail(function(error)
    {
        hideSpinnerWithButtonEnabled(".crypto-send-confirm", ".crypto-send-confirm-text", cryptoSendConfirmFailText);
        error.responseText.hasOwnProperty('message') == true ? showErrorMessage(JSON.parse(error.responseText).message) : showErrorMessage(error.responseText);
        $(window).scrollTop(0);
        return false;
    });
}
/*
|--------------------------------------------------------------------------
| Crypto Send ends here
|--------------------------------------------------------------------------
 */


function recipientAddressQrCodeScanner(recipentAddressField)
{
    cordova.plugins.barcodeScanner.scan(function(result)
    {
     
        if (result.cancelled == true)
        {
            window.location.replace('crypto-send.html');
        }
        else
        {
            recipentAddressField.val(result.text);
        }
    },
    function(error)
    {
        // alert("Scanning failed: " + error);
        window.location.replace('crypto-send.html');
    },
    {
        preferFrontCamera: false, // iOS and Android
        showFlipCameraButton: false, // iOS and Android
        showTorchButton: false, // iOS and Android
        torchOn: false, // Android, launch with the torch switched on (if available)
        saveHistory: true, // Android, save scan history (default false)
        prompt: "Scan QR Code", // Android
        resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
        formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
        orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
        disableAnimations: true, // iOS
        disableSuccessBeep: true // iOS and Android
    });

}