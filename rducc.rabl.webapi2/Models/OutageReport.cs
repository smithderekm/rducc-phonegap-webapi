using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;

namespace rducc.rabl.webapi.Models
{
    public class OutageReport
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        
        public string LicensePlateNumber { get; set; }
        public string LicensePlateState { get; set; }
        public DateTime ReportDate { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public string OutageReportStatus { get; set; }
        
        public string StateAndPlate {
            get { return string.Format("{0} - {1}", LicensePlateState, LicensePlateNumber); }
        }

    }

}