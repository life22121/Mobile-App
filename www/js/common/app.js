var loader;
var navCount = 0;
var navStack = ['firstNavigationBlock']; //initialy dashboard is the main stack
var navTitleStack = ['Dashboard'];

var SITE_URL = 'https://paymoney.techvill.org/api/';

/**
 * Common Functions Starts
 */
//networkState
function networkState()
{
    return navigator.connection.type; //for device only - change this at the end of project
    // return navigator.onLine; //for browser only
}

function menuClickEvents()
{
    //Dashboard Menu Redirect
    $(document).on('click', '.dashboard', function()
    {
        window.location.replace('profile.html');
    });

    // Redirect Update user profile  Page
    $(document).on('click', '.editProfile', function()
    {
        if (networkState() != 'none')
        {
            onOnline();
            window.location.href = 'edit-profile.html';
        }
        else
        {
            onOffline();
            $(window).scrollTop(0);
            window.location.replace('profile.html');
        }
    });

    // Redirect To User Activity/Transactions Page
    $(document).on('click', '.userActivity', function()
    {
        if (networkState() != 'none')
        {
            onOnline();
            window.location.href = 'transaction.html';
        }
        else
        {
            onOffline();
            $(window).scrollTop(0);
            window.location.replace('profile.html');
        }
    });

    $(document).on('click', '.availableWallets', function()
    {
        if (networkState() != 'none')
        {
            onOnline();
            window.location.href = 'available-balance.html';
        }
        else
        {
            onOffline();
            $(window).scrollTop(0);
            window.location.replace('profile.html');
        }
    });

    // Redirect deposit Money Page
    $(document).on('click', '.depositMoney', function()
    {
        if (networkState() != "none")
        {
            onOnline();
            window.location.href = 'deposit-money.html';
        }
        else
        {
            onOffline();
            $(window).scrollTop(0);
            window.location.replace('profile.html');
        }
    });

    // Redirect Withdraw Money Page
    $(document).on('click', '.withdrawMoney', function()
    {
        if (networkState() != "none")
        {
            onOnline();
            window.location.href = 'withdraw-money.html';
        }
        else
        {
            onOffline();
            $(window).scrollTop(0);
            window.location.replace('profile.html');
        }
    });

    // Redirect Send money Page
    $(document).on('click', '.sendMoneyProfile', function()
    {
        if (networkState() != "none")
        {
            onOnline();
            window.location.href = 'send-money-email.html';
        }
        else
        {
            onOffline();
            $(window).scrollTop(0);
            window.location.replace('profile.html');
        }
    });

    // Redirect Request Money Page
    $(document).on('click', '.requestMoneyProfile', function()
    {
        if (networkState() != "none")
        {
            onOnline();
            window.location.href = 'request-money-email.html';
        }
        else
        {
            onOffline();
            $(window).scrollTop(0);
            window.location.replace('profile.html');
        }
    });

    // Redirect Exchange Money Page
    $(document).on('click', '.exchangeMoney', function()
    {
        if (networkState() != "none")
        {
            onOnline();
            window.location.href = 'exchange-money.html';
        }
        else
        {
            onOffline();
            $(window).scrollTop(0);
            window.location.replace('profile.html');
        }
    });

    // TODO: crypto wallets page
    // Redirect Crypto Wallets Page
    $(document).on('click', '.crypto-wallets', function()
    {
        if (networkState() != "none")
        {
            onOnline();
            window.location.href = 'crypto-wallets.html';
        }
        else
        {
            onOffline();
            $(window).scrollTop(0);
            window.location.replace('profile.html');
        }
    });

    // Redirect Change Password Page
    $(document).on('click', '.changePassword', function()
    {
        if (networkState() != "none")
        {
            onOnline();
            window.location.href = 'change-password.html';
        }
        else
        {
            onOffline();
            $(window).scrollTop(0);
            window.location.replace('profile.html');
        }
    });

    //logout
    $(document).on('click', '.logout', function(e)
    {
        if (networkState() != "none")
        {
            onOnline();

            //removing all local storage values except language value
            var language = localStorage.getItem('language');
            localStorage.clear(); // clearing all except language value
            localStorage.setItem('language', language); // language not cleared from local storage
            localStorage.setItem('successMessage', (window.localStorage.getItem('language') == 'fr') ? 'Vous vous êtes déconnecté avec succès!' : "You have successfully logged out!"); //setting logut success message
            var redirect = $(this).attr('data-redirect');
            if (redirect != '') window.location.replace(redirect);
        }
        else
        {
            onOffline();
            $(window).scrollTop(0);
            window.location.replace('profile.html');
        }
    });
}

