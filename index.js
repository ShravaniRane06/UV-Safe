import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();


const app = express();
const port = 3000;
const API_URL = 'https://api.openuv.io/api/v1/uv';


app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

const token = process.env.API_KEY;

app.get('/', (req, res) => {
    res.render('home.ejs');
});

app.get('/home', (req, res) => {
    res.render('home.ejs');
});

app.get('/Scale', (req, res) => {
    res.render('uv-scale.ejs');
});

app.get('/Safety', (req, res) => {
    res.render('Safety.ejs');
});

app.get('/FAQs', (req, res) => {
    res.render('FAQs.ejs');
});

app.get('/check', (req, res) => {
    res.render('check.ejs',{
        uv:null,
        advice:null,
        color:null
    });
});

app.post('/check', async(req, res) => {
    const lat = req.body.latitude;
    const lng = req.body.longitude;
    try{
        console.log(`Fetching UV data for Latitude: ${lat}, Longitude: ${lng}`);
        const response = await axios.get(API_URL + '?lat=' + lat + '&lng=' + lng + '&alt=0',
            {headers: {'x-access-token': token}});
        const uv = response.data.result.uv;

        let color;
        let advice;

        if (uv < 3) {
            color = "green";
            advice = "Low UV index. No protection needed.";
        }
        else if (uv < 6) {
            color = "yellow";
            advice = "Moderate UV index. Consider wearing sunscreen.";
        }
        else if (uv < 8) {
            color = "orange";
            advice = "High UV index. Wear sunscreen and protective clothing.";
        }
        else if (uv < 11) {
            color = "red";
            advice = "Very high UV index. Take extra precautions, avoid the sun during midday hours.";
        }
        else {
            color = "purple";
            advice = "Extreme UV index. Stay indoors and avoid sun exposure.";
        }

        res.render('check.ejs', {
            uv,
            advice,
            color
        });

    }
    catch(error){
        console.log(error.response.data);
        res.status(500).send('Error fetching UV data');
    }
});


app.listen(port , () => {
    console.log(`Listening on ${port} .`);
});