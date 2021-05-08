const noRecordFoundText = (window.localStorage.getItem('language') == 'fr') ? 'Aucun Enregistrement Trouvé!' : 'No Record Found!';
let statusMsg;
let imgSrc;
let imgPhoto;
let merchantPhoto;
let payment_method_name;

let depositPendingtransTypeTransactionRow;
let payoutPendingtransTypeTransactionRow;
let transferredPendingtransTypeTransactionRow;
let receivedPendingtransTypeTransactionRow;
let exchangeFromPendingtransTypeTransactionRow;
let exchangeToPendingtransTypeTransactionRow;
let requestSentPendingtransTypeTransactionRow;
let requestReceivedPendingtransTypeTransactionRow;
let paymentSentPendingtransTypeTransactionRow;
let paymentReceivedPendingtransTypeTransactionRow;

let image_url = SITE_URL.replace('api/', '');

function transactionMoneyAll()
{
    $.ajax(
    {
        url: request_url('activityall'),//activityall
        type: "GET",
        data:
        {
            'user_id': localStorage.getItem('user_id'),
            'type': 'allTransactions',
        },
        dataType: 'json',
        beforeSend: function(xhr)
        {
            xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET');
            xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
            $('.loader').css('display', 'block'); //show loader
            $('#one').css('display', 'none'); //two hide
        },
    }).done(function(data)
    {
        $('.loader').css('display', 'none'); //hide loader
        $('.myDiv').css('display', 'block'); //show page
        $('#one').css('display', 'block'); //two show
        let outputPending = '';
        let outputSuccess = '';
        let datas = data.transactions;
        allTransactions(datas, outputPending, outputSuccess);
    }).fail(function(error)
    {
        console.log(error);
    });
}