function performNavTitleStack()
{
    // console.log('7');
    var availableWalletsPageHeaderText = '';
    var cryptoWalletsHeaderText = '';
    var sendMoneyPageHeaderText = '';
    var requestMoneyPageHeaderText = '';
    var payoutMoneyPageHeaderText = '';
    var depositMoneyPageHeaderText = '';
    var exchangePageHeaderText = '';
    var updateProfilePageHeaderText = '';

    if (window.localStorage.getItem('language') == 'fr')
    {
        availableWalletsPageHeaderText = "Portefeuilles";
        cryptoWalletsHeaderText = "Crypto Portefeuilles";
        sendMoneyPageHeaderText = "Envoyer de l'argent";
        requestMoneyPageHeaderText = "Demande de l'argent";
        payoutMoneyPageHeaderText = "Paiement";
        depositMoneyPageHeaderText = "Dépôt";
        exchangePageHeaderText = "Échange";
        updateProfilePageHeaderText = "Mettre à jour le profil";
    }
    else
    {
        availableWalletsPageHeaderText = "Wallets";
        cryptoWalletsHeaderText = "Crypto Wallets";
        sendMoneyPageHeaderText = "Send Money";
        requestMoneyPageHeaderText = "Request Money";
        payoutMoneyPageHeaderText = "Payout";
        depositMoneyPageHeaderText = "Deposit";
        exchangePageHeaderText = "Exchange";
        updateProfilePageHeaderText = "Update Profile";
    }

    var href = document.location.href;
    var lastPathSegment = href.substr(href.lastIndexOf('/') + 1);
    if (lastPathSegment == "available-balance.html")
    {
        navTitleStack.push(availableWalletsPageHeaderText);
        navStack.push("availableBalanceBlock");
    }
    else if (lastPathSegment == "crypto-wallets.html")
    {
        navTitleStack.push(cryptoWalletsHeaderText);
        navStack.push("cryptoWalletsBlock");
    }
    else if (lastPathSegment == "crypto-send.html")
    {
        // custom added
        navStack = ['sendCryptoNavigationBlock'];
        navStack.push("crypto-send-receiver-address-amount-section");
    }
    else if (lastPathSegment == "send-money-email.html")
    {
        navTitleStack.push(sendMoneyPageHeaderText);
        navStack.push("sendMoneyBlock");
    }
    else if (lastPathSegment == "request-money-email.html")
    {
        navTitleStack.push(requestMoneyPageHeaderText);
        navStack.push("requestMoneyBlock");
    }
    else if (lastPathSegment == "withdraw-money.html")
    {
        navTitleStack.push(payoutMoneyPageHeaderText);
        navStack.push("withdrawMoneyBlock");
    }
    else if (lastPathSegment == "deposit-money.html")
    {
        navTitleStack.push(depositMoneyPageHeaderText);
        navStack.push("depositMoneyBlock");
    }
    else if (lastPathSegment == "exchange-money.html")
    {
        navTitleStack.push(exchangePageHeaderText);
        navStack.push("exchangeMoneyBlock");
    }
    else if (lastPathSegment == "edit-profile.html")
    {
        navTitleStack.push(updateProfilePageHeaderText);
        navStack.push("updateProfileBlock");
    }
}

//onOnline
function onOnline()
{
    $('#NoInternetDiv').hide();
}

//onOffline
function onOffline()
{
    $('#NoInternetDiv').show();
    $('#NoInternetDiv span').css({
       'color' : 'darkred',
       'font-size' : '24px',
       'font-weight' : '800',
       'padding-top' : '5px',
    });
    $('#NoInternetDiv span').text((window.localStorage.getItem('language') == 'fr') ? 'Pas de connexion Internet!' : 'No Internet Connection!');
}

function userIsSuspended()
{
    $('.userSuspendedDiv').show();
    $('.showUserSuspendedError').text((window.localStorage.getItem('language') == 'fr') ? 'Vous êtes suspendu pour faire tout type de transaction!' : 'You are suspended to do any kind of transaction!');
}

function checkCryptoCurrencyStatus(currCode)
{
    $('.crypto-currency-status-div').show();
    $('.crypto-currency-status-error').text((window.localStorage.getItem('language') == 'fr') ? `${currCode} est inactif!` : `${currCode} is Inactive!`);
}

