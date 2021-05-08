function numberWithCommas(x)
{
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function numberWithDot(x)
{
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",");
}

/**
 * [formats number by comma and dot]
 */
function getDecimalNumberFormat(num = 0)
{
    let seperator = window.localStorage.getItem('thousand_separator');
    let decimal_format = window.localStorage.getItem('decimal_format_amount');
    if (seperator != null && decimal_format != null)
    {
        num = parseFloat(num).toFixed(decimal_format);
        if (seperator == '.')
        {
            num = numberWithDot(num);
        }
        else if (seperator == ',')
        {
            num = numberWithCommas(num);
        }
        return num;
    }
}

/**
 * [amount format before and after]
 */
function getMoneyFormat(symbol, amount)
{
    let symbol_position = window.localStorage.getItem('money_format');
    if (symbol_position != null)
    {
        if (symbol_position == "before")
        {
            amount = symbol + ' ' + amount;
        }
        else if (symbol_position == "after")
        {
            amount = amount + ' ' + symbol;
        }
        return amount;
    }
}