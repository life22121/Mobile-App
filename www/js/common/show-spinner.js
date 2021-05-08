//Show Spinner
function showSpinnerWithButtonDisabled(reviewSubmitId, reviewSpinnerId, reviewSpinnerText)
{
    $(".spinner").show();
    $(reviewSpinnerId).text(reviewSpinnerText);
    $(reviewSubmitId).attr("disabled", true);
}