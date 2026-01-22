# Entrance Gateway - Complete User-Side API Documentation

## Overview
This document provides comprehensive API documentation for all user-facing endpoints in the Entrance Gateway application. These are the APIs accessible to regular users (students/visitors).

**Base URL:** `/api/v1`

**Authentication:** Most endpoints require Bearer token authentication unless specified as Public.

---

## Table of Contents

1. [Authentication APIs](#1-authentication-apis)
2. [User Profile APIs](#2-user-profile-apis)
3. [Password Management APIs](#3-password-management-apis)
4. [Course APIs](#4-course-apis)
5. [College APIs](#5-college-apis)
6. [Syllabus APIs](#6-syllabus-apis)
7. [Notes APIs](#7-notes-apis)
8. [Blog APIs](#8-blog-apis)
9. [Notice APIs](#9-notice-apis)
10. [Question Set APIs](#10-question-set-apis)
11. [Quiz Attempt APIs](#11-quiz-attempt-apis)
12. [Old Question Collection APIs](#12-old-question-collection-apis)
13. [Training APIs](#13-training-apis)
14. [Training Enrollment APIs](#14-training-enrollment-apis)
15. [Payment APIs](#15-payment-apis)
16. [Contact Us APIs](#16-contact-us-apis)
17. [Category APIs](#17-category-apis)
18. [Enums Reference](#18-enums-reference)

---

## Standard Response Format

All API responses follow this structure:

```json
{
  "message": "string",
  "data": object | null
}
```

### Paginated Response Format

```json
{
  "message": "string",
  "data": {
    "content": [],
    "totalElements": 100,
    "totalPages": 10,
    "size": 10,
    "number": 0,
    "first": true,
    "last": false
  }
}
```

---

## 1. Authentication APIs

### 1.1 User Registration

**POST** `/api/v1/auth/user/register`

**Access:** Public

Registers a new user account. An OTP will be sent to the provided email for verification.

#### Request Body

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| fullname | string | Yes | Cannot be blank |
| email | string | Yes | Valid email format |
| contact | string | Yes | Nepal mobile: `^(\+977\|977)?(97\|98\|96)[0-9]{8}$` |
| address | string | Yes | Cannot be blank |
| dob | string | Yes | Format: `YYYY-MM-DD` |
| interested | string | No | - |
| latestQualification | string | No | - |
| password | string | Yes | Minimum 8 characters |

#### Request Example

```json
{
  "fullname": "Ram Sharma",
  "email": "ram.sharma@example.com",
  "contact": "9812345678",
  "address": "Kathmandu, Nepal",
  "dob": "2000-05-15",
  "interested": "Medical",
  "latestQualification": "+2 Science",
  "password": "SecurePass123"
}
```

#### Response (201 Created)

```json
{
  "message": "Success and OTP sent",
  "data": null
}
```

---

### 1.2 Verify OTP

**POST** `/api/v1/auth/user/verify-otp`

**Access:** Public

#### Request Body

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| email | string | Yes | Valid email format |
| otp | string | Yes | Exactly 6 characters |

#### Request Example

```json
{
  "email": "ram.sharma@example.com",
  "otp": "123456"
}
```

#### Response (200 OK)

```json
{
  "message": "OTP verified successfully",
  "data": {
    "userId": 1,
    "fullname": "Ram Sharma",
    "email": "ram.sharma@example.com",
    "contact": "9812345678",
    "address": "Kathmandu, Nepal",
    "dob": "2000-05-15",
    "interested": "Medical",
    "latestQualification": "+2 Science",
    "isVerified": true,
    "role": "USER"
  }
}
```

---

### 1.3 Login

**POST** `/api/v1/auth/login`

**Access:** Public

#### Request Body

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| email | string | Yes | Valid email format |
| password | string | Yes | Cannot be blank |

#### Request Example

```json
{
  "email": "ram.sharma@example.com",
  "password": "SecurePass123"
}
```

#### Response (200 OK)

```json
{
  "message": "Login Successful as USER",
  "data": {
    "userId": 1,
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
    "tokenType": "Bearer",
    "expiresIn": 900
  }
}
```

---

### 1.4 Refresh Token

**POST** `/api/v1/auth/refresh-token`

**Access:** Public

#### Request Body

| Field | Type | Required |
|-------|------|----------|
| refreshToken | string | Yes |

#### Response (200 OK)

```json
{
  "message": "Token refreshed successfully",
  "data": {
    "userId": 1,
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
    "tokenType": "Bearer",
    "expiresIn": 900
  }
}
```

---

### 1.5 Revoke Token

**POST** `/api/v1/auth/revoke-token`

**Access:** Authenticated

#### Request Body

```json
{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### Response (200 OK)

```json
{
  "message": "Refresh token revoked successfully",
  "data": null
}
```

---

### 1.6 Logout

**POST** `/api/v1/auth/logout`

**Access:** Authenticated

#### Request Body (Optional)

```json
{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### Response (200 OK)

```json
{
  "message": "Logout successful",
  "data": null
}
```

---

## 2. User Profile APIs

### 2.1 Get Current User Details

**GET** `/api/v1/user/me`

**Access:** Authenticated

#### Headers

| Header | Value |
|--------|-------|
| Authorization | Bearer {accessToken} |

#### Response (200 OK)

```json
{
  "message": "User details fetched successfully",
  "data": {
    "userId": 1,
    "fullname": "Ram Sharma",
    "email": "ram.sharma@example.com",
    "contact": "9812345678",
    "address": "Kathmandu, Nepal",
    "dob": "2000-05-15",
    "interested": "Medical",
    "latestQualification": "+2 Science",
    "isVerified": true,
    "role": "USER"
  }
}
```

---

### 2.2 Update User Profile

**PUT** `/api/v1/user/{id}/update-profile`

**Access:** Authenticated

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | Long | User ID |

#### Request Body

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| fullname | string | Yes | Cannot be blank |
| email | string | Yes | Valid email format |
| contact | string | Yes | Nepal mobile pattern |
| address | string | Yes | Cannot be blank |
| dob | string | Yes | Format: `YYYY-MM-DD` |
| interested | string | No | - |
| latestQualification | string | No | - |

#### Response (200 OK)

```json
{
  "message": "Profile updated successfully",
  "data": {
    "userId": 1,
    "fullname": "Ram Sharma Updated",
    "email": "ram.sharma@example.com",
    "contact": "9812345678",
    "address": "Lalitpur, Nepal",
    "dob": "2000-05-15",
    "interested": "Engineering",
    "latestQualification": "Bachelor's in Science",
    "isVerified": true,
    "role": "USER"
  }
}
```

---

## 3. Password Management APIs

### 3.1 Change Password

**POST** `/api/v1/user/change-password`

**Access:** Authenticated

#### Request Body

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| currentPassword | string | Yes | Cannot be blank |
| newPassword | string | Yes | Minimum 8 characters |
| confirmPassword | string | Yes | Cannot be blank |

#### Response (200 OK)

```json
{
  "message": "Password changed successfully",
  "data": null
}
```

---

### 3.2 Forgot Password

**POST** `/api/v1/user/forgot-password`

**Access:** Public

#### Request Body

| Field | Type | Required |
|-------|------|----------|
| email | string | Yes |

#### Response (200 OK)

```json
{
  "message": "Password reset OTP sent to your email",
  "data": null
}
```

---

### 3.3 Reset Password

**POST** `/api/v1/user/reset-password`

**Access:** Public

#### Request Body

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| email | string | Yes | Valid email format |
| otp | string | Yes | Cannot be blank |
| newPassword | string | Yes | Minimum 8 characters |
| confirmNewPassword | string | Yes | Cannot be blank |

#### Response (200 OK)

```json
{
  "message": "Password reset successfully",
  "data": null
}
```

---

## 4. Course APIs

### 4.1 Get All Courses

**GET** `/api/v1/courses`

**Access:** Public

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | int | 0 | Page number |
| size | int | 10 | Page size |
| sortBy | string | courseName | Sort field |
| sortDir | string | asc | Sort direction (asc/desc) |

#### Response (200 OK)

```json
{
  "message": "List of courses",
  "data": {
    "content": [
      {
        "courseId": 1,
        "courseName": "MBBS",
        "description": "Bachelor of Medicine and Bachelor of Surgery",
        "courseLevel": "BACHELOR",
        "courseType": "ANNUAL",
        "affiliation": "TRIBHUVAN_UNIVERSITY",
        "criteria": "10+2 Science with Biology",
        "collegeResponses": []
      }
    ],
    "totalElements": 50,
    "totalPages": 5,
    "size": 10,
    "number": 0
  }
}
```

---

### 4.2 Get Course By ID

**GET** `/api/v1/courses/{id}`

**Access:** Public

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | Long | Course ID |

#### Response (200 OK)

```json
{
  "message": "Course details",
  "data": {
    "courseId": 1,
    "courseName": "MBBS",
    "description": "Bachelor of Medicine and Bachelor of Surgery",
    "courseLevel": "BACHELOR",
    "courseType": "ANNUAL",
    "affiliation": "TRIBHUVAN_UNIVERSITY",
    "criteria": "10+2 Science with Biology",
    "collegeResponses": [
      {
        "collegeId": 1,
        "collegeName": "IOM Maharajgunj"
      }
    ]
  }
}
```

---

### 4.3 Get Courses By Affiliation

**GET** `/api/v1/courses/by-affiliation`

**Access:** Public

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| affiliation | Affiliation | Yes | See Enums Reference |
| page | int | No | Default: 0 |
| size | int | No | Default: 10 |

#### Response (200 OK)

```json
{
  "message": "affiliated with TRIBHUVAN_UNIVERSITY",
  "data": {
    "content": [...],
    "totalElements": 20
  }
}
```

---

### 4.4 Get Colleges By Course

**GET** `/api/v1/courses/colleges/by-courses`

**Access:** Public

#### Query Parameters

| Parameter | Type | Required |
|-----------|------|----------|
| courseId | Long | Yes |
| page | int | No |
| size | int | No |
| sortBy | string | No |
| sortDir | string | No |

#### Response (200 OK)

```json
{
  "message": "College for: 1",
  "data": [...]
}
```

---

### 4.5 Get Full Syllabus By Course

**GET** `/api/v1/courses/full-syllabus/{courseId}`

**Access:** Public

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| courseId | Long | Course ID |

#### Response (200 OK)

```json
{
  "message": "Full syllabus for course: 1",
  "data": [...]
}
```

---

## 5. College APIs

### 5.1 Get All Colleges

**GET** `/api/v1/colleges`

**Access:** Public

#### Query Parameters

| Parameter | Type | Default |
|-----------|------|---------|
| page | int | 0 |
| size | int | 10 |
| sortBy | string | collegeName |
| sortDir | string | asc |

#### Response (200 OK)

```json
{
  "message": "List of colleges",
  "data": {
    "content": [
      {
        "collegeId": 1,
        "collegeName": "IOM Maharajgunj",
        "location": "Kathmandu",
        "affiliation": "TRIBHUVAN_UNIVERSITY",
        "website": "https://iom.edu.np",
        "contact": "01-4412404",
        "email": "info@iom.edu.np",
        "description": "Institute of Medicine...",
        "establishedYear": "1972",
        "collegeType": "GOVERNMENT",
        "priority": "HIGH",
        "logoName": "iom_logo.png",
        "latitude": 27.7372,
        "longitude": 85.3240,
        "collegePictureName": ["img1.jpg", "img2.jpg"],
        "courses": []
      }
    ],
    "totalElements": 100
  }
}
```

---

### 5.2 Get College By ID

**GET** `/api/v1/colleges/{id}`

**Access:** Public

#### Response (200 OK)

```json
{
  "message": "College details for id: 1",
  "data": {
    "collegeId": 1,
    "collegeName": "IOM Maharajgunj",
    ...
  }
}
```

---

### 5.3 Search Colleges

**GET** `/api/v1/colleges/search`

**Access:** Public

#### Query Parameters

| Parameter | Type | Required |
|-----------|------|----------|
| name | string | Yes |
| page | int | No |
| size | int | No |
| sortBy | string | No |
| sortDir | string | No |

#### Response (200 OK)

```json
{
  "message": "Search results IOM",
  "data": {
    "content": [...],
    "totalElements": 5
  }
}
```

---

### 5.4 Get Colleges By Course

**GET** `/api/v1/colleges/by-course/{courseId}`

**Access:** Public

#### Response (200 OK)

```json
{
  "message": "Colleges offering course: 1",
  "data": [...]
}
```

---

### 5.5 Get College Logo

**GET** `/api/v1/colleges/{id}/logo`

**Access:** Public

#### Response
Returns the logo file as binary data.

---

### 5.6 Get College Image

**GET** `/api/v1/colleges/{collegeId}/images/{imageName}`

**Access:** Public

#### Response
Returns the image file as binary data.

---

## 6. Syllabus APIs

### 6.1 Get All Syllabus

**GET** `/api/v1/syllabus`

**Access:** Public

#### Query Parameters

| Parameter | Type | Default |
|-----------|------|---------|
| page | int | 0 |
| size | int | 10 |
| sortBy | string | syllabusTitle |
| sortDir | string | asc |

#### Response (200 OK)

```json
{
  "message": "List of syllabus",
  "data": {
    "content": [
      {
        "syllabusId": 1,
        "courseId": 1,
        "syllabusTitle": "Anatomy I",
        "syllabusFile": "anatomy_1.pdf",
        "courseCode": "ANAT101",
        "creditHours": 4.0,
        "lectureHours": 60,
        "practicalHours": 30,
        "courseName": "MBBS",
        "semester": 1,
        "year": 1,
        "subjectName": "Human Anatomy"
      }
    ],
    "totalElements": 200
  }
}
```

---

### 6.2 Get Syllabus By ID

**GET** `/api/v1/syllabus/{id}`

**Access:** Public

#### Response (200 OK)

```json
{
  "message": "Syllabus details f### 10.2 Get Question Set By ID

**GET** `/api/v1/question-sets/{id}`

**Access:** Public

#### Response (200 OK)

```json
{
  "message": "success",
  "data": {
    "questionSetId": 1,
    "setName": "MBBS Mock Test 1",
    ...
  }
}
```

---

### 10.3 Get Free Question Sets

**GET** `/api/v1/question-sets/free`

**Access:** Public

#### Query Parameters

| Parameter | Type | Default |
|-----------|------|---------|
| page | int | 0 |
| size | int | 10 |
| sortBy | string | categoryName |
| sortDir | string | asc |

#### Response (200 OK)

```json
{
  "message": "free sets",
  "data": {
    "content": [...],
    "totalElements": 10
  }
}
```

---

### 10.4 Get Question Sets By Course

**GET** `/api/v1/question-sets/course/{courseId}`

**Access:** Public

#### Query Parameters

| Parameter | Type | Default |
|-----------|------|---------|
| page | int | 0 |
| size | int | 10 |
| sortBy | string | setName |
| sortDir | string | asc |

#### Response (200 OK)

```json
{
  "message": "McqQuestion sets for course",
  "data": {...}
}
```

---

## 11. Quiz Attempt APIs

### 11.1 Attempt Question Set

**POST** `/api/v1/quiz-attempts`

**Access:** Authenticated

#### Request Body

```json
{
  "questionSetId": 1,
  "questionAnswers": [
    {
      "questionId": 1,
      "selectedOption": "A"
    },
    {
      "questionId": 2,
      "selectedOption": "B"
    }
  ]
}
```

#### Response (200 OK)

```json
{
  "message": "Quiz Attempt  Sucessfully",
  "data": {
    "totalQuestions": 100,
    "correctAnswers": 75,
    "percentage": 75.0
  }
}
```

---

### 11.2 Get Quiz Attempt By ID

**GET** `/api/v1/quiz-attempts/{id}`

**Access:** Authenticated

#### Response (200 OK)

```json
{
  "message": "success",
  "data": {
    "totalQuestions": 100,
    "correctAnswers": 75,
    "percentage": 75.0
  }
}
```

---

### 11.3 Get User's Quiz Attempts

**GET** `/api/v1/quiz-attempts/user`

**Access:** Authenticated

#### Response (200 OK)

```json
{
  "message": "success",
  "data": [...]
}
```

---

## 12. Old Question Collection APIs

### 12.1 Get Semesters By Course

**GET** `/api/v1/old-question-collections/course/{courseId}/semesters`

**Access:** Public

#### Response (200 OK)

```json
{
  "message": "Semesters for course: 1",
  "data": [1, 2, 3, 4, 5, 6, 7, 8]
}
```

---

### 12.2 Get Subjects By Semester

**GET** `/api/v1/old-question-collections/course/{courseId}/semester/{semester}/subjects`

**Access:** Public

#### Response (200 OK)

```json
{
  "message": "Subjects for course: 1 and semester: 1",
  "data": ["Anatomy", "Physiology", "Biochemistry"]
}
```

---

### 12.3 Get Old Questions By Syllabus

**GET** `/api/v1/old-question-collections/syllabus/{syllabusId}`

**Access:** Public

#### Response (200 OK)

```json
{
  "message": "Old questions for syllabus: 1",
  "data": [
    {
      "id": 1,
      "setName": "Anatomy Final 2079",
      "description": "Final examination paper",
      "year": 2079,
      "pdfFilePath": "anatomy_2079.pdf",
      "syllabusId": 1,
      "subject": "Anatomy",
      "courseName": "MBBS",
      "affiliation": "TRIBHUVAN_UNIVERSITY"
    }
  ]
}
```

---

### 12.4 Filter Old Questions

**GET** `/api/v1/old-question-collections/filter`

**Access:** Public

#### Query Parameters

| Parameter | Type | Required |
|-----------|------|----------|
| courseName | string | Yes |
| semester | int | No |
| year | int | No |
| affiliation | Affiliation | No |
| page | int | No |
| size | int | No |
| sortBy | string | No (default: year) |
| sortDir | string | No (default: desc) |

#### Response (200 OK)

```json
{
  "message": "Filtered old questions",
  "data": {...}
}
```

---

### 12.5 Search Old Questions

**GET** `/api/v1/old-question-collections/search`

**Access:** Public

#### Query Parameters

| Parameter | Type | Required |
|-----------|------|----------|
| courseName | string | No |
| syllabusName | string | No |
| year | Long | No |
| setName | string | No |
| semester | int | No |
| affiliation | Affiliation | No |
| page | int | No |
| size | int | No |
| sortBy | string | No |
| sortDir | string | No |

#### Response (200 OK)

```json
{
  "message": "Search results for old questions",
  "data": {...}
}
```

---

### 12.6 Download Old Question File

**GET** `/api/v1/old-question-collections/{id}/file`

**Access:** Public

#### Response
Returns the PDF file as binary data.

---

## 13. Training APIs

### 13.1 Get All Trainings

**GET** `/api/v1/trainings`

**Access:** Public

#### Query Parameters

| Parameter | Type | Default |
|-----------|------|---------|
| page | int | 0 |
| size | int | 10 |
| sortBy | string | trainingStatus |
| sortDir | string | asc |

#### Response (200 OK)

```json
{
  "message": "List of trainings",
  "data": {
    "content": [
      {
        "trainingId": 1,
        "trainingName": "MBBS Entrance Crash Course",
        "description": "Intensive preparation course...",
        "syllabusDescription": "Complete syllabus coverage...",
        "startDate": "2024-02-01",
        "endDate": "2024-03-01",
        "trainingType": "HYBRID",
        "trainingStatus": "REGISTRATION_OPEN",
        "trainingHours": 100,
        "location": "Kathmandu",
        "maxParticipants": 50,
        "currentParticipants": 30,
        "trainingCategory": "Medical",
        "price": 15000.00,
        "certificateProvided": true,
        "materialsLink": "https://materials.link",
        "remarks": "Limited seats available"
      }
    ],
    "totalElements": 15
  }
}
```

---

### 13.2 Get Training By ID

**GET** `/api/v1/trainings/{id}`

**Access:** Public

#### Response (200 OK)

```json
{
  "message": "Training details for id: 1",
  "data": {
    "trainingId": 1,
    "trainingName": "MBBS Entrance Crash Course",
    ...
  }
}
```

---

## 14. Training Enrollment APIs

### 14.1 Enroll In Training

**POST** `/api/v1/training-enrollments/{trainingId}/enroll`

**Access:** Authenticated

#### Headers

| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer {accessToken} | Yes |
| Idempotency-Key | UUID | Yes |

#### Response (201 Created)

```json
{
  "message": "Successfully enrolled in training program",
  "data": {
    "enrollmentId": 1,
    "userId": 1,
    "userName": "Ram Sharma",
    "trainingId": 1,
    "trainingName": "MBBS Entrance Crash Course",
    "status": "PENDING",
    "enrollmentDate": "2024-01-15T10:30:00",
    "completionDate": null,
    "paidAmount": 15000.00,
    "paymentReference": "PAY123456",
    "paymentMethod": "ESEWA",
    "progressPercentage": 0,
    "remarks": null,
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
}
```

---

### 14.2 Get Enrollment By ID

**GET** `/api/v1/training-enrollments/{id}`

**Access:** Authenticated

#### Response (200 OK)

```json
{
  "message": "Training enrollment details",
  "data": {
    "enrollmentId": 1,
    ...
  }
}
```

---

### 14.3 Get My Enrollments

**GET** `/api/v1/training-enrollments/my-enrollments`

**Access:** Authenticated

#### Response (200 OK)

```json
{
  "message": "Your training enrollments",
  "data": [
    {
      "enrollmentId": 1,
      "userId": 1,
      "userName": "Ram Sharma",
      "trainingId": 1,
      "trainingName": "MBBS Entrance Crash Course",
      "status": "ACTIVE",
      ...
    }
  ]
}
```

---

### 14.4 Cancel Enrollment

**DELETE** `/api/v1/training-enrollments/{id}`

**Access:** Authenticated

#### Response (200 OK)

```json
{
  "message": "Training enrollment cancelled successfully",
  "data": {
    "enrollmentId": 1,
    "status": "CANCELLED",
    ...
  }
}
```

---

## 15. Payment APIs

### 15.1 Initiate Payment

**POST** `/api/v1/payments/initiate`

**Access:** Authenticated

#### Request Body

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| amount | BigDecimal | Yes | Must be > 0 |
| moduleId | string | No | ID of item being purchased |
| moduleType | string | No | Type of item (course/training) |

#### Request Example

```json
{
  "amount": 15000.00,
  "moduleId": "1",
  "moduleType": "TRAINING"
}
```

#### Response (200 OK)

```json
{
  "message": "Payment initiated successfully",
  "data": {
    "amount": "15000.00",
    "taxAmount": "0",
    "totalAmount": "15000.00",
    "transactionUuid": "uuid-123-456",
    "productCode": "EPAYTEST",
    "productServiceCharge": "0",
    "productDeliveryCharge": "0",
    "successUrl": "https://api.entrancegateway.com/api/v1/payments/esewa/success",
    "failureUrl": "https://api.entrancegateway.com/api/v1/payments/esewa/failure",
    "signedFieldNames": "total_amount,transaction_uuid,product_code",
    "signature": "base64signature==",
    "esewaUrl": "https://rc-epay.esewa.com.np/api/epay/main/v2/form"
  }
}
```

---

### 15.2 eSewa Success Callback

**GET** `/api/v1/payments/esewa/success`

**Access:** Public (eSewa callback)

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| data | string | Base64 encoded response from eSewa |

#### Response
Redirects to: `https://entrancegateway.com/dashboard?payment=success`

---

### 15.3 eSewa Failure Callback

**GET** `/api/v1/payments/esewa/failure`

**Access:** Public (eSewa callback)

#### Response
Redirects to: `https://entrancegateway.com/dashboard?payment=failed`

---

## 16. Contact Us APIs

### 16.1 Submit Contact Message

**POST** `/api/v1/contact-us`

**Access:** Public

#### Request Body

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | string | Yes | Cannot be blank |
| email | string | Yes | Valid email format |
| message | string | Yes | Max 5000 characters |
| phone | string | No | - |
| subject | QuerySubject | Yes | See Enums Reference |

#### Request Example

```json
{
  "name": "Ram Sharma",
  "email": "ram@example.com",
  "message": "I have a question about the MBBS entrance preparation course.",
  "phone": "9812345678",
  "subject": "COURSE_INFORMATION"
}
```

#### Response (200 OK)

```json
{
  "message": "Message submitted successfully",
  "data": {
    "id": 1,
    "name": "Ram Sharma",
    "email": "ram@example.com",
    "message": "I have a question about the MBBS entrance preparation course.",
    "phone": "9812345678",
    "subject": "COURSE_INFORMATION"
  }
}
```

---

## 17. Category APIs

### 17.1 Get All Categories

**GET** `/api/v1/categories`

**Access:** Public

#### Query Parameters

| Parameter | Type | Default |
|-----------|------|---------|
| page | int | 0 |
| size | int | 10 |
| sortBy | string | categoryName |
| sortDir | string | asc |

#### Response (200 OK)

```json
{
  "message": "Categories fetched successfully",
  "data": {
    "content": [
      {
        "categoryId": 1,
        "categoryName": "Medical",
        "remarks": "Medical entrance related"
      }
    ],
    "totalElements": 10
  }
}
```

---

### 17.2 Get Category By ID

**GET** `/api/v1/categories/{id}`

**Access:** Public

#### Response (200 OK)

```json
{
  "message": "Category fetched successfully",
  "data": {
    "categoryId": 1,
    "categoryName": "Medical",
    "remarks": "Medical entrance related"
  }
}
```

---

## 18. Enums Reference

### Affiliation

```
NEB
TRIBHUVAN_UNIVERSITY
POKHARA_UNIVERSITY
KATHMANDU_UNIVERSITY
PURWANCHAL_UNIVERSITY
MID_WESTERN_UNIVERSITY
FAR_WESTERN_UNIVERSITY
LUMBINI_UNIVERSITY
CAMPUS_AFFILIATED_TO_FOREIGN_UNIVERSITY
```

### CourseLevel

```
PLUS_TWO
BACHELOR
MASTER
PHD
DIPLOMA
M_PHIL
```

### CourseType

```
SEMESTER
ANNUAL
```

### CollegeType

```
PRIVATE
COMMUNITY
GOVERNMENT
```

### TrainingType

```
REMOTE
ON_SITE
HYBRID
```

### TrainingStatus

```
UPCOMING
FLASH_SALE
ONGOING
COMPLETED
CANCELLED
POSTPONED
COMING_SOON
REGISTRATION_OPEN
REGISTRATION_CLOSED
SOLD_OUT
```

### EnrollmentStatus

```
PENDING          - Enrollment initiated, payment pending
ACTIVE           - Payment confirmed, enrolled
COMPLETED        - Training completed
CANCELLED        - Student cancelled
PAYMENT_FAILED   - Payment verification failed
EXPIRED          - Enrollment expired due to inactivity
SUSPENDED        - Admin suspended enrollment
```

### QuerySubject (Contact Us)

```
GENERAL_INQUIRY
TECHNICAL_SUPPORT
BILLING_ISSUES
FEEDBACK_SUGGESTIONS
COURSE_INFORMATION
COLLABORATION_OPPORTUNITIES
OTHER
```

---

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Authentication required or failed |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server error |

---

## Token Configuration

| Token Type | Expiration |
|------------|------------|
| Access Token | 15 minutes (900,000 ms) |
| Refresh Token | 7 days (604,800,000 ms) |

---

## Nepal Contact Number Validation

Nepal mobile numbers must follow this pattern:
- Optional country code: `+977` or `977`
- Operator prefix: `97`, `98`, or `96`
- Followed by 8 digits

**Valid Examples:**
- `9812345678`
- `9712345678`
- `9612345678`
- `+9779812345678`
- `9779812345678`