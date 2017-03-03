using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace rducc.rabl.webapi.Models
{
    public class OutageReportPhoto
    {
        public int Id { get; set; }
        public int OutageReportId { get; set; }
        public string Base64Photo { get; set; }
        public byte[] Photo { get; set; }

    }
}