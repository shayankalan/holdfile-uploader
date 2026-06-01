const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

app.use('/uploads', express.static(uploadDir));

app.post('/upload', upload.array('files'), (req, res) => {

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            error: 'هیچ فایلی ارسال نشده است'
        });
    }

    res.json({
        message: 'فایل‌ها با موفقیت آپلود شدند',
        files: req.files.map(file => ({
            name: file.filename,
            url: `/uploads/${file.filename}`
        }))
    });

});

app.get('/files', (req, res) => {

    fs.readdir(uploadDir, (err, files) => {

        if (err) {
            return res.status(500).json({
                error: 'خطا در خواندن فایل‌ها'
            });
        }

        res.json(
            files.map(file => ({
                name: file,
                url: `/uploads/${file}`,
                download: `/download/${file}`
            }))
        );

    });

});

app.get('/download/:name', (req, res) => {

    const filePath = path.join(uploadDir, req.params.name);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            error: 'فایل پیدا نشد'
        });
    }

    res.download(filePath);

});

app.delete('/files/:name', (req, res) => {

    const filePath = path.join(uploadDir, req.params.name);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            error: 'فایل پیدا نشد'
        });
    }

    fs.unlink(filePath, err => {

        if (err) {
            return res.status(500).json({
                error: 'خطا در حذف فایل'
            });
        }

        res.json({
            message: 'فایل حذف شد'
        });

    });

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
