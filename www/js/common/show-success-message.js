//Success Message
function showSuccessMessage(successMessage)
{
    $('.errorDiv').css('display', 'none');
    $(".successDiv").css('display', 'block');
    $('.showSuccess').text(successMessage);

    if ($('.alert-close').length == 0) {
        $('<a href="#" style="float:right;" class="alert-close" data-dismiss="alert">&times;</a>').insertAfter(".showSuccess"); //insert alert close element
    }

    $('.alert-close').click((e) => {
        // console.log(e);
        e.preventDefault();
        $('.successDiv').slideUp('slow');
    });
}


