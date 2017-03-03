var baseUri = function () {
    if (sessionStorage)
        if (sessionStorage["baseUri"])
            return sessionStorage["baseUri"];
    return "http://localhost/rducc.rabl.webapi/api/outageReport";
};

function Logon() {
    //allow call to remote page
    $.support.cors = true;
    //$.mobile.allowCrossDomainPages = true;

    var login = {
        username: $("input#username").val(),
        password: $("input#password").val()
    };

    //go to home page
    $.mobile.changePage($("#homePage"), "slide", true, true);

}

function CreateReport() {
    //allow call to remote page
    $.support.cors = true;
    //$.mobile.allowCrossDomainPages = true;

    var outagereport = {
        UserId: parseInt($("#UserId").val()),
        OutageReportStatus: $("#OutageReportStatus").val(),
        LicensePlateState: $("#LicensePlateState").val(),
        LicensePlateNumber: $("#LicensePlateNumber").val(),
        Latitude: $("#Latitude").val(),
        Longitude: $("#Longitude").val()
    };
    $.mobile.loading('show', { text: "Saving..." })

    //$.post(baseUri()(), outagereport, null, "json")
    //    .done(function (o) {
    //        $.mobile.loading('hide');
    //        $.mobile.changePage("#homePage")
    //    });
    $.ajax({
        url: baseUri(),
        type: 'POST',
        dataType: 'json',
        data: outagereport,
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

function RetrieveReport() {
    //allow call to remote url
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;


    $.mobile.loading('show');
    $.ajax({
        url: baseUri() + "/" + $("#selectedId").val(),
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $.mobile.loading('hide');
            WriteResponse(data);
        },
        error: function (x, y, z) {
            $.mobile.loading('hide');
            alert(x + '\n' + y + '\n' + z + '\n');
        }
    });

}

function RetrieveAllReports() {
    //allow call to remote page
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;

    $.mobile.loading('show');

    $.ajax({
        url: baseUri(),
        type: 'GET',
        dataType: 'json',
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

    $.mobile.loading('show');

    $.ajax({
        url: baseUri() + "/" + outagereport.Id,
        type: 'PUT',
        dataType: 'json',
        data: outagereport,
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

function DeleteReport() {
    //allow call to remote page
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;

    $.mobile.loading('show', { text: "Please wait..." });
    $.ajax({
        url: baseUri() + "/" + $("#deleteId").val(),
        type: 'DELETE',
        dataType: 'json',
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
        return true;
    }
}