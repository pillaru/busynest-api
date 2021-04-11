using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusyNest.Domain.Organizations;
using BusyNest.Persistence;
using BusyNest.Persistence.TypeHandlers;
using Dapper;
using MediatR;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace BusyNestApi.Web
{
    public class Startup
    {
        private const string providerInvariantName = "MySql.Data.MySqlClient";

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // services.AddIdentity<IdentityUser, IdentityRole>();
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.Authority = "https://accounts.google.com";
                options.Audience = "384209977854-c61mf24ovu4rnl5bfut5t1nl5t4k1f9q.apps.googleusercontent.com";
            });

            services.AddControllers();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "BusyNestApi.Web", Version = "v1" });
            });
            services.AddMediatR(typeof(CreateOrganizationCommandHandler));
            services.AddTransient<ICreateOrganizationRepository, MySqlCreateOrganizationRepository>();
            services.AddTransient<IConnectionFactory>((serviceProvider) => new ConnectionFactory(Configuration,
                                                                                                 "Default",
                                                                                                 providerInvariantName));
            DbProviderFactories.RegisterFactory(providerInvariantName, MySql.Data.MySqlClient.MySqlClientFactory.Instance);
            SqlMapper.AddTypeHandler(new OrgIdSqlTypeHandler());
            SqlMapper.AddTypeHandler(new OrgNameSqlTypeHandler());
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "BusyNestApi.Web v1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
