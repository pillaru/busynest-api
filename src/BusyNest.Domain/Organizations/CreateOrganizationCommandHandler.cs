using System.Data;
using System.Data.Common;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Configuration;

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

    // todo: this should be in infrastructure project?
    public interface ICreateOrganizationRepository
    {
        Task Create(CreateOrganizationCommand command);
    }

    // todo: this should be in infrastructure project?
    public interface IConnectionFactory
    {
        IDbConnection GetConnection();
    }

    public class ConnectionFactory : IConnectionFactory
    {
        private readonly IConfiguration config;
        private readonly string connectionStringIdentifier;
        private readonly string providerInvariantName;

        public ConnectionFactory(IConfiguration config, string connectionStringIdentifier, string providerInvariantName)
        {
            this.config = config;
            this.connectionStringIdentifier = connectionStringIdentifier;
            this.providerInvariantName = providerInvariantName;
        }

        public IDbConnection GetConnection()
        {
            var connectionString = config.GetConnectionString(connectionStringIdentifier);
            var factory = DbProviderFactories.GetFactory(providerInvariantName);
            var connection = factory.CreateConnection();
            connection.ConnectionString = connectionString;
            return connection;
        }
    }
}
