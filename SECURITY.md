# Security Policy

## 🛡️ Supported Versions

We actively support the following versions of Open Cleaner RN with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | ✅ Yes             |
| < 0.1   | ❌ No              |

## 🔒 Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### 📧 Contact Information

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, please report security issues privately by:

1. **Email**: Send details to `security@alexkads.dev` (if available)
2. **GitHub Security Advisory**: Use GitHub's private vulnerability reporting feature
3. **Direct Message**: Contact [@alexkads](https://github.com/alexkads) directly

### 📝 What to Include

When reporting a security vulnerability, please include:

- **Description**: A clear description of the vulnerability
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Impact**: What systems or data could be affected
- **Proof of Concept**: If possible, include a minimal proof of concept
- **Suggested Fix**: If you have ideas for how to fix the issue

### ⏱️ Response Timeline

- **Initial Response**: Within 48 hours
- **Status Updates**: Every 7 days until resolved
- **Resolution**: We aim to resolve critical issues within 30 days

### 🏆 Recognition

We appreciate security researchers who help make Open Cleaner RN safer. With your permission, we'll:

- Credit you in our security advisory
- Add you to our Hall of Fame (if you'd like)
- Consider a small token of appreciation for significant findings

## 🔐 Security Best Practices

### For Users

- Always download releases from official GitHub releases
- Verify checksums when available
- Keep the application updated to the latest version
- Report suspicious behavior immediately

### For Contributors

- Follow secure coding practices
- Use dependency scanning tools
- Never commit secrets or sensitive data
- Review security implications of changes

## 📋 Security Features

Open Cleaner RN includes several security features:

- **Safe File Operations**: Only removes cache and temporary files
- **User Confirmation**: Requires explicit user confirmation for destructive operations
- **Sandboxed Execution**: Runs with minimal system permissions
- **No Network Access**: Does not transmit data externally
- **Local Storage Only**: All data remains on your device

## 🚨 Known Security Considerations

- The application requires file system access to function
- Some antivirus software may flag the app (false positive)
- Administrative privileges may be required for system-level cache cleaning

---

**Note**: This security policy applies to the Open Cleaner RN application and its source code. For website or documentation security issues, please specify in your report.
