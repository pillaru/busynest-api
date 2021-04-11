using MediatR;

namespace BusyNest.Domain.Organizations
{
    public class CreateOrganizationCommand : IRequest<CreateOrganizationResponse>
    {
        public OrgId Id { get; set; }
        public OrgName Name { get; set; }
        public User User { get; set; }
    }
}
