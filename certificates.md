# SSL Certificate Generation & Installation Guide

This guide explains how to generate local SSL certificates for HTTPS development and import the Certificate Authority (CA) into your operating system trust store.

## Certificate Generation Commands

Run these commands in the root directory of your project using Node.js:

1. Generate a local Certificate Authority (CA):
   ```bash
   npx mkcert create-ca
   ```
   This creates two files in the root folder:
   - `ca.key`: The private key for your Certificate Authority.
   - `ca.crt`: The Certificate Authority certificate.

2. Generate an SSL certificate for `localhost`:
   ```bash
   npx mkcert create-cert localhost
   ```
   This creates two additional files in the root folder:
   - `cert.key`: The private key for localhost.
   - `cert.crt`: The SSL certificate signed by your local CA.

---

## Importing the Root CA Certificate

In order for your web browser and system to trust `https://localhost:3000` and `https://localhost:5173` without security warnings, you must import `ca.crt` into your operating system root trust store.

### Windows

#### Option 1: PowerShell (Recommended)

Open a PowerShell window in your project root directory and run:

```powershell
Import-Certificate -FilePath ".\ca.crt" -CertStoreLocation "Cert:\CurrentUser\Root"
```

#### Option 2: Windows Certificate Manager (GUI)

1. Double-click `ca.crt` in File Explorer.
2. Click **Install Certificate...**.
3. Select **Current User** and click **Next**.
4. Select **Place all certificates in the following store** and click **Browse...**.
5. Select **Trusted Root Certification Authorities** and click **OK**.
6. Click **Next** and then **Finish**.

---

### macOS

#### Option 1: Terminal (Recommended)

Open Terminal in your project root directory and run:

```bash
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ca.crt
```

#### Option 2: Keychain Access (GUI)

1. Double-click `ca.crt` to open Keychain Access.
2. Select **System** from the left sidebar keychains list.
3. Drag and drop `ca.crt` into Keychain Access.
4. Double-click the imported **mkcert** certificate.
5. Expand the **Trust** section.
6. Change **When using this certificate** to **Always Trust**.
7. Close the window and enter your administrator password to confirm.

---

### Linux

#### Debian / Ubuntu / Mint

1. Copy the CA certificate to the system trust directory:
   ```bash
   sudo cp ca.crt /usr/local/share/ca-certificates/ca.crt
   ```
2. Update the system CA trust store:
   ```bash
   sudo update-ca-certificates
   ```

#### Fedora / RHEL / CentOS

1. Copy the CA certificate to the PKI trust anchors directory:
   ```bash
   sudo cp ca.crt /etc/pki/ca-trust/source/anchors/
   ```
2. Update the CA trust store:
   ```bash
   sudo update-ca-trust
   ```

#### Chrome / Firefox Browser Trust Store (NSS Database)

If Chrome or Firefox on Linux still display certificate warnings, install `libnss3-tools` and import the certificate into the browser NSS database:

```bash
sudo apt install libnss3-tools
certutil -d sql:$HOME/.pki/nssdb -A -t "TCu,," -n "Local Root CA" -i ca.crt
```
