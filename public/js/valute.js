window.addEventListener("load",()=>{
    $.getJSON("/courses", (course)=>{
        fx.base = course.base;
        fx.rates = course.rates;
        let USD = parseFloat($("#USD").html())
        $("#RUB").html(fx(USD).from("USD").to("RUB").toFixed(3));
        $("#EUR").html(fx(USD).from("USD").to("EUR").toFixed(3));
    });
    $("#get").on("click", ()=>{
        try{
            let amount = parseFloat($("#amount").val());
            let idc = $("#id").attr("content");
            let code = $("#code").val();
            $("#coursetotal").html(fx(amount).from(idc).to(code).toFixed(3));
        } catch{
            $("#coursetotal").html("Валюта для перевода не найдена");
        }
    });
});