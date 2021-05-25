window.onload = ()=>{
    let idc = document.getElementById("idc");
    idc.oninput = function() {
        var regexp = /^[a-z\-]+$/i;
        if(!regexp.test(idc.value)) {
            idc.value = idc.value.slice(0,-1);
            return false;
        }
    };
    let rank = document.getElementById("rank");
    rank.oninput = function() {
        var regexp = /^[0-9]+$/i;
        if(!regexp.test(rank.value)) {
            rank.value = rank.value.slice(0,-1);
            return false;
        }
    };
}