function showEnabledCurrenciesPreferenceDiv(message)
{
    $('.enabled-currencies-preference-div').show();
    $('.enabled-currencies-preference-error').text((window.localStorage.getItem('language') == 'fr') ? `L'administrateur système a désactivé la crypto-monnaie!` : message);
}

//showUserName
function showUserName()
{
    // console.log('1');
    var checkUserName = window.localStorage.getItem('username');
    if (checkUserName != '')
    {
        $(".username").text(checkUserName);
    }
}

//showUserPicture
function showUserPicture()
{
    // console.log('2');
    var src;
    var userPicture = window.localStorage.getItem('picture');
    if (userPicture == '')
    {
        src = SITE_URL.replace('api/', '') + 'public/user_dashboard/images/avatar.jpg';
        $('.image_src').attr('src', src);
    }
    else
    {
        src = SITE_URL.replace('api/', '') + 'public/user_dashboard/profile/' + userPicture;
        $('.image_src').attr('src', src);
    }
}

//show user's email & phone
function showUserEmailPhone()
{
    $(".userEmail").text(window.localStorage.getItem('email'));
    if (window.localStorage.getItem('formattedPhone') != null)
    {
        $(".userPhone").text(window.localStorage.getItem('formattedPhone'));
    }
    else
    {
        $(".userPhone").text('');
    }
}

//success on click
function success()
{
    window.location.href = 'profile.html';
}

//URL function
function request_url(val)
{
    return SITE_URL + val;
}

//getPreferenceSettingsFromApi
function getPreferenceSettingsFromApi()
{
    // console.log('4');
    var promiseObj = new Promise(function(resolve, reject)
    {
        $.ajax(
        {
            url: request_url('get-preference-settings'),
            type: "GET",
            data:
            {},
            dataType: 'json',
        }).done(function(response)
        {
            if (response.status == 200)
            {
                localStorage.setItem('thousand_separator', response.thousand_separator);
                localStorage.setItem('decimal_format_amount', response.decimal_format_amount);
                localStorage.setItem('money_format', response.money_format);
                resolve();
            }
        }).fail(function(error)
        {
            console.log(error);
            reject();
        });
    });
    return promiseObj;
}

function log(log)
{
    console.log(log);
}

function menuEvents()
{
    // console.log('3');
    var promiseObj = new Promise(function(resolve, reject)
    {
        $('.dashboard span').text((window.localStorage.getItem('language') == 'fr') ? 'Tableau de bord' : 'Dashboard');
        $('.editProfile span').text((window.localStorage.getItem('language') == 'fr') ? 'Mon profil' : 'My Profile');
        $('.userActivity span').text((window.localStorage.getItem('language') == 'fr') ? 'Mon activité' : 'My Activity');
        $('.availableWallets span').text((window.localStorage.getItem('language') == 'fr') ? 'Mon Portefeuilles' : 'My Wallets');
        $('.depositMoney span').text((window.localStorage.getItem('language') == 'fr') ? 'Dépôt' : 'Deposit');
        $('.withdrawMoney span').text((window.localStorage.getItem('language') == 'fr') ? 'Paiement' : 'Payout');
        $('.sendMoneyProfile span').text((window.localStorage.getItem('language') == 'fr') ? 'Envoyer de l\'argent' : 'Send Money');
        $('.requestMoneyProfile span').text((window.localStorage.getItem('language') == 'fr') ? 'Demande de l\'argent' : 'Request Money');
        $('.exchangeMoney span').text((window.localStorage.getItem('language') == 'fr') ? 'Échange' : 'Exchange');
        $('.changePassword span').text((window.localStorage.getItem('language') == 'fr') ? 'Changer le mot de passe' : 'Change Password');
        $('.logout span').text((window.localStorage.getItem('language') == 'fr') ? 'Connectez - Out' : 'Logout');
        resolve();
    });
    return promiseObj;
}

