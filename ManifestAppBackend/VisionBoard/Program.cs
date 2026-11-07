using System.Text;
using ManifestApp.VisionBoard.Data;
using ManifestApp.VisionBoard.Features.Cqrs;
using ManifestApp.VisionBoard.Features.Vision;
using ManifestApp.VisionBoard.Repositories;
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
builder.Services.AddDbContext<VisionBoardDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("VisionBoard")));
builder.Services.AddScoped<IVisionBoardRepository, VisionBoardRepository>();
builder.Services.AddScoped<IDispatcher, Dispatcher>();
builder.Services.AddScoped<IQueryHandler<GetVisionBoardQuery, VisionBoardView>, GetVisionBoardHandler>();
builder.Services.AddScoped<IQueryHandler<GetVisionBoardItemImageQuery, VisionBoardItemImage?>, GetVisionBoardItemImageHandler>();
builder.Services.AddScoped<ICommandHandler<AddVisionBoardItemCommand, AddVisionBoardItemResult>, AddVisionBoardItemHandler>();
builder.Services.AddScoped<ICommandHandler<SaveVisionBoardLayoutCommand, SaveVisionBoardLayoutResult>, SaveVisionBoardLayoutHandler>();
builder.Services.AddScoped<ICommandHandler<DeleteVisionBoardItemCommand, DeleteVisionBoardItemResult>, DeleteVisionBoardItemHandler>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Vision Board",
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
    var db = scope.ServiceProvider.GetRequiredService<VisionBoardDbContext>();
    db.Database.EnsureCreated();
    db.Database.ExecuteSqlRaw(
        """
        CREATE TABLE IF NOT EXISTS "VisionBoards" (
            "Id" uuid NOT NULL,
            "UserId" uuid NOT NULL,
            "UpdatedAtUtc" timestamp with time zone NOT NULL,
            CONSTRAINT "PK_VisionBoards" PRIMARY KEY ("Id")
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "IX_VisionBoards_UserId" ON "VisionBoards" ("UserId");
        CREATE TABLE IF NOT EXISTS "VisionBoardItems" (
            "Id" uuid NOT NULL,
            "BoardId" uuid NOT NULL,
            "Photo" bytea NOT NULL,
            "ContentType" character varying(64) NOT NULL,
            "X" double precision NOT NULL,
            "Y" double precision NOT NULL,
            "Scale" double precision NOT NULL,
            "CreatedAtUtc" timestamp with time zone NOT NULL,
            CONSTRAINT "PK_VisionBoardItems" PRIMARY KEY ("Id"),
            CONSTRAINT "FK_VisionBoardItems_VisionBoards_BoardId"
                FOREIGN KEY ("BoardId") REFERENCES "VisionBoards" ("Id") ON DELETE CASCADE
        );
        CREATE INDEX IF NOT EXISTS "IX_VisionBoardItems_BoardId" ON "VisionBoardItems" ("BoardId");
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
