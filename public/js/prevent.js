window.onload = ()=>{
    let input = document.getElementById("idc");

    input.oninput = function() {
        var regexp = /^[a-z\-]+$/i;
        if(!regexp.test(input.value)) {
            input.value = input.value.slice(0,-1);
            return false;
        }
    };
}