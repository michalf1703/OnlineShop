# E-Commerce Store Management System

## Description
This repository contains the backend application for an E-Commerce store management system. The system consists of two applications: the backend providing APIs and data storage functionalities, and the frontend, a client application capable of consuming these APIs. Unauthenticated and regular users can browse products and add them to their cart. Regular users can also place orders. Administrators have the ability to modify products but cannot add them to the cart. Additionally, administrators can manage placed orders by marking them as accepted, completed, or cancelled.

#### Technologies Used:

**Backend:**
- User authentication via username/password (using Passport.js), followed by issuance of JWT for subsequent requests
- NestJS
- TypeORM
- SQLite
- Implementation of RBAC (Role Based Access Control) with Nest guards
- Endpoint exploration available through SwaggerUI

**Frontend:**
- Angular
- Bootstrap 5
- ng-bootstrap
  
  #### Features:

1. **Data Management:**
   - Storage of product and order data in the SQLite database.
   - Entities in the system include Product, Category, Order, and Order Status.

2. **API Operations:**
   - Product:
     - Retrieve all products or a single product by ID.
     - Add a new product.
     - Update product details.
   - Category:
     - Retrieve all categories.
   - Order:
     - Retrieve all orders or orders for a specific user.
     - Add a new order.
     - Update order status.
     - Retrieve orders by status.
   - Order Status:
     - Retrieve all order statuses.

3. **API Structure:**
   - Detailed API endpoints structured according to REST principles.
   - Example: 
     - `GET app_url/products` - Retrieve all products.
     - `GET app_url/products/id` - Retrieve product by ID.
     - `POST app_url/products` - Add a new product.
     - `PUT app_url/products/id` - Update product by ID.

4. **Error Handling:**
   - Proper error handling implemented using HTTP status codes.
   - Validation of data input to prevent erroneous entries.


## Main panel
![main_panel](https://github.com/michalf1703/OnlineShop/assets/126731293/377ae192-6225-4535-a998-c3eb6a842180)

## Cart
![cart](https://github.com/michalf1703/OnlineShop/assets/126731293/6bb28add-bec6-40b6-bf48-2db3919746af)

## Order
![order](https://github.com/michalf1703/OnlineShop/assets/126731293/9f22d06c-4257-40ce-a092-79206efc6940)

## Main panel - admin
![admin_panel](https://github.com/michalf1703/OnlineShop/assets/126731293/e93ce0b9-2689-4a49-9ea3-b3c5a138b40f)

## Edit product - admin
![admin_edit](https://github.com/michalf1703/OnlineShop/assets/126731293/372b38d1-cba9-434c-b5f1-70288b257d1f)

## Order - admin
![admin_order](https://github.com/michalf1703/OnlineShop/assets/126731293/438e23a4-fcd4-4fa3-95e6-157240c9d503)

## Register & Login panel 
![login_panel](https://github.com/michalf1703/OnlineShop/assets/126731293/218aceb1-66af-417f-81db-621bc965f0bc)
![register_panel](https://github.com/michalf1703/OnlineShop/assets/126731293/74c51f2d-1854-4349-b9ce-5f231dc297ca)

