import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import upload from './multerUploader/multer.js'
import cors from "cors";
import path from "path"
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 9000;



// Middleware setup
app.use(cors());
app.use(express.json());


// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Handle GET requests to serve the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});




// Set up multer for file uploads
// const upload = multer({ dest: 'uploads/' });



// Define the page sizes for A0, A1, A2, A3, A4 (in points, 1 point = 1/72 inch)
const pageSizes = {
    'A0': [2384, 3370],
    'A1': [1684, 2384],
    'A2': [1191, 1684],
    'A3': [842, 1191],
    'A4': [595, 842],
};

function classifyPageSize(width, height) {
    // Convert dimensions to the closest standard size
    const sortedSizes = Object.entries(pageSizes).sort((a, b) =>
        Math.abs(a[1][0] - width) + Math.abs(a[1][1] - height) -
        (Math.abs(b[1][0] - width) + Math.abs(b[1][1] - height))
    );

    return sortedSizes[0][0];
}

async function getPageSizes(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(fileBuffer);

    const pages = pdfDoc.getPages();
    const pageData = pages.map((page, index) => {
        const { width, height } = page.getSize();
        const sizeName = classifyPageSize(width, height);
        return { pageNo: index + 1, pageType: sizeName };
    });

    return pageData;
}

// app.post('/upload', upload.single('pdf'), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: 'No file uploaded' });
//         }

//         const result = await getPageSizes(req.file.path);

//         // Remove the uploaded file after processing
//         fs.unlinkSync(req.file.path);

//         res.status(200).json({ success: true, message: "page data", result: result });
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ message: 'An error occurred', error });
//     }
// });


app.post('/testing', upload.single('pdf'), async (req, res) => {
    return res.status(200).json({ success: true, message: "file save successfully" });
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