function ifNotInDepositPagesCleanDepositLocalStorage()
{
    // console.log('8');
    var pageUrl = document.URL.split('www/').pop().slice(0, -5);
    var depostPageArrays = ['deposit-money', 'deposit-money-success', 'deposit-money-confirm-stripe', 'deposit-money-confirm-paypal', 'deposit-money-confirm-bank'];
    // console.log(depostPageArrays.includes(pageUrl));
    if (!depostPageArrays.includes(pageUrl))
    {
        //clear local storage
        window.localStorage.removeItem('depositAmount');
        window.localStorage.removeItem('depositFees');
        window.localStorage.removeItem('depositCurrencyId');
        window.localStorage.removeItem('depositCurrencySymbol');
        window.localStorage.removeItem('depositCurrencyCode');
        window.localStorage.removeItem('deposit_payment_id');
        window.localStorage.removeItem('deposit_payment_name');
        window.localStorage.removeItem('totalAmount');
        window.localStorage.removeItem('depositAmount');
        window.localStorage.removeItem('depositAmount');
        window.localStorage.removeItem('clientID');
    }
}

function initPullToRefresh()
{
    // console.log('5');
    PullToRefresh.init({
        mainElement: '.page_content',
        distThreshold: 110,
        distMax: 140,
        distReload: 110,
        triggerElement: '.ui-panel-wrapper',
        instructionsPullToRefresh:  (window.localStorage.getItem('language') == 'fr') ? 'Tirez pour rafraîchir' : 'Pull down to refresh',
        instructionsReleaseToRefresh: (window.localStorage.getItem('language') == 'fr') ? 'Relâcher pour rafraîchir' : 'Release to refresh',
        instructionsRefreshing: (window.localStorage.getItem('language') == 'fr') ? 'Rafraîchissant...' : 'Refreshing...',
        onRefresh: function(){
            return new Promise(function (resolve) {
                window.location.reload();
                resolve();
            });
        }
    });
}

function checkUserStatus()
{
    if (window.localStorage.getItem('user_id') != null)
    {
        var promiseObj = new Promise(function(resolve, reject)
        {
            $.ajax(
            {
                url: request_url('check-user-status'),
                type: "GET",
                data:
                {
                    'user_id': window.localStorage.getItem('user_id'),
                },
                dataType: 'json',
            })
            .done(function(res)
            {
                // console.log(res);
                // return 0;

                if (res.status == 200)
                {
                    //set user status on local storage to check status on window load
                    window.localStorage.setItem('user-status', res['user-status']);

                    resolve(res['user-status']);
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
}

//app on load
$(window).on('load', function()
{
    if (networkState() == "none")
    {
        onOffline();
    }
    else
    {
        onOnline();

        // console.log('app.js loaded')

        if (window.localStorage.getItem('user_id') != null)
        {
            // below functions will execute after load is fired - if user is logged in
            checkUserStatus()
            .then((res) =>
            {
                // console.log(res);
                if (res != 'Inactive')
                {
                    $("#menuItem").load("menu.html", function()
                    {
                        showUserName();
                        showUserPicture();
                        menuEvents()
                        .then(() =>
                        {
                            getPreferenceSettingsFromApi()
                            .then(() =>
                            {
                                initPullToRefresh();
                                menuClickEvents();
                                performNavTitleStack();
                                ifNotInDepositPagesCleanDepositLocalStorage();
                            })
                            .catch(error => {
                                console.log(error);
                            });
                        })
                        .catch(error => {
                            console.log(error);
                        });
                    });
                }
                else
                {
                    //get language for login page
                    var language = window.localStorage.getItem('language');

                    //clear all except language value
                    window.localStorage.clear();

                    //set language for login page
                    window.localStorage.setItem('language', language);

                    //set user inactive message
                    window.localStorage.setItem('user-inactive-message', (window.localStorage.getItem('language') == 'fr') ? 'Votre compte est inactif. Veuillez réessayer plus tard!' : 'Your account is inactivated. Please try again later!');
                    window.location.replace('login.html');
                }
            })
            .catch(error => {
                console.log(error);
            });
        }
    }
});

//app on deviceready
// var mainApp =
// {
//     initialize: function()
//     {
//         document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
//     },
//     onDeviceReady: function()
//     {
//         this.receivedEvent('deviceready');
//     },
//     receivedEvent: function()
//     {}
// };
// mainApp.initialize();

/**
 * Common Functions Ends
 */

/*Promise Call - Sample below/*
/**
    var promiseObj = new Promise(function(resolve, reject)
    {
    });
    resolve();
    reject();
    return promiseObj;
**/

/*Device Ready - Sample below/*
/**
var app =
{
    initialize: function()
    {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function()
    {
        this.receivedEvent('deviceready');
    },
    receivedEvent: function()
    {}
};
app.initialize();
**/