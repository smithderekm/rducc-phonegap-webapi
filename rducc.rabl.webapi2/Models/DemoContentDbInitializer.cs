using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;

namespace rducc.rabl.webapi.Models
{
    public class DemoContentDbInitializer : DropCreateDatabaseIfModelChanges<rducc.rabl.webapi.Models.Rabl.Context> 
    {
        protected override void Seed(rducc.rabl.webapi.Models.Rabl.Context context)
        {
            //var user1 = new User { FirstName = "Derek", LastName = "Smith", UserId = 1 };

            //context.Users.Add(user1);
            //context.SaveChanges();

            //var reportStatusPending = new OutageReportStatus { Name = "PENDING", OutageReportStatusID = 1 };
            //var reportStatusConfirmed = new OutageReportStatus { Name = "CONFIRMED", OutageReportStatusID = 2 };
            //var reportStatusSendToOwner = new OutageReportStatus { Name = "SENT TO OWNER", OutageReportStatusID = 3 };
            //context.SaveChanges();

            var report1 = new OutageReport { Id = 1, UserId = 1, ReportDate = DateTime.Now.AddDays(-5), LicensePlateState = "NC", LicensePlateNumber = "ABC-0989", OutageReportStatus="PENDING" };
            var report2 = new OutageReport { Id = 2, UserId = 1, ReportDate = DateTime.Now.AddDays(-4), LicensePlateState = "NC", LicensePlateNumber = "DEF-1445", OutageReportStatus="PENDING"}; 
            var report3 = new OutageReport { Id = 3, UserId = 1, ReportDate = DateTime.Now.AddDays(-3), LicensePlateState = "VA", LicensePlateNumber = "4477-LKMN", OutageReportStatus="PENDING"};

            context.OutageReports.Add(report1);
            context.OutageReports.Add(report2);
            context.OutageReports.Add(report3);

            context.SaveChanges();

            //base.Seed(context);
        }
    }
}