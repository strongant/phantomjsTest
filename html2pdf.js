var page = require('webpage').create(),
    system = require('system'),
    address, output, size;

if (system.args.length!=5) {
    console.log('Usage: html2pdf.js URL filename caseno organization');
    console.log('  caseno examples: "20150918", "F2015001-001"');
    console.log('  organization examples: "报告所"');
    phantom.exit(1);
} else {
    address = system.args[1];
    output = system.args[2];
    caseno = system.args[3];
    organization = system.args[4];
    page.viewportSize = { width: 600, height: 600 };
    page.paperSize = {
      format: 'A4',
      margin: '.5cm',

      header: {
        height: "1.2cm",
        contents: phantom.callback(function(pageNum, numPages) {
          return "<div style='color:#999999;font-size:10pt;margin-bottom:5px;clear:both;border-bottom:1px solid #999; height:20px; width:100%'>"
          +"<div style='float:left; width:80px'>"+ caseno + "</div>"
          +"<div style='text-align:right;float:right;width:200px'>第" + pageNum + "页  共" + numPages + "页</div></div>"
        })
      },
      footer: {
        height: "1.2cm",
        contents: phantom.callback(function(pageNum, numPages) {
          return "<div style='color:#999999;font-size:10pt;margin-top:5px;clear:both;border-top:1px solid #999;height:20px;width:100%;text-align:center;'>"
          + organization + "</div>"
        })
      }

    };

    page.open(address, function (status) {
        if (status !== 'success') {
            console.log('Unable to load the address!');
            phantom.exit(1);
        } else {
            setTimeout(function () {
                page.render(output);
                phantom.exit();
            }, 5000);
        }
    });
}
