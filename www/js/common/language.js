let getCurrentLng = window.localStorage.getItem('language');

//Store login selected language to Local Storage, if not already in local storage
if (getCurrentLng == null)
{
    var currentLng = 'en'; //'en'
    window.localStorage.setItem('language', currentLng);
}
else
{
    // var currentLng = getCurrentLng; //'fr' or others
    window.localStorage.setItem('language', getCurrentLng);

    //Set language
    setlanguage(getCurrentLng)
    .then(currentLng =>
    {
        // console.log(currentLng);

        //Set dynamic Jquery validation message
        setDynamicJqueryValidationMessages(currentLng);
    })
    .catch(error => {
        console.log(error);
    });
}

function setlanguage(currentLng)
{
    var promiseObj = new Promise(function(resolve, reject)
    {
        // console.log(currentLng);
        var translate = new Translate();
        var attributeName = 'data-localize';
        var attributePlaceholder = 'data-placeholder';
        $("#language option[value='" + currentLng + "']").attr('selected', 'selected');
        translate.init(attributeName, attributePlaceholder, currentLng);
        translate.process();
        resolve(currentLng);
        // console.log("Language initialized...");
    });
    return promiseObj;
}

function setDynamicJqueryValidationMessages(getCurrentLng)
{
    var promiseObj = new Promise(function(resolve, reject)
    {
        if (getCurrentLng == 'fr')
        {
            // console.log(jQuery.validator);

            if (jQuery.validator != undefined)
            {
                jQuery.extend(jQuery.validator.messages,
                {
                    required: "Ce champ est obligatoire.",
                    email: 'Veuillez entrer une adresse email valide',
                });
            }
        }
        resolve(getCurrentLng);
        // console.log("language.js loaded");
    });
    return promiseObj;
}