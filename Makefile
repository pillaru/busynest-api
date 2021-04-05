build:
	dotnet build

migrate_ls:
	dotnet run --project src/BusyNest.DbMigration/BusyNest.DbMigration.csproj list

migrate_up:
	dotnet run --project src/BusyNest.DbMigration/BusyNest.DbMigration.csproj up

migrate_down:
	dotnet run --project src/BusyNest.DbMigration/BusyNest.DbMigration.csproj down
