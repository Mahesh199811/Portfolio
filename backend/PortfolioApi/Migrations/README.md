Run: dotnet ef migrations add InitialCreate
Then: dotnet ef database update
Or let the app auto-migrate on startup (already configured in Program.cs)
