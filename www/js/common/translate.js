function Translate()
{
    //initialization
    this.init = function(attribute, attributePlace, lng)
    {
        this.attribute = attribute;
        this.attributePlace = attributePlace;
        this.lng = lng;
    }
    //translate
    this.process = function()
    {
        _self = this;
        var xrhFile = new XMLHttpRequest();

        //load content data
        xrhFile.open("GET", "./lang/" + this.lng + ".json", true);
        xrhFile.onreadystatechange = function()
        {
            if (xrhFile.readyState === 4)
            {
                if (xrhFile.status === 200 || xrhFile.status == 0)
                {
                    var LngObject = JSON.parse(xrhFile.responseText);
                    //console.log(LngObject["name1"]);
                    var allDom = document.getElementsByTagName("*");

                    //Set label or text
                    for (var i = 0; i < allDom.length; i++)
                    {
                        var elem = allDom[i];
                        var key = elem.getAttribute(_self.attribute);
                        if (key != null)
                        {
                            //console.log(key);
                            elem.innerHTML = LngObject[key];
                        }
                    }

                    //Set placeholder
                    for (var j = 0; j < allDom.length; j++)
                    {
                        var elem = allDom[j];
                        var key = elem.getAttribute(_self.attributePlace);
                        if (key != null)
                        {
                            elem.setAttribute('placeholder', LngObject[key]);
                        }
                    }
                }
            }
        }
        xrhFile.send();
        // console.log('translate.js loaded');
    }
}