window.addEventListener("load",()=>{
    $.getJSON("https://www.cbr-xml-daily.ru/latest.js", (course)=>{
        fx.base = course.base;
        fx.rates = course.rates;
        let USD = parseFloat($("#USD").html())
        $("#RUB").html(fx(USD).from("USD").to("RUB").toFixed(3));
        $("#EUR").html(fx(USD).from("USD").to("EUR").toFixed(3));
    });
});