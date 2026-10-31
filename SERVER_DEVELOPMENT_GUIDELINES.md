# Server Development Guidelines

A standard backend engineering handbook for building production-grade APIs with **C# / ASP.NET Core Web API (.NET 10)**, **Entity Framework Core**, and **SQL Server**.

This document is technology-specific but **project-agnostic** — it can be reused as the baseline for any new ASP.NET Core backend.

---

## Table of Contents

1. [Backend Project Structure](#1-backend-project-structure)
2. [Step-by-Step Backend Development Guide](#2-step-by-step-backend-development-guide)
3. [Naming and Coding Conventions](#3-naming-and-coding-conventions)
4. [API Development Standards](#4-api-development-standards)
5. [Architecture and Design Principles](#5-architecture-and-design-principles)
6. [Database Development Standards](#6-database-development-standards)
7. [Security Standards](#7-security-standards)
8. [Error Handling and Logging](#8-error-handling-and-logging)
9. [Testing Standards](#9-testing-standards)
10. [Performance and Scalability](#10-performance-and-scalability)
11. [Configuration and Environment Management](#11-configuration-and-environment-management)
12. [Git and Development Workflow](#12-git-and-development-workflow)
13. [Production Readiness Checklist](#13-production-readiness-checklist)
14. [AI-Assisted Development Guidelines](#14-ai-assisted-development-guidelines)

---

## 1. Backend Project Structure

### 1.1 Recommended Solution Layout

Use a **3-project Clean-Architecture-lite layout** for most business applications. Avoid more layers unless the project genuinely needs them.

```
server/
  server.slnx                     # Solution file (or .sln)
  API/                             # Presentation layer (Web API)
    API.csproj
    Program.cs
    appsettings.json
    appsettings.Development.json
    Controllers/
    DTOs/
    Extensions/                    # Mapping extensions, claims helpers
    Middleware/
    RequestHelpers/                # Pagination, spec params, etc.
    Properties/
      launchSettings.json

  Core/                            # Domain layer (no external dependencies)
    Core.csproj
    Entities/
    Interfaces/
    Specifications/
    Exceptions/ (domain-specific, optional)

  Infrastructure/                  # Data access & external services
    Infrastructure.csproj
    Data/
      AppDbContext.cs
      Configurations/              # IEntityTypeConfiguration<T> classes
      SeedData/
    Migrations/
    Services/                      # Email, Payment, Cache, etc.

  Tests/
    UnitTests/
    IntegrationTests/
```

> ⚠️ Naming note: keep project folder names spelled correctly (`Infrastructure`, not `Infrastracture`). Typos in a root namespace are painful to fix later and should be corrected early in a project's life.

### 1.2 Folder Responsibilities

| Folder | Responsibility |
|---|---|
| `API/Controllers` | HTTP entry points only. No business logic, no direct EF Core queries. |
| `API/DTOs` | Request/response contracts exposed to clients. Never expose entities directly. |
| `API/Extensions` | Mapping methods (`ToDto()`), claims helpers, `IServiceCollection` extensions. |
| `API/Middleware` | Cross-cutting HTTP pipeline concerns (exception handling, logging). |
| `API/RequestHelpers` | Query parameter binding, pagination wrappers. |
| `Core/Entities` | Domain/database entities. Plain C# with minimal behavior. |
| `Core/Interfaces` | Abstractions for repositories, unit of work, and services. Core must not reference Infrastructure. |
| `Core/Specifications` | Query specification objects (filter/sort/include definitions). |
| `Infrastructure/Data` | `DbContext`, EF configurations, seeders. |
| `Infrastructure/Services` | Concrete implementations of `Core` interfaces (payment, email, caching, etc). |
| `Infrastructure/Migrations` | EF Core generated migrations — never hand-edit generated files. |

### 1.3 Growing the Project

- Start with **folders by technical concern** (Controllers, Services, Entities) as above.
- When a module clearly owns an independent business capability (e.g., "Orders", "Catalog", "Identity") and has 5+ files per layer, switch to **feature folders**:

```
Core/
  Orders/
    Entities/
    Interfaces/
    Specifications/
  Catalog/
    Entities/
    Interfaces/
```

- Only introduce a new class library (e.g., `Application`, `Domain`) when:
  - Core is being referenced by more than one deployable (e.g., API + a background worker), **or**
  - You need to isolate business logic from persistence concerns for independent testing at scale.
- Don't add a `Services`/`Managers`/`Helpers` catch-all folder with unrelated classes. Group by what the code does, not by generic layer name alone.

### 1.4 Naming Conventions — Folders, Files, Namespaces, Classes

| Item | Convention | Example |
|---|---|---|
| Folder | PascalCase, plural for collections | `Controllers`, `Entities`, `Specifications` |
| File | Matches the single public type it contains | `ProductsController.cs` contains `ProductsController` |
| Namespace | Mirrors folder path from project root | `API.Controllers`, `Core.Entities.OrderAggregate` |
| Class | PascalCase, noun or noun phrase | `OrderService`, `ProductRepository` |
| Interface | `I` + PascalCase | `IOrderService`, `IGenericRepository<T>` |
| Controller | PascalCase + `Controller` suffix, plural resource name | `OrdersController`, `ProductsController` |

---

## 2. Step-by-Step Backend Development Guide

This section walks through adding a brand-new feature end-to-end: **"Create and retrieve Brands"**.

### Step 1 — Define the Entity

```csharp
// Core/Entities/Brand.cs
namespace Core.Entities;

public class Brand : BaseEntity
{
    public required string Name { get; set; }
}
```

```csharp
// Core/Entities/BaseEntity.cs
namespace Core.Entities;

public abstract class BaseEntity
{
    public int Id { get; set; }
}
```

### Step 2 — Add DbSet & EF Core Configuration

```csharp
// Infrastructure/Data/AppDbContext.cs
public DbSet<Brand> Brands { get; set; }
```

```csharp
// Infrastructure/Data/Configurations/BrandConfiguration.cs
public class BrandConfiguration : IEntityTypeConfiguration<Brand>
{
    public void Configure(EntityTypeBuilder<Brand> builder)
    {
        builder.Property(b => b.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(b => b.Name).IsUnique();
    }
}
```

> ✅ Recommended default: one configuration class per entity, applied via `modelBuilder.ApplyConfigurationsFromAssembly(...)` in `OnModelCreating`. Avoid configuring entities with data annotations **and** fluent API at the same time — pick fluent API for anything beyond trivial `[Required]` attributes.

### Step 3 — Create and Apply a Migration

```powershell
dotnet ef migrations add AddBrandEntity --project Infrastructure --startup-project API
dotnet ef database update --project Infrastructure --startup-project API
```

- Always review the generated migration file before applying it.
- Never edit a migration that has already been applied to a shared environment — create a new migration instead.

### Step 4 — Define the Repository Interface (Core)

```csharp
// Core/Interfaces/IGenericRepository.cs
public interface IGenericRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IReadOnlyList<T>> ListAllAsync(CancellationToken ct = default);
    Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec, CancellationToken ct = default);
    void Add(T entity);
    void Update(T entity);
    void Remove(T entity);
}
```

> ✅ Recommended default: use a **generic repository + specification pattern** only for simple CRUD-heavy aggregates (like a catalog). For complex aggregates with rich business rules (like Orders), prefer a dedicated repository interface (`IOrderRepository`) with explicit, intention-revealing methods.

### Step 5 — Implement the Repository (Infrastructure)

```csharp
// Infrastructure/Data/GenericRepository.cs
public class GenericRepository<T>(AppDbContext context) : IGenericRepository<T>
    where T : BaseEntity
{
    public async Task<T?> GetByIdAsync(int id, CancellationToken ct = default)
        => await context.Set<T>().FindAsync([id], ct);

    public async Task<IReadOnlyList<T>> ListAllAsync(CancellationToken ct = default)
        => await context.Set<T>().ToListAsync(ct);

    public void Add(T entity) => context.Set<T>().Add(entity);
    public void Update(T entity) => context.Entry(entity).State = EntityState.Modified;
    public void Remove(T entity) => context.Set<T>().Remove(entity);
}
```

### Step 6 — Create Request/Response DTOs

```csharp
// API/DTOs/BrandDto.cs
public record BrandDto(int Id, string Name);

public record CreateBrandRequest(string Name);
```

> ✅ Never return entities directly from a controller. DTOs decouple your public contract from your database schema and prevent accidental over-exposure of fields (e.g., password hashes, internal flags).

### Step 7 — Create a Mapping Extension

```csharp
// API/Extensions/BrandMappingExtensions.cs
public static class BrandMappingExtensions
{
    public static BrandDto ToDto(this Brand brand) => new(brand.Id, brand.Name);
}
```

### Step 8 — Add Validation

```csharp
// API/DTOs/CreateBrandRequestValidator.cs (FluentValidation)
public class CreateBrandRequestValidator : AbstractValidator<CreateBrandRequest>
{
    public CreateBrandRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
    }
}
```

Register FluentValidation in `Program.cs`:

```csharp
builder.Services.AddValidatorsFromAssemblyContaining<CreateBrandRequestValidator>();
builder.Services.AddFluentValidationAutoValidation();
```

> If you prefer to avoid a validation library, use Data Annotations + `ModelState.IsValid` combined with `[ApiController]` (which auto-returns `400` on invalid model state).

### Step 9 — Implement the Service / Business Logic

```csharp
// Core/Interfaces/IBrandService.cs
public interface IBrandService
{
    Task<IReadOnlyList<Brand>> GetBrandsAsync(CancellationToken ct = default);
    Task<Brand> CreateBrandAsync(string name, CancellationToken ct = default);
}
```

```csharp
// Infrastructure/Services/BrandService.cs
public class BrandService(IUnitOfWork unit) : IBrandService
{
    public async Task<IReadOnlyList<Brand>> GetBrandsAsync(CancellationToken ct = default)
        => await unit.Repository<Brand>().ListAllAsync(ct);

    public async Task<Brand> CreateBrandAsync(string name, CancellationToken ct = default)
    {
        var brand = new Brand { Name = name };
        unit.Repository<Brand>().Add(brand);

        if (!await unit.Complete())
            throw new InvalidOperationException("Failed to save brand.");

        return brand;
    }
}
```

### Step 10 — Register Dependencies (DI)

```csharp
// Program.cs
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IBrandService, BrandService>();
```

### Step 11 — Create the Controller

```csharp
// API/Controllers/BrandsController.cs
[ApiController]
[Route("api/[controller]")]
public class BrandsController(IBrandService brandService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<BrandDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<BrandDto>>> GetBrands(CancellationToken ct)
    {
        var brands = await brandService.GetBrandsAsync(ct);
        return Ok(brands.Select(b => b.ToDto()));
    }

    [HttpPost]
    [ProducesResponseType(typeof(BrandDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<BrandDto>> CreateBrand(
        CreateBrandRequest request, CancellationToken ct)
    {
        var brand = await brandService.CreateBrandAsync(request.Name, ct);
        return CreatedAtAction(nameof(GetBrands), new { id = brand.Id }, brand.ToDto());
    }
}
```

### Step 12 — Error Handling

Rely on global exception middleware (see [Section 8](#8-error-handling-and-logging)) rather than wrapping every action in `try/catch`. Only catch exceptions in a controller/service when you can do something meaningfully different with them (e.g., return a specific `400` for a known failure mode).

### Step 13 — Test the Endpoint

- **Swagger**: run the API, open `/swagger`, expand `BrandsController`, execute `GET /api/brands` and `POST /api/brands`.
- **.http file** (built into VS Code / Rider):

```http
### Get all brands
GET {{baseUrl}}/api/brands

### Create a brand
POST {{baseUrl}}/api/brands
Content-Type: application/json

{
  "name": "Nike"
}
```

- **Postman**: create a collection per API, use environment variables for `baseUrl` and auth tokens, and add basic assertions (status code, response schema) as test scripts.

### Step 14 — Write Tests

See [Section 9](#9-testing-standards) for structure and examples.

---

## 3. Naming and Coding Conventions

### 3.1 General Rules

| Element | Convention | Good | Bad |
|---|---|---|---|
| Class / Record / Struct | PascalCase | `OrderService` | `orderService`, `Order_Service` |
| Interface | `I` + PascalCase | `IOrderService` | `OrderServiceInterface` |
| Method | PascalCase, verb or verb phrase | `GetOrderByIdAsync` | `orderById`, `Data` |
| Local variable | camelCase | `orderTotal` | `OrderTotal`, `ordertotal` |
| Private field | `_camelCase` | `_logger` | `logger`, `m_logger` |
| Constant | PascalCase | `MaxPageSize` | `MAX_PAGE_SIZE`, `maxPageSize` |
| Parameter | camelCase | `cartId` | `CartId` |
| Enum type | PascalCase, singular | `OrderStatus` | `OrderStatuses`, `orderStatus` |
| Enum member | PascalCase | `PaymentReceived` | `payment_received` |
| Async method | PascalCase + `Async` suffix | `CreateOrderAsync` | `CreateOrder` (when it's async) |

### 3.2 DTOs vs Entities

```csharp
// ✅ Good: DTO is independent of persistence model
public record OrderSummaryDto(int Id, DateTime OrderDate, decimal Total, string Status);

// ❌ Bad: returning the entity directly, including navigation properties & internal fields
public class Order : BaseEntity
{
    public string BuyerEmail { get; set; }
    public List<OrderItem> OrderItems { get; set; }
    // ...
}
// return Ok(order); <-- leaks persistence structure and may over-fetch/serialize cycles
```

### 3.3 Database Naming

| Element | Convention | Example |
|---|---|---|
| Table | PascalCase, plural | `Orders`, `OrderItems` |
| Column | PascalCase, singular | `BuyerEmail`, `OrderDate` |
| Primary key | `Id` | `Id` |
| Foreign key | `<ReferencedEntity>Id` | `DeliveryMethodId` |
| Join table (many-to-many) | `<EntityA><EntityB>` | `ProductCategories` |

### 3.4 API Routes

```csharp
// ✅ Good: plural noun, resource-oriented, no verbs in the route
[Route("api/orders")]
[HttpGet("{id:int}")]
public Task<ActionResult<OrderDto>> GetOrderById(int id) { ... }

// ❌ Bad: verb in the route, inconsistent casing
[Route("api/GetOrderDetails")]
public Task<ActionResult<OrderDto>> getOrderDetails(int orderId) { ... }
```

### 3.5 Async Methods & Cancellation Tokens

```csharp
// ✅ Good: always accept and forward a CancellationToken for I/O-bound work
public async Task<Order?> GetOrderByIdAsync(int id, CancellationToken ct = default)
{
    return await context.Orders
        .FirstOrDefaultAsync(o => o.Id == id, ct);
}

// ❌ Bad: no cancellation token, blocking call on an async method
public Order GetOrderById(int id)
{
    return context.Orders.FirstOrDefault(o => o.Id == id); // blocks thread
}
```

- Controller actions should accept `CancellationToken` as the last parameter — ASP.NET Core automatically binds the request's `HttpContext.RequestAborted`.
- Never use `.Result` or `.Wait()` on a `Task` in application code — this can cause deadlocks.

---

## 4. API Development Standards

### 4.1 RESTful Design

| Operation | HTTP Method | Route | Success Status |
|---|---|---|---|
| List | `GET` | `/api/orders` | `200 OK` |
| Get one | `GET` | `/api/orders/{id}` | `200 OK` |
| Create | `POST` | `/api/orders` | `201 Created` |
| Full update | `PUT` | `/api/orders/{id}` | `204 No Content` |
| Partial update | `PATCH` | `/api/orders/{id}` | `200 OK` / `204 No Content` |
| Delete | `DELETE` | `/api/orders/{id}` | `204 No Content` |

### 4.2 Status Code Usage

| Code | Meaning | When to use |
|---|---|---|
| `200` | OK | Successful `GET`/`PUT`/`PATCH` with body |
| `201` | Created | Successful `POST` that creates a resource (include `Location` header) |
| `204` | No Content | Successful operation with no response body |
| `400` | Bad Request | Validation failure, malformed request |
| `401` | Unauthorized | Missing/invalid authentication |
| `403` | Forbidden | Authenticated but lacks permission |
| `404` | Not Found | Resource does not exist |
| `409` | Conflict | Concurrency conflict, duplicate resource |
| `422` | Unprocessable Entity | Semantically invalid request (optional, use consistently if adopted) |
| `500` | Internal Server Error | Unhandled exception (never expose stack traces to clients) |

### 4.3 Pagination, Filtering, Sorting

```csharp
// API/RequestHelpers/PaginationParams.cs
public abstract class PaginationParams
{
    private const int MaxPageSize = 50;
    public int PageIndex { get; set; } = 1;

    private int _pageSize = 10;
    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value > MaxPageSize ? MaxPageSize : value;
    }
}
```

```csharp
// API/RequestHelpers/Pagination.cs
public class Pagination<T>(int pageIndex, int pageSize, int count, IReadOnlyList<T> data)
{
    public int PageIndex { get; } = pageIndex;
    public int PageSize { get; } = pageSize;
    public int Count { get; } = count;
    public IReadOnlyList<T> Data { get; } = data;
}
```

Query string convention: `GET /api/products?brands=nike,adidas&sort=priceAsc&pageIndex=1&pageSize=20`

### 4.4 API Versioning

- For a new project, prefer **URL-segment versioning**: `/api/v1/orders`.
- Only introduce versioning once you have a published contract with external consumers — don't pre-emptively version an internal-only API.
- Use the `Asp.Versioning.Mvc` package rather than hand-rolled version routing.

### 4.5 Authentication & Authorization

```csharp
[Authorize] // requires any authenticated user
[HttpGet]
public async Task<ActionResult<IReadOnlyList<OrderDto>>> GetOrdersForUser() { ... }

[Authorize(Roles = "Admin")] // role-based
[HttpDelete("{id:int}")]
public async Task<IActionResult> DeleteProduct(int id) { ... }

[Authorize(Policy = "CanManageInventory")] // policy-based (preferred for complex rules)
[HttpPost]
public async Task<IActionResult> AdjustStock(int productId, int quantity) { ... }
```

> ✅ Recommended default: use **policy-based authorization** for anything beyond simple role checks (e.g., "owns the resource", "has an active subscription"). Keep role checks for coarse-grained access only.

### 4.6 Consistent API Response Format

Adopt one consistent shape for errors across the whole API (see [Section 8.2](#82-consistent-error-response-format)). For success responses, return the resource or DTO directly (no unnecessary `{ "data": ... }` wrapper) unless your team has a strong reason to standardize on an envelope.

### 4.7 Swagger / OpenAPI

```csharp
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header
    });
});
```

- Annotate controllers with `[ProducesResponseType]` so the generated schema accurately documents success/error contracts.
- Keep Swagger enabled in Development/Staging; disable or protect it in Production unless the API is meant to be publicly documented.

---

## 5. Architecture and Design Principles

### 5.1 Clean Architecture (Pragmatic Version)

- **Core** (Domain): entities, interfaces, specifications. No dependency on EF Core, ASP.NET Core, or any infrastructure package.
- **Infrastructure**: implements Core's interfaces using EF Core, Redis, Stripe, etc.
- **API**: composition root — wires up DI, hosts HTTP endpoints, maps DTOs.

Dependency direction: `API → Infrastructure → Core` and `API → Core`. **Core never references Infrastructure or API.**

### 5.2 Separation of Concerns

| Layer | Owns | Does NOT own |
|---|---|---|
| Controller | HTTP concerns: routing, status codes, model binding | Business rules, direct DB queries |
| Service | Business logic, orchestration across repositories | HTTP concepts (no `ActionResult`, no `HttpContext`) |
| Repository | Data access queries | Business rules |
| Entity | Core domain data + simple invariants | Cross-aggregate orchestration |

### 5.3 Dependency Injection

```csharp
// ✅ Good: depend on abstractions, inject via constructor (primary constructor syntax in .NET 8+)
public class OrdersController(IUnitOfWork unit, ICartService cartService) : ControllerBase { ... }

// ❌ Bad: manual instantiation inside a controller/service
public class OrdersController : ControllerBase
{
    private readonly OrderService _service = new(new AppDbContext()); // untestable, tightly coupled
}
```

Standard service lifetimes:

| Lifetime | Use for |
|---|---|
| `Scoped` | `DbContext`, repositories, unit of work, most application services (default choice) |
| `Singleton` | Stateless, thread-safe services (e.g., `IConnectionMultiplexer`, configuration readers) |
| `Transient` | Lightweight, stateless, cheap-to-construct helpers |

### 5.4 SOLID in Practice

- **S**ingle Responsibility: a controller action should orchestrate, not implement business rules inline.
- **O**pen/Closed: add new specifications/strategies rather than branching with large `if/switch` chains inside shared services.
- **L**iskov Substitution: any `IGenericRepository<T>` implementation must honor the same contract (e.g., `GetByIdAsync` returns `null`, not throws, when not found).
- **I**nterface Segregation: prefer small, focused interfaces (`IOrderReader`, `IOrderWriter`) over one large interface, when consumers only need part of the behavior.
- **D**ependency Inversion: `Core` defines interfaces; `Infrastructure` implements them.

### 5.5 Repository Pattern — When to Use It

| Scenario | Recommendation |
|---|---|
| Simple CRUD entities (catalog items, lookup tables) | Generic repository + specification pattern is fine. |
| Rich aggregate roots with invariants (Orders, Carts) | Prefer a dedicated repository interface with explicit methods (`GetOrderWithItemsAsync`), or query directly from a focused service using `DbContext` if the project is small. |
| Reporting / read-heavy endpoints | Bypass repositories — query directly via EF Core (`AsNoTracking`) or Dapper for raw performance. Don't force every read through a write-oriented repository abstraction. |

> ⚠️ Avoid wrapping `DbContext` in a repository **and then** wrapping that in another generic repository "for consistency." This is overengineering for most applications — `DbContext` already implements the Unit of Work and Repository patterns.

### 5.6 Modular Monolith Guidance

For most business applications, a modular monolith (single deployable, internally organized by feature/module) is the pragmatic default over microservices. Define clear module boundaries (e.g., `Catalog`, `Orders`, `Identity`) and avoid one module's repository directly querying another module's tables — go through that module's public service/interface instead.

### 5.7 Avoiding Overengineering

- Don't introduce CQRS/MediatR for a CRUD-only module with no complex query/command divergence.
- Don't create an interface for every class "just in case" — add an interface when you have a real need for substitution (tests, multiple implementations).
- Don't add a caching layer before you have a measured performance problem.

---

## 6. Database Development Standards

### 6.1 Entity & Relationship Design

```csharp
public class Order : BaseEntity
{
    public required string BuyerEmail { get; set; }
    public DeliveryMethod DeliveryMethod { get; set; } = null!;
    public List<OrderItem> OrderItems { get; set; } = [];
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
}
```

- Use `required` properties for mandatory fields with no sensible default (nullable reference types enabled project-wide).
- Initialize collection navigation properties to an empty collection, never `null`.

### 6.2 Keys

- Every entity has a surrogate integer (or `Guid` for distributed scenarios) primary key named `Id`.
- Foreign keys follow `<Entity>Id` naming and are explicit properties (not just shadow properties) when the relationship is queried/filtered on frequently.

### 6.3 EF Core Configuration

```csharp
public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.OwnsOne(o => o.ShippingAddress);
        builder.OwnsOne(o => o.PaymentSummary);

        builder.Property(o => o.Status)
            .HasConversion<string>(); // store enums as strings for readability/debuggability

        builder.HasOne(o => o.DeliveryMethod)
            .WithMany()
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(o => o.OrderItems)
            .WithOne()
            .OnDelete(DeleteBehavior.Cascade);
    }
}
```

### 6.4 Relationships

| Type | Example | EF Core Approach |
|---|---|---|
| One-to-one | `Order` ↔ `ShippingAddress` (owned) | `OwnsOne` for value-object-like data, or separate entity with shared PK for true 1:1 |
| One-to-many | `Order` → `OrderItems` | `HasMany().WithOne()` |
| Many-to-many | `Product` ↔ `Category` | Implicit join entity (EF Core 5+) or explicit join entity when the relationship carries its own data |

### 6.5 Migrations

```powershell
# Add a migration
dotnet ef migrations add <DescriptiveName> --project Infrastructure --startup-project API

# Apply to the database
dotnet ef database update --project Infrastructure --startup-project API

# Remove the last (unapplied) migration
dotnet ef migrations remove --project Infrastructure --startup-project API
```

Rules:
- One migration per logical schema change; descriptive names (`AddOrderAggregate`, not `Update1`).
- Never edit a migration that has shipped to a shared/staging/production environment.
- Review the generated SQL (`dotnet ef migrations script`) before applying to production.

### 6.6 Transactions & Concurrency

```csharp
// Simple case: SaveChangesAsync is already transactional for a single DbContext
await context.SaveChangesAsync();

// Multiple operations that must succeed/fail together
await using var transaction = await context.Database.BeginTransactionAsync(ct);
try
{
    context.Orders.Add(order);
    await context.SaveChangesAsync(ct);

    context.Payments.Add(payment);
    await context.SaveChangesAsync(ct);

    await transaction.CommitAsync(ct);
}
catch
{
    await transaction.RollbackAsync(ct);
    throw;
}
```

Optimistic concurrency:

```csharp
public class Product : BaseEntity
{
    [Timestamp]
    public byte[]? RowVersion { get; set; }
}
```

```csharp
catch (DbUpdateConcurrencyException)
{
    return Conflict("This record was modified by another user. Please reload and try again.");
}
```

### 6.7 Indexing & Query Optimization

```csharp
builder.HasIndex(p => p.Brand);
builder.HasIndex(p => new { p.Brand, p.Type }); // composite index for common filter combos
```

- Index columns used in `WHERE`, `ORDER BY`, and `JOIN` frequently.
- Use `AsNoTracking()` for read-only queries.
- Use projection (`.Select(...)`) to fetch only needed columns for list endpoints.

### 6.8 Avoiding N+1 Queries

```csharp
// ✅ Good: eager load related data in a single query
var orders = await context.Orders
    .Include(o => o.OrderItems)
    .Include(o => o.DeliveryMethod)
    .Where(o => o.BuyerEmail == email)
    .ToListAsync(ct);

// ❌ Bad: lazy-loads items per order inside a loop
foreach (var order in orders)
{
    var items = order.OrderItems; // triggers a separate query per order if lazy loading is on
}
```

- Disable lazy loading proxies unless there's a specific, well-understood reason to use them.
- Use `.Include()`/`.ThenInclude()` or projection with `.Select()` to shape the exact data needed in one round trip.

### 6.9 Soft Deletes

```csharp
public abstract class BaseEntity
{
    public int Id { get; set; }
    public bool IsDeleted { get; set; }
}

// Global query filter
modelBuilder.Entity<Product>().HasQueryFilter(p => !p.IsDeleted);
```

> Use soft deletes only where there's a real business requirement (audit trail, recovery, compliance). For most lookup/reference data, a hard delete with proper foreign key constraints is simpler and avoids query-filter surprises.

### 6.10 Data Integrity

- Enforce required fields and max lengths via EF Core configuration, not just client-side validation.
- Use database-level foreign key constraints (`DeleteBehavior.Restrict`/`Cascade`) deliberately — don't default everything to `Cascade`, which can silently delete unrelated data.
- Add `HasIndex(...).IsUnique()` for natural keys (emails, SKUs) instead of relying only on application-level checks.

---

## 7. Security Standards

### 7.1 Password Hashing

- Use ASP.NET Core Identity's built-in `PasswordHasher<T>` (PBKDF2) — never implement custom hashing.
- Never log, store, or return plaintext passwords anywhere, including debug logs.

### 7.2 JWT Authentication

```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = config["Jwt:Issuer"],
            ValidAudience = config["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(config["Jwt:Key"]!))
        };
    });
```

- Keep access tokens short-lived (5–15 minutes).
- Sign with a secret of at least 256 bits; never commit the signing key to source control.

### 7.3 Refresh Tokens

- Store refresh tokens hashed in the database, associated with a user and an expiry.
- Rotate refresh tokens on every use (issue a new one, invalidate the old one) to limit replay risk.
- Support explicit revocation (logout, "sign out of all devices").

### 7.4 Authorization Policies

```csharp
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("CanManageInventory", policy =>
        policy.RequireClaim("permission", "inventory.manage"));
});
```

### 7.5 Input Validation & Sanitization

- Validate all external input at the API boundary (FluentValidation or Data Annotations).
- Never concatenate user input into SQL — EF Core LINQ queries are parameterized by default; for raw SQL, always use parameters:

```csharp
// ✅ Good
await context.Database.ExecuteSqlInterpolatedAsync(
    $"UPDATE Products SET QuantityInStock = QuantityInStock - {quantity} WHERE Id = {productId}");

// ❌ Bad — SQL injection risk
await context.Database.ExecuteSqlRawAsync(
    $"UPDATE Products SET QuantityInStock = QuantityInStock - {quantity} WHERE Id = {productId}");
```

### 7.6 CORS

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AppCors", policy => policy
        .WithOrigins("https://app.example.com")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});

app.UseCors("AppCors");
```

- Never use `AllowAnyOrigin()` together with `AllowCredentials()` — the two are mutually exclusive and a security risk if misconfigured.
- Restrict allowed origins explicitly per environment (dev vs. production domains).

### 7.7 Secrets & Environment Variables

- Local development: use `dotnet user-secrets` — never commit real keys to `appsettings.Development.json`.
- Production: use environment variables, Azure Key Vault, AWS Secrets Manager, or an equivalent secret store.
- Rotate any secret that is accidentally committed, immediately — treat it as compromised.

```powershell
dotnet user-secrets init --project API
dotnet user-secrets set "StripeSettings:SecretKey" "sk_test_xxx" --project API
```

### 7.8 Rate Limiting

```csharp
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("fixed", opt =>
    {
        opt.Window = TimeSpan.FromMinutes(1);
        opt.PermitLimit = 100;
        opt.QueueLimit = 0;
    });
});

app.UseRateLimiter();
```

Apply stricter limits to authentication endpoints (login, register, password reset) to mitigate brute-force attacks.

### 7.9 Sensitive Data Protection

- Never return password hashes, security stamps, or internal tokens in any DTO.
- Mask/redact PII (full card numbers, SSNs) in logs — log only non-sensitive identifiers (e.g., last 4 digits).
- Encrypt sensitive data at rest when required by compliance (e.g., `Microsoft.AspNetCore.DataProtection` for small secrets, column/TDE encryption for broader needs).

### 7.10 Audit Logging

- Log who did what and when for sensitive operations (role changes, payments, deletions): user id, action, entity id, timestamp.
- Keep audit logs append-only and separate from general application logs where compliance requires it.

---

## 8. Error Handling and Logging

### 8.1 Global Exception Middleware

```csharp
// API/Middleware/ExceptionMiddleware.cs
public class ExceptionMiddleware(
    RequestDelegate next,
    ILogger<ExceptionMiddleware> logger,
    IHostEnvironment env)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception for {Method} {Path}",
                context.Request.Method, context.Request.Path);

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;

            var response = env.IsDevelopment()
                ? new ApiErrorResponse(500, ex.Message, ex.StackTrace)
                : new ApiErrorResponse(500, "An unexpected error occurred.");

            await context.Response.WriteAsJsonAsync(response);
        }
    }
}
```

Register it **first** in the pipeline, before routing/auth:

```csharp
app.UseMiddleware<ExceptionMiddleware>();
```

### 8.2 Consistent Error Response Format

```csharp
public record ApiErrorResponse(int StatusCode, string Message, string? Details = null);
```

Use this same shape for:
- Unhandled exceptions (middleware).
- Validation errors (`400` with field-level messages via `ValidationProblemDetails`, or a custom shape — pick **one** and use it everywhere).
- Explicit `BadRequest("message")` / `NotFound()` results.

### 8.3 Structured Logging

```csharp
// ✅ Good: structured, queryable
logger.LogInformation("Order {OrderId} created for {BuyerEmail} with total {Total}",
    order.Id, order.BuyerEmail, order.GetTotal());

// ❌ Bad: string interpolation defeats structured logging / log querying
logger.LogInformation($"Order {order.Id} created for {order.BuyerEmail}");
```

### 8.4 Logging Levels

| Level | Use for |
|---|---|
| `Trace` | Extremely detailed diagnostic data (rarely enabled) |
| `Debug` | Development-time diagnostic detail |
| `Information` | Normal application flow (request handled, order created) |
| `Warning` | Unexpected but recoverable situations (fallback used, retry happened) |
| `Error` | Failures that affect the current operation but not the whole app |
| `Critical` | Failures that may crash the app or cause data loss |

### 8.5 Request Tracing & Correlation IDs

- Use the built-in `TraceIdentifier` (`HttpContext.TraceIdentifier`) or propagate a custom `X-Correlation-Id` header through services for distributed tracing.
- Include the correlation/trace id in every log statement and in error responses so support can correlate a user-reported issue with server logs.

### 8.6 Avoid Exposing Sensitive Information

- Never return stack traces, connection strings, or internal exception messages to clients in Production.
- Scrub tokens, passwords, and card data from logs — log identifiers, not payloads, for sensitive requests.

---

## 9. Testing Standards

### 9.1 Test Types

| Type | Scope | Tools |
|---|---|---|
| Unit | Single class/method, dependencies mocked | xUnit, Moq/NSubstitute, FluentAssertions |
| Integration | Multiple components together (API + real/in-memory DB) | `WebApplicationFactory<T>`, Testcontainers/SQLite in-memory |
| API / E2E | Full HTTP round trip against a running instance | `HttpClient` via `WebApplicationFactory`, Postman/Newman in CI |

### 9.2 Recommended Test Project Structure

```
Tests/
  UnitTests/
    UnitTests.csproj
    Services/
      OrderServiceTests.cs
    Specifications/
  IntegrationTests/
    IntegrationTests.csproj
    Controllers/
      OrdersControllerTests.cs
    CustomWebApplicationFactory.cs
```

### 9.3 Naming Convention

`MethodUnderTest_Scenario_ExpectedResult`

```csharp
[Fact]
public async Task CreateOrderAsync_WhenCartIsEmpty_ThrowsInvalidOperationException()
{
    // Arrange
    var service = new OrderService(fakeUnitOfWork, fakeCartService);

    // Act
    var act = () => service.CreateOrderAsync("empty-cart-id");

    // Assert
    await act.Should().ThrowAsync<InvalidOperationException>();
}
```

### 9.4 Mocking Dependencies

```csharp
var mockRepo = new Mock<IGenericRepository<Product>>();
mockRepo.Setup(r => r.GetByIdAsync(1, default))
    .ReturnsAsync(new Product { Id = 1, Name = "Test Product", Price = 10m });

var mockUnit = new Mock<IUnitOfWork>();
mockUnit.Setup(u => u.Repository<Product>()).Returns(mockRepo.Object);
```

### 9.5 Testing Business Logic vs. Database Operations

- **Business logic** (pricing calculations, status transitions): unit test with mocked repositories — fast, no I/O.
- **Database operations** (query correctness, EF Core configuration, migrations): integration test against a real (or containerized) SQL Server instance, or SQLite in-memory as a lightweight substitute for simple cases.

```csharp
public class OrdersControllerTests(CustomWebApplicationFactory factory)
    : IClassFixture<CustomWebApplicationFactory>
{
    [Fact]
    public async Task GetOrdersForUser_ReturnsOk_WhenAuthenticated()
    {
        var client = factory.CreateAuthenticatedClient("test@example.com");
        var response = await client.GetAsync("/api/orders");
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
```

---

## 10. Performance and Scalability

### 10.1 Async/Await Best Practices

- Make I/O-bound methods (DB, HTTP, file) `async` all the way up the call stack — avoid mixing sync-over-async (`.Result`, `.Wait()`, `GetAwaiter().GetResult()`).
- Use `ConfigureAwait(false)` in library code (not needed in ASP.NET Core request-handling code, since there's no `SynchronizationContext`).

### 10.2 Efficient Database Queries

```csharp
// ✅ Good: project only needed fields, filter/paginate in the DB
var products = await context.Products
    .Where(p => p.Brand == brand)
    .OrderBy(p => p.Name)
    .Skip((pageIndex - 1) * pageSize)
    .Take(pageSize)
    .Select(p => new ProductDto(p.Id, p.Name, p.Price))
    .ToListAsync(ct);

// ❌ Bad: load everything into memory, then filter/paginate in C#
var allProducts = await context.Products.ToListAsync(ct);
var filtered = allProducts.Where(p => p.Brand == brand).Skip(10).Take(10);
```

### 10.3 Caching Strategies

| Cache type | Use for |
|---|---|
| In-memory (`IMemoryCache`) | Single-instance apps, short-lived lookup data |
| Distributed (Redis) | Multi-instance deployments, session/cart data, shared cache across nodes |
| Response caching / CDN | Public, rarely-changing GET endpoints |

```csharp
var cacheKey = $"product:{id}";
var cached = await cache.GetStringAsync(cacheKey, ct);
if (cached is not null) return JsonSerializer.Deserialize<ProductDto>(cached);

var product = await repo.GetByIdAsync(id, ct);
await cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(product),
    new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10) }, ct);
```

### 10.4 Background Services & Jobs

```csharp
public class OutboxProcessorService(IServiceScopeFactory scopeFactory)
    : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = scopeFactory.CreateScope();
            var processor = scope.ServiceProvider.GetRequiredService<IOutboxProcessor>();
            await processor.ProcessPendingMessagesAsync(stoppingToken);

            await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
        }
    }
}
```

- Use `IHostedService`/`BackgroundService` for in-process recurring work; use a proper job scheduler (Hangfire, Quartz.NET, Azure Functions) when you need persistence, retries, or distributed scheduling.

### 10.5 Connection Pooling

- EF Core's `DbContext` with `AddDbContext` already uses ADO.NET connection pooling by default — don't disable pooling without a strong reason.
- Avoid opening long-lived connections manually; let EF Core manage connection lifetime per `DbContext` scope.

### 10.6 Resource Management

```csharp
await using var stream = new FileStream(path, FileMode.Open);
```

- Always use `using`/`await using` for `IDisposable`/`IAsyncDisposable` resources (streams, transactions, `HttpClient` handlers when manually created).
- Use `IHttpClientFactory` instead of `new HttpClient()` per call to avoid socket exhaustion.

### 10.7 Performance Monitoring

- Use `Application Insights`, `OpenTelemetry`, or a similar APM tool in Production.
- Track key metrics: request latency (p50/p95/p99), error rate, DB query duration, external dependency latency.
- Set up alerts on error-rate and latency thresholds before launch, not after an incident.

---

## 11. Configuration and Environment Management

### 11.1 Environments

| Environment | `ASPNETCORE_ENVIRONMENT` | Purpose |
|---|---|---|
| Development | `Development` | Local machine, verbose logging, Swagger enabled |
| Staging | `Staging` | Pre-production validation, production-like config |
| Production | `Production` | Live traffic, minimal logging, Swagger disabled/secured |

### 11.2 appsettings.json Conventions

```
appsettings.json                   # Shared defaults, safe to commit, NO secrets
appsettings.Development.json       # Local overrides, NO real secrets
appsettings.Staging.json           # Staging-specific, non-secret config
appsettings.Production.json        # Production-specific, non-secret config
```

- Real secrets (connection strings with passwords, API keys) never live in any `appsettings*.json` committed to source control — use User Secrets locally and environment variables/secret stores elsewhere.
- Keep configuration **keys** (e.g., `"StripeSettings:SecretKey"`) consistent across environments; only values differ.

### 11.3 User Secrets

```powershell
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=...;" --project API
```

### 11.4 Environment Variables (Production)

```
ConnectionStrings__DefaultConnection=Server=prod-db;...
StripeSettings__SecretKey=sk_live_xxx
```

(Double underscore `__` maps to `:` in configuration keys.)

### 11.5 Dependency Configuration

```csharp
builder.Services.AddOptions<StripeSettings>()
    .Bind(builder.Configuration.GetSection("StripeSettings"))
    .ValidateDataAnnotations()
    .ValidateOnStart();
```

> ✅ Recommended default: bind configuration sections to strongly-typed options classes (`IOptions<T>`) instead of reading raw strings via `config["Section:Key"]` scattered throughout the codebase.

### 11.6 Database Connection Management

- Use a single `AddDbContext<AppDbContext>()` registration; don't manually construct `DbContextOptions` in multiple places.
- Apply migrations via a controlled startup step or deployment pipeline step — be cautious with auto-migrate-on-startup in Production (prefer running migrations as an explicit release step for multi-instance deployments).

---

## 12. Git and Development Workflow

### 12.1 Branch Naming

| Type | Pattern | Example |
|---|---|---|
| Feature | `feature/<short-description>` | `feature/order-delivery-method` |
| Bug fix | `fix/<short-description>` | `fix/webhook-signature-validation` |
| Hotfix | `hotfix/<short-description>` | `hotfix/payment-500-error` |
| Chore | `chore/<short-description>` | `chore/upgrade-ef-core` |

### 12.2 Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>

<optional body>
```

```
feat(orders): include delivery method in order include spec
fix(payments): handle stripe api version mismatch in webhook
chore(infra): fix seed data glob pattern in csproj
```

Types: `feat`, `fix`, `chore`, `refactor`, `test`, `docs`, `perf`, `build`, `ci`.

### 12.3 Pull Request Guidelines

- Keep PRs focused on a single concern; avoid mixing refactors with feature work.
- PR description should include: what changed, why, how it was tested, and any migration/config steps required.
- Link the related issue/ticket.
- CI (build + tests) must pass before merge.

### 12.4 Code Review Standards

- Review for correctness, security, and adherence to these guidelines — not just style (let formatters/analyzers handle style).
- Check: proper DI usage, no leaked entities as DTOs, async used correctly, no secrets committed, migrations reviewed.
- At least one approval required before merging to the main branch.

### 12.5 Feature Development Workflow

1. Create a branch from the latest `main`/`develop`.
2. Implement the feature following [Section 2](#2-step-by-step-backend-development-guide).
3. Write/update tests.
4. Run `dotnet build` and `dotnet test` locally.
5. Open a PR; address review feedback.
6. Merge via squash or rebase (team preference, but stay consistent).

### 12.6 Release & Deployment Practices

- Tag releases using semantic versioning (`v1.4.0`).
- Run database migrations as an explicit deployment step, ideally before the new app version receives traffic.
- Use blue-green or rolling deployments where possible to avoid downtime.
- Maintain a rollback plan (previous artifact + previous migration state) before every production deploy.

---

## 13. Production Readiness Checklist

Use this checklist before shipping a new backend feature to production.

**Code & Design**
- [ ] No business logic in controllers.
- [ ] DTOs used for all request/response payloads (no entities exposed).
- [ ] Dependencies injected via constructor, registered with the correct lifetime.
- [ ] No hardcoded secrets, connection strings, or API keys.

**Data**
- [ ] EF Core migration created, reviewed, and tested against a non-prod database.
- [ ] Appropriate indexes added for new query patterns.
- [ ] N+1 query risk checked (`Include`/projection used where needed).

**Validation & Errors**
- [ ] All inputs validated (FluentValidation or Data Annotations).
- [ ] Global exception middleware covers the new endpoints.
- [ ] Errors return the project's standard error response shape.

**Security**
- [ ] `[Authorize]`/policy applied where required.
- [ ] CORS policy reviewed for the new endpoint's origin requirements.
- [ ] No sensitive data (passwords, tokens, PII) logged or returned in responses.
- [ ] Rate limiting considered for public-facing or auth-sensitive endpoints.

**Testing**
- [ ] Unit tests cover new business logic branches.
- [ ] Integration test(s) cover the new endpoint's happy path and at least one failure path.
- [ ] Manually verified via Swagger/Postman.

**Operations**
- [ ] Structured logging added for key operations and failures.
- [ ] Configuration externalized per environment (no environment-specific values hardcoded).
- [ ] CI pipeline passes build + tests.
- [ ] Rollback plan understood for this change (migration + code).

---

## 14. AI-Assisted Development Guidelines

AI coding assistants (GitHub Copilot, Claude, etc.) are productivity tools, not a replacement for engineering judgment. Apply the following standards whenever AI-generated code is used in this project.

### 14.1 Review Before Merge

- Treat AI-generated code exactly like a junior contributor's PR: read every line before accepting it.
- Confirm the generated code actually matches the stated intent — AI can produce plausible-looking but subtly incorrect logic (off-by-one errors, wrong HTTP status codes, incorrect EF Core includes).

### 14.2 Preventing Unnecessary Abstractions

- Reject AI suggestions that introduce new layers (extra interfaces, generic base classes, new design patterns) not already used in the project, unless there's a clear, stated reason.
- Prefer the simplest solution that solves the actual requirement — don't let an assistant "gold-plate" a simple CRUD feature.

### 14.3 Following Existing Project Conventions

- Before accepting generated code, check it against this document: naming, folder placement, DTO usage, error handling pattern, async/cancellation token usage.
- If the assistant introduces a new pattern (e.g., a different repository style, different error shape), either align it with the existing convention or make a deliberate, documented decision to change the convention project-wide — don't let conventions drift file-by-file.

### 14.4 Validating Generated SQL and Business Logic

- Any raw SQL (`FromSqlRaw`, `ExecuteSqlRaw`) generated by AI must be reviewed for parameterization (no string concatenation of user input) and correctness against the actual schema.
- Validate generated LINQ-to-EF queries don't cause N+1 issues or unintentionally load entire tables into memory.
- Verify business rules (totals, status transitions, authorization checks) against actual requirements — don't assume correctness because the code compiles.

### 14.5 Avoiding Hardcoded Secrets

- Reject any AI-generated snippet containing literal API keys, connection strings with credentials, or JWT signing keys. Replace with configuration/User Secrets references.
- Scan AI-assisted commits for accidentally included real credentials before pushing.

### 14.6 Ensuring Generated Code Is Tested and Maintainable

- Require unit/integration tests for any non-trivial AI-generated business logic, same as hand-written code.
- Refactor generated code for readability and naming consistency — don't leave verbose or oddly-named AI output as-is if it doesn't match the codebase's style.
- Document any non-obvious AI-assisted design decision in the PR description so reviewers understand the reasoning, not just the diff.

---

*This document should be revisited periodically (e.g., each major .NET version upgrade or architecture review) and updated to reflect the team's evolving standards.*
