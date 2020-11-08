// Get the modal
let modal = document.getElementById('id01');
let signUp = document.getElementById('signUpButton');
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
signUp.onclick = function(event) {
  if (event.target == signUp) {
    modal.style.display = "block";
  }
}
