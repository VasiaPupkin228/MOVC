function replacespec(text){
    let urlspec = new RegExp(/url\(.+\)/g);
    let imgspec = new RegExp(/img\(.*?\)/g);
    let boldspec = new RegExp(/bold\(.*?\)/g);
    let customoption = new RegExp(/custom\(.*?\)/g);

    text = text.replace(/&/g, "&amp;");
    text = text.replace(/</g, "&lt;");
    text = text.replace(/>/g, "&gt;");
    text = text.replace(/"/g, "&quot;");

    try{
        let img = text.match(imgspec);
        for(let i = 0; i<img.length; i++){
            text = text.replace(img[i], `</br><img class="w-100 bordert" src=${img[i].slice(4, -1)}></br>`);
        }
    } catch{}

    try{
        let url = text.match(urlspec);
        for(let i = 0; i<url.length; i++){
            text = text.replace(url[i], `<a href=${url[i].slice(4, -1)} title=${url[i].slice(4, -1)}>${url[i].slice(4, -1).slice(0, 50)}...</a>`)
        }
    } catch{}

    try{
        let bold = text.match(boldspec);
        for(let i = 0; i<bold.length; i++){
            text = text.replace(bold[i], `<b>${bold[i].slice(5, -1)}</b>`)
        }
    } catch{}

    try{
        let custom = text.match(customoption);
        for(let i = 0; i<custom.length; i++){
            let args = (custom[i].slice(7, -1)).split(",")
            text = text.replace(custom[i], `<div class="row"><span><b>${args[0]}: </b>${args[1]}</span></div></b>`)
        }
    } catch (e){console.log(e)}


    text = text.replace(/\n/g, "<br>");
    return text;
}

module.exports = {
    replacespec
}