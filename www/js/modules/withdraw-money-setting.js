const noRecordFoundText = (window.localStorage.getItem('language') == 'fr') ? 'Aucun Enregistrement Trouvé!' : 'No Record Found!';

function checkPayoutSettings() {
    var promiseObj = new Promise(function (resolve, reject) {
        $.ajax({
                url: request_url('check-payout-settings'),
                type: "GET",
                data: {
                    'user_id': window.localStorage.getItem('user_id'),
                },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET');
                    xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
                },
            })
            .done((res) => {
                if (res.status == 200) {
                    if (res.payoutSettings <= 0) {
                        swal({
                            title: `${(window.localStorage.getItem('language') == 'fr') ? 'Erreur!' : 'Error!'}`,
                            text: `${(window.localStorage.getItem('language') == 'fr') ? 'Aucun paramètre de paiement existe!' : 'No Payout Setting Exists!'}`,
                            type: "error"
                        }, function () {
                            window.location.replace('withdraw-money.html');
                        });
                        event.preventDefault();
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                }
            })
            .fail((error) => {
                reject();
                console.log(error);
            });
    });
    return promiseObj;
}

function availablePayoutSetting() {
    $.ajax({
            url: request_url('payout-setting'),
            type: 'GET',
            data: {
                'user_id': window.localStorage.getItem('user_id')
            },
            dataType: 'json',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET');
                xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
                $('.loader').css('display', 'block'); //show loader
            },
        })
        .done(function (data) {
            $('.loader').css('display', 'none'); //hide loader
            $('#ptr').css('display', 'block'); //show page

            //show users available wallet balances - starts
            let datas = data.payoutSettings;
            let paypal = '';
            let bank = '';
            let mobile = '';
            $.each(datas, function (index, data) {

                if (data.payment_method.id == 3) // Paypal
                {
                    paypal += `
                    <tr id="ps-${data.id}">
                        <td>
                            <h2 style="color:#0069a6;" class="transaction_row"> ${data.payment_method.name} 
                                <span style="float: right; color: blue; ">
                                    <i class="fa fa-edit fa-lg edit-payout-setting"></i>
                                </span>
                            </h2>
                            <h4 style="color:#0069a6;" class="transaction_row"> ${data.email} 
                                <span style="float: right; color: red">
                                    <i class="fa fa-trash fa-2x delete-payout-setting"></i>
                                </span>
                            </h4>
                        </td>
                    </tr>
                `;
                } else if (data.payment_method.id == 6) // Bank
                {
                    bank += `
                    <tr id="ps-${data.id}">
                        <td>
                            <h2 style="color:#0069a6;" class="transaction_row"> ${data.account_name}
                                <span style="float: right; color: blue; ">
                                    <i class="fa fa-edit fa-lg edit-payout-setting"></i>
                                </span>
                            </h2>
                            <h4 style="color:#0069a6;" class="transaction_row"> ${data.account_number}
                                <span style="float: right; color: red">
                                    <i class="fa fa-trash fa-2x delete-payout-setting"></i>
                                </span>
                            </h4>
                            
                        </td>
                    </tr>
                `;
                } 
            });
            if (bank == '') {
                $('.bank tbody').html(`<h4 style="text-align:center;font-size:12px;"> ${noRecordFoundText} </h4>`);
            }
            if (bank != '') {
                $('.bank tbody').html(bank);
            }
            if (paypal == '') {
                $('.paypal tbody').html(`<h4 style="text-align:center;font-size:12px;"> ${noRecordFoundText} </h4>`);
            }
            if (paypal != '') {
                $('.paypal tbody').html(paypal);
            }
            
            //show users available wallet balances - ends
        })
        .fail(function (error) {
            console.log(error.responseText);
            return false;
        });
}

