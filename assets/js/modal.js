var modal_id01 = document.getElementById('id01');
var modal_id02 = document.getElementById('id02');

window.onclick = function(event) {
    if (event.target == modal_id01) {
        modal_id01.style.display = "none";
    }
	if (event.target == modal_id02) {
        modal_id02.style.display = "none";
    }
}