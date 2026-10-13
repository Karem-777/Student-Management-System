document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const messageEl = document.getElementById('message');
    const searchBtn = document.getElementById('searchBtn');
    const resultArea = document.getElementById('resultArea');

    if (!searchForm) return;

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const studentID = document.getElementById('studentID').value.trim();
        messageEl.textContent = '';
        messageEl.className = '';
        resultArea.innerHTML = '';

        if (!studentID) {
            messageEl.textContent = 'Please enter a student ID.';
            messageEl.classList.add('error');
            return;
        }

        searchBtn.disabled = true;
        searchBtn.textContent = 'Searching...';

        try {
            const res = await fetch('/api/v1/students/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ID: studentID })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Student not found');
            }

            const student = data.data.student;
            const statusClass = student.status === 'currentStudent' ? 'current' : 'graduate';
            const statusText = student.status === 'currentStudent' ? 'Current' : 'Graduate';

            resultArea.innerHTML = `
                <a href="/student/${student._id}" class="student-card">
                    <div class="card-header">
                        <span class="student-id">ID: ${student.ID}</span>
                        <span class="status ${statusClass}">${statusText}</span>
                    </div>
                    <div class="card-body">
                        <h3>${student.name}</h3>
                        <p class="email">📧 ${student.email}</p>
                        <p class="cgpa">CGPA: <strong>${student.CGPA}</strong></p>
                    </div>
                    <div class="card-footer">
                        Click to view full profile →
                    </div>
                </a>
            `;
        } catch (err) {
            console.error('Search error:', err);
            messageEl.textContent = err.message || 'Student not found.';
            messageEl.classList.add('error');
        } finally {
            searchBtn.disabled = false;
            searchBtn.textContent = 'Search';
        }
    });
});