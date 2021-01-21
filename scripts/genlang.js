var xlsx = require('node-xlsx').default;
var fs = require("fs");

var file = `${process.env.HOME}/Downloads/teemo-languages.xlsx`;
var list = xlsx.parse(file);
if (list.length > 0 && list[0].name == 'Sheet1') {
    var sheet = list[0];
    var result = {};

    for (let i = 1; i < sheet.data.length && sheet.data[i].length > 0; i++) {
        for (let j = 1; j < sheet.data[i].length; j++) {
            if (result[sheet.data[0][j]] == undefined) {
                result[sheet.data[0][j]] = {};
            }
            result[sheet.data[0][j]][sheet.data[i][0]] = sheet.data[i][j];
        }
    }
    //console.log(sheet);
    console.log(result);
    for (language of Object.keys(result)) {
        //public/locales/${language}.json
        console.log(language);
        fs.writeFile(`public/locales/${language}.json`, JSON.stringify(result[language], null, 2),  function(err) {
            if (err) {
                return console.error(err);
            }
            console.log(`public/locales/${language}.json 写入成功！`);
         });
    }

    fs.unlink(file, function(err) {
        if(err && err.code == 'ENOENT') {
            // file doens't exist
            console.info("File doesn't exist, won't remove it.");
        } else if (err) {
            // other errors, e.g. maybe we don't have enough permission
            console.error("Error occurred while trying to remove file");
        } else {
            console.info(`${file} removed`);
        }
    });
}
