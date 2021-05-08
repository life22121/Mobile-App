const noRecordFoundText = (window.localStorage.getItem('language') == 'fr') ? 'Aucun Enregistrement Trouvé!' : 'No Record Found!';

function avaiablePayoutMethod() {

	var promiseObj = new Promise(function (resolve, reject) {
		$.ajax({
			url: request_url('get-withdraw-payment-methods'),
			type: "GET",
			data: {
				'user_id': localStorage.getItem('user_id'),
			},
			dataType: 'json',
			beforeSend: function (xhr) {
				xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET');
				xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
			},
		})
			.done(function (data) {
				if (data.success.status == 200) {
					// console.log(data.paymentMethods);
					let paymentOutput = '';
					if (data.paymentMethods != 0) {
						$.each(data.paymentMethods, function (index, data) {
							paymentOutput += `
							<option value="${data.id}" data-paymentmethodid="${data.name}">${data.name}</option>
						`;
						});
					} else {
						paymentOutput += `<option value="">${(window.localStorage.getItem('language') == 'fr') ? 'Sélectionnez le mode de paiement' : 'Select Payment Method'}</option>`;
					}
					$('#paymentmethod').html(paymentOutput);
					//Show First Payment Method Selected Text
					let paymentmethod = $("#paymentmethod option:first").text();
					$('#paymentmethod-button span').text(paymentmethod);
					//Pass Payment Method Id to promise resolve
					var paymentMethodId = $('option:first', '#paymentmethod').attr('data-paymentMethodId');
					resolve(paymentMethodId);
				}
			})
			.fail(function (error) {
				reject(error);
				console.log(error);
			});
		// console.log("Get Withdrawal paymentMethods request sent succesfully");
	});
	return promiseObj;
}


// Add Withdraw Setting - Success
function addWithdrawSetting() {
	var myForm = document.getElementById('addWithdrawSettingForm');
	var form_data = new FormData(myForm);
	form_data.append('_token', localStorage.getItem('token'));
	form_data.append('user_id', localStorage.getItem('user_id'));

	$.ajax({
		url: request_url($('#addWithdrawSettingForm').attr('action')), //add-withdraw-setting
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

		$("#addWithdrawSettingForm")[0].reset();
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

function showingOnlyPaypalForm() {
	$('#paymentmethod').val(3);
	$('#paypalForm').show();
	$('#bankForm').hide();
	$('#mobilemoney').hide();
}

function getAllCountries() {

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
				var type = $('#paymentmethod').val();
				if (type == 6) {
					$('#country').html(output);
					var country = $('option:selected', '#country').html();
					$('#country-button span').text(country);
					var country = $('option:first', '#country').attr('data-countryName');
					resolve(country);
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