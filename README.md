This project is a Node.js backend system that receives incoming events via HTTP, logs them, and forwards them to multiple destinations asynchronously. It supports account management, destination management, user roles, and admin-level log viewing.

## Tech Stack

- **Node.js & Express**: Backend framework for building RESTful APIs.
- **MongoDB & Mongoose**: Database and ODM for data persistence.
- **Redis & Bull**: Queue worker for asynchronous event forwarding.
- **JWT**: Authentication and authorization.
- **Webhook.site**: Testing webhook endpoints.
- **Helmet, CORS, Morgan**: Security and logging middleware.

### Installation & Setup

```bash
npm install
node app.js
node workers/forwardWorker.js
```

### Environment Variables

Create a `.env` file with the following variables:

```env
PORT=3000
MONGO_URI=
JWT_SECRET=3e44baa48942cffa463c9b900542d42b174114088e0469eaf9e85e1e465a6bc8
JWT_EXPIRY=7d
REDIS_URL=
ADMIN_DEFAULT_EMAIL=admin@example.com
ADMIN_DEFAULT_PASSWORD=Admin@123
RATE_LIMIT_TOKENS_PER_SECOND=5
```

## Usage

### 1. Admin Signup

**Endpoint:** `POST /auth/signup`

**Request Body:**

```json
{
  "email": "admin@example.com",
  "password": "Admin@123",
  "fullname": "Admin User"
}
```

### 2. Admin Login

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "email": "admin@example.com",
  "password": "Admin@123"
}
```

### 3. Create Account

**Endpoint:** `POST /accounts`

**Request Body:**

```json
{
  "account_name": "My Account"
}
```

### 4. Create Destination for Account

**Endpoint:** `POST /accounts/:accountId/destinations`

**Request Body:**

```json
{
  "url": "https://webhook.site/<unique-id>",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer 01234"
  }
}
```

### 5. Send Event Data

**Endpoint:** `POST /server/incoming_data`

**Headers:**

- `Content-Type: application/json`
- `cl-x-token: <account_app_secret_token>`
- `cl-x-event-id: <unique_event_id>`

**Request Body:**

```json
{
  "order_id": "ORD123",
  "amount": 2500,
  "currency": "INR",
  "customer": "John Doe"
}
```

### 6. View Logs (Admin Only)

**Endpoint:** `GET /:accountId/logs`

**Headers:**

- `Authorization: Bearer <JWT_TOKEN>`

**Response Example:**

```json
{
  "success": true,
  "logs": [
    {
      "_id": "...",
      "event_id": "event-123",
      "received_data": {
        /* event data */
      },
      "status": "success",
      "attempt_count": 1,
      "destination": "...",
      "received_timestamp": "...",
      "processed_timestamp": "..."
    }
  ]
}
```

## Forward Worker

- Runs asynchronously and listens to the `forwardQueue`.
- Picks up jobs with incoming events and forwards them to all destinations for the account.
- Updates logs with status (`success`/`failed`) and `attempt_count`.
- Start worker separately:
  ```bash
  node workers/forwardWorker.js
  ```

## Permissions & Roles

- **Admin**: Full CRUD on accounts, destinations, and account members. Can view logs.
- **Normal User**: Restricted access (can be extended as needed).
- Middleware ensures only authorized users can access logs or perform account management.

## Testing with Webhook.site

1. Create a unique Webhook URL at [Webhook.site](https://webhook.site).
2. Use this URL as a destination for your account.
3. Send an incoming event using `/server/incoming_data`.
4. Verify payload delivery on Webhook.site.
