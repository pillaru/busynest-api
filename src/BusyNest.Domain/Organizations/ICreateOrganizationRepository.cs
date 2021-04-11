using System.Threading.Tasks;

namespace BusyNest.Domain.Organizations
{
    // todo: this should be in infrastructure project?
    public interface ICreateOrganizationRepository
    {
        Task Create(CreateOrganizationCommand command);
    }
}
