using System;
using FluentMigrator.Runner;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace BusyNest.DbMigration
{
    class Program
    {
        static void Main(string[] args)
        {
            var config = new ConfigurationBuilder().AddUserSecrets<Program>().Build();
            var serviceProvider = CreateServices(config);

            if (args[0] == "list")
            {
                // Put the database update into a scope to ensure
                // that all resources will be disposed.
                using (var scope = serviceProvider.CreateScope())
                {
                    ListMigrations(scope.ServiceProvider);
                }
            }
            else if (args[0] == "up")
            {
                // Put the database update into a scope to ensure
                // that all resources will be disposed.
                using (var scope = serviceProvider.CreateScope())
                {
                    UpdateDatabase(scope.ServiceProvider);
                }
            }
            else if (args[0] == "down")
            {
                throw new NotImplementedException("down command not implemented!");
            }
        }

        /// <summary>
        /// Configure the dependency injection services
        /// </summary>
        static IServiceProvider CreateServices(IConfigurationRoot config)
        {
            return new ServiceCollection()
                // Enable logging to console in the FluentMigrator way
                .AddLogging(lb => lb.AddFluentMigratorConsole())
                .AddFluentMigratorCore()
                // Add common FluentMigrator services
                .ConfigureRunner(rb => rb
                    // Add SQLite support to FluentMigrator
                    .AddMySql5()
                    // Set the connection string
                    .WithGlobalConnectionString(config.GetConnectionString("Default"))
                    // Define the assembly containing the migrations
                    .ScanIn(typeof(CreateOrganizationTableMigration).Assembly).For.Migrations())
                // Build the service provider
                .BuildServiceProvider(false);
        }

        /// <summary>
        /// Update the database
        /// </summary>
        private static void UpdateDatabase(IServiceProvider serviceProvider)
            => serviceProvider.GetRequiredService<IMigrationRunner>()
                              .MigrateUp();

        /// <summary>
        /// Update the database
        /// </summary>
        private static void ListMigrations(IServiceProvider serviceProvider)
            => serviceProvider.GetRequiredService<IMigrationRunner>()
                              .ListMigrations();
    }
}
