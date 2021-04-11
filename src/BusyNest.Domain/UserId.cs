using System;

namespace BusyNest.Domain
{
    public class UserId
    {
        private readonly Guid id;

        public UserId(Guid id)
        {
            this.id = id;
        }
    }
}
