# 🚀 DevOps Pipeline - Backend

Spring Boot REST API với CRUD operations cho **Product** management.

## 📋 Yêu cầu hệ thống

- **Java 17** trở lên
- **Maven** (đã tích hợp sẵn Maven Wrapper, không cần cài riêng)

## ▶️ Chạy dự án

```bash
# Di chuyển vào thư mục backend
cd backend

# Chạy ứng dụng
./mvnw spring-boot:run
```

> Trên Windows, sử dụng `mvnw.cmd spring-boot:run`

Server sẽ khởi chạy tại: **http://localhost:7070**

## 🗄️ Database

Dự án sử dụng **H2 In-Memory Database** — không cần cài đặt hay cấu hình database bên ngoài.

| Thông tin  | Giá trị                          |
| ---------- | -------------------------------- |
| H2 Console | http://localhost:7070/h2-console |
| JDBC URL   | `jdbc:h2:mem:devops_db`          |
| Username   | `sa`                             |
| Password   | _(để trống)_                     |

## 🔗 API Endpoints

Base URL: `http://localhost:7070/api/products`

| Method   | Endpoint                     | Mô tả               |
| -------- | ---------------------------- | ------------------- |
| `GET`    | `/api/products`              | Lấy tất cả products |
| `GET`    | `/api/products/{id}`         | Lấy product theo ID |
| `GET`    | `/api/products/search?name=` | Tìm kiếm theo tên   |
| `POST`   | `/api/products`              | Tạo product mới     |
| `PUT`    | `/api/products/{id}`         | Cập nhật product    |
| `DELETE` | `/api/products/{id}`         | Xóa product         |

## 📝 Ví dụ sử dụng (cURL)

### Tạo product mới

```bash
curl -X POST http://localhost:7070/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "Gaming laptop 16GB RAM",
    "price": 1500.00,
    "quantity": 10
  }'
```

### Lấy tất cả products

```bash
curl http://localhost:7070/api/products
```

### Lấy product theo ID

```bash
curl http://localhost:7070/api/products/1
```

### Tìm kiếm product theo tên

```bash
curl "http://localhost:7070/api/products/search?name=laptop"
```

### Cập nhật product

```bash
curl -X PUT http://localhost:7070/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Pro",
    "description": "Gaming laptop 32GB RAM",
    "price": 2500.00,
    "quantity": 5
  }'
```

### Xóa product

```bash
curl -X DELETE http://localhost:7070/api/products/1
```

## 📦 Response Format

Tất cả API đều trả về response theo format chuẩn:

```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [ ... ]
}
```

Khi có lỗi validation:

```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "name": "Product name is required",
    "price": "Price must be >= 0"
  }
}
```

## 📁 Cấu trúc project

```
src/main/java/com/example/devops_pipeline/
├── DevopsPipelineApplication.java        # Main application
├── config/
│   └── SecurityConfig.java               # Security configuration
├── controller/
│   └── ProductController.java            # REST API endpoints
├── dto/
│   ├── ApiResponse.java                  # Response wrapper
│   └── ProductRequest.java               # Request DTO
├── entity/
│   └── Product.java                      # JPA Entity
├── exception/
│   ├── GlobalExceptionHandler.java       # Global error handling
│   └── ResourceNotFoundException.java    # Custom 404 exception
├── repository/
│   └── ProductRepository.java            # Data access layer
└── service/
    └── ProductService.java               # Business logic layer
```

## 🛠️ Build & Package

```bash
# Build project
./mvnw clean package

# Chạy file JAR
java -jar target/devops-pipeline-0.0.1-SNAPSHOT.jar
```

## 🧪 Chạy tests

```bash
./mvnw test
```
