# Clean RN Dev Documentation

This directory contains the source files for the Clean RN Dev documentation website, automatically deployed to GitHub Pages.

## 🌐 Live Documentation

The documentation is available at: `https://YOUR-USERNAME.github.io/clean-rn-dev/`

## 📁 Structure

```
docs/
├── index.html              # Main landing page
├── getting-started.html    # Installation and setup guide
├── features.html          # Complete features overview
├── build-guide.html       # Build from source instructions
├── api.html               # API reference for developers
├── assets/
│   ├── style.css          # Main stylesheet
│   ├── docs.css           # Documentation-specific styles
│   ├── script.js          # Interactive functionality
│   └── favicon.svg        # Site icon
└── README.md              # This file
```

## 🔄 Automatic Updates

The documentation is automatically updated via GitHub Actions:

### Triggers
- **Push to main** - Updates documentation when docs/ files change
- **New releases** - Updates download links and stats automatically
- **Manual dispatch** - Can be triggered manually from Actions tab

### Features
- ✅ Real-time download statistics from GitHub API
- ✅ Automatic platform detection for download buttons
- ✅ Build status badges
- ✅ Repository-specific URLs and branding
- ✅ Mobile-responsive design
- ✅ SEO optimized with meta tags

## 🎨 Design System

### Colors
- **Primary Background**: `#0a0a0a`
- **Secondary Background**: `#1a1a1a`
- **Accent Cyan**: `#00d2ff`
- **Accent Magenta**: `#ff0080`
- **Text Primary**: `#ffffff`
- **Text Secondary**: `#a0a0a0`

### Typography
- **Font Family**: System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', etc.)
- **Headings**: Gradient text effects for emphasis
- **Code**: Monaco, Menlo, Ubuntu Mono monospace fonts

## 🛠️ Local Development

To test the documentation locally:

```bash
# Serve the docs directory
cd docs
python -m http.server 8000

# Or use any static file server
npx serve .
```

Navigate to `http://localhost:8000` to view the documentation.

## 📝 Content Updates

### Adding New Pages
1. Create HTML file in `docs/` directory
2. Follow the existing template structure
3. Include navigation and styling
4. Update navigation links in other pages

### Updating API Documentation
1. Edit `docs/api.html`
2. Add new commands or types
3. Include code examples and descriptions

### Modifying Styles
1. **Global styles**: Edit `docs/assets/style.css`
2. **Documentation styles**: Edit `docs/assets/docs.css`
3. **Interactive features**: Edit `docs/assets/script.js`

## 🔧 Configuration

### GitHub Pages Setup
1. Go to repository Settings > Pages
2. Select "Deploy from a branch"
3. Choose "gh-pages" branch (auto-created by workflow)
4. Save settings

### Custom Domain (Optional)
1. Add CNAME file to docs/ directory
2. Configure DNS settings
3. Enable HTTPS in repository settings

## 📊 Analytics Integration

The documentation supports analytics integration:

```javascript
// Add to docs/assets/script.js
if (typeof gtag !== 'undefined') {
    gtag('event', 'download', {
        event_category: 'Software',
        event_label: platform,
        value: filename
    });
}
```

## 🚀 Performance Features

- **Fast Loading**: Optimized CSS and minimal JavaScript
- **Responsive Design**: Mobile-first approach
- **Progressive Enhancement**: Works without JavaScript
- **SEO Optimized**: Proper meta tags and structure
- **Accessible**: ARIA labels and semantic HTML

## 🔒 Security

- **CSP Headers**: Content Security Policy configured
- **HTTPS Only**: All external resources use HTTPS
- **Safe Links**: External links open in new tabs
- **Input Validation**: All user interactions are validated

## 📈 Monitoring

Monitor documentation performance:
- **GitHub Pages Analytics**: Built-in traffic statistics
- **Google Analytics**: Optional integration available
- **Core Web Vitals**: Performance monitoring
- **Uptime Monitoring**: External service recommendations

## 🤝 Contributing

To contribute to the documentation:

1. Fork the repository
2. Create a feature branch
3. Make your changes in the `docs/` directory
4. Test locally
5. Submit a pull request

## 📞 Support

For documentation issues:
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/YOUR-USERNAME/clean-rn-dev/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/YOUR-USERNAME/clean-rn-dev/discussions)
- 📧 **Contact**: support@clean-rn-dev.com

---

**Note**: This documentation is automatically generated and deployed. Direct edits to the gh-pages branch will be overwritten.