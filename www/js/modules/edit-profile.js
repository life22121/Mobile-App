// flag for submit button disable/enable
let hasPhoneError = false;
let hasEmailError = false;
let isValidPhoneRegex = /^[\d-]*$/;

function formattedPhone()
{
    if ($('#phone').val != '')
    {
        let p = $('#phone').intlTelInput("getNumber").replace(/-|\s/g, "");
        $("#formattedPhone").val(p);
    }
}

/**
 * [checks whether email value is empty or not]
 * @return {void}
 */
function emptyEmail(email)
{
    if( email.length === 0 )
    {
        $('#email-validation-error').html('');
    }
}

//Custom Email Validation
function validateEmail(email)
{
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(email).toLowerCase()))
    {
        return true;
    }
    else
    {
        return false;
    }
}

/**
 * [check submit button should be disabled or not]
 * @return {void}
*/
function enableDisableButton()
{
    // console.log(hasEmailError);
    if (!hasPhoneError && !hasEmailError) {
        $('#updateProfileSubmit').prop('disabled',false);
    } else {
        $('#updateProfileSubmit').prop('disabled',true);
    }
}

/* intlTelInput starts*/
function invokeIntelInputPluginOnUserEdit()
{
    let countryData = $("#phone").intlTelInput("getSelectedCountryData");
    $('#user_defaultCountry').val(countryData.iso2);
    $('#user_carrierCode').val(countryData.dialCode);
    $("#phone").on("countrychange", function(e, countryData)
    {
        let that = $("#phone");
        $('#user_defaultCountry').val(countryData.iso2);
        $('#user_carrierCode').val(countryData.dialCode);
        formattedPhone();
        //Invalid Number Validation
        checkInvalidAndDuplicatePhoneNumberOnUserEdit($.trim(that.val()), $.trim(countryData.dialCode));
    });
}

// Show User Profile Details
function showProfileDetails()
{
    $.ajax(
    {
        url: request_url("get-user-profile"),
        type: "GET",
        dataType: 'json',
        data:
        {
            'user_id': localStorage.getItem('user_id')
        },
        beforeSend: function(xhr)
        {
            xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET');
            xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
        },
    }).done(function(data)
    {
        /* intlTelInput starts*/
        $("#phone").intlTelInput(
        {
            separateDialCode: true,
            nationalMode: true,
            preferredCountries: [window.localStorage.getItem('defaultCountry')],
            autoPlaceholder: "polite",
            placeholderNumberType: "MOBILE",
            formatOnDisplay: false,
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/13.0.4/js/utils.js",
        })
        .done(function()
        {
            if (data.success.user.formattedPhone !== null) { //pm_app_v1.3 - fix
                $('.phone').intlTelInput("setNumber", data.success.user.formattedPhone);
                $('#user_defaultCountry').val(data.success.user.defaultCountry);
                $('#user_carrierCode').val(data.success.user.carrierCode);
            }
        });
        /* intlTelInput ends*/

        $('.first_name').val(data.success.user.first_name);
        $('.last_name').val(data.success.user.last_name);
        $('.email').val(data.success.user.email);
        if (data.success.user.phone !== null) { //pm_app_v1.3 - fix
            $('.phone').val(data.success.user.phone); //phone
        }
        $('.address').val(data.success.user.address_1);
        $('.city').val(data.success.user.city);
        $('.state').val(data.success.user.state);
        showCountriesList(data.success.countries, data.success.user.country_id);
        showTimezonesList(data.success.timezones, data.success.user.timezone);
        showWalletsList(data.success.wallets); //pm_app_v1.3

    }).fail(function(error)
    {
        console.log(error);
    });
}

//Show Countries List
function showCountriesList(countries, country_id)
{
    // console.log(country_id);
    let output = '';
    $.each(countries, function(index, country)
    {
        output += `
            <option value="${country.id}">${country.name}</option>
        `;
    });
    $('#country').html(output);
    //Make Selected by database user country value
    $('[name=country] option').filter(function()
    {
        return ($(this).val() == country_id); //To select Blue
    }).prop('selected', true);
    //Show Selected Country text
    let selectedCountry = $("#country option:selected").text();
    $('#country-button span').text(selectedCountry);
}

//Show PHP Timezones List
function showTimezonesList(timezones, timeZone)
{
    //Timezone List starts here
    let outputTimezone = '';
    $.each(timezones, function(index, timezone)
    {
        outputTimezone += `
            <option value="${timezone.zone}">${timezone.diff_from_GMT} - ${timezone.zone}</option>
        `;
    });
    $('#timezone').html(outputTimezone);
    //Make Selected by database user timezone value
    $('[name=timezone] option').filter(function()
    {
        return ($(this).val() == timeZone); //To select Blue
    }).prop('selected', true)
    //Show Selected Timezone text
    let selectedTimezone = $("#timezone option:selected").text();
    $('#timezone-button span').text(selectedTimezone);
}

