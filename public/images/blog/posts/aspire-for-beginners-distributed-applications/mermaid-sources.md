# Mermaid Diagram Sources

Use these to generate the PNG images referenced in the blog post.

---

## 1. architecture-overview.png

```mermaid
graph TB
    subgraph AppHost["AppHost (Orchestrator)"]
        direction TB
        AH["Program.cs<br/>Defines the entire system"]
    end

    subgraph Infrastructure["Infrastructure (Containers)"]
        PG["PostgreSQL"]
        RD["Redis"]
        CDB["catalogdb"]
        ODB["ordersdb"]
    end

    subgraph Services["Application Services"]
        CA["Catalog API<br/>.NET"]
        OA["Orders API<br/>.NET"]
        WEB["Web Frontend<br/>React + TypeScript"]
        FW["Fulfillment Worker<br/>Python"]
    end

    PG --> CDB
    PG --> ODB
    
    CA -->|reads products| CDB
    CA -->|caches results| RD
    OA -->|reads/writes orders| ODB
    
    WEB -->|browse products| CA
    WEB -->|place orders| OA
    FW -->|polls pending orders| OA

    AH -.->|starts & wires| PG
    AH -.->|starts & wires| RD
    AH -.->|starts & wires| CA
    AH -.->|starts & wires| OA
    AH -.->|starts & wires| WEB
    AH -.->|starts & wires| FW

    style AppHost fill:#1e40af,stroke:#3b82f6,color:#fff
    style Infrastructure fill:#065f46,stroke:#10b981,color:#fff
    style Services fill:#7c2d12,stroke:#f97316,color:#fff
    style AH fill:#2563eb,stroke:#3b82f6,color:#fff
    style PG fill:#059669,stroke:#10b981,color:#fff
    style RD fill:#059669,stroke:#10b981,color:#fff
    style CDB fill:#047857,stroke:#10b981,color:#fff
    style ODB fill:#047857,stroke:#10b981,color:#fff
    style CA fill:#ea580c,stroke:#f97316,color:#fff
    style OA fill:#ea580c,stroke:#f97316,color:#fff
    style WEB fill:#ea580c,stroke:#f97316,color:#fff
    style FW fill:#ea580c,stroke:#f97316,color:#fff
```

---

## 2. product-browse-flow.png

```mermaid
sequenceDiagram
    actor User
    participant Web as Web Frontend<br/>(React)
    participant CatAPI as Catalog API<br/>(.NET)
    participant Redis as Redis<br/>(Cache)
    participant DB as PostgreSQL<br/>(catalogdb)

    Note over User,DB: First Request — Cache MISS
    User->>Web: Click "Products"
    Web->>CatAPI: GET /api/catalog/products
    CatAPI->>Redis: GET products:all
    Redis-->>CatAPI: null (MISS)
    CatAPI->>DB: SELECT * FROM Products
    DB-->>CatAPI: 8 products
    CatAPI->>Redis: SET products:all (TTL 30s)
    CatAPI-->>Web: JSON [8 products]
    Web-->>User: Render product cards

    Note over User,DB: Second Request (within 30s) — Cache HIT
    User->>Web: Reload page
    Web->>CatAPI: GET /api/catalog/products
    CatAPI->>Redis: GET products:all
    Redis-->>CatAPI: cached data (HIT)
    CatAPI-->>Web: JSON [8 products]
    Web-->>User: Render product cards (faster!)
```

---

## 3. order-fulfillment-flow.png

```mermaid
sequenceDiagram
    actor User
    participant Web as Web Frontend<br/>(React)
    participant OrdAPI as Orders API<br/>(.NET)
    participant DB as PostgreSQL<br/>(ordersdb)
    participant Worker as Fulfillment Worker<br/>(Python)

    Note over User,Worker: Step 1 — Place Order
    User->>Web: Add to cart + Place Order
    Web->>OrdAPI: POST /orders {items, name, email}
    OrdAPI->>DB: INSERT Order (status="Pending")
    DB-->>OrdAPI: Order #5 created
    OrdAPI-->>Web: 201 Created
    Web-->>User: "Order #5 created!"

    Note over User,Worker: Step 2 — Background Fulfillment
    loop Every 10 seconds
        Worker->>OrdAPI: GET /orders?status=Pending
        OrdAPI->>DB: SELECT WHERE status='Pending'
        DB-->>OrdAPI: [Order #5]
        OrdAPI-->>Worker: [{id:5, status:"Pending"}]
    end
    
    Worker->>Worker: Process Order #5 (simulate work)
    Worker->>OrdAPI: PUT /orders/5/fulfill
    OrdAPI->>DB: UPDATE status='Fulfilled'
    DB-->>OrdAPI: OK
    OrdAPI-->>Worker: 200 OK

    Note over User,Worker: Step 3 — User Sees Update
    Web->>OrdAPI: GET /orders (auto-refresh)
    OrdAPI-->>Web: Order #5 status="Fulfilled" ✓
    Web-->>User: Status badge → green "Fulfilled"
```

---

## 4. without-vs-with-aspire.png

```mermaid
graph LR
    subgraph WITHOUT["Without Aspire — 5 Terminals"]
        direction TB
        T1["Terminal 1<br/>docker-compose up -d"]
        T2["Terminal 2<br/>dotnet run CatalogApi"]
        T3["Terminal 3<br/>dotnet run OrdersApi"]
        T4["Terminal 4<br/>npm install && npm run dev"]
        T5["Terminal 5<br/>python -m venv .venv<br/>pip install -r requirements.txt<br/>python main.py"]
        
        T1 --> T2
        T1 --> T3
        T2 --> T4
        T3 --> T4
        T4 --> T5
    end

    subgraph WITH["With Aspire — 1 Command"]
        direction TB
        ONE["dotnet run --project<br/>OrderCanvas.AppHost"]
        ONE --> R1["✓ PostgreSQL started"]
        ONE --> R2["✓ Redis started"]
        ONE --> R3["✓ Catalog API started"]
        ONE --> R4["✓ Orders API started"]
        ONE --> R5["✓ Web Frontend started"]
        ONE --> R6["✓ Python Worker started"]
        ONE --> R7["✓ Dashboard opened"]
    end

    style WITHOUT fill:#7f1d1d,stroke:#ef4444,color:#fff
    style WITH fill:#14532d,stroke:#22c55e,color:#fff
    style T1 fill:#991b1b,stroke:#ef4444,color:#fff
    style T2 fill:#991b1b,stroke:#ef4444,color:#fff
    style T3 fill:#991b1b,stroke:#ef4444,color:#fff
    style T4 fill:#991b1b,stroke:#ef4444,color:#fff
    style T5 fill:#991b1b,stroke:#ef4444,color:#fff
    style ONE fill:#166534,stroke:#22c55e,color:#fff
    style R1 fill:#166534,stroke:#22c55e,color:#fff
    style R2 fill:#166534,stroke:#22c55e,color:#fff
    style R3 fill:#166534,stroke:#22c55e,color:#fff
    style R4 fill:#166534,stroke:#22c55e,color:#fff
    style R5 fill:#166534,stroke:#22c55e,color:#fff
    style R6 fill:#166534,stroke:#22c55e,color:#fff
    style R7 fill:#166534,stroke:#22c55e,color:#fff
```
