# Stage 1 - Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY PortfolioApi/PortfolioApi.csproj PortfolioApi/
RUN dotnet restore PortfolioApi/PortfolioApi.csproj
COPY . .
RUN dotnet publish PortfolioApi/PortfolioApi.csproj -c Release -o /app/publish

# Stage 2 - Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000
ENTRYPOINT ["dotnet", "PortfolioApi.dll"]
