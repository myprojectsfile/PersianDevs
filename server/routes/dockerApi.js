var express = require('express');
var router = express.Router();
var docker = require('./docker-lib');
var Promise = require("bluebird");
var Queue = require('promise-queue');
Queue.configure(Promise);
var maxConcurrent = 1;
var maxQueue = Infinity;
var queue = new Queue(maxConcurrent, maxQueue);

/* GET api listing. */
router.get('/', (req, res) => {
    res.status(200).send('this is docker api get method.');
});


router.post('/downloadImage', function (req, res) {

    var image=req.body.image;
    var tag=req.body.tag;

    // add image to download queue
    queue.add(docker.downloadImage(image, tag)
        .then(() => { console.log('succeeded') })
        .catch((error) => {
            console.log('error message:' + error);
        }));

    res.status(200).send();
});

// function downloadImage(req) {
//     var image = req.body.image;
//     var tag = req.body.tag;
//     var dir = image + '_' + tag;

//     var download_command = './image-downloader.sh ' + dir + ' ' + image + ':' + tag;
//     var compress_command = 'tar -C ./' + dir + ' -cvf ' + dir + '.tar ./';
//     var upload_command = './dropbox_uploader.sh upload ' + dir + '.tar' + ' /vps';
//     var delete_dir_command = 'rm -r ' + dir;
//     var delete_file_command = 'rm ' + dir + '.tar';

//     exec(download_command,
//         (error, stdout, stderr) => {
//             if (error === null) {
//                 console.log('*** download completed successfully ***');
//                 console.log('2 ---> compressing downloaded layers ...');
//                 exec(compress_command,
//                     (error, stdout, stderr) => {
//                         if (error === null) {
//                             console.log('*** compression completed successfully ***');
//                             console.log('3 ---> Now , Uploading file to dropbox...');
//                             exec(upload_command,
//                                 (error, stdout, stderr) => {
//                                     if (error === null) {
//                                         console.log('*** Uploading file completed Successfully ***');
//                                         console.log('4 ---> Now , Deleting directory...');
//                                         exec(delete_dir_command,
//                                             (error, stdout, stderr) => {
//                                                 if (error === null) {
//                                                     console.log('*** temporary directory deleted Successfully ***');
//                                                     console.log('5 ---> Now , Deleting temporary file ...');
//                                                     exec(delete_file_command,
//                                                         (error, stdout, stderr) => {
//                                                             if (error === null) {
//                                                                 console.log('*** temporary file deleted Successfully ***');
//                                                                 return;
//                                                             }
//                                                             else {
//                                                                 console.log(`delete file exec error: ${error}`);
//                                                                 return;
//                                                             }
//                                                         });
//                                                 }
//                                                 else {
//                                                     console.log(`delete directory exec error: ${error}`);
//                                                     return;
//                                                 }
//                                             });
//                                     }
//                                     else {
//                                         console.log(`uploading file exec error: ${error}`);
//                                         return;
//                                     }
//                                 });
//                         }
//                         else {
//                             console.log(`compressing direcotry exec error: ${error}`);
//                             return;
//                         }
//                     });
//             }
//             else {
//                 console.log(`downloading exec error: ${error}`);
//                 return;
//             }
//         });
// };

// router.post('/downloadImage', function (req, res) {
//     var image = req.body.image;
//     var tag = req.body.tag;
//     var dir = image + '_' + tag;

//     var download_command = './image-downloader.sh ' + dir + ' ' + image + ':' + tag;
//     var compress_command = 'tar -C ./' + dir + ' -cvf ' + dir + '.tar ./';
//     var upload_command = './dropbox_uploader.sh upload ' + dir + '.tar' + ' /vps';
//     var delete_dir_command = 'rm -r ' + dir;
//     var delete_file_command = 'rm ' + dir + '.tar';

//     console.log('1 ---> downloading ' + image + ':' + tag + ' from docker Hub...');
//     exec(download_command,
//         (error, stdout, stderr) => {
//             console.log(`${stdout}`);
//             console.log(`${stderr}`);
//             if (error === null) {
//                 console.log('*** download completed successfully ***');
//                 console.log('2 ---> compressing downloaded layers ...');
//                 exec(compress_command,
//                     (error, stdout, stderr) => {
//                         if (error === null) {
//                             console.log('*** compression completed successfully ***');
//                             console.log('3 ---> Now , Uploading file to dropbox...');
//                             exec(upload_command,
//                                 (error, stdout, stderr) => {
//                                     if (error === null) {
//                                         console.log('*** Uploading file completed Successfully ***');
//                                         console.log('4 ---> Now , Deleting directory...');
//                                         exec(delete_dir_command,
//                                             (error, stdout, stderr) => {
//                                                 if (error === null) {
//                                                     console.log('*** temporary directory deleted Successfully ***');
//                                                     exec(delete_file_command,
//                                                         (error, stdout, stderr) => {
//                                                             if (error === null) {
//                                                                 console.log('*** temporary file deleted Successfully ***');
//                                                                 res.status(200).json(dir + '.tar file uploaded to dropbox successfully.');
//                                                             }
//                                                             else {
//                                                                 console.log(`delete file exec error: ${error}`);
//                                                                 res.status(400).json(`delete file exec error: ${error}`);                                                                
//                                                             }
//                                                         });                                                 
//                                                 }
//                                                 else {
//                                                     console.log(`delete directory exec error: ${error}`);
//                                                     res.status(400).json(`delete directory exec error: ${error}`); 
//                                                 }
//                                             });
//                                     }
//                                     else {
//                                         console.log(`uploading file exec error: ${error}`);
//                                         res.status(400).json(`uploading file exec error: ${error}`);
//                                     }
//                                 });
//                         }
//                         else {
//                             console.log(`compressing direcotry exec error: ${error}`);
//                             res.status(400).json(`compressing direcotry exec error: ${error}`);
//                         }
//                     });
//             }
//             else {
//                 console.log(`downloading exec error: ${error}`);
//                 res.status(400).json(`downloading exec error: ${error}`);
//             }
//         });    
// });

module.exports = router;
