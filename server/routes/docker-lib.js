
var Promise = require("bluebird");
var exec = Promise.promisify(require('child_process').exec);



function downloadImage(image, tag) {
    var dir = image + '_' + tag;

    var download_command = './image-downloader.sh ' + dir + ' ' + image + ':' + tag;
    var compress_command = 'tar -C ./' + dir + ' -cvf ' + dir + '.tar ./';
    var upload_command = './dropbox_uploader.sh upload ' + dir + '.tar' + ' /vps';
    var delete_dir_command = 'rm -r ' + dir;
    var delete_file_command = 'rm ' + dir + '.tar';

    return new Promise(function (resolve, reject) {
        // 1- download image layers
        downloadImageLayer(download_command)
            .then(() => {
                // 2- compress image layers
                compressImageLayers(compress_command)
                    .then(() => {
                        // 3- upload image file
                        uploadImage(upload_command)
                            .then(() => {
                                // 4- delete temp directory
                                deleteTempDir(delete_dir_command)
                                    .then(() => {
                                        // 5- delete temp file
                                        downloadImageLayer(delete_file_command)
                                            .then(() => {
                                                resolve(true);
                                            })
                                            .catch((error) => {
                                                reject(error);
                                            });
                                    })
                                    .catch((error) => {
                                        reject(error);
                                    });
                            })
                            .catch((error) => {
                                reject(error);
                            });
                    })
                    .catch((error) => {
                        reject(error);
                    });
            })
            .catch((error) => {
                reject(error);
            });
    });
}

function downloadImageLayer(download_command) {
    return exec(download_command);
}

function compressImageLayers(compress_command) {
    return exec(compress_command);
}

function uploadImage(upload_command) {
    return exec(upload_command);
}

function deleteTempDir(delete_dir_command) {
    return exec(delete_dir_command);
}

function deleteTempFile(delete_file_command) {
    return exec(delete_file_command);
}

module.exports = {
    downloadImage: downloadImage
}
