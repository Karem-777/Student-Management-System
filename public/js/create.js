document.addEventListener('DOMContentLoaded', () => {
    const createForm = document.getElementById('createForm');
    const messageEl = document.getElementById('message');
    const createBtn = document.getElementById('createBtn');

    if (!createForm) return;

    createForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const ID = document.getElementById('ID').value.trim();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();

        messageEl.textContent = '';
        messageEl.className = '';

        if (!ID || !name || !email) {
            messageEl.textContent = 'Please fill in all fields.';
            messageEl.classList.add('error');
            return;
        }

        createBtn.disabled = true;
        createBtn.textContent = 'Creating...';

        try {
            const res = await fetch('/api/v1/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ID, name, email })
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to create student');
            }

            messageEl.textContent = 'Student created successfully!';
            messageEl.classList.add('success');
            createForm.reset();

            const newId = data.data.newStudent._id;
            setTimeout(() => {
                window.location.href = `/student/${newId}`;
            }, 1200);
        } catch (err) {
            messageEl.textContent = err.message || 'Failed to create student.';
            messageEl.classList.add('error');
        } finally {
            createBtn.disabled = false;
            createBtn.textContent = 'Create Student';
        }
    });
});