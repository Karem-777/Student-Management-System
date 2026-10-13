document.addEventListener('DOMContentLoaded', async () => {
    const profileArea = document.getElementById('profileArea');
    const messageEl = document.getElementById('message');
    const studentId = window.STUDENT_ID;

    if (!studentId) {
        profileArea.innerHTML = '';
        messageEl.textContent = 'No student ID provided.';
        messageEl.classList.add('error');
        return;
    }

    try {
        const res = await fetch(`/api/v1/students/${studentId}`);
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Student not found');
        }

        const student = data.data.student;
        renderProfile(student);
        setupActions(student);
    } catch (err) {
        profileArea.innerHTML = '';
        messageEl.textContent = err.message || 'Failed to load student.';
        messageEl.classList.add('error');
    }

    function renderProfile(student) {
        const statusClass = student.status === 'currentStudent' ? 'current' : 'graduate';
        const statusText = student.status === 'currentStudent' ? 'Current Student' : 'Graduate Student';
        const initial = student.name.charAt(0).toUpperCase();

        profileArea.innerHTML = `
            <div class="profile-header">
                <div class="avatar">${initial}</div>
                <div class="profile-info">
                    <h2>${student.name}</h2>
                    <p class="student-id">ID: ${student.ID}</p>
                    <span class="status ${statusClass}">${statusText}</span>
                </div>
            </div>

            <div class="profile-details">
                <div class="detail-row">
                    <span class="label">Email</span>
                    <span class="value">${student.email}</span>
                </div>
                <div class="detail-row">
                    <span class="label">CGPA</span>
                    <span class="value cgpa-value" id="cgpaDisplay">${student.CGPA}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Status</span>
                    <span class="value">${statusText}</span>
                </div>
            </div>

            <div class="actions-section">
                <h3>Update CGPA</h3>
                <form id="updateForm" class="update-form">
                    <input
                        type="number"
                        id="cgpaInput"
                        min="0"
                        max="4"
                        step="0.01"
                        value="${student.CGPA}"
                        required
                    >
                    <button type="submit" id="updateBtn">Update</button>
                </form>

                <button type="button" id="deleteBtn" class="delete-btn">Delete Student</button>
            </div>
        `;
    }

    function setupActions(student) {
        const updateForm = document.getElementById('updateForm');
        const updateBtn = document.getElementById('updateBtn');
        const deleteBtn = document.getElementById('deleteBtn');
        const cgpaDisplay = document.getElementById('cgpaDisplay');

        // ----- UPDATE CGPA -----
        updateForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            messageEl.textContent = '';
            messageEl.className = '';

            const CGPA = parseFloat(document.getElementById('cgpaInput').value);

            if (isNaN(CGPA) || CGPA < 0 || CGPA > 4) {
                messageEl.textContent = 'CGPA must be a number between 0 and 4.';
                messageEl.classList.add('error');
                return;
            }

            updateBtn.disabled = true;
            updateBtn.textContent = 'Updating...';

            try {
                const res = await fetch(`/api/v1/students/${studentId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ CGPA })
                });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || 'Failed to update');
                }

                cgpaDisplay.textContent = data.data.updatedStudent.CGPA;
                messageEl.textContent = 'CGPA updated successfully!';
                messageEl.classList.add('success');
            } catch (err) {
                messageEl.textContent = err.message || 'Failed to update CGPA.';
                messageEl.classList.add('error');
            } finally {
                updateBtn.disabled = false;
                updateBtn.textContent = 'Update';
            }
        });

        // ----- DELETE STUDENT -----
        deleteBtn.addEventListener('click', async () => {
            const confirmed = confirm(`Are you sure you want to delete "${student.name}"? This cannot be undone.`);
            if (!confirmed) return;

            messageEl.textContent = '';
            messageEl.className = '';
            deleteBtn.disabled = true;
            deleteBtn.textContent = 'Deleting...';

            try {
                const res = await fetch(`/api/v1/students/${studentId}`, {
                    method: 'DELETE'
                });

                if (!res.ok && res.status !== 204) {
                    let msg = 'Failed to delete student';
                    try {
                        const data = await res.json();
                        msg = data.message || msg;
                    } catch (_) {}
                    throw new Error(msg);
                }

                messageEl.textContent = 'Student deleted. Redirecting...';
                messageEl.classList.add('success');
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            } catch (err) {
                messageEl.textContent = err.message || 'Failed to delete student.';
                messageEl.classList.add('error');
                deleteBtn.disabled = false;
                deleteBtn.textContent = 'Delete Student';
            }
        });
    }
});