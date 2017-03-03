using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using rducc.rabl.webapi.Models;
using rducc.rabl.webapi.Models.Rabl;
using System.Web.Http.Cors;
using System.Text;

namespace rducc.rabl.webapi.Controllers
{
    [Authorize]
    [EnableCors("*","*","*")]
    public class OutageReportPhotoController : ApiController
    {
        private Context db = new Context();

        // POST api/OutageReportPhoto
        [ResponseType(typeof(OutageReportPhoto))]
        public IHttpActionResult PostOutageReportPhoto(OutageReportPhoto outageReportPhoto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            OutageReportPhoto newPhoto = new OutageReportPhoto { OutageReportId = outageReportPhoto.OutageReportId, Base64Photo = outageReportPhoto.Base64Photo };

            //conver to byte array
            UTF8Encoding encoding = new UTF8Encoding();
            byte[] newImage = encoding.GetBytes(outageReportPhoto.Base64Photo);

            newPhoto.Photo = newImage;

            db.OutageReportPhotos.Add(newPhoto);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = newPhoto.Id }, newPhoto);
        }

        // GET api/OutageReportPhoto/5
        [ResponseType(typeof(OutageReportPhoto))]
        public IHttpActionResult GetOutageReportPhotoForReport(int outageReportId)
        {
            OutageReportPhoto outagereportphoto = db.OutageReportPhotos.Where(r => r.OutageReportId == outageReportId).FirstOrDefault();
            if (outagereportphoto == null)
            {
                return NotFound();
            }

            return Ok(outagereportphoto);
        }

        #region "Other Methods"
        // GET api/OutageReportPhoto
        public IQueryable<OutageReportPhoto> GetOutageReportPhotos()
        {
            return db.OutageReportPhotos;
        }

        // GET api/OutageReportPhoto/5
        [ResponseType(typeof(OutageReportPhoto))]
        public IHttpActionResult GetOutageReportPhoto(int id)
        {
            OutageReportPhoto outagereportphoto = db.OutageReportPhotos.Find(id);
            if (outagereportphoto == null)
            {
                return NotFound();
            }

            return Ok(outagereportphoto);
        }


        // PUT api/OutageReportPhoto/5
        public IHttpActionResult PutOutageReportPhoto(int id, OutageReportPhoto outagereportphoto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != outagereportphoto.Id)
            {
                return BadRequest();
            }

            db.Entry(outagereportphoto).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OutageReportPhotoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }


        // DELETE api/OutageReportPhoto/5
        [ResponseType(typeof(OutageReportPhoto))]
        public IHttpActionResult DeleteOutageReportPhoto(int id)
        {
            OutageReportPhoto outagereportphoto = db.OutageReportPhotos.Find(id);
            if (outagereportphoto == null)
            {
                return NotFound();
            }

            db.OutageReportPhotos.Remove(outagereportphoto);
            db.SaveChanges();

            return Ok(outagereportphoto);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool OutageReportPhotoExists(int id)
        {
            return db.OutageReportPhotos.Count(e => e.Id == id) > 0;
        }
    }
        #endregion

}