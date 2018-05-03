var express = require('express');
var router = express.Router();
var docker = require('./docker-lib');
var Promise = require("bluebird");
const PQueue = require('p-queue');
const uuidv1 = require('uuid/v1');

// var Queue = require('promise-queue');
global.Promise = Promise;
// Queue.configure(require('bluebird'));
var maxConcurrent = 1;
var maxQueue = Infinity;
// var queue = new Queue(maxConcurrent, maxQueue);
const queue = new PQueue({ concurrency: maxConcurrent });

/* GET api listing. */
router.get('/', (req, res) => {
    res.status(200).send('this is docker api get method.');
});


router.post('/downloadImage', function (req, res) {
    // generate taksId;
    id = uuidv1();

    var image = req.body.image;
    var tag = req.body.tag;

    // add image to download queue
    queue.add(() => docker.downloadImage(image, tag, id)
        .then(
            (taskId) => { console.log(`download task with id ${taskId} completed Successfully.`) })
        .catch(
            (error) => {
                console.log('error message:' + error);
            }));

    res.status(200).send();
});


module.exports = router;
