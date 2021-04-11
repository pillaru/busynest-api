using System.Threading;
using System.Threading.Tasks;
using MediatR;

namespace BusyNest.Domain.Organizations
{
    public class CreateOrganizationCommandHandler : IRequestHandler<CreateOrganizationCommand, CreateOrganizationResponse>
    {
        private readonly ICreateOrganizationRepository repository;

        public CreateOrganizationCommandHandler(ICreateOrganizationRepository repository)
        {
            this.repository = repository;
        }

        public async Task<CreateOrganizationResponse> Handle(CreateOrganizationCommand request,
                                                             CancellationToken cancellationToken)
        {
            await repository.Create(request);

            return new CreateOrganizationResponse
            {
                Id = request.Id,
                Name = request.Name
            };
        }
    }
}