$(document).on('click', '.delete-payout-setting', function () {
    var payout_setting_id = $(this).parents('tr').attr('id');
    payout_setting_id = payout_setting_id.substr(3);

    payout_setting_id = parseFloat(payout_setting_id);
    swal({
        title: `${(window.localStorage.getItem('language') == 'fr') ? 'Êtes-vous sûr?' : 'Are you sure?'}`,
        icon: "warning",
        type: "warning",
        buttons: true,
        dangerMode: true,
        showCancelButton: true,
        confirmButtonText: `${(window.localStorage.getItem('language') == 'fr') ? 'Oui' : 'Yes'}`,
        cancelButtonText: `${(window.localStorage.getItem('language') == 'fr') ? 'Non' : 'No'}`,
    }, function (isConfirm) {
        if (isConfirm) {
            deletePayoutSetting(payout_setting_id);
        } else {
            // var errorMessage = (window.localStorage.getItem('language') == 'fr') ? "Payout Setting not deleted!" : "Payout Setting not deleted!";
            // showErrorMessage(errorMessage);
            $(window).scrollTop(0);
        }
    });

});

function deletePayoutSetting(payout_setting_id) {
    $.ajax({
            url: request_url('delete-payout-setting'),
            type: "POST",
            data: {
                'payout_setting_id': payout_setting_id,
                'user_id': window.localStorage.getItem('user_id')
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
                xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
            },
        })
        .done((res) => {
            if (res.success.status == 200) {
                var successMesage = (window.localStorage.getItem('language') == 'fr') ? "Le paramètre de paiement a bien été supprimé!" : res.success.message;
                $(".delete-payout-setting").parents("#ps-" + payout_setting_id).fadeOut(2000, function () {
                    $(this).remove();
                });
                showSuccessMessage(successMesage);
                $(window).scrollTop(0);
                return false;
            } else if (res.success.status == 403) {
                var errorMessage = (window.localStorage.getItem('language') == 'fr') ? "Le paramètre de paiement a bien été supprimé!" : res.success.message;
                showErrorMessage(errorMessage);
                $(window).scrollTop(0);
                return false;
            } else {
                var errorMessage = (window.localStorage.getItem('language') == 'fr') ? "Unexpected Error Occured!" : "Unexpected Error Occured!";
                showErrorMessage(errorMessage);
                $(window).scrollTop(0);
                return false;
            }
        })
        .fail((error) => {
            console.log(error);
        });

}
$(document).on('click', '.edit-payout-setting', function () {
    var payout_setting_id = $(this).parents('tr').attr('id');
    payout_setting_id = parseFloat(payout_setting_id.substr(3));
    checkSpecificPayoutSetting(payout_setting_id).then(function () {
        window.localStorage.setItem('payout_setting_id', payout_setting_id);
    });

});

function checkSpecificPayoutSetting(payout_setting_id) {
    var promiseObj = new Promise(function (resolve, reject) {
        $.ajax({
                url: request_url('payout-setting'),
                type: "GET",
                data: {
                    'user_id': window.localStorage.getItem('user_id'),
                    'payout_setting_id': payout_setting_id,
                },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET');
                    xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
                },
            })
            .done((data) => {

                if (data.success.status == 200) {
                    if (data.payoutSettings <= 0) {
                        showErrorMessage(noRecordFoundText);
                        $(window).scrollTop(0);
                        resolve(false);
                    } else {
                        window.location.href = "withdraw-money-setting-edit.html";
                        resolve(true);
                    }
                } else {
                    var errorMessage = (window.localStorage.getItem('language') == 'fr') ? "Une erreur inattendue s'est produite!" : 'Unexpected Error Occured!';
                    showErrorMessage(errorMessage);
                    $(window).scrollTop(0);
                    resolve(false);
                }
            })
            .fail((error) => {
                reject();
                console.log(error);
            });
    });
    return promiseObj;
}
// output += `<div><p> ${data.email} </p><span><i class="fa fa-edit"></i>Edit</span><span class="payout-setting" data-payout-setting-id="${data.id}">&nbsp;&nbsp;&nbsp;<i class="fa fa-trash"></i>Delete</span></div>