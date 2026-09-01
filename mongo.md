# MongoDB Setup Guide

This guide covers how to set up MongoDB for local development across Windows, macOS, and Linux, as well as how to configure a free cloud database cluster using MongoDB Atlas with team IP whitelisting.

---

## Part 1: Local MongoDB Installation

### Windows

1. Download the MongoDB Community Server installer (.msi) from the official MongoDB website:
   `https://www.mongodb.com/try/download/community`
2. Run the downloaded `.msi` setup wizard.
3. Choose **Complete** setup when prompted.
4. Keep **Install MongoDB as a Service** checked so MongoDB starts automatically in the background.
5. (Optional) Check the box to install **MongoDB Compass** if you would like a graphical database interface.
6. Complete the installation.
7. Verify that the MongoDB service is running in PowerShell or Command Prompt:
   ```powershell
   mongod --version
   ```
8. Local Connection String for `.env`:
   ```env
   CONN_STRING=mongodb://localhost:27017/library
   ```

---

### macOS

The easiest way to install and manage MongoDB on macOS is via Homebrew:

1. Open Terminal and add the official MongoDB Homebrew tap:
   ```bash
   brew tap mongodb/brew
   ```
2. Install MongoDB Community Server:
   ```bash
   brew install mongodb-community
   ```
3. Start the MongoDB background service:
   ```bash
   brew services start mongodb-community
   ```
4. Verify the database is running:
   ```bash
   brew services list
   ```
5. Local Connection String for `.env`:
   ```env
   CONN_STRING=mongodb://localhost:27017/library
   ```

To stop the service when finished:
```bash
brew services stop mongodb-community
```

---

### Linux

#### Ubuntu / Debian

1. Import the official MongoDB public GPG key:
   ```bash
   sudo apt install gnupg curl
   curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
   ```
2. Create the list file for MongoDB:
   ```bash
   echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   ```
3. Update package index and install MongoDB:
   ```bash
   sudo apt update
   sudo apt install -y mongodb-org
   ```
4. Start and enable the MongoDB service:
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```
5. Verify service status:
   ```bash
   sudo systemctl status mongod
   ```

#### Fedora / RHEL / CentOS

1. Create a repository configuration file at `/etc/yum.repos.d/mongodb-org-7.0.repo`:
   ```ini
   [mongodb-org-7.0]
   name=MongoDB Repository
   baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/7.0/x86_64/
   gpgcheck=1
   enabled=1
   gpgkey=https://www.mongodb.org/static/pgp/server-7.0.asc
   ```
2. Install MongoDB:
   ```bash
   sudo dnf install -y mongodb-org
   ```
3. Start and enable the service:
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

Local Connection String for `.env`:
```env
CONN_STRING=mongodb://localhost:27017/library
```

---

## Part 2: MongoDB Atlas (Cloud Setup)

MongoDB Atlas provides a hosted cloud database with a free tier cluster suitable for coursework and team projects.

### Step 1: Create an Atlas Account

1. Navigate to the MongoDB Cloud registration page:
   `https://www.mongodb.com/cloud/atlas/register`
2. Sign up with your email or your institutional account.
3. Accept the terms of service to create your organization and initial project.

---

### Step 2: Deploy a Free Shared Cluster

1. On the Atlas dashboard, click **Create** or **Build a Database**.
2. Under the deployment options, select the free tier: **M0 Free** (Shared).
3. Select your preferred Cloud Provider (AWS, Google Cloud, or Azure) and choose a Region close to your location (for example, `eu-west-1` or `af-south-1`).
4. Set your Cluster Name (or leave as default `Cluster0`).
5. Click **Create Deployment** (or **Create Cluster**).

---

### Step 3: Whitelist IP Addresses (Self & Teammates)

MongoDB Atlas blocks all incoming connections by default until IP addresses are explicitly whitelisted in Network Access.

1. In the left navigation menu under **Security**, click **Network Access**.
2. Click **Add IP Address**.
3. **Whitelist your own IP address**:
   - Click the button labeled **Add Current IP Address**.
   - Add a comment (for example: `My Home IP`).
   - Click **Confirm**.
4. **Whitelist your teammate's IP address**:
   - Click **Add IP Address** again.
   - Ask your teammate for their public IPv4 address (they can find this by visiting `https://whatismyipaddress.com` or running `curl ifconfig.me`).
   - Enter their IP in the **Access List Entry** field (for example: `192.168.1.10/32`).
   - Add a comment with their name (for example: `Teammate - Jordan`).
   - Click **Confirm**.
5. Repeat step 3 for each team member who needs to connect to the cloud database.
6. Wait for the status next to the entries to change from *Pending* to *Active*.

*Note on dynamic IPs*: If a team member has an internet connection where the IP changes frequently, they will need to update their entry in the Network Access list when their IP changes. For temporary testing environments where dynamic IPs cannot be predicted, you can choose **Allow Access from Anywhere** (`0.0.0.0/0`), though this should only be used during active development and paired with strong database passwords.

---

### Step 4: Obtain the Connection String

1. In the left navigation menu under **Deployment**, click **Database**.
2. Find your cluster and click the **Connect** button.
3. Under **Connect to your application**, select **Drivers**.
4. Set **Driver** to `Node.js` and select the latest version.
5. Copy the connection string provided. It will look like this:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/library?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with the database user credentials created in Step 3.
7. Open `backend/.env` and update `CONN_STRING`:
   ```env
   CONN_STRING=mongodb+srv://appUser:yourSecurePassword@cluster0.xxxxx.mongodb.net/library?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key
   ```
8. Save `.env` and restart your backend server using `npm run dev`.
