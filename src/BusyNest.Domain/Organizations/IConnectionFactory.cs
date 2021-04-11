using System.Data;

namespace BusyNest.Domain.Organizations
{
    // todo: this should be in infrastructure project?
    public interface IConnectionFactory
    {
        IDbConnection GetConnection();
    }
}
