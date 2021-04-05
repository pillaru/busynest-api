using System.Threading;
using System.Threading.Tasks;
using MediatR;

namespace BusyNest.Domain.Organizations
{
    public class CreateOrganizationCommandHandler : IRequestHandler<CreateOrganizationCommand, CreateOrganizationResponse>
    {
        public Task<CreateOrganizationResponse> Handle(CreateOrganizationCommand request,
                                                       CancellationToken cancellationToken)
        {
            // todo: save to mysql database table `organizations`
            return Task.FromResult(new CreateOrganizationResponse
            {
                Id = request.Id,
                Name = request.Name
            });
        }
    }
}
