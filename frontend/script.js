const API_URL = 'http://192.168.1.13:3000';

const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const uploadBtn = document.getElementById('uploadBtn');
const refreshBtn = document.getElementById('refreshBtn');
const selectedFilesList = document.getElementById('selectedFiles');
const uploadedFilesList = document.getElementById('uploadedFiles');
const message = document.getElementById('message');

let selectedFiles = [];

function showMessage(text, type = '') {
    message.textContent = text;
    message.className = 'message ' + type;
}

function formatBytes(bytes) {

    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];

    const i = Math.floor(
        Math.log(bytes) / Math.log(k)
    );

    return (
        parseFloat(
            (bytes / Math.pow(k, i)).toFixed(2)
        ) +
        ' ' +
        sizes[i]
    );
}

function renderSelectedFiles() {

    selectedFilesList.innerHTML = '';

    if (selectedFiles.length === 0) {

        selectedFilesList.innerHTML =
            '<li class="file-item">هیچ فایلی انتخاب نشده است</li>';

        return;
    }

    selectedFiles.forEach((file, index) => {

        const li = document.createElement('li');

        li.className = 'file-item';

        li.innerHTML = `
            <span>
                ${file.name}
                (${formatBytes(file.size)})
            </span>

            <button
                class="secondary remove-btn"
                data-index="${index}"
            >
                حذف
            </button>
        `;

        selectedFilesList.appendChild(li);

    });

    document.querySelectorAll('.remove-btn')
        .forEach(btn => {

            btn.addEventListener('click', e => {

                const index =
                    parseInt(
                        e.target.dataset.index
                    );

                selectedFiles.splice(index, 1);

                renderSelectedFiles();

            });

        });

}

function updateSelectedFiles(files) {

    const incoming = Array.from(files);

    selectedFiles = [
        ...selectedFiles,
        ...incoming
    ];

    renderSelectedFiles();

}

fileInput.addEventListener('change', e => {

    updateSelectedFiles(e.target.files);

    fileInput.value = '';

});

dropZone.addEventListener('dragover', e => {

    e.preventDefault();

    dropZone.classList.add('dragover');

});

dropZone.addEventListener('dragleave', () => {

    dropZone.classList.remove('dragover');

});

dropZone.addEventListener('drop', e => {

    e.preventDefault();

    dropZone.classList.remove('dragover');

    updateSelectedFiles(
        e.dataTransfer.files
    );

});

uploadBtn.addEventListener('click', async () => {

    if (selectedFiles.length === 0) {

        showMessage(
            'ابتدا فایل انتخاب کنید',
            'error'
        );

        return;
    }

    const formData = new FormData();

    selectedFiles.forEach(file => {

        formData.append(
            'files',
            file
        );

    });

    try {

        showMessage(
            'در حال آپلود...',
            ''
        );

        const response =
            await fetch(
                `${API_URL}/upload`,
                {
                    method: 'POST',
                    body: formData
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.error
            );
        }

        showMessage(
            data.message,
            'success'
        );

        selectedFiles = [];

        renderSelectedFiles();

        loadUploadedFiles();

    } catch (error) {

        showMessage(
            error.message,
            'error'
        );

    }

});

refreshBtn.addEventListener(
    'click',
    loadUploadedFiles
);

async function deleteFile(name) {

    try {

        const response =
            await fetch(
                `${API_URL}/files/${encodeURIComponent(name)}`,{
                    method: 'DELETE'
                }
            );

        const data =
            await response.json();

        showMessage(
            data.message,
            'success'
        );

        loadUploadedFiles();

    } catch {

        showMessage(
            'خطا در حذف فایل',
            'error'
        );

    }

}

async function loadUploadedFiles() {

    try {

        const response =
            await fetch(
                `${API_URL}/files`
            );

        const files =
            await response.json();

        uploadedFilesList.innerHTML = '';

        if (
            !Array.isArray(files) ||
            files.length === 0
        ) {

            uploadedFilesList.innerHTML =
                '<li class="file-item">فایلی وجود ندارد</li>';

            return;
        }

        files.forEach(file => {

            const li =
                document.createElement('li');

            li.className =
                'file-item';

            li.innerHTML = `
                <span>
                    ${file.name}
                </span>

                <div>

                    <a
                    href="${API_URL}${file.download}"
                    target="_blank"
                    >
                    دانلود
                    </a>

                    <button
                    class="secondary"
                    onclick="deleteFile('${file.name}')"
                    >
                    حذف
                    </button>

                </div>
            `;

            uploadedFilesList.appendChild(li);

        });

    } catch {

        uploadedFilesList.innerHTML =
            '<li class="file-item">خطا در دریافت فایل‌ها</li>';

    }

}

renderSelectedFiles();
loadUploadedFiles();

window.deleteFile = deleteFile;
