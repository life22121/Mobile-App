//Error Message
function showErrorMessage(errorMessage)
{
    $(".successDiv").css('display', 'none');
    $('.errorDiv').css('display', 'block');
    $('.showError').text(errorMessage);

    if ($('.alert-close').length == 0) {
        $('<a href="#" style="float:right;" class="alert-close" data-dismiss="alert">&times;</a>').insertAfter(".showError"); //insert alert close element
    }

    $('.alert-close').click((e) => {
        // console.log(e);
        e.preventDefault();
        $('.errorDiv').slideUp('slow');
    });
}