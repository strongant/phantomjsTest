var page = require('webpage').create(),
    system = require('system');


page.onError = function(msg, trace) {

  var msgStack = ['ERROR: ' + msg];

  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
    });
  }

  console.error(msgStack.join('\n'));

};

if (system.args.length < 3) {
    console.log('Usage: printheaderfooter.js URL filename');
    phantom.exit(1);
} else {
    var address = system.args[1];
    var output = system.args[2];
    page.viewportSize = { width: 600, height: 600 };
    page.paperSize = {
      format: 'A4',
      margin: '.5cm',
      header: {
        height: "1cm",
        contents: phantom.callback(function(pageNum, numPages) {
        return "<h1 style='font-size:12.0; font-family:Arial,Helvetica,FreeSans,sans-serif'>Header <span style='float:center'>" + pageNum + " / " + numPages + "</span></h1>";
        })
      },
      footer: {
        height: "1cm",
        contents: phantom.callback(function(pageNum, numPages) {
        return "<h1 style='font-size:12.0; font-family:Arial,Helvetica,FreeSans,sans-serif'>Footer <span style='float:center'>" + pageNum + " / " + numPages + "</span></h1>";
        })
      }
    };
};
page.open(address, function (status) {
    if (status !== 'success') {
        console.log('Unable to load the address!');
    } else {
        window.setTimeout(function () {
            page.evaluate(function(){
              lastScrollTop = document.body.scrollTop;
              pageHeight = 0;
              while(document.body.scrollTop ==pageHeight){
                   setTimeout(function(){
                     document.body.scrollTop += 300;
                     pageHeight+=300;
                   },1000);
              }
            });
            page.render(output);
            phantom.exit();
        }, 1000*60);
    }
});
