window.addEventListener("load",()=>{
    $.getJSON("/courses", (course)=>{
        fx.base = course.base;
        fx.rates = course.rates;
        let USD = parseFloat($("#USD").html())
        $("#RUB").html(fx(USD).from("USD").to("RUB").toFixed(3));
        $("#EUR").html(fx(USD).from("USD").to("EUR").toFixed(3));
        Object.keys(course.rates).sort((a, b) => a.localeCompare(b)).forEach((val)=>{
            $("#code").append(`<option>${val}</option>`);
            $("#fcode").append(`<option>${val}</option>`);
        });
    });
    $("#get").on("click", ()=>{
        try{
            let amount = parseFloat($("#amount").val());
            let idc = $("#id").attr("content")||$("#fcode").val();
            let code = $("#code").val();
            $("#coursetotal").html(amount+" "+idc+" = "+fx(amount).from(idc).to(code).toFixed(3)+" "+code);
        } catch{
            $("#coursetotal").html("Валюта для перевода не найдена");
        }
        window.scrollTo(0, 0);
    });
});