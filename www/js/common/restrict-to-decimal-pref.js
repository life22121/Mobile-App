function restrictNumberToPrefdecimalPlaces(numStr)
{
    let output;
    let decimaFormat = localStorage.getItem('decimal_format_amount');
    if (numStr.length > 0 && !isNaN(numStr))
    {
        switch (decimaFormat)
        {
            case '1':
                output = numStr.match(/^-?\d+(?:\.\d{0,1})?/)[0];
                break;
            case '2':
                output = numStr.match(/^-?\d+(?:\.\d{0,2})?/)[0];
                break;
            case '3':
                output = numStr.match(/^-?\d+(?:\.\d{0,3})?/)[0]
                break;
            case '4':
                output = numStr.match(/^-?\d+(?:\.\d{0,4})?/)[0]
                break;
            case '5':
                output = numStr.match(/^-?\d+(?:\.\d{0,5})?/)[0]
                break;
            case '6':
                output = numStr.match(/^-?\d+(?:\.\d{0,6})?/)[0]
                break;
            case '7':
                output = numStr.match(/^-?\d+(?:\.\d{0,7})?/)[0]
                break;
            case '8':
                output = numStr.match(/^-?\d+(?:\.\d{0,8})?/)[0]
                break;
        }
    }
    return output;
}