function allTransactions(datas, outputPending, outputSuccess)
{
    $.each(datas, function(index, data)
    {
        // console.log(data);

        //date - starts
        let finalDate = data.t_created_at;
        //date - ends

        //amnt - starts
        let amnt = data.total;
        let subtotal = data.subtotal;
        let txtClass = (amnt.indexOf('-') > -1) ? 'txtDanger' : 'txtSuccess';
        let total = (amnt < 0) ? amnt : amnt;//this is needed as no (+) sign will be before postive total - old logic => let total = (amnt < 0) ? amnt : '+' + amnt;
        //amnt - starts

        //status
        let status = data.status;
        //

        /////////////////////////////////////////////////////////////
        //IMAGE and STATUS separation logic - starts
            if (data.transaction_type == 'Deposit')
            {
                //image
                if (data.payment_method_id == 1)
                {
                    payment_method_name = data.company_name;
                    imgPhoto = data.company_logo;

                    if (imgPhoto != null) {
                        imgSrc = image_url + "public/images/logos/" + imgPhoto;
                    } else {
                        imgSrc = image_url + "public/uploads/userPic/default-logo.jpg";
                    }
                }
                else if (data.bank_id)
                {
                    payment_method_name = data.payment_method_name +' ('+data.bank_name+')';
                    if (data.bank_logo)
                    {
                        imgPhoto = data.bank_logo;
                        imgSrc = image_url + "public/uploads/files/bank_logos/" + imgPhoto;
                    }
                    else
                    {
                        imgPhoto = 'bank.jpg';
                        imgSrc = image_url + "public/images/payment_gateway/" + imgPhoto;
                    }
                }
                else
                {
                    payment_method_name = data.payment_method_name;
                    imgPhoto = payment_method_name.toLowerCase() + '.jpg';
                    imgSrc = image_url + "public/images/payment_gateway/" + imgPhoto;
                }

                //if status is pending
                depositPendingtransTypeTransactionRow = (window.localStorage.getItem('language') == 'fr') ? 'Dépôt-En attente' : 'Deposit-Pending';

                //if status is NOT pending
                if (data.status != 'Pending')
                {
                    if (status == 'Success')
                    {
                        statusMsg = (window.localStorage.getItem('language') == 'fr') ? 'Dépôt' : 'Deposit';
                    }
                    else
                    {
                        if (status == 'Blocked')
                        {
                            statusMsg = (window.localStorage.getItem('language') == 'fr') ? 'Dépôt' + '-' + 'Annulé' : 'Deposit' + '-' + 'Cancelled';
                        }
                        else
                        {
                            statusMsg = 'Deposit' + '-' + status;
                        }
                    }
                }
            }
            if (data.transaction_type == 'Withdrawal')
            {
                //image
                if (data.payment_method_id == 1)
                {
                    payment_method_name = data.company_name;
                    imgPhoto = data.company_logo;
                    if (imgPhoto != null) {
                        imgSrc = image_url + "public/images/logos/" + imgPhoto;
                    } else {
                        imgSrc = image_url + "public/uploads/userPic/default-logo.jpg";
                    }
                }
                else
                {
                    payment_method_name = data.payment_method_name;
                    imgPhoto = payment_method_name.toLowerCase() + '.jpg';
                    imgSrc = image_url + "public/images/payment_gateway/" + imgPhoto;
                }

                //if status is pending
                payoutPendingtransTypeTransactionRow = (window.localStorage.getItem('language') == 'fr') ? 'Paiement-En attente' : 'Payout-Pending';

                //if status is NOT pending
                if (data.status != 'Pending')
                {
                    if (status == 'Success')
                    {
                        statusMsg = (window.localStorage.getItem('language') == 'fr') ? 'Paiement' : 'Payout';
                    }
                    else
                    {
                        if (status == 'Blocked')
                        {
                            statusMsg = (window.localStorage.getItem('language') == 'fr') ? 'Paiement' + '-' + 'Annulé' :  'Payout' + '-' + 'Cancelled';
                        }
                        else
                        {
                            statusMsg = 'Payout' + '-' + status;
                        }
                    }
                }
            }
            if (data.transaction_type == 'Transferred')
            {
                //image
                imgPhoto = data.end_user_photo;
                if (imgPhoto)
                {
                    imgSrc = image_url + "public/user_dashboard/profile/" + imgPhoto;
                }
                else
                {
                    imgSrc = SITE_URL.replace('api/', '') + 'public/user_dashboard/images/avatar.jpg';
                }

                //if status is pending
                transferredPendingtransTypeTransactionRow = (window.localStorage.getItem('language') == 'fr') ? 'Transféré-En attente' : 'Transferred-Pending';

                //if status is NOT pending
                if (data.status != 'Pending')
                {
                    if (status == 'Success')
                    {
                        statusMsg = (window.localStorage.getItem('language') == 'fr') ? 'Transféré': 'Transferred';
                    }
                    else
                    {
                        if (status == 'Blocked')
                        {
                            statusMsg = (window.localStorage.getItem('language') == 'fr') ? 'Transféré' + '-' + 'Annulé' :  'Transferred' + '-' + 'Cancelled';
                        }
                        else if (status == 'Refund')
                        {
                            statusMsg = (window.localStorage.getItem('language') == 'fr') ? 'Transféré' + '-' + 'Remboursé' :  'Transferred' + '-' + 'Refunded';
                        }
                        else
                        {
                            statusMsg = 'Transferred' + '-' + status;
                        }
                    }
                }
            }
            if (data.transaction_type == 'Received') //d
            {
                //image
                imgPhoto = data.end_user_photo;
                if (imgPhoto)
                {
                    imgSrc = image_url + "public/user_dashboard/profile/" + imgPhoto;
                }
                else
                {
                    imgSrc = SITE_URL.replace('api/', '') + 'public/user_dashboard/images/avatar.jpg';
                }

                //if status is pending
                receivedPendingtransTypeTransactionRow = (window.localStorage.getItem('language') == 'fr') ? 'Reçu-En attente' : 'Received-Pending';

                //if status is NOT pending
                if (data.status != 'Pending')
                {
                    if (status == 'Success')
                    {
                        statusMsg = (window.localStorage.getItem('language') == 'fr') ? 'Reçu': 'Received';
                    }
                    else
                    {
                        if (status == 'Blocked')
                        {
                            statusMsg = (window.localStorage.getItem('language') == 'fr') ? 'Reçu' + '-' + 'Annulé' :  'Received' + '-' + 'Cancelled';
                        }
                        else if (status == 'Refund')
                        {
                            statusMsg = (window.localStorage.getItem('language') == 'fr') ? 'Reçu' + '-' + 'Remboursé' :  'Received' + '-' + 'Refunded';
                        }
                        else
                        {
                            statusMsg = 'Received' + '-' + status;
                        }
                    }
                }
            }
            if (data.transaction_type == 'Exchange_From')
            {
                //image
                imgSrc = image_url + "public/frontend/images/exchange.png";

                //if status is pending
                exchangeFromPendingtransTypeTransactionRow = (window.localStorage.getItem('language') == 'fr') ? 'Échanger de-En attente' : 'Exchange From-Pending';

                //if status is NOT pending
                if (data.status != 'Pending')
                {
                    if (status == 'Success')
                    {
                        statusMsg = (window.localStorage.getItem('language') == 'fr') ? 'Échanger de': 'Exchange From';
                    }
                    else
                    {
                        if (status == 'Blocked')
                        {
                            statusMsg = (window.localStorage.getItem('language') == 'fr') ? 'Échanger de-Annulé' : 'Exchange From-Cancelled';
                        }
                        else
                        {
                            statusMsg = 'Exchange From' + '-' + status;
                        }
                    }
                }
            }
            if (data.transaction_type == 'Exchange_To')
            {
                //image
                imgSrc = image_url + "public/frontend/images/exchange.png";

                //if status is pending
                exchangeToPendingtransTypeTransactionRow = (window.localStorage.getItem('language') == 'fr') ? 'Échanger à-En attente' : 'Exchange To-Pending';

                //if status is NOT pending
                if (data.status != 'Pending')
                {
                    if (status == 'Success')
                    {
                        statusMsg = (window.localStorage.getItem('language') == 'fr') ? 'Échanger à' : 'Exchange To';
                    }
                    else
                    {
                        if (status == 'Blocked')
                        {
                            statusMsg = (window.localStorage.getItem('language') == 'fr') ? 'Échanger à-Annulé' : 'Exchange To-Cancelled';
                        }
                        else
                        {
                            statusMsg = 'Exchange To' + '-' + status;
                        }
                    }
                }
            }
            if (data.transaction_type == 'Request_From')
            {
                //image
                imgPhoto = data.end_user_photo;
                if (imgPhoto)
                {
                    imgSrc = image_url + "public/user_dashboard/profile/" + imgPhoto;
                }
                else
                {
                    imgSrc = SITE_URL.replace('api/', '') + 'public/user_dashboard/images/avatar.jpg';
                }

                //if status is pending
                requestSentPendingtransTypeTransactionRow = (window.localStorage.getItem('language') == 'fr') ? 'Demande envoyée-En attente' : 'Request Sent-Pending';

                //if status is NOT pending
                if (data.status != 'Pending')
                {
                    if (status == 'Success')
                    {
                        statusMsg = (window.localStorage.getItem('language') == 'fr') ? 'Demande envoyée' : 'Request Sent';
                    }
                    else
                    {
                        if (status == 'Blocked')
                        {
                            statusMsg = (window.localStorage.getItem('language') == 'fr') ? 'Demande envoyée-Annulé' : 'Request Sent-Cancelled';
                        }
                        else if (status == 'Refund')
                        {
                            statusMsg = (window.localStorage.getItem('language') == 'fr') ? 'Demande envoyée' + '-' + 'Remboursé' :  'Request Sent' + '-' + 'Refunded';
                        }
                        else
                        {
                            statusMsg = 'Request Sent' + '-' + status;
                        }
                    }
                }
            }
            if (data.transaction_type == 'Request_To') //d
            {
                //image
                imgPhoto = data.end_user_photo;
                if (imgPhoto)
                {
                    imgSrc = image_url + "public/user_dashboard/profile/" + imgPhoto;
                }
                else
                {
                    imgSrc = SITE_URL.replace('api/', '') + 'public/user_dashboard/images/avatar.jpg';
                }

                //if status is pending
                requestReceivedPendingtransTypeTransactionRow = (window.localStorage.getItem('language') == 'fr') ? 'Demande reçue-En attente' : 'Request Received-Pending';

                //if status is NOT pending
                if (data.status != 'Pending')
                {
                    if (status == 'Success')
                    {
                        statusMsg = (window.localStorage.getItem('language') == 'fr') ? 'Demande reçue' : 'Request Received';
                    }
                    else
                    {
                        if (status == 'Blocked')
                        {
                            statusMsg = (window.localStorage.getItem('language') == 'fr') ? 'Demande reçue-Annulé' : 'Request Received-Cancelled';
                        }
                        else if (status == 'Refund')
                        {
                            statusMsg = (window.localStorage.getItem('language') == 'fr') ? 'Demande reçue' + '-' + 'Remboursé' :  'Request Received' + '-' + 'Refunded';
                        }
                        else
                        {
                            statusMsg = 'Request Received' + '-' + status;
                        }
                    }
                }
            }
            if (data.transaction_type == 'Payment_Sent')
            {
                //image
                merchantPhoto = data.logo;
                if (merchantPhoto)
                {
                    imgSrc = image_url + "public/user_dashboard/merchant/thumb/" + merchantPhoto;
                }
                else
                {
                    imgSrc = image_url + "public/uploads/merchant/merchant.jpg";;
                }

                //if status is pending
                paymentSentPendingtransTypeTransactionRow = (window.localStorage.getItem('language') == 'fr') ? 'Paiement envoyé-En attente' : 'Payment Sent-Pending';

                //if status is NOT pending
                if (data.status != 'Pending')
                {
                    if (status == 'Success')
                    {
                        statusMsg = (window.localStorage.getItem('language') == 'fr') ? 'Paiement envoyé' : 'Payment Sent';
                    }
                    else
                    {
                        if (status == 'Blocked')
                        {
                            statusMsg = (window.localStorage.getItem('language') == 'fr') ? 'Paiement envoyé-Annulé' : 'Payment Sent-Cancelled';
                        }
                        else if (status == 'Refund')
                        {
                            statusMsg = (window.localStorage.getItem('language') == 'fr') ? 'Paiement envoyé' + '-' + 'Remboursé' :  'Payment Sent' + '-' + 'Refunded';
                        }
                        else
                        {
                            statusMsg = 'Payment Sent' + '-' + status;
                        }
                    }
                }
            }
            if (data.transaction_type == 'Payment_Received')
            {
                //image
                merchantPhoto = data.logo;
                if (merchantPhoto)
                {
                    imgSrc = image_url + "public/user_dashboard/merchant/thumb/" + merchantPhoto;
                }
                else
                {
                    imgSrc = image_url + "public/uploads/merchant/merchant.jpg";;
                }

                //if status is pending
                paymentReceivedPendingtransTypeTransactionRow = (window.localStorage.getItem('language') == 'fr') ? 'Paiement reçu-En attente' : 'Payment Received-Pending';

                //if status is NOT pending
                if (data.status != 'Pending')
                {
                    if (status == 'Success')
                    {
                        statusMsg = (window.localStorage.getItem('language') == 'fr') ? 'Paiement reçu' : 'Payment Received';
                    }
                    else
                    {
                        if (status == 'Blocked')
                        {
                            statusMsg = (window.localStorage.getItem('language') == 'fr') ? 'Paiement reçu-Annulé' : 'Payment Received-Cancelled';
                        }
                        else if (status == 'Refund')
                        {
                            statusMsg = (window.localStorage.getItem('language') == 'fr') ? 'Paiement reçu' + '-' + 'Remboursé' :  'Payment Received' + '-' + 'Refunded';
                        }
                        else
                        {
                            statusMsg = 'Payment Received' + '-' + status;
                        }
                    }
                }
            }
        //IMAGE and STATUS separation login -ends
        /////////////////////////////////////////////////////////////

        if (data.status == 'Pending')
        {
            if (data.transaction_type == 'Deposit')//subtotal
            {
                outputPending += `
                    <tr>
                        <td>
                            <a data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><img src="${imgSrc}" alt="" title="" style="width:44px;height:42px;border-radius:50%;margin-top:8px" /></a>
                        </td>

                        <td style="font-size:12px;">
                            <h2><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="pm-name-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${payment_method_name}</a></h2>
                            <h4><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="trans-type-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${depositPendingtransTypeTransactionRow}</a></h4>
                        </td>

                        <td style="font-size:12px;">
                            <a style="color:#000" data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><p style="font-size:11px;margin-top:8px">${finalDate}</p><span style="font-size:12px" class="${txtClass}">${subtotal}</span></a>
                        </td>
                    </tr>
                `;
            }
            if (data.transaction_type == 'Withdrawal')
            {
                outputPending += `
                    <tr>
                        <td>
                            <a data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><img src="${imgSrc}" alt="" title="" style="width:44px;height:42px;border-radius:50%;margin-top:8px" /></a>
                        </td>

                        <td style="font-size:12px;">
                            <h2><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="pm-name-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${payment_method_name}</a></h2>
                            <h4><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="trans-type-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${payoutPendingtransTypeTransactionRow}</a></h4>
                        </td>

                        <td style="font-size:12px;">
                            <a style="color:#000" data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html"data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><p style="font-size:11px;margin-top:8px">${finalDate}</p><span style="font-size:12px" class="${txtClass}">${total}</span></a>
                        </td>
                    </tr>
                `;
            }
            if (data.transaction_type == 'Transferred')//d
            {
                outputPending += `
                    <tr>
                        <td>
                            <a data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><img src="${imgSrc}" alt="" title="" style="width:44px;height:42px;border-radius:50%;margin-top:8px" /></a>
                        </td>

                        <td style="font-size:12px;">
                            <h2><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="pm-name-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${ ((data.end_user_f_name && data.end_user_l_name) ? `${data.end_user_f_name}\u00A0${data.end_user_l_name}` : ((data.email) ? data.email : data.phone)) }</a></h2>
                            <h4><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="trans-type-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${transferredPendingtransTypeTransactionRow}</a></h4>
                        </td>

                        <td style="font-size:12px;">
                            <a style="color:#000" data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><p style="font-size:11px;margin-top:8px">${finalDate}</p><span style="font-size:12px;" class="${txtClass}">${total}</span></a>
                        </td>
                    </tr>
                `;
            }
            if (data.transaction_type == 'Received')//subtotal
            {
                outputPending += `
                    <tr>
                        <td>
                            <a data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><img src="${imgSrc}" alt="" title="" style="width:44px;height:42px;border-radius:50%;margin-top:8px" /></a>
                        </td>

                        <td style="font-size:12px;">
                            <h2><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="pm-name-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${ ((data.end_user_f_name && data.end_user_l_name) ? `${data.end_user_f_name}\u00A0${data.end_user_l_name}` : ((data.email) ? data.email : data.phone)) }</a></h2>


                            <h4><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="trans-type-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${receivedPendingtransTypeTransactionRow}</a></h4></td>
                        <td style="font-size:12px;">
                            <a style="color:#000" data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><p style="font-size:11px;margin-top:8px">${finalDate}</p><span style="font-size:12px" class="${txtClass}"> ${subtotal}</span></a>
                        </td>
                    </tr>
                `;
            }
            if (data.transaction_type == 'Exchange_From')
            {
                outputPending += `
                    <tr>
                        <td>
                            <a data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><img src="${imgSrc}" alt="" title="" style="width:44px;height:42px;border-radius:50%;margin-top:8px" /></a>
                        </td>

                        <td style="font-size:12px;">
                            <h2><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="pm-name-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">&nbsp;</a></h2>
                            <h4><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="trans-type-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${exchangeFromPendingtransTypeTransactionRow}</a></h4>
                        </td>

                        <td style="font-size:12px;">
                            <a style="color:#000" data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><p style="font-size:11px;margin-top:8px">${finalDate}</p><span style="font-size:12px" class="${txtClass}">${total}</span></a>
                        </td>
                    </tr>
                `;
            }
            if (data.transaction_type == 'Exchange_To')
            {
                let exchangeToPendingtransTypeTransactionRow = (window.localStorage.getItem('language') == 'fr') ? 'Échanger à-En attente' : 'Exchange To-Pending';
                outputPending += `
                    <tr>
                        <td>
                            <a data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><img src="${imgSrc}" alt="" title="" style="width:44px;height:42px;border-radius:50%;margin-top:8px" /></a>
                        </td>

                        <td style="font-size:12px;">
                            <h2><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="pm-name-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">&nbsp;</a></h2>
                            <h4><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="trans-type-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${exchangeToPendingtransTypeTransactionRow}</a></h4>
                        </td>

                        <td style="font-size:12px;">
                            <a style="color:#000" data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><p style="font-size:11px;margin-top:8px">${finalDate}</p><span style="font-size:12px" class="${txtClass}">${total}</span></a>
                        </td>
                    </tr>
                `;
            }
            if (data.transaction_type == 'Request_From')//d
            {
                outputPending += `
                    <tr>
                        <td>
                            <a data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><img src="${imgSrc}" alt="" title="" style="width:44px;height:42px;border-radius:50%;margin-top:8px" /></a>
                        </td>

                        <td style="font-size:12px;">
                            <h2><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="pm-name-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${ ((data.end_user_f_name && data.end_user_l_name) ? `${data.end_user_f_name}\u00A0${data.end_user_l_name}` : ((data.email) ? data.email : data.phone)) }</a></h2>
                            <h4><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="trans-type-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${requestSentPendingtransTypeTransactionRow}</a></h4>
                        </td>

                        <td style="font-size:12px;">
                            <a style="color:#000" data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><p style="font-size:11px;margin-top:8px">${finalDate}</p><span style="font-size:12px" class="${txtClass}">${total}</span></a>
                        </td>
                    </tr>
                `;
            }
            if (data.transaction_type == 'Request_To')//d
            {
                outputPending += `
                    <tr>
                        <td>
                            <a data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><img src="${imgSrc}" alt="" title="" style="width:44px;height:42px;border-radius:50%;margin-top:8px" /></a>
                        </td>

                        <td style="font-size:12px;">

                            <h2><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="pm-name-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${ ((data.end_user_f_name && data.end_user_l_name) ? `${data.end_user_f_name}\u00A0${data.end_user_l_name}` : ((data.email) ? data.email : data.phone)) }</a></h2>

                            <h4><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="trans-type-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${requestReceivedPendingtransTypeTransactionRow}</a></h4></td>

                        <td style="font-size:12px;">

                            <a style="color:#000" data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><p style="font-size:11px;margin-top:8px">${finalDate}</p><span style="font-size:12px" class="${txtClass}">${total}</span></a>

                        </td>
                    </tr>
                `;
            }
            if (data.transaction_type == 'Payment_Sent')//subtotal
            {
                outputPending += `
                    <tr>
                        <td>
                            <a data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><img src="${imgSrc}" alt="" title="" style="width:44px;height:42px;border-radius:50%;margin-top:8px" /></a>
                        </td>

                        <td style="font-size:12px;">
                            <h2><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="pm-name-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${data.merchant_name}</a></h2>
                            <h4><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="trans-type-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${paymentSentPendingtransTypeTransactionRow}</a></h4></td>

                        <td style="font-size:12px;">
                            <a style="color:#000" data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><p style="font-size:11px;margin-top:8px">${finalDate}</p><span style="font-size:12px" class="${txtClass}">${subtotal}</span></a>
                        </td>
                    </tr>
                `;
            }
            if (data.transaction_type == 'Payment_Received')//subtotal
            {
                outputPending += `
                    <tr>
                        <td>
                            <a data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><img src="${imgSrc}" alt="" title="" style="width:44px;height:42px;border-radius:50%;margin-top:8px" />
                            </a>
                        </td>

                        <td style="font-size:12px;">
                            <h2><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="pm-name-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${data.merchant_name}</a>
                            </h2>
                            <h4><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="trans-type-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${paymentReceivedPendingtransTypeTransactionRow}</a>
                            </h4>
                        </td>

                        <td style="font-size:12px;">
                            <a style="color:#000" data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><p style="font-size:11px;margin-top:8px">${finalDate}</p><span style="font-size:12px" class="${txtClass}">${subtotal}</span>
                            </a>
                        </td>
                    </tr>
                `;
            }
        }
        else
        {
            if (data.transaction_type == 'Deposit')//subtotal
            {
                outputSuccess += `
                    <tr>
                        <td>
                            <a data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><img src="${imgSrc}" alt="" title="" style="width:44px;height:42px;border-radius:50%;margin-top:8px" /></a>
                        </td>
                        <td style="font-size:12px;">
                            <h2><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="pm-name-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${payment_method_name}</a></h2>
                            <h4><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="trans-type-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${statusMsg}</a></h4>
                        </td>
                        <td style="font-size:12px;">
                            <a style="color:#000" data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><p style="font-size:11px;margin-top:8px">${finalDate}</p><span style="font-size:12px" class="${txtClass}">${subtotal}</span></a>
                        </td>
                    </tr>
                `;
            }
            if (data.transaction_type == 'Withdrawal')
            {
                outputSuccess += `
                    <tr>

                        <td>

                            <a data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><img src="${imgSrc}" alt="" title="" style="width:44px;height:42px;border-radius:50%;margin-top:8px" /></a>

                        </td>

                        <td style="font-size:12px;">

                            <h2><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="pm-name-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${payment_method_name}</a></h2>

                            <h4><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="trans-type-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${statusMsg}</a></h4>

                        </td>

                        <td style="font-size:12px;">

                            <a style="color:#000" data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><p style="font-size:11px;margin-top:8px">${finalDate}</p><span style="font-size:12px" class="${txtClass}">${total}</span></a>

                        </td>
                    </tr>
                `;
            }
            if (data.transaction_type == 'Transferred')//d
            {
                outputSuccess += `
                    <tr>
                        <td>
                            <a data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><img src="${imgSrc}" alt="" title="" style="width:44px;height:42px;border-radius:50%;margin-top:8px" /></a>
                        </td>

                        <td style="font-size:12px;">
                            <h2><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="pm-name-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${ ((data.end_user_f_name && data.end_user_l_name) ? `${data.end_user_f_name}\u00A0${data.end_user_l_name}` : ((data.email) ? data.email : data.phone)) }</a>

                            <h4><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="trans-type-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${statusMsg}</a></h4>
                        </td>

                        <td style="font-size:12px;">
                            <a style="color:#000" data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><p style="font-size:11px;margin-top:8px">${finalDate}</p><span style="font-size:12px" class="${txtClass}">${total}</span></a>
                        </td>
                    </tr>
                `;
            }
            if (data.transaction_type == 'Received')//subtotal
            {
                outputSuccess += `
                    <tr>
                        <td>
                            <a data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><img src="${imgSrc}" alt="" title="" style="width:44px;height:42px;border-radius:50%;margin-top:8px" />
                            </a>
                        </td>

                        <td style="font-size:12px;">
                            <h2><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="pm-name-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${ ((data.end_user_f_name && data.end_user_l_name) ? `${data.end_user_f_name}\u00A0${data.end_user_l_name}` : ((data.email) ? data.email : data.phone)) }</a>
                            </h2>
                            <h4><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="trans-type-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${statusMsg}</a>
                            </h4>
                        </td>

                        <td style="font-size:12px;">
                            <a style="color:#000" data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><p style="font-size:11px;margin-top:8px">${finalDate}</p><span style="font-size:12px" class="${txtClass}">${subtotal}</span>
                            </a>
                        </td>
                    </tr>
                `;
            }
            if (data.transaction_type == 'Exchange_From')
            {
                outputSuccess += `
                    <tr>
                        <td>
                            <a data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><img src="${imgSrc}" alt="" title="" style="width:44px;height:42px;border-radius:50%;margin-top:8px" />
                            </a>
                        </td>

                        <td>
                            <h2><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="pm-name-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">&nbsp;</a>
                            </h2>
                            <h4><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="trans-type-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${statusMsg}</a>
                            </h4>
                        </td>

                        <td>
                            <a style="color:#000" data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><p style="font-size:11px;margin-top:8px">${finalDate}</p><span style="font-size:12px" class="${txtClass}">${total}</span>
                            </a>
                        </td>
                    </tr>
                `;
            }
            if (data.transaction_type == 'Exchange_To')
            {
                outputSuccess += `
                    <tr>
                        <td>
                            <a data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><img src="${imgSrc}" alt="" title="" style="width:44px;height:42px;border-radius:50%;margin-top:8px" />
                            </a>
                        </td>

                        <td>
                            <h2><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="pm-name-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">&nbsp;</a>
                            </h2>
                            <h4><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="trans-type-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${statusMsg}</a></h4>
                            </td>
                        <td>
                            <a style="color:#000" data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><p style="font-size:11px;margin-top:8px">${finalDate}</p><span style="font-size:12px" class="${txtClass}">${total}</span>
                            </a>
                        </td>
                    </tr>
                `;
            }
            if (data.transaction_type == 'Request_From') //d
            {
                outputSuccess += `
                    <tr>
                        <td>
                            <a data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><img src="${imgSrc}" alt="" title="" style="width:44px;height:42px;border-radius:50%;margin-top:8px" /></a>
                        </td>

                        <td style="font-size:12px;">
                            <h2><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="pm-name-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${ ((data.end_user_f_name && data.end_user_l_name) ? `${data.end_user_f_name}\u00A0${data.end_user_l_name}` : ((data.email) ? data.email : data.phone)) }</a>
                            </h2>

                            <h4><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="trans-type-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${statusMsg}</a></h4></td>

                        <td style="font-size:12px;">
                         <a style="color:#000" data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><p style="font-size:11px;margin-top:8px">${finalDate}</p><span style="font-size:12px" class="${txtClass}">${total}</span></a>
                        </td>
                    </tr>
                `;
            }
            if (data.transaction_type == 'Request_To') //d
            {
                outputSuccess += `
                    <tr>
                        <td>
                            <a data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><img src="${imgSrc}" alt="" title="" style="width:44px;height:42px;border-radius:50%;margin-top:8px" />
                            </a>
                        </td>

                        <td style="font-size:12px;">

                            <h2><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="pm-name-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${ ((data.end_user_f_name && data.end_user_l_name) ? `${data.end_user_f_name}\u00A0${data.end_user_l_name}` : ((data.email) ? data.email : data.phone)) }</a>
                            </h2>

                            <h4><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="trans-type-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${statusMsg}</a></h4>
                            </td>

                        <td style="font-size:12px;">
                            <a style="color:#000" data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><p style="font-size:11px;margin-top:8px">${finalDate}</p><span style="font-size:12px" class="${txtClass}">${total}</span>
                            </a>
                        </td>
                    </tr>
                `;
            }
            if (data.transaction_type == 'Payment_Sent') //subtotal
            {
                outputSuccess += `
                    <tr>
                        <td>
                            <a data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><img src="${imgSrc}" alt="" title="" style="width:44px;height:42px;border-radius:50%;margin-top:8px" />
                            </a>
                        </td>

                        <td style="font-size:12px;">
                            <h2><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="pm-name-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${data.merchant_name}</a>
                            </h2>

                            <h4><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="trans-type-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${statusMsg}</a>
                            </h4>
                        </td>

                        <td style="font-size:12px;">
                            <a style="color:#000" data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><p style="font-size:11px;margin-top:8px">${finalDate}</p><span style="font-size:12px" class="${txtClass}">${subtotal}</span>
                            </a>
                        </td>
                    </tr>
                `;
            }
            if (data.transaction_type == 'Payment_Received') //subtotal
            {
                outputSuccess += `
                    <tr>

                        <td>

                            <a data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><img src="${imgSrc}" alt="" title="" style="width:44px;height:42px;border-radius:50%;margin-top:8px" /></a>

                        </td>

                        <td style="font-size:12px;">

                            <h2><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="pm-name-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${data.merchant_name}</a></h2>

                            <h4><a style="color:#0069a6;" data-rel="${data.id}" class="transaction_row" id="trans-type-transaction-row" href="#" data-redirect="transaction-details.html" data-transition="slidefade">${statusMsg}</a></h4></td>

                        <td style="font-size:12px;">


                            <a style="color:#000" data-rel="${data.id}" class="transaction_row" href="#" data-redirect="transaction-details.html" data-transition="slidefade"><p style="font-size:11px;margin-top:8px">${finalDate}</p><span style="font-size:12px" class="${txtClass}">${subtotal}</span></a>

                        </td>
                    </tr>
                `;
            }
        }
    });
    if (outputPending == '')
    {
        $('.allPending tbody').html(`<h4 style="text-align:center;font-size:12px;">${noRecordFoundText}</h4>`);
    }
    if (outputPending != '')
    {
        $('.allPending tbody').html(outputPending);
    }
    if (outputSuccess == '')
    {
        $('.allSuccess tbody').html(`<h4 style="text-align:center;font-size:12px;">${noRecordFoundText}</h4>`);
    }
    if (outputSuccess != '')
    {
        $('.allSuccess tbody').html(outputSuccess);
    }
}




