# ⚙️ QuickCart - E-Commerce API Server

QuickCart Backend is a robust, scalable RESTful API built with **Node.js**, **Express.js v5**, and **MongoDB (Mongoose v9)**. It provides authentication, Passport Google OAuth 2.0 social login, product management with Cloudinary image uploads, cart operations, wishlist management, order processing with Stripe Payment integration (without webhooks), and administrative dashboard metrics.

---

## 🚀 Technologies & Version Specifications

- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules `type: "module"`)
- **Server Framework**: [Express v5.2.1](https://expressjs.com/)
- **Database & ORM**: [MongoDB](https://www.mongodb.com/) via [Mongoose v9.8.1](https://mongoosejs.com/)
- **Authentication**: [JSON Web Token (jsonwebtoken v9.0.3)](https://jwt.io/) stored in HTTP-Only Cookies
- **Social OAuth**: [Passport.js v0.7.0](https://www.passportjs.org/) & `passport-google-oauth20` v2.0.0
- **Payments**: [Stripe Node SDK v22.4.0](https://stripe.com/)
- **Password Hashing**: [bcryptjs v3.0.3](https://github.com/dcodeIO/bcrypt.js)
- **Cookie Handler**: `cookie-parser` v1.4.7
- **CORS & Logger**: `cors` v2.8.6, `morgan` v1.11.0
- **Environment Config**: `dotenv` v17.4.2
- **File Uploads**: `multer` v2.2.0 + [Cloudinary SDK v2.10.0](https://cloudinary.com/)
- **Dev Server**: `nodemon` v3.1.14

---

## 🔑 Authentication & Middlewares

- **`authMiddleware`**: Verifies JWT token from HTTP-Only cookies for protected routes (Admin & Authenticated Customers).
- **`optionalAuthMiddleware`**: Decodes JWT token if present (setting `req.role = 'admin'`), allowing unauthenticated guest requests to pass through for public product catalog listings.
- **`googleAuthMiddleware`**: Processes Google OAuth profile, automatically creates user records in MongoDB if not existing, generates a 7-day JWT token, and sets the HTTP-Only cookie.

---

## 📡 API Endpoints Reference

### 🔐 Authentication Routes (`/api/auth` & `/auth/google`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new customer account |
| `POST` | `/api/auth/login` | Public | Authenticate user & set JWT HTTP-only cookie |
| `GET` | `/api/auth/check-auth` | Public/Auth | Verify current user session & return user profile |
| `POST` | `/api/auth/logout` | Auth | Clear authentication cookie |
| `GET` | `/auth/google` | Public | Initiate Passport Google OAuth 2.0 authentication |
| `GET` | `/auth/google/callback` | Public | Handle Google OAuth callback & issue JWT HTTP-only cookie |

---

### 📦 Product Routes (`/api/product`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/product/all` | Public & Auth | Fetch products (Admin gets all, Guests/Customers get active only) |
| `GET` | `/api/product/get-single/:id` | Public & Auth | Fetch single product details by ID |
| `POST` | `/api/product/create` | Admin Only | Create new product with image upload to Cloudinary |
| `PATCH` | `/api/product/update/:id` | Admin Only | Update product details or status |
| `DELETE` | `/api/product/delete/:id` | Admin Only | Delete product and remove image from Cloudinary |

---

### 🛒 Cart Routes (`/api/cart`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/cart/get` | Auth | Fetch user's cart with populated product details & subtotal |
| `POST` | `/api/cart/add` | Auth | Add product & quantity to cart with stock validation |
| `PATCH` | `/api/cart/update/:productId` | Auth | Update item quantity in cart |
| `DELETE` | `/api/cart/delete/:productId` | Auth | Remove item from cart |
| `DELETE` | `/api/cart/clear` | Auth | Clear all items from cart |

---

### ❤️ Wishlist Routes (`/api/wishlist`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/wishlist/get` | Auth | Fetch user's saved wishlist products |
| `POST` | `/api/wishlist/add` | Auth | Add product to wishlist |
| `DELETE` | `/api/wishlist/delete/:id` | Auth | Remove product from wishlist |

---

### 📋 Order & Stripe Routes (`/api/order`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/order/create` | Auth | Place Cash on Delivery (COD) order with validated shipping details & stock check, auto-clearing cart |
| `POST` | `/api/order/create-stripe-session` | Auth | Initialize Stripe Hosted Checkout session and return checkout URL |
| `GET` | `/api/order/verify-stripe-session` | Auth | Verify Stripe payment status, create Paid order, update product stock, and clear cart |
| `GET` | `/api/order/my-orders` | Auth | Fetch customer's personal order history |
| `GET` | `/api/order/all-orders` | Admin Only | Fetch all customer orders across the platform |
| `GET` | `/api/order/get-single/:id` | Admin Only | Get detailed single order information |
| `PATCH` | `/api/order/update-status/:id` | Admin Only | Update order status (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`) |
| `DELETE` | `/api/order/delete-order/:id` | Admin Only | Delete an order record |

---

### 👤 User Routes (`/api/user`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/user/current` | Auth | Get authenticated user profile details |
| `GET` | `/api/user/dashboard-stats` | Customer | Get customer dashboard metrics (Total Spent, Orders Count, Cart Count, Wishlist Count) |
| `GET` | `/api/user/all` | Admin Only | List all registered platform users |
| `GET` | `/api/user/details/:id` | Admin Only | Fetch detailed user profile by ID |
| `PATCH` | `/api/user/update-role/:id` | Admin Only | Update user role (`admin` / `customer`) |
| `DELETE` | `/api/user/delete/:id` | Admin Only | Remove user account from system |

---

### 🛡️ Admin Routes (`/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/dashboard-stats` | Admin Only | Fetch store-wide metrics (Total Revenue, Orders, Products, Customers, Low Stock, Wishlists) |

---

## 🛠️ Environment Configuration & Setup

1. **Navigate to Server Directory**:
   ```bash
   cd Server
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Create `.env` File**:
   Create a `.env` file in the `Server` root directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/quickcart
   JWT_SECRET=your_jwt_secret_key_here
   FRONTEND_URL=http://localhost:5173
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   SMTP_USER=your_smtp_user
   SMTP_PASS=your_smtp_pass
   SENDER_EMAIL=noreply@quickcart.com
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK=http://localhost:5000/auth/google/callback
   SUCCESS_URL=http://localhost:5173/dashboard
   FAILURE_URL=http://localhost:5173/auth/login
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

---

## 📁 Directory Structure

```text
Server/
├── src/
│   ├── config/               # Database connection & env config
│   ├── controllers/          # Business logic controllers (auth, product, cart, wishlist, order, user, admin)
│   ├── middlewares/          # Express middlewares (auth, optionalAuth, googleAuth, multer)
│   ├── models/               # Mongoose Database Schemas (User, Product, Cart, Wishlist, Order)
│   ├── routes/               # API route definitions (auth, product, cart, wishlist, order, user, admin)
│   ├── utils/                # Google Passport OAuth strategy setup
│   └── app.js                # Express app initialization
├── server.js                 # Server entry point
├── vercel.json               # Serverless function deployment rules for Vercel
├── .env
├── package.json
└── README.md
```
