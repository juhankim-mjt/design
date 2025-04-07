document.getElementById('myCheckbox').addEventListener('change', function () {
  const label = document.getElementById('mytickets');
  if (this.checked) {
    label.classList.add('strike');
  } else {
    label.classList.remove('strike');
  }
});