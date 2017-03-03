var baseUri = function () {
    if (sessionStorage)
        if (sessionStorage["baseUri"])
            return sessionStorage["baseUri"];
    return "http://localhost/rducc.rabl.webapi/api";
};

function Logon() {
    //allow call to remote page
    $.support.cors = true;
    //$.mobile.allowCrossDomainPages = true;

    var login = {
        username: $("input#username").val(),
        password: $("input#password").val()
    };

    var token;

    //pass 1 - send credentials and get token
    $.mobile.loading('show');
    $.ajax
      ({
          type: "POST",
          url: baseUri() + "/account/token",
          dataType: 'json',
          async: false,
          data: login,
          beforeSend: function (xhr) {
              xhr.setRequestHeader('Authorization', make_base_auth(login.username, login.password));
          },
          success: function (data) {
              $.mobile.loading('hide');
              //check for valid token and save
              if (data.AccessToken) {
                  token = data.AccessToken;
                  sessionStorage["token"] = data.AccessToken;

                  //go to home page
                  $.mobile.changePage($("#homePage"));
              }
          },
          error: function (x, y, z) {
              $.mobile.loading('hide');
              alert(x + '\n' + y + '\n' + z + '\n');
              $("#loginError").html('Authentication failed. Please check your credentials and try again.').show();
          }

      });
}

function CreateReport() {
    //allow call to remote page
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;

    var outagereport = {
        UserId: parseInt($("#UserId").val()),
        OutageReportStatus: $("#OutageReportStatus").val(),
        LicensePlateState: $("#LicensePlateState").val(),
        LicensePlateNumber: $("#LicensePlateNumber").val(),
        Latitude: $("#Latitude").val(),
        Longitude: $("#Longitude").val()
    };

    var token;

    var newId; //will hold record id after add

    if (sessionStorage["token"]) {
        token = sessionStorage["token"];

        $.mobile.loading('show', { text: 'Saving...' });

        $.ajax({
            url: baseUri() + "/outagereport",
            type: 'POST',
            dataType: 'json',
            data: outagereport,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', "Bearer " + token);
            },
            success: function (data) {
                newId = data.Id;

                //check if photo captured
                if ($('#capturedPicture').attr('src')) {
                    UploadPhotoIfCaptured(newId);
                }
                else {
                    $.mobile.loading('hide');
                    $.mobile.changePage($("#homePage"), "slide", true, true);
                }
            },
            error: function (x, y, z) {
                $.mobile.loading('hide');
                alert(x + '\n' + y + '\n' + z + '\n');
            }
        });
    }

}

function UploadPhotoIfCaptured(reportId) {
    //upload photo if captured
    if ($('#capturedPicture').attr('src')) {
        //post
        var outagereportphoto = {
            OutageReportId: reportId,
            Base64Photo: $('#capturedPicture').attr('src') //expects value to already be base64
        };

        $.mobile.loading('show', { text: 'Uploading image...' });

        $.ajax({
            url: baseUri() + "/outagereportphoto",
            type: 'POST',
            dataType: 'json',
            data: outagereportphoto,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', "Bearer " + sessionStorage["token"]);
            },
            success: function (data) {
                newId = data.OutageReportId;

                $.mobile.loading('hide');
                $.mobile.changePage($("#homePage"), "slide", true, true);
            },
            error: function (x, y, z) {
                $.mobile.loading('hide');
                alert(x + '\n' + y + '\n' + z + '\n');
            }
        });
    }

}
function RetrieveReport() {
    //allow call to remote url
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;


    $.mobile.loading('show', { text: 'Getting report...' });
    //auth version
    var token;

    if (sessionStorage["token"]) {
        token = sessionStorage["token"];

        $.mobile.loading('show');
        $.ajax({
            url: baseUri() + "/outagereport/" + $("#selectedId").val(),
            type: 'GET',
            dataType: 'json',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', "Bearer " + token);
            },
            success: function (data) {
                $.mobile.loading('hide');
                WriteResponse(data);

                //check for uploaded image and retrieve
                $.mobile.loading('show', { text: 'Retrieving image...' });
                $.ajax({
                    url: baseUri() + "/OutageReportPhoto/?outageReportId=" + $("#selectedId").val(),
                    type: 'GET',
                    dataType: 'json',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', "Bearer " + token);
                    },
                    success: function (data) {
                        $.mobile.loading('hide');
                        $('#editOutageReportPhoto').attr('src', data.Base64Photo).load();

                    },
                    error: function (x, y, z) {
                        $.mobile.loading('hide');
                        //alert(x + '\n' + y + '\n' + z + '\n');
                    }
                });
            },
            error: function (x, y, z) {
                $.mobile.loading('hide');
                alert(x + '\n' + y + '\n' + z + '\n');
            }
        });

        $.mobile.loading('hide');


        
    }
}

