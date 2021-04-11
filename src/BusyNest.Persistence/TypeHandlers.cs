using System;
using System.Data;
using BusyNest.Domain.Organizations;
using Dapper;

namespace BusyNest.Persistence.TypeHandlers
{
    public class OrgIdSqlTypeHandler : SqlMapper.TypeHandler<OrgId>
    {
        public override OrgId Parse(object value)
        {
            if (OrgId.TryParse(value.ToString(), out var id))
            {
                return id;
            }
            return default;
        }

        public override void SetValue(IDbDataParameter parameter, OrgId value)
        {
            parameter.Value = value.ToString();
        }
    }

    public class OrgNameSqlTypeHandler : SqlMapper.TypeHandler<OrgName>
    {
        public override OrgName Parse(object value) => new OrgName(value.ToString());

        public override void SetValue(IDbDataParameter parameter, OrgName value)
        {
            parameter.Value = value.ToString();
        }
    }
}
