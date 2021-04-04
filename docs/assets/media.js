let code
function addCode(code) {
            document.getElementById("s").innerHTML += code ;
        }

if (document.documentElement.clientWidth < 900){
    addcode("<script type="text/javascript" src="{{ site.baseurl }}/assets/scriptm.js"></script>");
    }
else {
    addcode("<script type="text/javascript" src="{{ site.baseurl }}/assets/script.js"></script>");      
}
