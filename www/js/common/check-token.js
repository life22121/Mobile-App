/**
 * [Check token]
 */
$(window).bind('load click', function()
{
    if (localStorage.getItem('token') == null && localStorage.getItem('user_id') == null)
    {
        window.location.href = 'login.html';
    }
});
