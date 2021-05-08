function availableWalletsBalance()
{
    $.ajax(
    {
        url: request_url('available-balance'),
        type: 'GET',
        data:
        {
            'user_id': window.localStorage.getItem('user_id')
        },
        dataType: 'json',
        beforeSend: function(xhr)
        {
            xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET');
            xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
            $('.loader').css('display', 'block'); //show loader
        },
    })
    .done(function(data)
    {
        $('.loader').css('display', 'none'); //hide loader
        $('#ptr').css('display', 'block'); //show page

        //show users available wallet balances - starts
        let datas = data.wallets;
        let output = '';
        $.each(datas, function(index, data)
        {
            console.log(data.curr_code);
            let defaultLabelText = (window.localStorage.getItem('language') == 'fr') ? 'Défaut' : 'Default';
            output += `<li>
                <div class="feat_small_details">
                    <h4 style="font-size: 14px" class="currency">${data.is_default == 'Yes' ? data.curr_code + ' <span style="color: #fff;background-color: #6c757d;display: inline-block;padding: .25em .4em;font-size: 75%;font-weight: 700;line-height: 1;text-align: center;white-space: nowrap;vertical-align: baseline;border-radius: .25rem;">' + defaultLabelText + '</span>' : data.curr_code}
                    </h4>
                </div>
                <div class="feat_small_details currencyAmount" style="float: right;"><h4 style="font-size: 14px">${data.balance}</h4></div>
            </li>`;
        });
        $('.features_list_detailed').html(output);
        //show users available wallet balances - ends
    })
    .fail(function(error)
    {
        console.log(error.responseText);
        return false;
    });
}