using ManifestApp.Auth.Data;
using ManifestApp.Auth.Features.Auth;
using ManifestApp.Auth.Features.Cqrs;
using ManifestApp.Auth.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<AuthDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Auth")));
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddSingleton<IPasswordHasher, PasswordHasher>();
builder.Services.AddSingleton<ITokenIssuer, TokenIssuer>();
builder.Services.AddScoped<IDispatcher, Dispatcher>();
builder.Services.AddScoped<ICommandHandler<RegisterUserCommand, AuthResult>, RegisterUserHandler>();
builder.Services.AddScoped<ICommandHandler<LoginUserCommand, AuthResult>, LoginUserHandler>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Auth",
        Version = "v1",
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    scope.ServiceProvider.GetRequiredService<AuthDbContext>().Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.Run();
