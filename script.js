document.addEventListener('DOMContentLoaded', () => {
    const fileUploadArea = document.querySelector('.file-upload-area');
    const fileInput = document.getElementById('file-upload');

    if (fileUploadArea) {
        fileUploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = '#3498db';
        });

        fileUploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = '#ddd';
        });

        fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = '#ddd';
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                // Optionally, display file name
                const p = fileUploadArea.querySelector('p');
                p.textContent = files[0].name;
            }
        });
    }

    const form = document.querySelector('.cta-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real application, you would handle form submission here.
            // For this static version, we can just show an alert.
            alert('Dziękujemy! Formularz został wysłany (symulacja).');
            form.reset();
            const p = fileUploadArea.querySelector('p');
            p.textContent = 'Przeciągnij i upuść plik tutaj lub kliknij, aby wybrać';
        });
    }
});
