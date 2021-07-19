window.onload = ()=>{
    var idc = document.getElementById("idc");
    idc.oninput = function() {
        var regexp = /^[a-z\-]+$/i;
        if(!regexp.test(idc.value)) {
            idc.value = idc.value.slice(0,-1);
        }
    };
    var img = document.getElementById("img");
    img.oninput = function() {
        var regexp = /^https?:\/\/\S+(?:.jpg|.jpeg|.png)\?\S+$/;
        if(img.value){
            if(!regexp.test(img.value)) {
                    img.style.backgroundColor = "#ff8a8a";
                    document.getElementById("send").disabled = true;
                    document.getElementById("send").value = "Чтобы отправить заявку, заполните форму нормально";
            } else{
                img.style.backgroundColor = "white"
                document.getElementById("send").disabled = false
            }
        } else{
            img.style.backgroundColor = "white"
            document.getElementById("send").disabled = false
            document.getElementById("send").value = "Отправить";
        }
    }
    var rank = document.getElementById("rank");
    rank.oninput = function() {
        var regexp = /^[0-9]+$/i;
        if(!regexp.test(rank.value)) {
            rank.value = rank.value.slice(0,-1);
        }
    };
}