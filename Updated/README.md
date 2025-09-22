# 🚀 Portfolio Website - Production Ready

A modern, responsive portfolio website with contact form functionality, ready for Netlify deployment.

## ✨ Features

- 📱 **Responsive Design** - Works perfectly on all devices
- 🌙 **Dark/Light Theme** - Toggle between themes with smooth transitions
- 📧 **Contact Form** - Full validation with backend integration
- 🎨 **Smooth Animations** - Modern scroll-triggered animations
- 🔒 **Production Ready** - Enhanced security and error handling
- 📊 **Health Monitoring** - Built-in health checks and statistics

## 🛠️ Technologies Used

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL/Supabase
- **Deployment:** Netlify (Frontend) + Railway/Render (Backend)

## 🚀 Quick Deployment to Netlify

### Option 1: Frontend Only (Recommended)

1. **Deploy Frontend to Netlify:**
   ```bash
   # Push your code to GitHub first
   git add .
   git commit -m "Ready for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify:**
   - Go to [Netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Build settings: Leave default (static site)
   - Deploy!

3. **Deploy Backend:**
   - Use [Railway.app](https://railway.app) or [Render.com](https://render.com)
   - Connect your GitHub repo
   - Add environment variables
   - Deploy automatically

4. **Update API URL:**
   - In Netlify dashboard, go to Site Settings → Environment Variables
   - Add: `API_URL = https://your-backend-service.railway.app`

### Option 2: Full-Stack with Netlify Functions

Convert backend to serverless functions:

```javascript
// netlify/functions/contact.js
const { Pool } = require('pg');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { name, number, email, message } = JSON.parse(event.body);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const result = await pool.query(
      'INSERT INTO portfolio (name, number, email, message) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, number, email, message]
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Message sent successfully!' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send message' })
    };
  }
};
```

## 🔧 Environment Variables

### Backend Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
DB_USER=your_db_user
DB_HOST=your_db_host
DB_NAME=your_db_name
DB_PASS=your_db_password
DB_PORT=5432
DB_SSL=true

# Server Configuration
PORT=5000
NODE_ENV=production

# CORS Origins (add your Netlify URL)
ALLOWED_ORIGINS=https://your-netlify-site.netlify.app
```

### Netlify Environment Variables

In Netlify Dashboard → Site Settings → Environment Variables:

```env
API_URL=https://your-backend-service.railway.app
SUPABASE_URL=your_supabase_url (if using Supabase)
SUPABASE_ANON_KEY=your_supabase_key (if using Supabase)
```

## 📋 Deployment Checklist

### ✅ Pre-Deployment Checklist

- [ ] Update CORS origins in backend to include your Netlify URL
- [ ] Set environment variables in your deployment platform
- [ ] Test contact form locally
- [ ] Remove or secure test endpoints
- [ ] Enable SSL/HTTPS
- [ ] Set up custom domain (optional)

### ✅ Production Features Included

- [x] **Rate Limiting** - Prevents spam (10 requests per 15 minutes)
- [x] **Input Validation** - Client and server-side validation
- [x] **Error Handling** - Comprehensive error handling
- [x] **Request Logging** - All requests are logged
- [x] **Health Checks** - Monitor server health
- [x] **Graceful Shutdown** - Proper cleanup on shutdown
- [x] **CORS Configuration** - Secure cross-origin requests
- [x] **Database Connection Pooling** - Efficient database usage

## 🧪 Testing Your Deployment

1. **Test Contact Form:**
   - Submit a test message
   - Check if it appears in your database
   - Verify email notifications (if configured)

2. **Performance Testing:**
   - Use Lighthouse in Chrome DevTools
   - Test on different devices and networks
   - Check loading times

3. **Security Testing:**
   - Test with invalid data
   - Check rate limiting
   - Verify CORS restrictions

## 📊 Monitoring & Analytics

### Health Check Endpoints

- `GET /health` - Server health status
- `GET /test-db` - Database connection test
- `GET /api/stats` - Message statistics

### Recommended Monitoring Tools

- **UptimeRobot** - Monitor server uptime
- **Google Analytics** - Track website visitors
- **Sentry** - Error tracking and monitoring
- **LogRocket** - User session recordings

## 🔒 Security Features

- **Rate Limiting:** Prevents abuse and spam
- **Input Sanitization:** Cleans user input
- **CORS Protection:** Restricts cross-origin requests
- **Error Handling:** Doesn't expose sensitive information
- **Environment Variables:** Secure configuration management

## 🐛 Troubleshooting

### Common Issues

1. **Contact Form Not Working:**
   - Check if backend server is running
   - Verify database connection
   - Check browser console for errors
   - Ensure CORS is configured correctly

2. **Theme Not Switching:**
   - Clear localStorage
   - Check if JavaScript is enabled
   - Verify CSS custom properties

3. **Database Connection Issues:**
   - Check environment variables
   - Verify database credentials
   - Ensure database is accessible
   - Check SSL configuration

### Debug Mode

Set `NODE_ENV=development` in your environment variables to get detailed error messages.

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the browser console for errors
3. Check server logs for backend issues
4. Ensure all environment variables are set correctly

## 📄 License

This project is open source and available under the MIT License.

---

**Happy Deploying! 🎉**
