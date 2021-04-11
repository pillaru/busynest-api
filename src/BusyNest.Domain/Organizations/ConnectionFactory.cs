using System.Data;
using System.Data.Common;
using Microsoft.Extensions.Configuration;

namespace BusyNest.Domain.Organizations
{
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
