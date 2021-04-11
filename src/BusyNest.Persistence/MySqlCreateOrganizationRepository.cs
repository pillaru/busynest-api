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
            const string sql = @"INSERT INTO organizations(id, name, user_id) VALUES (@id, @name, @userId);";
            var parameters = new { id = command.Id, name = command.Name, userId = command.User.Id };
            await connection.ExecuteAsync(sql, parameters);
        }
    }
}
