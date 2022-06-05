# sacas-bills-manager-api
An API for a money management mpbile app 

## Storage
We'll use a relational database (schema follows) to fast retrieval of Money cycle. A simple No-SQL database such as MongoDB. Data will be stored on the server on a separate, backed up volume for resilience. There will be no replication or sharding of data at this early stage.

## Scheme:
We'll need at least the following entities to implement the service:

**Users**:
| Column | Type |
|--------|------|
| ID | STRING/UUID |
| FirstName | STRING |
| LastName | STRING |
| PhoneNumber | NUMBER |
| Email | STRING |
| Avatar | STRING |
| Rate | Number |
| BankName | STRING |
| IBAN | STRING |
| BackAccNum | STRING |
| ActiveICG | [STRING] |
| ActiveInvoices | [STRING] |
| Friends | [STRING] |
| history | [STRING] |



**CSGs**:
| Column | Type |
|--------|------|
| CSGId | STRING/UUID |
| CSGName | STRING |
| CSGColor | STRING |
| OwnerId | STRING |
| Members | ARRAY |
| TotalBalance | NUMBER |
| MonthlyShare | NUMBER |
| Paid | NUMBER |
| Receiver | NUMBER |
| CreatedAt | Timestamp |

**Invoices**:
| Column | Type |
|---------|------|
| InvoiceId | STRING/UUID |
| OwnerId | STRING |
| Members | ARRAY |
| TotalBalance | NUMBER |
| Paid | NUMBER |
| Receiver | NUMBER |
| CreatedAt | Timestamp |

## Server

A simple HTTP server is responsible for authentication, serving stored data, and
potentially ingesting and serving analytics data.

- Node.js is selected for implementing the server for speed of development.
- Express.js is the web server framework.
- Sequelize to be used as an ORM.

### Auth

For v1, a simple JWT-based auth mechanism is to be used, with passwords
encrypted and stored in the database. OAuth is to be added initially or later
for Google + Facebook and maybe others (Github?).

### API

**Auth**:

```
/signIn   [POST]
/signUp   [POST]
/signOut  [POST]
```

**Users**:

```
// Creation
/users/addNewUser     [POST] ✅
/users/addFriend      [POST]
/users/addInvoice     [POST]
/users/me/avatar      [POST] ✅

// Edit
/users/edit/:id       [POST] ✅

// Search
/users/:id            [GET] ✅
/users/search/:num    [GET] ✅

// Display
/users/list           [GET] ✅
/users/me             [GET] ✅
/users/friends/:id    [GET] ✅
/users/history/:id    [GET] ✅
/users/activeInvoices [GET] ✅
/users/rate/:id       [GET] ✅

// Delete
/users/:id            [DELETE] ✅

// Operations
/users/login          [POST] ✅
/users/logout         [POST] ✅
```

**CSGs**:

```
/csgs/list  [GET]
/csgs/new   [POST]
/csgs/:id   [GET]
/csgs/:id   [DELETE]
```

**Invoices**:

```
/invoices/list  [GET]
/invoices/new   [POST]
/invoices/:id   [GET]
/invoices/:id   [DELETE]
```
