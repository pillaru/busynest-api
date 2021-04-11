using System;
using System.Security.Claims;
using System.Threading.Tasks;
using BusyNest.Domain;
using BusyNest.Domain.Organizations;
using BusyNestApi.Web.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace BusyNestApi.Web.Controllers
{
    [Authorize]
    [ApiController, Route("[controller]")]
    public class OrganizationsController : ControllerBase
    {
        private readonly ILogger<OrganizationsController> logger;
        private readonly IMediator mediator;
        private readonly IUserRepository userRepository;

        public OrganizationsController(ILogger<OrganizationsController> logger,
                                       IMediator mediator,
                                       IUserRepository userRepository)
        {
            this.logger = logger;
            this.mediator = mediator;
            this.userRepository = userRepository;
        }

        [HttpPost]
        public async Task<CreatedAtActionResult> Post(CreateOrganizationModel model)
        {
            logger.LogInformation("creating new organization");

            var subjectIdClaim = User.FindFirst(claim => claim.Type == ClaimTypes.NameIdentifier);
            var subjectValue = new GoogleUserId(subjectIdClaim.Value);
            var user = await userRepository.GetByGoogleId(subjectValue);

            var command = new CreateOrganizationCommand
            {
                Id = OrgId.NewId(),
                Name = model.Name,
                User = user,
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
