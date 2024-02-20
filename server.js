const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to receive base64 encoded image
app.post('/detect-face', async (req, res) => {
    try {
        // Get base64 image data from request body
        const base64Data = req.body.image;
       // console.log(base64Data);

        var buf = Buffer.from(base64Data, 'base64');

        console.log(buf);
        const python = spawn('python', ['single_face.py']);
        python.stdin.write(base64Data);
        python.stdin.end(); // End the input stream


        python.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`);
        });
        
        python.stderr.on('data', (data) => {
          console.error(`stderr: ${data}`);
        });
        
        python.on('close', (code) => {
          console.log(`child process exited with code ${code}`);
          res.status(200).json("Succuess");
        });

        
        
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
