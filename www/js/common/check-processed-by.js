function checkMoneyProcessedBy()
{
    $.ajax(
    {
        url: request_url('check-processed-by'),
        type: 'GET',
        data: {},
        dataType: 'json',
        beforeSend: function(xhr)
        {
            xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET');
            xhr.setRequestHeader('Authorization-Token', `${window.localStorage.getItem('token')}`);
        },
    })
    .done(function(response)
    {
        // console.log(response);
        if (response.processedBy == "email")
        {
           $('#email').attr("placeholder", (window.localStorage.getItem('language') == 'fr') ? 'S\'il vous plaît entrer email valide (ex: user@gmail.com)' : 'Please enter valid email (ex: user@gmail.com)');
        }
        else if (response.processedBy == "phone")
        {
           $('#email').attr("placeholder", (window.localStorage.getItem('language') == 'fr') ? 'Veuillez entrer un téléphone valide (ex: +12015550123)' : 'Please enter valid phone (ex: +12015550123)');
        }
        else if (response.processedBy == "email_or_phone")
        {
             $('#email').attr("placeholder", (window.localStorage.getItem('language') == 'fr') ? 'Veuillez entrer un email valide (ex: utilisateur@gmail.com) ou un téléphone (ex: +12015550123)' :'Please enter valid email (ex: user@gmail.com) or phone (ex: +12015550123)');
        }
        $('#email').attr("data-processedBy", response.processedBy);
    })
    .fail(function(error)
    {
        console.log(error);
    });
}