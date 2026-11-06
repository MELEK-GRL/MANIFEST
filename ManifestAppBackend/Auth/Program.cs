using System.Text;
using ManifestApp.Auth.Data;
using ManifestApp.Auth.Features.Auth;
using ManifestApp.Auth.Features.Cqrs;
using ManifestApp.Auth.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

var signingKey = builder.Configuration["Auth:SigningKey"]
    ?? throw new InvalidOperationException("Auth:SigningKey is missing.");
var issuer = builder.Configuration["Auth:Issuer"] ?? "ManifestApp";

builder.Services.AddControllers();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = issuer,
            ValidAudience = issuer,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey)),
        };
    });
builder.Services.AddAuthorization();
builder.Services.AddDbContext<AuthDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Auth")));
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddSingleton<IPasswordHasher, PasswordHasher>();
builder.Services.AddSingleton<ITokenIssuer, TokenIssuer>();
builder.Services.AddScoped<IDispatcher, Dispatcher>();
builder.Services.AddScoped<ICommandHandler<RegisterUserCommand, AuthResult>, RegisterUserHandler>();
builder.Services.AddScoped<ICommandHandler<LoginUserCommand, AuthResult>, LoginUserHandler>();
builder.Services.AddScoped<ICommandHandler<UpdateUserPhotoCommand, PhotoUpdateResult>, UpdateUserPhotoHandler>();
builder.Services.AddScoped<IQueryHandler<GetProfileQuery, ProfileView?>, GetProfileHandler>();
builder.Services.AddScoped<IQueryHandler<GetUserPhotoQuery, UserPhoto?>, GetUserPhotoHandler>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Auth",
        Version = "v1",
    });
    options.AddSecurityDefinition("bearer", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Name = "Authorization",
    });
    options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("bearer", document)] = [],
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AuthDbContext>();
    db.Database.EnsureCreated();
    db.Database.ExecuteSqlRaw(
        """
        ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "Photo" bytea NULL;
        ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "PhotoContentType" character varying(64) NULL;
        """);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
