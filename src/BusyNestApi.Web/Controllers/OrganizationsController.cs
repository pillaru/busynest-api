using System;
using BusyNestApi.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace BusyNestApi.Web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrganizationsController : ControllerBase
    {
        private readonly ILogger<OrganizationsController> _logger;

        public OrganizationsController(ILogger<OrganizationsController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public CreatedAtActionResult Post(CreateOrganizationModel model)
        {
            _logger.LogInformation("creating new organization");

            model.Id = OrgId.NewId();
            return CreatedAtAction("GetById", new { id = model.Id }, model);
        }

        [HttpGet("{id}")]
        public void GetById(OrgId id)
        {

        }
    }
}
