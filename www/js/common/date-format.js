Date.shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function shortMonth(dt)
{
    return Date.shortMonths[dt.getMonth() - 1];
}

function getDateFormat(value)
{
    // console.log(value);
    let date_format_type;
    let date_separator;
    let data;
    let first;
    let second;
    let third;
    let dateInfo;
    let datas;
    let year;
    let month;
    let day;

    //
    date_format_type = localStorage.getItem('date_format_type'); //got from getUserDateFormatForTransaction()
    date_separator = localStorage.getItem('date_sepa');  //got from getUserDateFormatForTransaction()
    //

    data = date_format_type.replace('/',date_separator).replace('.',date_separator).replace(' ',date_separator).replace('-',date_separator);
    data = data.split(date_separator);
    first  = data[0];
    second = data[1];
    third  = data[2];

    //
    var key = {
      '/': date_separator,
      '.': date_separator,
      ' ': date_separator,
      '-': date_separator,
    }
    dateInfo = value.replace(/[/. -]/g, (char) => key[char] || '');
    datas    = dateInfo.split(date_separator);
    year     = datas[0];
    month    = datas[1];
    day      = datas[2];
    // console.log(value);
    // return false;

    current_datetime  = new Date(year, month, day);
    if (first == 'yyyy' && second == 'mm' && third == 'dd')
    {
        value    = current_datetime.getFullYear() + date_separator + current_datetime.getMonth() + date_separator + current_datetime.getDate();
    }
    else if (first == 'dd' && second == 'mm' && third == 'yyyy')
    {
        value    = current_datetime.getDate() + date_separator + current_datetime.getMonth() + date_separator + current_datetime.getFullYear();
    }
    else if (first == 'mm' && second == 'dd' && third == 'yyyy')
    {
        value    = current_datetime.getMonth() + date_separator + current_datetime.getDate() + date_separator + current_datetime.getFullYear();
    }
    else if (first == 'dd' && second == 'M' && third == 'yyyy')
    {
        value = current_datetime.getDate() + date_separator + shortMonth(current_datetime) + date_separator + current_datetime.getFullYear();
    }
    else if (first == 'yyyy' && second == 'M' && third == 'dd')
    {
        value = current_datetime.getFullYear() + date_separator + shortMonth(current_datetime) + date_separator + current_datetime.getDate();
    }
    return value;
}


