const express = require('express');
const bodyParser = require('body-parser');
const https=require('https');


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public',express.static(__dirname + '/public'));


app.get('/', (req, res) => {
   res.sendFile(__dirname +'/index.html');
})

app.post('/', (req, res) => {

    const city=req.body.cityName;

    const key=""; /*Write Your API Key from openweathermap.org here*/

    const url="https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=metric&appid="+key;
    
    https.get(url, (response) => {
        response.on('data', (data) => {
            const weather = JSON.parse(data);
            if(weather.cod === '404' || weather.cod === '400' ){
                res.send("<h1 style='text-align:center;font-size:6vh;' >Enter a valid City Name</h1>");
                return;
            }
            const temp=weather.main.temp;
            const humidity=weather.main.humidity;
            const weatherdetails=weather.weather[0].description;
            const icon=weather.weather[0].icon;
            const src="https://openweathermap.org/img/wn/"+icon+"@4x.png";
            
            res.write("<h1 style='text-align:center;font-size:6vh;'>Present temperatue of "+city+" is <spam style='color:red'>"+temp+"</spam> degree Celcius</h1>");
            res.write("<h2 style='text-align:center;font-size:5vh;'>"+weatherdetails+" </h2>");
            res.write("<h2 style='text-align:center;font-size:4vh;'>Humidity is "+humidity+"</h2>");
            res.write("<h2 style='text-align:center;font-size:4vh;'>Wind Speed is "+weather.wind.speed+" m/s </h2>");
            res.write("<h3 style='text-align:center;font-size:4vh;'>Today's minimum Temperature is "+weather.main.temp_min+" degree Celcius</h3>");
            res.write("<h3 style='text-align:center;font-size:4vh;'>Today's maximum Temperature is "+weather.main.temp_max+" degree Celcius</h3>");
            res.write("<img style='display: block;margin-left: auto;margin-right: auto;' src="+src+">");
            res.send();

        })
    })
    
})

app.listen(process.env.PORT||3000,(req, res) => {
    console.log("listening on port 3000");
})