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
                    <span class="value cgpa-value">${student.CGPA}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Status</span>
                    <span class="value">${statusText}</span>
                </div>
            </div>
        `;
    } catch (err) {
        profileArea.innerHTML = '';
        messageEl.textContent = err.message || 'Failed to load student.';
        messageEl.classList.add('error');
    }
});