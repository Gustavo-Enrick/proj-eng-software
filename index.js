// Variáveis
const dropdownItems = document.querySelectorAll('.dropdown-item');
const dropdownButton = document.getElementById('dropdownButton');

dropdownItems.forEach(item => {
    item.addEventListener('click', function() {
        
        const selectedValue = item.value;
        console.log("Valor selecionado:", selectedValue);
        dropdownButton.remove();
        item.closest('.dropdown-menu').remove();
    });
});
