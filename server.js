const express = require('express');
const multer = require('multer');

const AWS = require('aws-sdk');

const app = express();

const {
    AWS_ACCESS_KEY,
    AWS_SECRET_ACCESS_KEY,
    PORT,
    S3_BUCKET
} = process.env;

const port = PORT;

app.use(express.static('dist'));

app.post('/save-details', (req, res) => {
    res.send('Something happened!');
});

app.get('/sign-s3', (req, res) => {
    const s3 = new AWS.S3({
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    });
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if(err){
            console.log(err);
            return res.end();
        }

        const returnData = {
            signedRequest: data,
            url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
        };

        console.log('putObject')

        res.write(JSON.stringify(returnData));
        res.end();
    });
});

// Serve the files.
app.listen(port, function () {
    console.log(`Upload app listening on port ${port}!\n`);
});
