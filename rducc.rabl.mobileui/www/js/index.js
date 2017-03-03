(function (index, $) {

    //app/session init

    var baseUrl = '';

    if (window.cordova) {
        //phonegap mode
        baseUrl = "http://rabl.azurewebsites.com/";
    }
    else {
        baseUrl = "http://localhost:81/";
    }


});