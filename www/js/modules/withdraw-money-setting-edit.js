function showWithdrawSetting(payout_setting_id) {
    var promiseObj = new Promise(function (resolve, reject) {
        $.ajax({
                url: request_url("payout-setting"),
                type: "GET",
                dataType: "json",
                data: {
                    user_id: localStorage.getItem("user_id"),
                    payout_setting_id: payout_setting_id
                },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Access-Control-Allow-Methods", "GET");
                    xhr.setRequestHeader(
                        "Authorization-Token",
                        `${window.localStorage.getItem("token")}`
                    );
                    $("#ptr").css("display", "none"); //show page
                    $(".loader").css("display", "block"); //show loader
                }
            })
            .done(function (data) {
                $("#ptr").css("display", "block"); //show page
                $(".loader").css("display", "none"); //show loader

                if (data.success.status == 200) {
                    if (data.payoutSettings <= 0) {
                        showErrorMessage(noRecordFoundText);
                        $(window).scrollTop(0);
                        resolve(false);
                    } else {
                        var paymentmethod = data.payoutSettings[0].type;
                        $("#payout_setting_id").val(data.payoutSettings[0].id);
                        $("#payout_setting_name").val(
                            data.payoutSettings[0].payment_method.name
                        );
                        showPaymentMethod(paymentmethod, data.payoutSettings[0].country).then(function () {
                            fillData(paymentmethod, data.payoutSettings[0]);
                        });
                        resolve(true);
                    }
                } else {
                    var errorMessage =
                        window.localStorage.getItem("language") == "fr" ?
                        "Une erreur inattendue s'est produite!" :
                        "Unexpected Error Occured!";
                    showErrorMessage(errorMessage);
                    $(window).scrollTop(0);
                    resolve(false);
                }
            })
            .fail(function (error) {
                console.log(error);
                reject(error);
            });
    });
    return promiseObj;
}

function showPaymentMethod(paymentmethod, country_id) {
    var promiseObj = new Promise(function (resolve, reject) {
        if (paymentmethod == 3) {
            $("#bankForm").css("display", "none");
            $("#paypalForm").css("display", "block");
        } else if (paymentmethod == 6) {
            getAllCountries(paymentmethod, country_id).then(function () {
                $("#bankForm").css("display", "block");
                $("#paypalForm").css("display", "none");
            });
        }
        resolve(true);
    });
    return promiseObj;
}

function fillData(paymentmethod, data) {
    if (paymentmethod == 3) {
        $("#email").val(data.email);
    } else if (paymentmethod == 6) {
        $("#account_name").val(
            data.account_name
        );
        $("#account_number").val(
            data.account_number
        );
        $("#swift_code").val(data.swift_code);
        $("#bank_name").val(data.bank_name);
        $("#branch_name").val(
            data.bank_branch_name
        );
        $("#branch_city").val(
            data.bank_branch_city
        );
        $("#branch_address").val(
            data.bank_branch_address
        );
        // $("#country").val(data.country);
        // $("#country").selectmenu("refresh");
    }
}

function getAllCountries(type, country_id) {
    var promiseObj = new Promise(function (resolve, reject) {
        $.ajax({
                url: request_url('withdrawal/get-all-countries'),
                type: "GET",
                dataType: 'json',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
                    xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
                },
            }).done(function (response) {
                if (response.success.status == 200) {
                    var datas = response.success.countries;
                    var output = "";
                    $.map(datas, function (value, index) {
                        output += `<option value="${value.id}" data-countryName=${value.name}">${value.name}</option>`;
                    });
                    if (type == 6) {
                        $('#country').html(output);
                        $('[name=country] option').filter(function()
                        {
                            return ($(this).val() == country_id); //To select Blue
                        }).prop('selected', true);
                        //Show Selected Country text
                        let selectedCountry = $("#country option:selected").text();
                        $('#country-button span').text(selectedCountry);
                        resolve(selectedCountry);
                    }

                }
            })
            .fail(function (error) {
                reject(error);
                console.log(error);
            });
    });
    return promiseObj;
}

function updateWithdrawSetting() {
    var myForm = document.getElementById('editWithdrawSettingForm');
    var form_data = new FormData(myForm);
    form_data.append('_token', localStorage.getItem('token'));
    form_data.append('user_id', localStorage.getItem('user_id'));

    $.ajax({
        url: request_url('edit-withdraw-setting'),
        type: "post",
        cache: false,
        dataType: 'json',
        contentType: false,
        processData: false,
        data: form_data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
            xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
            $('.pageDiv').css('display', 'none'); //fixed
            $('.loader').css('display', 'block'); //show loader
        },
    }).done(function (data) {
        $('.pageDiv').css('display', 'block'); //fixed
        $('.loader').css('display', 'none'); //hide loader

        if (data.success.status == 200) {
            var successMesage = (window.localStorage.getItem('language') == 'fr') ? "Le paramètre de paiement a bien été ajouté" : data.success.message;
            showSuccessMessage(successMesage);
            $(window).scrollTop(0);
            showingOnlyPaypalForm();
            return false;
        } else {
            // console.log(data.success.message);
            var errorMessage = (window.localStorage.getItem('language') == 'fr') ? "Désolé, une erreur inattendue s'est produite" : data.success.message;
            showErrorMessage(errorMessage);
            $(window).scrollTop(0);
            showingOnlyPaypalForm();
            return false;
        }
    }).fail(function (error) {
        console.log(error);
    });
}