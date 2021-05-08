/*
|--------------------------------------------------------------------------
| Deposit Money starts here
|--------------------------------------------------------------------------
 */
// Deposit - Get Currency List
function getDepositCurrencyList()
{
    var promiseObj = new Promise(function(resolve, reject)
    {
        $.ajax(
        {
            url: request_url('get-deposit-currency-list'),
            type: "GET",
            data:
            {
                'user_id': window.localStorage.getItem('user_id'),
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
            // console.log(data.success);
            if (data.success.status == 200)
            {
                var defaultWalletCurrencyId = data.success.defaultWalletCurrencyId;//
                var datas = data.success.currencies;
                var output = '';
                if (window.localStorage.getItem('depositCurrencyId') != null)
                {
                    $.map(datas, function(value, index)
                    {
                        output += `<option value="${index}" ${window.localStorage.getItem('depositCurrencyId') == value.id ? "selected='selected'" : ""}>${value.code}</option>`;//
                    });
                }
                else
                {
                    $.map(datas, function(value, index)
                    {
                        output += `<option value="${index}" ${defaultWalletCurrencyId == value.id ? 'selected="selected"': ''}>${value.code}</option>`;//
                    });
                }
                $('#depositCurrency').html(output);
                let depositCurrency = $("#depositCurrency option:selected").text();//
                $('#depositCurrency-button span').text(depositCurrency);//

                let depositCurrencyVal = $("#depositCurrency option:selected").val();//
                resolve(depositCurrencyVal);
            }
        })
        .fail(function(error)
        {
            reject(error);
            console.log(error);
        });
    });
    return promiseObj;
}

// Deposit - Get Payment Method Based on Currency
function getMatchedFeesLimitsCurrencyPaymentMethodsSettingsPaymentMethods(currency_id)
{
    getPaymentMethodsOfSelectedCurrency(currency_id,null);
}

// Deposit - Get Payment Method Based on Currency - on load based on selected
function onLoadGetPaymentMethod(currency_id, previous_selected_method)
{
    getPaymentMethodsOfSelectedCurrency(currency_id, previous_selected_method);
}

function getPaymentMethodsOfSelectedCurrency(currency_id, previous_selected_method)
{
    var promiseObj = new Promise(function(resolve, reject)
    {
        $.ajax(
        {
            url: request_url('fees-limit-currency-payment-methods-is-active-payment-methods-list'),
            type: "POST",
            data:
            {
                'transaction_type_id': 1,
                'currency_id': currency_id,
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
                $('.loader').css('display', 'none'); //hide loader
                let options = '';
                if (previous_selected_method != null)
                {
                    $.map(data.success.paymentMethods, function(value, index)
                    {
                        if (value.name == 'Bank' || value.name == 'Stripe' || value.name == 'Paypal')
                        {
                            options += `<option value="${value.id}" data-paymentMethodId=${value.id} ${previous_selected_method == value.id ? "selected='selected'" : ""}>${value.name}</option>`;
                        }
                    });
                }
                else
                {
                    $.map(data.success.paymentMethods, function(value, index)
                    {
                        if (value.name == 'Bank' || value.name == 'Stripe' || value.name == 'Paypal')
                        {
                            options += `<option value="${value.id}" data-paymentMethodId=${value.id}>${value.name}</option>`;
                        }
                    });
                }
                if (data.success.paymentMethods != '')
                {
                    $('#paymentMethod').html(options);
                    $('#paymentMethodEmpty').hide();
                    $('#paymentMethodCustomDiv').show();
                    $('#nextButtonCustomDiv').show();
                    let paymentMethod = $("#paymentMethod option:selected").text();//
                    $('#paymentMethod-button span').text(paymentMethod);//
                }
                else
                {
                    if (currency_id == '')
                    {
                        $('#paymentMethodEmpty').hide();
                        $('#paymentMethodCustomDiv').show();
                        $('#nextButtonCustomDiv').show();
                    }
                    else
                    {
                        $('#paymentMethodEmpty').show();
                        $('#paymentMethodCustomDiv').hide();
                        $('#nextButtonCustomDiv').hide();
                    }
                    $('#paymentMethod').html('');
                }
                resolve();
            }
        })
        .fail(function(error)
        {
            reject(error);
            console.log(error);
        });
    });
    return promiseObj;
}

// Deposit - Review
function depositMoneyReview(paymentMethodId, element)
{
    $.ajax(
    {
        url: request_url('get-deposit-details-with-amount-limit-check'),
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
            localStorage.setItem('depositAmount', data.success.amount);
            localStorage.setItem('depositFees', data.success.totalFees);
            localStorage.setItem('depositCurrencyId', data.success.currency_id);
            localStorage.setItem('depositCurrencySymbol', data.success.currSymbol);
            localStorage.setItem('depositCurrencyCode', data.success.currCode);
            localStorage.setItem('deposit_payment_id', paymentMethodId);
            localStorage.setItem('deposit_payment_name', data.success.paymentMethodName);
            localStorage.setItem('totalAmount', data.success.totalAmount);
            //check if the payment is bank
            if (paymentMethodId == 6)
            {
                window.location.href = "deposit-money-confirm-bank.html";
            }
            //check if the payment is stripe
            else if (paymentMethodId == 2)
            {
                window.location.href = "deposit-money-confirm-stripe.html";
            }
            //check if the payment is paypal
            else if (paymentMethodId == 3)
            {
                //load paypal method data for next page
                var method_id = window.localStorage.getItem('deposit_payment_id');
                var currency_id = window.localStorage.getItem('depositCurrencyId');
                $.ajax(
                {
                    url: request_url('deposit/get-paypal-info'),
                    type: "post",
                    dataType: 'json',
                    data:
                    {
                        'currency_id': currency_id,
                        'method_id': method_id, //Paypal
                    },
                    beforeSend: function(xhr)
                    {
                        xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET');
                        xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
                    },
                }).done(function(data)
                {
                    if (data.success.status == 200)
                    {
                        function myCallbackFunction(clientID, callback)
                        {
                            localStorage.setItem('clientID', clientID);
                            callback();
                        }
                        myCallbackFunction(data.success.method_info.client_id, function func()
                        {
                            window.location.href = "deposit-money-confirm-paypal.html";
                        })
                    }
                    else
                    {
                        console.log(data.success.message);
                        return false;
                    }
                }).fail(function(error)
                {
                    console.log(error);
                });
            }
        }
        else
        {
            let errorMessage = '';
            if (data.success.reason == "minLimit")
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

// Deposit - Get Bank List
function getDepositBankList()
{
    var currency_id = window.localStorage.getItem('depositCurrencyId');
    $.ajax(
    {
        url: request_url('get-deposit-bank-list'),
        type: "GET",
        data:
        {
            'currency_id': currency_id,
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
            var datas = data.success.banks;
            var output = "";
            $.map(datas, function(value, index)
            {
                var isSelected = '';
                if(value.is_default == "Yes") {
                    isSelected = "selected";
                }
                output += `<option value="${value.id}" ${isSelected}>${value.bank_name}</option>`;
            });
            $('#bank').html(output);


            var bankSelected = $('option:selected','#bank').html();
            $('#bank-button span').text(bankSelected);

            getBankDetails();
        }
    }).fail(function(error)
    {
        console.log(error);
    });
}

//Get Selected Bank Details
function getBankDetails()
{
    var bank = $('#bank').val();
    if (bank)
    {
        $.ajax(
        {
            url: request_url('deposit/get-bank-detail'),
            type: "POST",
            data:
            {
                'bank': bank,
            },
            dataType: 'json',
            beforeSend: function(xhr)
            {
                xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
                xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
            },
        }).done(function(response)
        {
            /* log(response); */
            if (response.success.status == 200)
            {
                $('#account_name').html(response.success.bank.account_name);
                $('#account_number').html(response.success.bank.account_number);
                $('#bank_name').html(response.success.bank.bank_name);

                if (response.success.bank_logo) {
                    $("#bank_logo").html(`<img class="" src="${SITE_URL.replace('api/','')}/public/uploads/files/bank_logos/${response.success.bank_logo}" class="img-responsive" style="max-width: 130px; margin:auto" />`);
                } else {
                    $("#bank_logo").html(`<img class="" src="${SITE_URL.replace('api/','')}/public/images/payment_gateway/bank.jpg" class="img-responsive" style="max-width: 130px; margin:auto" />`);
                }
            }
            else
            {
                $('#account_name').html('');
                $('#account_number').html('');
                $('#bank_name').html('');
                $("#bank_logo").html(`<img class="" src="${SITE_URL.replace('api/','')}/public/images/payment_gateway/bank.jpg" class="img-responsive" style="max-width: 130px; margin:auto" />`);
            }
        });
    }
}

// Deposit Bank - Success
function depositMoneyPayBank()
{
    var bank_id = $('#bank').val();
    var file = $('#my_file').prop('files')[0];
    var form_data = new FormData();
    form_data.append('_token', localStorage.getItem('token'));
    form_data.append('user_id', localStorage.getItem('user_id'));
    form_data.append('amount', localStorage.getItem('depositAmount'));
    form_data.append('totalFees', localStorage.getItem('depositFees'));
    form_data.append('currency_id', localStorage.getItem('depositCurrencyId'));
    form_data.append('deposit_payment_id', localStorage.getItem('deposit_payment_id'));
    form_data.append('deposit_payment_name', localStorage.getItem('deposit_payment_name'));
    form_data.append('bank_id', bank_id);
    form_data.append('file', file);
    $.ajax(
    {
        url: request_url($('#depositMoneyConfirmBankForm').attr('action')), //deposit/bank-payment-store
        type: "post",
        cache: false,
        dataType: 'json',
        contentType: false,
        processData: false,
        data: form_data,
        beforeSend: function(xhr)
        {
            xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
            xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
            $('.pageDiv').css('display', 'none'); //fixed
            $('.loader').css('display', 'block'); //show loader
        },
    }).done(function(data)
    {
        $('.loader').css('display', 'none'); //hide loader
        if (data.success.status == 200)
        {
            window.location.href = 'deposit-money-success.html';
        }
        else
        {
            console.log(data.success.message);
            return false;
        }
    }).fail(function(error)
    {
        console.log(error);
    });
}

function backToDeposit()
{
    // cleanLocalStorage();
    window.location.href = "deposit-money.html";
}

function cleanDepositLocalStorage()
{
    //clear local storage
    localStorage.removeItem('depositAmount');
    localStorage.removeItem('depositFees');
    localStorage.removeItem('depositCurrencyId');
    localStorage.removeItem('depositCurrencySymbol');
    localStorage.removeItem('depositCurrencyCode');
    localStorage.removeItem('deposit_payment_id');
    localStorage.removeItem('deposit_payment_name');
    localStorage.removeItem('totalAmount');
    localStorage.removeItem('depositAmount');
    localStorage.removeItem('depositAmount');
    localStorage.removeItem('clientID');
}
/*
|--------------------------------------------------------------------------
| Deposit Money ends here
|--------------------------------------------------------------------------
 */