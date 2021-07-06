window.addEventListener("load",()=>{
    $.getJSON("https://www.cbr-xml-daily.ru/daily_json.js", (course)=>{
        let EUR = course.Valute.EUR.Value;
        let USD = course.Valute.USD.Value;
        let valute = parseFloat($("#RUB").html())
        EUR = (valute/EUR).toFixed(3);
        USD = (valute/USD).toFixed(3);
        $("#USD").html(USD);
        $("#EUR").html(EUR);
    });
});