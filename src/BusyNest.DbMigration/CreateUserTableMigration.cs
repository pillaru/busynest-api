using FluentMigrator;

namespace BusyNest.DbMigration
{
    [Migration(202104112223, "Create user table")]
    public class CreateUserTableMigration : Migration
    {
        public override void Down()
        {
            Delete.Column("user_id").FromTable("organizations");
            Delete.Table("users");
        }

        public override void Up()
        {
            Create.Table("users")
                .WithColumn("id").AsFixedLengthString(36).PrimaryKey()
                .WithColumn("name")
                  .AsFixedLengthString(50).NotNullable()
                .WithColumn("google_user_id").AsFixedLengthString(25).Indexed()
                  .Nullable().WithDefaultValue(null);

            Alter.Table("organizations")
                .AddColumn("user_id").AsFixedLengthString(36).ForeignKey("users", "id");
        }
    }
}
