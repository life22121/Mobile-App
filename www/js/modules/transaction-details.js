//Capitalize First Character of a string
function capitalizeFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//Window Size detection
function windowSize()
{
    let size = $(window).width();
    let accept = $('.accept').attr('data-role');
    let cancel = $('.cancel').attr('data-role');
    if (size <= 280)
    {
        if (accept == 'accept' && cancel == 'cancel')
        {
            $('.acceptrequest').css(
            {
                'width': '21%',
                'float': 'left'
            });
            $('.cancelrequest').css(
            {
                'width': '21%',
                'float': 'right'
            });
        }
        else
        {
            $('.acceptrequest').css(
            {
                'width': '72%'
            });
            $('.cancelrequest').css(
            {
                'width': '72%'
            });
        }
    }
    else if (size > 285 && size < 320)
    {
        if (accept == 'accept' && cancel == 'cancel')
        {
            $('.acceptrequest').css(
            {
                'width': '22%',
                'float': 'left'
            });
            $('.cancelrequest').css(
            {
                'width': '22%',
                'float': 'right'
            });
        }
        else
        {
            $('.acceptrequest').css(
            {
                'width': '72%'
            });
            $('.cancelrequest').css(
            {
                'width': '72%'
            });
        }
    }
    else if (size > 280 && size < 286)
    {
        if (accept == 'accept' && cancel == 'cancel')
        {
            $('.acceptrequest').css(
            {
                'width': '20%',
                'float': 'left'
            });
            $('.cancelrequest').css(
            {
                'width': '20%',
                'float': 'right'
            });
        }
        else
        {
            $('.acceptrequest').css(
            {
                'width': '72%'
            });
            $('.cancelrequest').css(
            {
                'width': '72%'
            });
        }
    }
    else
    {
        if (accept == 'accept' && cancel == 'cancel')
        {
            $('.acceptrequest').css(
            {
                'width': '25%',
                'float': 'left'
            });
            $('.cancelrequest').css(
            {
                'width': '25%',
                'float': 'right'
            });
        }
        else
        {
            $('.acceptrequest').css(
            {
                'width': '75%'
            });
            $('.cancelrequest').css(
            {
                'width': '75%'
            });
        }
    }
}

// Transaction Details
function transactionDetails(td)
{
    $.ajax(
    {
        url: request_url('transaction-details'),
        type: "GET",
        data:
        {
            'tr_id': localStorage.getItem('tr_id'),
            'user_id': localStorage.getItem('user_id')
        },
        dataType: 'json',
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET');
            xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
            $('.loader').css('display', 'block'); //show loader
        },
    })
    .done(function(data)
    {
        $('.loader').css('display', 'none'); //hide loader
        $('.profileDiv').css('display', 'block'); //show page
        td(data);
    })
    .fail(function(error)
    {
        console.log(error);
    });
}

function acceptrequest()
{
    let tr_ref_id = $('.accept').attr('data-id');
    let tr_email_or_phone = $('.tr_email_or_phone').text();
    let action = $('.acceptrequest').attr('action');

    //Setting values to local storage - especially for accept request payment - starts
    localStorage.setItem('tr_ref_id', tr_ref_id);
    localStorage.setItem('tr_email_or_phone', tr_email_or_phone); //needed for mail or sms sent based on request via
    localStorage.setItem('accept-request-action', action);
    //Setting values to local storage - especially for accept request payment - ends

    window.location.href = 'accept-money-email.html';
}

function cancelrequest()
{
    // let tr_email_or_phone = $('.tr_email_or_phone').text();
    // console.log(tr_email_or_phone);
    // return false;

    $.ajax(
    {
        url: request_url($('.cancelrequest').attr('action')), //cancel-accept-request
        type: "post",
        data:
        {
            '_token': localStorage.getItem('token'),
            'tr_id': $('.cancelrequest').attr('data-id'),
            'user_id': localStorage.getItem('user_id'),
            'tr_email_or_phone': $('.tr_email_or_phone').text()
        },
        dataType: 'json',
        beforeSend: function(xhr)
        {
            xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
            xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
            $('.acceptrequest').hide();
            let canecelRequestPaymentPayLoaderText = (window.localStorage.getItem('language') == 'fr') ? 'Annuler ...' : 'Cancelling...';
            showSpinnerWithButtonDisabled(".cancelrequest", "#cancelrequestText", canecelRequestPaymentPayLoaderText);
        },
    })
    .done(function(response)
    {
        if (response.status == 200)
        {
            hideSpinnerWithButtonEnabled(".cancelrequest", "#cancelrequestText", 'Cancelled');
            setTimeout(function() {
                $(".cancelrequest").fadeOut('fast');
            }, 1000);
        }
        else
        {
            console.log(response.message);
            return false;
        }
    })
    .fail(function(error)
    {
        console.log(error);
    });
}

function checkTransactionReqCreatorStatus(transaction_id)
{
    var promiseObj = new Promise(function(resolve, reject)
    {
        $.ajax(
        {
            url: request_url('transaction-details/request-payment/check-creator-status'),
            type: "GET",
            data:
            {
                'trans_id': transaction_id,
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
            if (res.success.status == 200)
            {
                resolve(res.success['transaction-user-status']);
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