//Show Wallets List
function showWalletsList(wallets)
{
    let output = '';

    console.log(wallets)
    $.each(wallets, function(index, wallet)
    {
        output += `
            <option value="${wallet.id}" ${wallet.is_default == 'Yes' ? 'selected="selected"': ''}>${wallet.currencyCode}</option>
        `;
    });
    $('#defaultWallet').html(output);

    //Show Selected Wallet text
    let selectedWallet = $("#defaultWallet option:selected").text();
    $('#defaultWallet-button span').text(selectedWallet);
}

function checkInvalidAndDuplicatePhoneNumberOnUserEdit(phoneVal, phoneData)
{
    let that = $("input[name=phone]");
    if ($.trim(that.val()) !== '')
    {
        if (!that.intlTelInput("isValidNumber") || !isValidPhoneRegex.test($.trim(that.val())))
        {
            $('#tel-validation-error').addClass('error')
            .html((window.localStorage.getItem('language') == 'fr') ? 'Veuillez entrer un numéro de téléphone international valide.' : 'Please enter a valid International Phone Number.')
            .css("font-weight", "bold");
            $('#phone-validation-error').hide();
            hasPhoneError = true;
            enableDisableButton();
        }
        else
        {
            $('#tel-validation-error').html('');
            $('#phone-validation-error').show();
            // hasPhoneError = false;
            // enableDisableButton();
            $.ajax(
            {
                method: "POST",
                url: SITE_URL + "registration/duplicate-phone-number-check",
                dataType: "json",
                cache: false,
                data:
                {
                    'phone': phoneVal,
                    'carrierCode': phoneData,
                    'id': localStorage.getItem('user_id'),
                }
            })
            .done(function(response)
            {
                if (response.status == true)
                {
                    $('#tel-validation-error').html('');
                    $('#phone-validation-error').show();
                    $('#phone-validation-error').addClass('error').html(response.fail).css("font-weight", "bold");
                    hasPhoneError = true;
                    enableDisableButton();
                }
                else if (response.status == false)
                {
                    $('#tel-validation-error').show();
                    $('#phone-validation-error').html('');
                    hasPhoneError = false;
                    enableDisableButton();
                }
            })
            .fail(function(error)
            {
                console.log(error);
            });
        }
    }
    else
    {
        $('#tel-validation-error').html('');
        $('#phone-validation-error').html('');
        hasPhoneError = false;
        enableDisableButton();
    }
}
/* intlTelInput ends*/

function duplicateEmailCheckUser(email)
{
    $.ajax({
        headers:
        {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        method: "POST",
        url: SITE_URL+"profile/duplicate-email-check",
        dataType: "json",
        data: {
            'email': email,
            'user_id': localStorage.getItem('user_id'),
        },
        beforeSend: function(xhr)
        {
            xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
            xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
        },
    })
    .done(function(response)
    {
        if (response.status == true)
        {
            // console.log(response.status);
            emptyEmail(email);
            if (validateEmail(email))
            {
                $('#email-validation-error').addClass('error').html(response.fail).css("font-weight", "bold");
                hasEmailError = true;
                enableDisableButton();
            }
            else {
                $('#email-validation-error').html('');
                hasEmailError = false;
                enableDisableButton();
            }
        }
        else if (response.status == false)
        {
            hasEmailError = false;
            enableDisableButton();

            emptyEmail(email);
            if (validateEmail(email))
            {
                $('#email-validation-error').html('');
            }
        }
    })
    .fail(function(error)
    {
        console.log(error);
    });
}

// Update User Profile
function updateProfile(requestUrl,data,token)
{
    $.ajax(
    {
        url: request_url(requestUrl), //update-user-profile
        type: "POST",
        data: data + "&user_id=" + localStorage.getItem('user_id') + "" + "&_token=" + token + "",
        dataType: 'json',
        beforeSend: function(xhr)
        {
            xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
            xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
        },
    })
    .done(function(response)
    {
        $(window).scrollTop(0);
        if (response.success.status == 200)
        {
            // console.log(response.success.formattedPhone);
            // console.log(typeof response.success.formattedPhone);

            //Update user's username(firstname & lastname),email & formattedPhone in local storage
            window.localStorage.setItem('username', response.success.username);
            window.localStorage.setItem('email', response.success.email);
            if (response.success.formattedPhone != undefined)
            {
                window.localStorage.setItem('formattedPhone', response.success.formattedPhone);
            }
            else
            {
                window.localStorage.removeItem('formattedPhone');//this is needed to check null in profile & available balance pages
            }

            //Update user's username for right sidebar
            $(".username").text(window.localStorage.getItem('username'));

            //Show success message
            showSuccessMessage((window.localStorage.getItem('language') == 'fr') ? 'Informations de profil mises à jour avec succès!' : 'Profile Information Updated Successfully!');
        }
        else
        {
            let message = response.success.message.errorInfo[2] ? response.success.message.errorInfo[2] : (window.localStorage.getItem('language') == 'fr') ? 'La mise à jour du profil a échoué!' : 'Profile Update failed!';
            showErrorMessage(message)
        }
    })
    .fail(function(error)
    {
        console.log(error);
    });
}