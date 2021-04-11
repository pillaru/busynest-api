using System.Threading.Tasks;

namespace BusyNest.Domain
{
    public interface IUserRepository
    {
        Task<User> GetByGoogleId(GoogleUserId id);
    }
}
