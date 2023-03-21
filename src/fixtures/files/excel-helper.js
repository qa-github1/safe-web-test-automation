const XLSX = require('xlsx');
var path = require('path');

exports.generate_file = async function(fileName, data) {

    var fullfile = path.join( __dirname + '/' + fileName + '.xlsx')
    console.log(fullfile);

    var wb = XLSX.utils.book_new();
    var ws_name = "Import";

    var ws = XLSX.utils.aoa_to_sheet(data);

    XLSX.utils.book_append_sheet(wb, ws, ws_name);

    XLSX.writeFile(wb, fullfile);
};
