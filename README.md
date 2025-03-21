# Banking Web App

**NOTE:** *This web app has been developed with the help of ChatGPT and DeepThink R1. I am a learner and have learned a lot from this project!*

**DISCLAIMER:** *This is just a game for kids who want to play a banking game. It does not involve real-life transactions or financial fraud.*

## 🚀 Features

- User registration & authentication
- Admin dashboard for managing accounts
- Deposit, withdrawal, and balance check
- Secure MongoDB database integration
- User profile with document uploads

---

## 🛠 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/nitingaming-india/bank.git
cd bank
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory and add your MongoDB URI:

```env
MONGODB_URI=your_mongodb_connection_string
```

### 4️⃣ Create Uploads Directory

Ensure there is an `uploads` folder in the root directory to store user documents:

```bash
mkdir uploads
```

### 5️⃣ Run the Application

```bash
node app.js
```

Your app should now be live at: `http://localhost:3000`

### 6️⃣ Set Up Admin Account

To create an admin account, run:

```bash
node ad.js
```

This will insert an admin user into the database. You can modify `ad.js` to set your own credentials:

```js
const createAdminUser = async () => {
  const adminUser = {
    username: 'your_admin_username',
    password: 'your_secure_password', // Will be hashed automatically
    role: 'admin',
  };
```

---

## 📸 Screenshots

### 🏠 Homepage



### 📋 Manage Account



### 🏦 Banking Transactions



### 🔒 Login Page



### 🛡 Admin Dashboard



### 📝 User Account Details


IMAGES

![image](https://github.com/user-attachments/assets/8affa43f-c5c7-4a50-9e93-e173fd6f4c90)
![image](https://github.com/user-attachments/assets/4fe1e5cc-c61d-4125-8474-c393c68833bc)
![image](https://github.com/user-attachments/assets/ead710bf-2271-4e33-8c93-a19f49c9b3e6)

![image](https://github.com/user-attachments/assets/538207f7-ce06-4f8a-b7d8-224f96aeaf0c)
![image](https://github.com/user-attachments/assets/58a618d3-f931-4374-969e-20990915426c)
![image](https://github.com/user-attachments/assets/2c8a08e4-6e62-4890-872f-9b756a54b7af)


---

## 💡 Future Improvements

- Add OTP-based authentication
- Implement transaction history logs
- UI improvements with modern design
- Mobile-responsive layout

---

## 🎯 Contributing

Feel free to fork this repo and submit pull requests with improvements! 😊

---

## 📜 License

This project is open-source under the MIT License.

---

### 👨‍💻 Developed by: **Nitin**



**I am giving my best to add more and More features to the app**








