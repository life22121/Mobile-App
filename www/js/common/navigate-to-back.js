//Navigate Back
function backNavigateTo(e)
{
    navStack.pop();
    navTitleStack.pop();
    navCount -= 1;
    var to = navStack[navStack.length - 1];
    var title = navTitleStack[navTitleStack.length - 1];
    // console.log(to + '\n')
    // return;

    //
    if (to == 'firstNavigationBlock')
    {
        window.location.replace('profile.html');
    }
    else if (to == 'sendCryptoNavigationBlock')
    {
        window.location.replace('crypto-wallets.html');
    }
    else if (to == 'crypto-send-receiver-address-amount-section')
    {
        // Disable spinner in crypto send first section
        $(".spinner").hide();
        $(".crypto-send-review-text").text((window.localStorage.getItem('language') == 'fr') ? 'Prochain' : 'Next');
        $(".crypto-send-review").removeAttr("disabled");
    }
    //

    $('.ui-content').hide();
    $('#' + to).fadeIn('slow', function()
    {
        $(this).removeClass('animate-center-to-left');
        $(this).removeClass('animate-right-to-center');
        // $(this).addClass("animate-left-to-center");
    });
    $('.nav_center_logo .p-title h2').html(title);
}