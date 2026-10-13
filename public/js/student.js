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
                <div class="avatar" id="avatarDisplay">${initial}</div>
                <div class="profile-info">
                    <h2 id="nameDisplay">${student.name}</h2>
                    <p class="student-id" id="idDisplay">ID: ${student.ID}</p>
                    <span class="status ${statusClass}" id="statusBadge">${statusText}</span>
                </div>
            </div>

            <div class="profile-details">
                <div class="detail-row">
                    <span class="label">Email</span>
                    <span class="value" id="emailDisplay">${student.email}</span>
                </div>
                <div class="detail-row">
                    <span class="label">CGPA</span>
                    <span class="value cgpa-value" id="cgpaDisplay">${student.CGPA}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Status</span>
                    <span class="value" id="statusDisplay">${statusText}</span>
                </div>
            </div>

            <div class="actions-section">
                <h3>Update Student</h3>
                <form id="updateForm" class="full-update-form">
                    <div class="form-group">
                        <label for="updateID">Student ID</label>
                        <input type="text" id="updateID" value="${student.ID}" required>
                    </div>
                    <div class="form-group">
                        <label for="updateName">Full Name</label>
                        <input type="text" id="updateName" value="${student.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="updateEmail">Email</label>
                        <input type="email" id="updateEmail" value="${student.email}" required>
                    </div>
                    <div class="form-group">
                        <label for="updateCGPA">CGPA</label>
                        <input type="number" id="updateCGPA" min="0" max="4" step="0.01" value="${student.CGPA}" required>
                    </div>
                    <div class="form-group">
                        <label for="updateStatus">Status</label>
                        <select id="updateStatus">
                            <option value="currentStudent" ${student.status === 'currentStudent' ? 'selected' : ''}>Current Student</option>
                            <option value="GraduteStudent" ${student.status === 'GraduteStudent' ? 'selected' : ''}>Graduate Student</option>
                        </select>
                    </div>
                    <button type="submit" id="updateBtn">Save Changes</button>
                </form>

                <button type="button" id="deleteBtn" class="delete-btn">Delete Student</button>
            </div>
        `;
    }

    function setupActions(student) {
        const updateForm = document.getElementById('updateForm');
        const updateBtn = document.getElementById('updateBtn');
        const deleteBtn = document.getElementById('deleteBtn');

        // ----- UPDATE ANY FIELD -----
        updateForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            messageEl.textContent = '';
            messageEl.className = '';

            const ID = document.getElementById('updateID').value.trim();
            const name = document.getElementById('updateName').value.trim();
            const email = document.getElementById('updateEmail').value.trim();
            const CGPA = parseFloat(document.getElementById('updateCGPA').value);
            const status = document.getElementById('updateStatus').value;

            if (!ID || !name || !email) {
                messageEl.textContent = 'ID, name and email are required.';
                messageEl.classList.add('error');
                return;
            }

            if (isNaN(CGPA) || CGPA < 0 || CGPA > 4) {
                messageEl.textContent = 'CGPA must be a number between 0 and 4.';
                messageEl.classList.add('error');
                return;
            }

            updateBtn.disabled = true;
            updateBtn.textContent = 'Saving...';

            try {
                const res = await fetch(`/api/v1/students/${studentId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ID, name, email, CGPA, status })
                });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || 'Failed to update');
                }

                const updated = data.data.updatedStudent;
                const statusText = updated.status === 'currentStudent' ? 'Current Student' : 'Graduate Student';
                const statusClass = updated.status === 'currentStudent' ? 'current' : 'graduate';

                document.getElementById('nameDisplay').textContent = updated.name;
                document.getElementById('idDisplay').textContent = `ID: ${updated.ID}`;
                document.getElementById('emailDisplay').textContent = updated.email;
                document.getElementById('cgpaDisplay').textContent = updated.CGPA;
                document.getElementById('statusDisplay').textContent = statusText;
                document.getElementById('avatarDisplay').textContent = updated.name.charAt(0).toUpperCase();

                const badge = document.getElementById('statusBadge');
                badge.textContent = statusText;
                badge.className = `status ${statusClass}`;

                messageEl.textContent = 'Student updated successfully!';
                messageEl.classList.add('success');
            } catch (err) {
                messageEl.textContent = err.message || 'Failed to update student.';
                messageEl.classList.add('error');
            } finally {
                updateBtn.disabled = false;
                updateBtn.textContent = 'Save Changes';
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