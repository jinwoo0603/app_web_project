document.addEventListener('DOMContentLoaded', () => {
    // "Write new Note" 버튼 클릭 시
    const writeButton = document.getElementById('write');
    writeButton.addEventListener('click', () => {
        window.location.href = '/note/new'; // 새로운 노트 작성 페이지로 이동
    });

    // "Sign Out" 버튼 클릭 시
    const logoutButton = document.getElementById('logout');
    logoutButton.addEventListener('click', async () => {
        try {
            const response = await axios.post('/logout');
            if (response.status === 200) {
                window.location.href = '/login'; // 로그아웃 후 로그인 페이지로 이동
            }
        } catch (error) {
            console.error('Logout failed:', error);
            alert('Failed to log out. Please try again.');
        }
    });

    // 노트 삭제 버튼 처리
    const deleteButtons = document.querySelectorAll('input[name="delete"]');
    deleteButtons.forEach((button) => {
        button.addEventListener('click', async (event) => {
            const noteContainer = event.target.closest('.note-container');
            const noteId = noteContainer.querySelector('a').href.split('/').pop(); // 노트 ID 추출

            if (confirm('Are you sure you want to delete this note?')) {
                try {
                    const response = await axios.delete(`/note/${noteId}`);
                    if (response.status === 200) {
                        noteContainer.remove(); // 노트 UI에서 삭제
                        alert('Note deleted successfully.');
                    }
                } catch (error) {
                    console.error('Failed to delete note:', error);
                    alert('Failed to delete the note. Please try again.');
                }
            }
        });
    });

    // 노트 수정 버튼 처리
    const editButtons = document.querySelectorAll('input[name="edit"]');
    editButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            const noteContainer = event.target.closest('.note-container');
            const noteId = noteContainer.querySelector('a').href.split('/').pop(); // 노트 ID 추출

            window.location.href = `/note/${noteId}/edit`; // 노트 수정 페이지로 이동
        });
    });
});
