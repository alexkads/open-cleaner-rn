// Clean RN Dev - Documentation Website JavaScript

class GitHubAPI {
    constructor(repoUrl) {
        // Extract owner and repo from GitHub URL
        const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if (match) {
            this.owner = match[1];
            this.repo = match[2];
        } else {
            // Fallback for local development
            this.owner = 'seu-usuario';
            this.repo = 'clean-rn-dev';
        }
        this.apiBase = 'https://api.github.com';
    }

    async fetchLatestRelease() {
        try {
            const response = await fetch(`${this.apiBase}/repos/${this.owner}/${this.repo}/releases/latest`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.warn('Failed to fetch latest release:', error);
            return this.getMockRelease();
        }
    }

    async fetchRepoStats() {
        try {
            const response = await fetch(`${this.apiBase}/repos/${this.owner}/${this.repo}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.warn('Failed to fetch repo stats:', error);
            return this.getMockStats();
        }
    }

    getMockRelease() {
        return {
            tag_name: 'v1.0.0',
            name: 'Clean RN Dev v1.0.0',
            assets: [
                {
                    name: 'clean-rn-dev_1.0.0_universal.dmg',
                    browser_download_url: '#',
                    download_count: 1234
                },
                {
                    name: 'clean-rn-dev_1.0.0_x64.msi',
                    browser_download_url: '#',
                    download_count: 987
                },
                {
                    name: 'clean-rn-dev_1.0.0_amd64.deb',
                    browser_download_url: '#',
                    download_count: 654
                },
                {
                    name: 'clean-rn-dev_1.0.0_x86_64.AppImage',
                    browser_download_url: '#',
                    download_count: 432
                }
            ]
        };
    }

    getMockStats() {
        return {
            stargazers_count: 1520,
            forks_count: 89
        };
    }
}

class DownloadManager {
    constructor(githubAPI) {
        this.githubAPI = githubAPI;
        this.platforms = {
            darwin: { name: 'macOS', icon: '🍎', extensions: ['.dmg'] },
            windows: { name: 'Windows', icon: '🪟', extensions: ['.msi', '.exe'] },
            linux: { name: 'Linux', icon: '🐧', extensions: ['.deb', '.AppImage', '.rpm'] }
        };
    }

    detectPlatform() {
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes('mac')) return 'darwin';
        if (userAgent.includes('win')) return 'windows';
        if (userAgent.includes('linux')) return 'linux';
        return 'linux'; // Default to Linux
    }

    async generateDownloadButtons() {
        const release = await this.githubAPI.fetchLatestRelease();
        const primaryPlatform = this.detectPlatform();
        const container = document.getElementById('download-buttons');
        
        if (!container) return;

        container.innerHTML = '';

        // Primary download button for detected platform
        const primaryAsset = this.findAssetForPlatform(release.assets, primaryPlatform);
        if (primaryAsset) {
            const primaryBtn = this.createDownloadButton(
                primaryAsset,
                this.platforms[primaryPlatform],
                true
            );
            container.appendChild(primaryBtn);
        }

        // Secondary buttons for other platforms
        Object.entries(this.platforms).forEach(([platform, info]) => {
            if (platform === primaryPlatform) return;
            
            const asset = this.findAssetForPlatform(release.assets, platform);
            if (asset) {
                const btn = this.createDownloadButton(asset, info, false);
                container.appendChild(btn);
            }
        });

        return release;
    }

    findAssetForPlatform(assets, platform) {
        const extensions = this.platforms[platform]?.extensions || [];
        
        return assets.find(asset => {
            const name = asset.name.toLowerCase();
            return extensions.some(ext => name.includes(ext));
        });
    }

    createDownloadButton(asset, platform, isPrimary = false) {
        const button = document.createElement('a');
        button.href = asset.browser_download_url;
        button.className = isPrimary ? 'btn btn-primary' : 'btn btn-outline';
        button.innerHTML = `
            <span>${platform.icon}</span>
            <span>Download for ${platform.name}</span>
        `;
        
        // Add download tracking
        button.addEventListener('click', () => {
            this.trackDownload(platform.name, asset.name);
        });

        return button;
    }

    trackDownload(platform, filename) {
        // Basic analytics - you can integrate with Google Analytics, etc.
        console.log(`Download tracked: ${platform} - ${filename}`);
        
        // Example Google Analytics event (uncomment if you have GA)
        // if (typeof gtag !== 'undefined') {
        //     gtag('event', 'download', {
        //         event_category: 'Software',
        //         event_label: platform,
        //         value: filename
        //     });
        // }
    }

    async updateDownloadLinks() {
        const release = await this.githubAPI.fetchLatestRelease();
        
        // Update platform-specific download links
        const platforms = ['macos', 'windows', 'linux'];
        platforms.forEach(platform => {
            const container = document.getElementById(`${platform}-download`);
            if (!container) return;

            const asset = this.findAssetForPlatform(release.assets, platform === 'macos' ? 'darwin' : platform);
            if (asset) {
                container.innerHTML = `
                    <a href="${asset.browser_download_url}" class="btn btn-outline">
                        Download (${this.formatFileSize(asset.size || 15000000)})
                    </a>
                `;
            }
        });
    }

    formatFileSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Byte';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }
}

class StatsManager {
    constructor(githubAPI) {
        this.githubAPI = githubAPI;
    }

    async updateStats() {
        try {
            const [release, repo] = await Promise.all([
                this.githubAPI.fetchLatestRelease(),
                this.githubAPI.fetchRepoStats()
            ]);

            this.updateDownloadCount(release);
            this.updateLatestVersion(release);
            
        } catch (error) {
            console.error('Failed to update stats:', error);
        }
    }

    updateDownloadCount(release) {
        const totalDownloads = release.assets?.reduce((total, asset) => {
            return total + (asset.download_count || 0);
        }, 0) || 3307; // Fallback number

        const element = document.getElementById('download-count');
        if (element) {
            this.animateNumber(element, totalDownloads);
        }
    }

    updateLatestVersion(release) {
        const element = document.getElementById('latest-version');
        if (element) {
            element.textContent = release.tag_name || 'v1.0.0';
            element.classList.remove('loading');
        }
    }

    animateNumber(element, targetNumber) {
        element.classList.remove('loading');
        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = targetNumber / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
                current = targetNumber;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, duration / steps);
    }
}

class BuildStatusManager {
    constructor(githubAPI) {
        this.githubAPI = githubAPI;
    }

    async updateBuildStatus() {
        try {
            // Update badge URLs with correct repository
            const badgeUrl = `https://github.com/${this.githubAPI.owner}/${this.githubAPI.repo}/workflows/Build/badge.svg`;
            
            const statusElements = ['macos-status', 'windows-status', 'linux-status'];
            statusElements.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    const img = element.querySelector('img');
                    if (img) {
                        img.src = badgeUrl;
                        img.alt = `${id.replace('-status', '')} Build Status`;
                    }
                }
            });
        } catch (error) {
            console.error('Failed to update build status:', error);
        }
    }
}

// App initialization
class App {
    constructor() {
        this.githubAPI = new GitHubAPI(window.location.href);
        this.downloadManager = new DownloadManager(this.githubAPI);
        this.statsManager = new StatsManager(this.githubAPI);
        this.buildStatusManager = new BuildStatusManager(this.githubAPI);
    }

    async init() {
        try {
            // Show loading states
            this.showLoadingStates();
            
            // Initialize all components
            await Promise.all([
                this.downloadManager.generateDownloadButtons(),
                this.downloadManager.updateDownloadLinks(),
                this.statsManager.updateStats(),
                this.buildStatusManager.updateBuildStatus()
            ]);

            console.log('Clean RN Dev documentation site initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
        }
    }

    showLoadingStates() {
        const loadingElements = ['download-count', 'latest-version'];
        loadingElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.classList.add('loading');
                element.textContent = 'Loading...';
            }
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animations
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .doc-card, .status-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});