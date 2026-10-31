# Inventory Management System (IMS)

A web-based Inventory Management System for small businesses


It manages products, categories, suppliers, stock, purchase orders, sales, returns and users, with role-based access, a dashboard and reports.

## Features

- Full CRUD on products, categories, suppliers and users, stored in MongoDB
- Search products by name or code and filter by category
- Sales cart with automatic invoice numbers (INV-001, INV-002, ...) and automatic stock reduction
- Purchase orders with approval (PENDING, APPROVED, COMPLETED)
- Stock adjustments (approved before they change stock) and stock transfers
- Returns linked to a valid invoice, returned items go back into stock
- Dashboard and reports (sales, stock, purchases, low stock)
- JWT login, BCrypt password hashing and role-based access (ADMIN, INVENTORY_MANAGER, SALES_STAFF)
- Light and dark theme

## Tech stack

| Layer    |                 Technology                          |

| Frontend | React, Vite, React Router, Axios, Tailwind CSS      |

| Backend  | Java 17, Spring Boot 3.2, Spring Security, Lombok   |

| Database | MongoDB (Atlas) with Spring Data MongoDB            |

| Security | JWT, BCrypt                                         |


## Setup

### Prerequisites

- JDK 17 or newer
- Maven
- Node.js 18 or newer
- A MongoDB database (a free MongoDB Atlas cluster works)

### 1. Backend (runs on port 8080)

1. Go to the backend folder:
   ```bash
   cd backend/org.ruh.ims
   ```
2. Open `src/main/resources/application.properties` 
   ```properties
   spring.data.mongodb.uri=${MONGODB_URI}
   ```
   ```bash
   export MONGODB_URI="mongodb+srv://<user>:<password>@<cluster>/inventory_management?retryWrites=true&w=majority"
   ```
3. Optional: set a JWT secret (a development default exists).
   ```bash
   export JWT_SECRET="your-long-secret"
   ```
4. Start the server:
   ```bash
   mvn spring-boot:run
   ```
   On the first run the app creates sample users, categories, suppliers, products, purchase orders and sales.

### 2. Frontend (runs on port 5173)

1. Go to the frontend folder:
   ```bash
   cd ims
   ```
2. Install the packages:
   ```bash
   npm install
   npm install axios tailwindcss @tailwindcss/vite
   ```
3. Optional: set the API address (default is `http://localhost:8080/api`).
   ```bash
   echo "VITE_API_URL=http://localhost:8080/api" > .env
   ```
4. Start the app and open http://localhost:5173:
   ```bash
   npm run dev
   ```

| Role              | Can access                                                       |

| ADMIN             | Everything, including user management                            |

| INVENTORY_MANAGER | Products, categories, suppliers, stock, purchase orders, reports |

| SALES_STAFF       | Product list (read only), sales, invoices, returns               |

## Database design

The database has 9 collections. Sale items and purchase order items are embedded inside `sales` and `purchase_orders`, so they are not separate collections.


| Collection | Purpose |

| users             | Login accounts (unique email)                      |

| categories        | Product groups                                     |
| suppliers         | Vendors                                            |
| products          | Main entity, references category and supplier      |
| purchase_orders   | Stock ordered from suppliers, with embedded items  |
| sales             | Customer invoices, with embedded items             |
| product_returns   | Returned goods, linked to an invoice and a product |
| stock_adjustments | Manual stock corrections awaiting approval         |
| stock_transfers   | Stock moved between locations                      |

## Main API endpoints

All endpoints start with `/api` and need a JWT token (`Authorization: Bearer <token>`), except login.



## Known limitations

- Server-side validation is basic; Bean Validation (`@Valid`) is not added yet.
- Tables have no sorting or pagination.
- The layout is built for desktop screens.
- There are no automated tests yet.

