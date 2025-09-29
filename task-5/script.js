document.getElementById('userForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const output = document.getElementById('output');
    output.innerHTML = <div class="alert alert-success" role="alert">Thank you, ${name}! Your email (${email}) was submitted successfully.</div>;
    this.reset();
});
