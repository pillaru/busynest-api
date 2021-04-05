using FluentMigrator;
using FluentMigrator.Runner.VersionTableInfo;

namespace BusyNest.DbMigration
{
    [Migration(202104042326, "Create organization table")]
    public class CreateOrganizationTableMigration : Migration
    {
        public override void Up() => Create.Table("organizations")
                .WithColumn("id").AsFixedLengthString(36).PrimaryKey().Identity()
                .WithColumn("name").AsFixedLengthString(120);
        public override void Down() => Delete.Table("organizations");
    }
}
