document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content'); // textarea 요소 선택
    const previewFrame = document.getElementById('preview'); // iframe 요소 선택

    // textarea 내용이 변경될 때마다 실행
    content.addEventListener('input', () => {
        const markdownText = content.value; // textarea 내부 값 가져오기
        const htmlContent = marked(markdownText); // 마크다운을 HTML로 변환
        const previewDocument = previewFrame.contentDocument || previewFrame.contentWindow.document; // iframe의 문서 객체 가져오기

        previewDocument.open(); // iframe 문서 초기화
        previewDocument.write(htmlContent); // 변환된 HTML 삽입
        previewDocument.close(); // 문서 닫기
    });
});
