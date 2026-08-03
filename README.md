# ⚙️ QuickCart - E-Commerce API Server

QuickCart Backend is a robust, scalable RESTful API built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)**. It provides authentication, product management with Cloudinary image uploads, cart operations, wishlist management, order processing, and administrative dashboard metrics.

---

## 🚀 Technologies Used

- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose ORM](https://mongoosejs.com/)
- **Authentication**: [JSON Web Token (JWT)](https://jwt.io/) stored in HTTP-Only Cookies
- **Security & Utilities**: `bcryptjs`, `cookie-parser`, `cors`, `dotenv`
- **File Uploads**: `multer` + [Cloudinary SDK](https://cloudinary.com/)

---

## 🔑 Authentication & Middlewares

- **`authMiddleware`**: Verifies JWT token from cookies for protected routes (Admin & Authenticated Customers).
- **`optionalAuthMiddleware`**: Decodes JWT token if present (setting `req.role = 'admin'`), but allows unauthenticated guest requests to pass through seamlessly for public routes like product listings.

---

## 📡 API Endpoints Reference

### 🔐 Authentication Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new customer account |
| `POST` | `/api/auth/login` | Public | Authenticate user & set JWT HTTP-only cookie |
| `GET` | `/api/auth/check-auth` | Public/Auth | Verify current user session & return user profile |
| `POST` | `/api/auth/logout` | Auth | Clear authentication cookie |

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

### 📋 Order Routes (`/api/order`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/order/create` | Auth | Place order with validated shipping details & stock check, auto-clearing cart |
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
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/quickcart
   JWT_SECRET=your_jwt_secret_key_here
   CLIENT_URL=http://localhost:5173
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
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
│   ├── controllers/          # Business logic controllers (auth, product, cart, wishlist, order, user)
│   ├── middlewares/          # Express middlewares (auth, multer)
│   ├── models/               # Mongoose Database Schemas (User, Product, Cart, Wishlist, Order)
│   ├── routes/               # API route definitions
│   └── index.js              # Express app initialization & server entry point
├── .env
├── package.json
└── README.md
```
