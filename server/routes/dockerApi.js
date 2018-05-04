var express = require('express');
var router = express.Router();
var docker = require('./docker-lib');
var Promise = require("bluebird");
const uuidv1 = require('uuid/v1');
var Queue = require('bull');

global.Promise = Promise;
var maxConcurrent = 1;
var maxQueue = Infinity;

var dockerDownQueue = new Queue('docker_download_queue');


dockerDownQueue.process(function (job) {
    return docker.downloadImage(job.data.image, job.data.tag, job.opts.jobId);

    return Promise.reject(new Error(`error in dwonloaing docker image with jobId:${job.opts.jobId}`));
    return Promise.resolve({ jobId: job.opts.id });
});

/* GET api listing. */
router.get('/', (req, res) => {
    res.status(200).send('this is docker api get method.');
});


router.post('/downloadImage', function (req, res) {
    // generate taksId;
    var _jobId = uuidv1();
    var _image = req.body.image;
    var _tag = req.body.tag;

    // add image to download queue
    dockerDownQueue.add({ image: _image, tag: _tag }, { jobId: _jobId })
        .then(
            (job) => {
                console.log(`+++++ Added +++++ download job with id ${job.opts.jobId} added to queue Successfully.`);
                res.status(200).send();
            })
        .catch(
            (error) => {
                console.log('error message:' + error);
            });
});

dockerDownQueue.on('active', function (job, jobPromise) {
    console.log(`<<<<< Started >>>>> the download job with id ${job.opts.jobId} is started`);
})

dockerDownQueue.on('completed', function (job, jobPromise) {
    console.log(`>>>>> Completed <<<<< the download job with id ${job.opts.jobId} is completed`);
})

module.exports = router;