function RetrieveAllReports() {
    //allow call to remote page
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;

    $.mobile.loading('show');

    //auth version
    var token;

    if (sessionStorage["token"]) {
        token = sessionStorage["token"];

        $.mobile.loading('show');
        $.ajax({
            url: baseUri() + "/outagereport",
            type: 'GET',
            dataType: 'json',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', "Bearer " + token);
            },
            success: function (data) {
                $.mobile.loading('hide');
                WriteResponses(data);
            },
            error: function (x, y, z) {
                $.mobile.loading('hide');
                alert(x + '\n' + y + '\n' + z + '\n');
            }
        });
    }
}

function UpdateReport() {
    //allow call to remote page
    $.support.cors = true;
    //$.mobile.allowCrossDomainPages = true;

    var outagereport = {
        Id: parseInt($("#editId").val()),
        UserId: parseInt($("#editUserId").val()),
        OutageReportStatus: $("#editOutageReportStatus").val(),
        LicensePlateState: $("#editLicensePlateState").val(),
        LicensePlateNumber: $("#editLicensePlateNumber").val(),
        Latitude: $("#editLatitude").val(),
        Longitude: $("#editLongitude").val(),
        ReportDate: $("#editReportDate").val()
    };

    var token;

    if (sessionStorage["token"]) {
        token = sessionStorage["token"];

        $.mobile.loading('show');

        $.ajax({
            url: baseUri() + "/outagereport/" + outagereport.Id,
            type: 'PUT',
            dataType: 'json',
            data: outagereport,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', "Bearer " + token);
            },
            success: function (data) {
                $.mobile.loading('hide');
                $.mobile.changePage($("#homePage"), "slide", true, true);
            },
            error: function (x, y, z) {
                $.mobile.loading('hide');
                $.mobile.changePage($("#homePage"), "slide", true, true);
                //alert(x + '\n' + y + '\n' + z + '\n');
            }
        });
    }
}

function DeleteReport() {
    //allow call to remote page
    $.support.cors = true;
    //$.mobile.allowCrossDomainPages = true;
    
    var token;

    if (sessionStorage["token"]) {
        token = sessionStorage["token"];

        $.mobile.loading('show', { text: "Please wait..." });

        $.ajax({
            url: baseUri() + "/outagereport/" + $("#deleteId").val(),
            type: 'DELETE',
            dataType: 'json',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', "Bearer " + token);
            },
            success: function (data) {
                $.mobile.loading('hide');
                $.mobile.changePage($("#homePage"), "slide", true, true);
            },
            error: function (x, y, z) {
                $.mobile.loading('hide');
                alert(x + '\n' + y + '\n' + z + '\n');
            }
        });
    }
}

//utility methods
function make_base_auth(user, password) {
    var tok = user + ':' + password;
    var hash = btoa(tok);
    return "Basic " + hash;
}

function WriteResponses(reports) {
    if (reports) {
        //clear existing list
        $("#ReportList").empty();

        $.each(reports, function (key, val) {
            //format item
            var str = '<a href="#editReportPage" onclick="SetSelectedReport(' + val.Id + ');">';
            str += '<img src="img/plates/' + val.LicensePlateState + '.png" alt=""/>';
            str += '<h3>' + val.LicensePlateState + ' - ' + val.LicensePlateNumber + '</h3>';
            str += '<p>Submitted: ' + val.ReportDate + '</p>';
            str += '<p><b>' + val.OutageReportStatus + '</b></p>';
            str += '</a>';

            //add to list
            $("<li/>", { html: str }).appendTo($("#ReportList"));
        });

        //reapply jQM
        $("#ReportList").listview('refresh');
    }
}

function WriteResponse(report) {
    $("#editLicensePlateState").val(report.LicensePlateState);
    $("#editLicensePlateState").selectmenu('refresh');

    $("#editLicensePlateNumber").val(report.LicensePlateNumber);
    $("#editId").val(report.Id);
    $("#editUserId").val(report.UserId);
    $("#editOutageReportStatus").val(report.OutageReportStatus);
    $("#editOutageReportStatus").selectmenu('refresh');

    $("#editReportDate").val(report.ReportDate);
    $("#editLatitude").val(report.Latitude);
    $("#editLongitude").val(report.Longitude);

    $("#deleteId").val(report.Id);
}

function SetSelectedReport(id) {
    if (id) {
        $("#selectedId").val(id);
        $("#deleteId").val(id);
        return true;
    }
}