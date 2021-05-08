//Navigate To Next
function navigateTo(section_id, title, previous_page_id)
{
    if (title == null) title = '';
    navTitleStack.push(title);
    navCount += 1;
    navStack.push(section_id);
    //$('.ui-content').hide();
    $('#' + previous_page_id).fadeOut('fast', function()
    {
        $(this).addClass('animate-center-to-left');
        $(this).removeClass('animate-center-to-left');
        // $(this).removeClass('animate-right-to-center');
    });
    $('#' + previous_page_id).fadeOut('slow');
    $('#' + section_id).fadeIn('slow');
    $('.nav_center_logo .p-title h2').html(title);
    clearErrorMessage();
}

function clearErrorMessage()
{
    $('.showError').text('');
    $('.errorDiv').hide();
}