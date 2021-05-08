//Hide Spinner
function hideSpinnerWithButtonEnabled(reviewSubmitId, reviewSpinnerId, reviewSpinnerText)
{
    $(".spinner").hide();
    $(reviewSpinnerId).text(reviewSpinnerText);
    $(reviewSubmitId).removeAttr("disabled");
}