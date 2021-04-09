using System.Threading.Tasks;
using BusyNest.Domain.Organizations;
using Dapper;

namespace BusyNest.Persistence
{
    public class MySqlCreateOrganizationRepository : ICreateOrganizationRepository
    {
        private readonly IConnectionFactory connectionFactory;

        public MySqlCreateOrganizationRepository(IConnectionFactory connectionFactory)
        {
            this.connectionFactory = connectionFactory;
        }
        public async Task Create(CreateOrganizationCommand command)
        {
            var connection = connectionFactory.GetConnection();
            const string sql = @"INSERT organizations(id, name) VALUES (@id, @name);";
            await connection.ExecuteAsync(sql, new { id = command.Id, name = command.Name });
        }
    }
}
