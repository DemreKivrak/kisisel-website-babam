# AWS Elastic Beanstalk Deployment Guide

## Prerequisites

1. AWS Account
2. AWS CLI installed
3. EB CLI installed: `pip install awsebcli`

## Backend Deployment

### 1. Configure Environment Variables in AWS Console

Go to Elastic Beanstalk → Your Environment → Configuration → Software:

```
PORT=8080
NODE_ENV=production
JWT_SECRET=your-production-jwt-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
DB_PATH=./database.sqlite
```

### 2. Initialize Elastic Beanstalk (Backend)

```bash
cd backend
eb init

# Select:
# - Region: eu-central-1 (or your preferred region)
# - Application name: tourism-backend
# - Platform: Node.js
# - Setup SSH: Yes (optional)
```

### 3. Create Environment

```bash
eb create tourism-backend-prod

# This will:
# - Create the environment
# - Deploy your application
# - Assign a URL like: tourism-backend-prod.eu-central-1.elasticbeanstalk.com
```

### 4. Deploy Updates

```bash
cd backend
eb deploy
```

### 5. Check Status

```bash
eb status
eb health
eb logs
```

## Frontend Deployment

### Option 1: AWS S3 + CloudFront (Recommended)

1. **Build frontend:**

```bash
cd frontend
npm run build
```

2. **Create S3 bucket:**

```bash
aws s3 mb s3://your-tourism-website
```

3. **Enable static website hosting:**

```bash
aws s3 website s3://your-tourism-website --index-document index.html --error-document index.html
```

4. **Update API URL in frontend/.env:**

```
VITE_API_URL=https://tourism-backend-prod.eu-central-1.elasticbeanstalk.com/api
```

5. **Rebuild and upload:**

```bash
npm run build
aws s3 sync dist/ s3://your-tourism-website --delete
```

6. **Make bucket public (bucket policy):**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-tourism-website/*"
    }
  ]
}
```

### Option 2: Deploy with Backend (Serve Static)

1. **Build frontend:**

```bash
cd frontend
npm run build
```

2. **Copy build to backend:**

```bash
cp -r dist ../backend/public
```

3. **Update backend/index.js** (add before app.listen):

```javascript
// Serve frontend static files
app.use(express.static("public"));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
```

4. **Deploy:**

```bash
cd backend
eb deploy
```

## Database Considerations

### Current: SQLite (Development)

- ✅ Easy setup
- ❌ Not suitable for production scaling
- ❌ Lost on environment recreation

### Production: AWS RDS (Recommended)

1. **Create RDS MySQL/PostgreSQL instance**
2. **Update backend to use RDS:**

Install mysql2 or pg:

```bash
npm install mysql2
```

Update connection in index.js:

```javascript
import mysql from "mysql2/promise";

const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
```

3. **Add to EB environment variables:**

```
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=your-password
DB_NAME=tourism_db
```

## CORS Configuration

Update backend CORS for production:

```javascript
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://your-domain.com", "https://www.your-domain.com"]
        : "http://localhost:5173",
    credentials: true,
  })
);
```

## Useful Commands

```bash
# View logs
eb logs

# SSH into instance
eb ssh

# Open in browser
eb open

# Terminate environment
eb terminate tourism-backend-prod

# List environments
eb list

# Check configuration
eb config
```

## Cost Optimization

- Use t2.micro/t3.micro for backend (Free tier eligible)
- Use S3 + CloudFront for frontend (cheaper than EC2)
- Enable Auto Scaling only if needed
- Use RDS t3.micro (Free tier: 750 hours/month)

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Change default admin password
- [ ] Enable HTTPS (use ACM certificate)
- [ ] Configure security groups properly
- [ ] Use IAM roles instead of access keys
- [ ] Enable CloudWatch logging
- [ ] Set up backup strategy for database

## Estimated Monthly Costs (US East)

- Elastic Beanstalk (t3.micro): ~$8-10
- RDS MySQL (t3.micro): ~$15-20
- S3 + CloudFront: ~$1-5
- **Total: ~$25-35/month**

## Alternative: Deploy Everything on Vercel/Netlify

Cheaper option for small projects:

- Frontend: Vercel/Netlify (Free tier)
- Backend: Vercel Serverless Functions or Railway ($5/month)
- Database: PlanetScale MySQL (Free tier) or Supabase PostgreSQL (Free tier)

---

**Next Steps:**

1. Set up AWS account
2. Install EB CLI
3. Follow backend deployment steps
4. Choose frontend deployment method
5. Configure production environment variables
