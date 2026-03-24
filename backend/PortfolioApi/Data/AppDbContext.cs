using Microsoft.EntityFrameworkCore;
using PortfolioApi.Models;

namespace PortfolioApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<Project> Projects => Set<Project>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed initial projects
        modelBuilder.Entity<Project>().HasData(
            new Project { Id = 1, Title = "Otis Elevators – Mobile Maintenance App", Description = "Real-time mobile maintenance app for field engineers. CI/CD pipelines via Azure DevOps, reducing release time by ~30%.", TechStack = "Azure DevOps,CI/CD,Real-time Data", GitHubUrl = "#", LiveUrl = "#", Icon = "fa-elevator", Color = "blue", Order = 1 },
            new Project { Id = 2, Title = "CI/CD Pipeline Automation", Description = "Automated pipelines using Jenkins, GitHub Actions, Docker, and AWS CodePipeline. Cut release cycles by ~40%.", TechStack = "Jenkins,GitHub Actions,Docker,AWS CodePipeline", GitHubUrl = "#", LiveUrl = "#", Icon = "fa-infinity", Color = "green", Order = 2 },
            new Project { Id = 3, Title = "Arunayan Dairy – Full-Stack Mobile App", Description = "Production-ready app with AWS Cognito auth, Lambda + DynamoDB + API Gateway serverless backend.", TechStack = "AWS Lambda,DynamoDB,API Gateway,AWS Cognito,Serverless", GitHubUrl = "#", LiveUrl = "#", Icon = "fa-cow", Color = "purple", Order = 3 },
            new Project { Id = 4, Title = "Order Management System API", Description = "Containerized RESTful API. Docker multi-stage builds cut image size by 70%. Deployment time reduced by 95%.", TechStack = "ASP.NET Core 9,Docker,Docker Compose,PostgreSQL,Swagger", GitHubUrl = "#", LiveUrl = "#", Icon = "fa-docker", Color = "green", Order = 4 }
        );
    }
}
