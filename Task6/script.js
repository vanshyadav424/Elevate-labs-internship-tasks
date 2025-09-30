const form = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const submitBtn = document.querySelector("button[type='submit']");
const successMessage = document.getElementById("successMessage");

function initForm() {
    form.addEventListener("submit", handleFormSubmission);
    addRealTimeValidation();
}

function addRealTimeValidation() {
    [nameInput, emailInput, messageInput].forEach(input => {
        input.addEventListener("blur", () => validateField(input));
        input.addEventListener("input", () => clearFieldError(input));
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = "";
    
    clearFieldError(field);
    
    if (field.id === "name") {
        if (value === "") errorMessage = "Name is required";
        else if (value.length < 2) errorMessage = "Name must be at least 2 characters";
    } else if (field.id === "email") {
        if (value === "") errorMessage = "Email is required";
        else if (!isValidEmail(value)) errorMessage = "Please enter a valid email address";
    } else if (field.id === "message") {
        if (value === "") errorMessage = "Message is required";
        else if (value.length < 10) errorMessage = "Message must be at least 10 characters";
    }
    
    if (errorMessage) {
        showFieldError(field, errorMessage);
        isValid = false;
    }
    
    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFieldError(field, message) {
    const errorElement = document.getElementById(field.id + "Error");
    errorElement.textContent = message;
    errorElement.style.display = "block";
}

function clearFieldError(field) {
    const errorElement = document.getElementById(field.id + "Error");
    errorElement.textContent = "";
    errorElement.style.display = "none";
}

async function handleFormSubmission(e) {
    e.preventDefault();
    
    const isNameValid = validateField(nameInput);
    const isEmailValid = validateField(emailInput);
    const isMessageValid = validateField(messageInput);
    
    if (!isNameValid || !isEmailValid || !isMessageValid) {
        const firstErrorField = [nameInput, emailInput, messageInput].find(input => 
            document.getElementById(input.id + "Error").style.display === "block"
        );
        if (firstErrorField) firstErrorField.focus();
        return;
    }
    
    showLoadingState();
    
    try {
        await simulateSubmission();
        showSuccessMessage();
        resetForm();
    } catch (error) {
        showErrorMessage("An error occurred. Please try again.");
    } finally {
        hideLoadingState();
    }
}

function simulateSubmission() {
    return new Promise(resolve => setTimeout(resolve, 1000));
}

function showLoadingState() {
    submitBtn.textContent = "Submitting...";
    submitBtn.disabled = true;
}

function hideLoadingState() {
    submitBtn.textContent = "Send Message";
    submitBtn.disabled = false;
}

function showSuccessMessage() {
    successMessage.textContent = "🎉 Thank you! Your message has been sent successfully.";
    successMessage.style.display = "block";
    setTimeout(() => successMessage.style.display = "none", 5000);
}

function showErrorMessage(message) {
    successMessage.textContent = message;
    successMessage.style.display = "block";
}

function resetForm() {
    form.reset();
    [nameInput, emailInput, messageInput].forEach(clearFieldError);
    nameInput.focus();
}

document.addEventListener("DOMContentLoaded", initForm);
