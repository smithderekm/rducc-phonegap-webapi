using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using rducc.rabl.webapi.Models;
using rducc.rabl.webapi.Models.Rabl;
using System.Web.Http.Cors;

namespace rducc.rabl.webapi.Controllers
{
    //[Authorize]
    [EnableCors("*", "*", "*")]
    public class OutageReportController : ApiController
    {
        private Context db = new Context();

        // GET api/OutageReport
        public IEnumerable<OutageReport> GetOutageReports()
        {
            var reports = db.OutageReports;
            return reports.ToList();
        }

        // GET api/OutageReport/5
        public OutageReport GetOutageReport(int id)
        {
            OutageReport outagereport = db.OutageReports.Where(r=>r.Id==id).FirstOrDefault ();
            if (outagereport != null)
            {
                return outagereport; 
            }

            throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
        }

        // GET api/OutageReport/5
        public IEnumerable<OutageReport> GetOutageReportByUser(int userId)
        {
            return db.OutageReports.Where(r => r.UserId == userId).AsEnumerable();
        }


        // PUT api/OutageReport/5
        public HttpResponseMessage PutOutageReport(int id, OutageReport outagereport)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            if (id != outagereport.Id)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            db.Entry(outagereport).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        // POST api/OutageReport
        public HttpResponseMessage PostOutageReport(OutageReport outagereport)
        {
            if (ModelState.IsValid && outagereport != null)
            {
                if (outagereport.ReportDate == DateTime.MinValue) outagereport.ReportDate = DateTime.Now;

                db.OutageReports.Add(outagereport);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, outagereport);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = outagereport.Id }));
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        // DELETE api/OutageReport/5
        public HttpResponseMessage DeleteOutageReport(int id)
        {
            OutageReport outagereport = db.OutageReports.Where(r=> r.Id == id).FirstOrDefault();
            
            if (outagereport != null)
            {

                db.OutageReports.Remove(outagereport);

                try
                {
                    db.SaveChanges();
                }
                catch (DbUpdateConcurrencyException ex)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
                }
    
                return Request.CreateResponse(HttpStatusCode.OK, outagereport);
            }

            return Request.CreateResponse(HttpStatusCode.NotFound);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}