document.getElementById('toggleButton').addEventListener('click', function() {
    // You can add functionality here to toggle the extension on and off
    // For now, it just toggles the displayed status text as an example
    const statusElem = document.getElementById('status');
    if (statusElem.textContent === "Active") {
        statusElem.textContent = "Inactive";
        statusElem.style.color = "red";
    } else {
        statusElem.textContent = "Active";
        statusElem.style.color = "green";
    }
});
