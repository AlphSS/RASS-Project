
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector("form").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent form submission
        
        let email = document.getElementById("email").value.trim();
        let password = document.getElementById("password").value.trim();

        if (email === "" || password === "") {
            alert("Error: Email and Password cannot be empty.");
            return;
        }

        if (!validateEmail(email)) {
            alert("Error: Please enter a valid email.");
            return;
        }

        if (password.length < 6) {
            alert("Error: Password must be at least 6 characters long.");
            return;
        }

        alert("Registration successful!");
        // Submit form after validation
        this.submit();
    });

    function validateEmail(email) {
        let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});
