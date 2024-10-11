// import express from 'express';
// import cors from 'cors';
// import multer from 'multer';
// import axios from 'axios';
// import FormData from 'form-data'; 
// import path from "path";

// const app = express();
// const PORT = process.env.PORT || 3002;

// app.use(cors());
// app.use(express.json()); // To parse JSON bodies
// app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// const storage = multer.memoryStorage();  
// const upload = multer({ storage: storage });

// // Serve the index.html file on GET requests
// app.get("/", (req, res) => {
//     res.sendFile(path.join(path.resolve(), 'views', 'index.html'));
// });

// // Handle POST requests to process audio
// app.post('/process_audio_returning_user', upload.single('audio'), async (req, res) => {
//     try {
//         const { product_data, reviews_data, average_rating, summary } = req.body;
//         const audioBuffer = req.file ? req.file.buffer : null; 

//         console.log('Processing /process_audio_returning_user request...');
//         console.log('Received data:');
//         console.log('Audio file:', audioBuffer ? 'Audio file received' : 'No audio file');
//         console.log('Product data:', product_data);
//         console.log('Reviews data:', reviews_data);
//         console.log('Average rating:', average_rating);
//         console.log('Summary:', summary);

//         if (!audioBuffer) {
//             return res.status(400).json({ error: 'Audio file is missing' });
//         }

//         const productDataObj = JSON.parse(product_data);
//         const formattedProductData = {
//             name: productDataObj.name,
//             description: productDataObj.description,
//             brand: productDataObj.brand,
//             price: productDataObj.price,
//             discountedPrice: productDataObj.discountedPrice,
//             currency: productDataObj.currency,
//             stock: productDataObj.stock,
//             InStock: productDataObj.InStock,
//             ribbon: productDataObj.ribbon,
//             productOptions: [
//                 {
//                     name: "Size",
//                     choices: productDataObj.size ? productDataObj.size.split(',').map(s => s.trim()) : []
//                 }
//             ]
//         };

//         const reviewsDataObj = JSON.parse(reviews_data);
//         const formattedReviewsData = {
//             items: [
//                 {
//                     title: reviewsDataObj.title,
//                     rating: reviewsDataObj.rating,
//                     content: reviewsDataObj.content
//                 }
//             ]
//         };

//         const formData = new FormData();
//         formData.append('audio', audioBuffer, { 
//             filename: 'audio.wav',
//             contentType: 'audio/wav'
//         });
//         formData.append('product_data', JSON.stringify(formattedProductData)); 
//         formData.append('reviews_data', JSON.stringify(formattedReviewsData));  
//         formData.append('average_rating', average_rating);  
//         formData.append('summary', summary);  

//         console.log('FormData prepared for external API');

//         const apiResponse = await axios.post(
//             'https://ai-product-marketor-6qimfbl7bq-uc.a.run.app/process_audio_returning_user/',
//             formData,
//             {
//                 headers: formData.getHeaders()  
//             }
//         );

//         // Send the response from the external API back to the client
//         res.json(apiResponse.data);

//     } catch (error) {
//         console.error('Error processing the request:', error.message);

//         if (error.response) {
//             console.error('API response error:', error.response.data);
//         }

//         res.status(500).json({ error: error.message });
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data'; 
import path from "path";

const app = express();
const PORT = process.env.PORT || 3003;

// CORS setup to allow all origins
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();  
const upload = multer({ storage: storage });

// Serve the index.html file on GET requests
app.get("/", (req, res) => {
    res.sendFile(path.join(path.resolve(), 'views', 'index.html'));
});

// Handle POST requests to process audio
app.post('/process_audio_returning_user', upload.single('audio'), async (req, res) => {
    try {
        const { product_data, reviews_data, average_rating, summary } = req.body;
        const audioBuffer = req.file ? req.file.buffer : null;

        if (!audioBuffer) {
            return res.status(400).json({ error: 'Audio file is missing' });
        }

        const productDataObj = JSON.parse(product_data);
        const formattedProductData = {
            name: productDataObj.name,
            description: productDataObj.description,
            brand: productDataObj.brand,
            price: productDataObj.price,
            discountedPrice: productDataObj.discountedPrice,
            currency: productDataObj.currency,
            stock: productDataObj.stock,
            InStock: productDataObj.InStock,
            ribbon: productDataObj.ribbon,
            productOptions: [
                {
                    name: "Size",
                    choices: productDataObj.size ? productDataObj.size.split(',').map(s => s.trim()) : []
                }
            ]
        };

        const reviewsDataObj = JSON.parse(reviews_data);
        const formattedReviewsData = {
            items: [
                {
                    title: reviewsDataObj.title,
                    rating: reviewsDataObj.rating,
                    content: reviewsDataObj.content
                }
            ]
        };

        const formData = new FormData();
        formData.append('audio', audioBuffer, { 
            filename: 'audio.wav',
            contentType: 'audio/wav'
        });
        formData.append('product_data', JSON.stringify(formattedProductData)); 
        formData.append('reviews_data', JSON.stringify(formattedReviewsData));  
        formData.append('average_rating', average_rating);  
        formData.append('summary', summary);  

        const apiResponse = await axios.post(
            'https://ai-product-marketor-6qimfbl7bq-uc.a.run.app/process_audio_returning_user/',
            formData,
            {
                headers: formData.getHeaders()  
            }
        );

        res.json(apiResponse.data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

