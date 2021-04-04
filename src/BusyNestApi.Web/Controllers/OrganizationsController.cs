using System;
using System.Threading.Tasks;
using BusyNest.Domain.Organizations;
using BusyNestApi.Web.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace BusyNestApi.Web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrganizationsController : ControllerBase
    {
        private readonly ILogger<OrganizationsController> logger;
        private readonly IMediator mediator;

        public OrganizationsController(ILogger<OrganizationsController> logger,
                                       IMediator mediator)
        {
            this.logger = logger;
            this.mediator = mediator;
        }

        [HttpPost]
        public async Task<CreatedAtActionResult> Post(CreateOrganizationModel model)
        {
            logger.LogInformation("creating new organization");

            var command = new CreateOrganizationCommand
            {
                Id = OrgId.NewId(),
                Name = model.Name,
            };

            var result = await mediator.Send<CreateOrganizationResponse>(command);

            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpGet("{id}")]
        public void GetById(OrgId id)
        {

        }
    }
}
