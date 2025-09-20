<template>
    <v-container fluid class="pa-0">
        <!-- Hero Section with Organization Banner -->
        <v-row class="ma-0">
            <v-col cols="12" class="pa-0">
                <div class="hero-section">
                    <div class="hero-overlay">
                        <v-container class="hero-content">
                            <v-row class="align-center justify-center text-center">
                                <v-col cols="12" md="8">
                                    <!-- Organization Logo -->
                                    <div class="org-logo-container mb-6">
                                        <v-avatar size="120" class="org-hero-avatar elevation-8">
                                            <v-img v-if="organization?.logo_image_url"
                                                :src="organization.logo_image_url"
                                                :alt="organization?.name || 'Organization'" cover></v-img>
                                            <v-icon v-else icon="mdi-domain" size="80" color="white"></v-icon>
                                        </v-avatar>
                                    </div>

                                    <!-- Organization Name and Status -->
                                    <h1 class="hero-title text-h2 font-weight-bold mb-4 text-white">
                                        {{ organization?.name || 'Organization' }}
                                    </h1>

                                    <p class="hero-description text-h6 text-white mb-6" v-if="organization?.bio">
                                        {{ organization.bio }}
                                    </p>

                                    <!-- Quick Contact Actions -->
                                    <div class="hero-actions">
                                        <v-btn v-if="organization?.email" :href="`mailto:${organization.email}`"
                                            color="white" variant="elevated" size="large" prepend-icon="mdi-email"
                                            class="mr-2 mb-2">
                                            Contact Us
                                        </v-btn>
                                        <v-btn v-if="organization?.phone" :href="`https://wa.me/${organization.phone}`"
                                            color="primary" variant="elevated" size="large" prepend-icon="mdi-whatsapp"
                                            class="mb-2">
                                            Contact via WhatsApp
                                        </v-btn>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-container>
                    </div>
                </div>
            </v-col>
        </v-row>

        <v-container class="py-8" v-if="organization">
            <!-- Organization Information Section -->
            <v-row class="mb-8">
                <v-col cols="12">
                    <div class="section-header mb-6 text-center">
                        <h2 class="text-h3 font-weight-bold mb-2">About {{ organization.name }}</h2>
                        <p class="text-h6 text-medium-emphasis">{{ organization.bio }}</p>
                    </div>

                    <v-card class="info-card" elevation="6">
                        <v-card-text class="pa-8">
                            <v-row>
                                <!-- Contact Information -->
                                <v-col cols="12" md="12">
                                    <div class="info-section">
                                        <h3 class="section-title text-h5 font-weight-bold mb-4">
                                            <v-icon icon="mdi-contact-mail" class="mr-2" color="primary"></v-icon>
                                            Contact Information
                                        </h3>

                                        <div class="contact-items">
                                            <div class="contact-item" v-if="organization.email">
                                                <v-icon icon="mdi-email" size="small"
                                                    class="mr-3 text-medium-emphasis"></v-icon>
                                                <div>
                                                    <div class="contact-label">Email</div>
                                                    <a :href="`mailto:${organization.email}`"
                                                        class="contact-value text-decoration-none">
                                                        {{ organization.email }}
                                                    </a>
                                                </div>
                                            </div>

                                            <div class="contact-item" v-if="organization.phone">
                                                <v-icon icon="mdi-phone" size="small"
                                                    class="mr-3 text-medium-emphasis"></v-icon>
                                                <div>
                                                    <div class="contact-label">Phone</div>
                                                    <a :href="`tel:${organization.phone}`"
                                                        class="contact-value text-decoration-none">
                                                        {{ organization.phone }}
                                                    </a>
                                                </div>
                                            </div>

                                            <div class="contact-item" v-if="organization.address">
                                                <v-icon icon="mdi-map-marker" size="small"
                                                    class="mr-3 text-medium-emphasis"></v-icon>
                                                <div>
                                                    <div class="contact-label">Address</div>
                                                    <div class="contact-value">{{ organization.address }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Call to Action Section -->
            <v-row class="mb-8">
                <v-col cols="12">
                    <v-card class="modern-card cta-card" elevation="6" color="primary">
                        <v-card-text class="pa-8 text-center text-white">
                            <h2 class="text-h4 font-weight-bold mb-4">Get in Touch</h2>
                            <p class="text-h6 mb-6">
                                Interested in learning more about {{ organization.name }}? We'd love to hear from you!
                            </p>

                            <div class="cta-actions">
                                <v-btn v-if="organization.email" :href="`mailto:${organization.email}`" color="white"
                                    variant="elevated" size="x-large" prepend-icon="mdi-email" class="mr-4 mb-2">
                                    Send Email
                                </v-btn>
                                <v-btn v-if="organization.phone" :href="`https://wa.me/${organization.phone}`"
                                    color="white" variant="outlined" size="x-large" prepend-icon="mdi-whatsapp"
                                    class="mb-2">
                                    Call Us
                                </v-btn>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <!-- Organization Not Found State -->
        <v-container v-else-if="!loading" class="py-12">
            <v-row>
                <v-col cols="12">
                    <v-card class="modern-card" elevation="6">
                        <v-card-text class="pa-12 text-center">
                            <v-icon icon="mdi-domain-off" size="96" color="grey-lighten-1" class="mb-6"></v-icon>
                            <h1 class="text-h3 font-weight-bold mb-4">Organization Not Found</h1>
                            <p class="text-h6 text-medium-emphasis mb-6">
                                The organization you're looking for doesn't exist or may not be publicly visible.
                            </p>
                            <v-btn color="primary" variant="elevated" size="large" href="/" prepend-icon="mdi-home">
                                Go Home
                            </v-btn>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <!-- Loading State -->
        <v-container v-if="loading" class="py-12">
            <v-row>
                <v-col cols="12" class="text-center">
                    <v-progress-circular indeterminate color="primary" size="64" class="mb-4"></v-progress-circular>
                    <h2 class="text-h5">Loading organization details...</h2>
                </v-col>
            </v-row>
        </v-container>

        <!-- Footer -->
        <v-footer class="bg-grey-lighten-5 text-center pa-8" v-if="organization">
            <div>
                <p class="text-body-2 text-medium-emphasis mb-2">
                    © {{ new Date().getFullYear() }} {{ organization.name }}. All rights reserved.
                </p>
                <p class="text-caption text-medium-emphasis">
                    Public organization profile • Last updated: {{ formatDate(new Date()) }}
                </p>
            </div>
        </v-footer>
    </v-container>
</template>

<style scoped>
/* Hero Section */
.hero-section {
    min-height: 70vh;
    background: linear-gradient(135deg,
            #667eea 0%,
            #764ba2 25%,
            #f093fb 50%,
            #f5576c 75%,
            #4facfe 100%);
    background-size: 300% 300%;
    animation: gradientShift 15s ease infinite;
    position: relative;
    display: flex;
    align-items: center;
    overflow: hidden;
}

@keyframes gradientShift {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

.hero-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:
        radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 25%),
        radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.08) 0%, transparent 25%),
        linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.03) 50%, transparent 60%);
    opacity: 1;
}

.hero-overlay {
    position: relative;
    z-index: 1;
    width: 100%;
    padding: 60px 0;
}

.hero-content {
    max-width: 1200px;
}

.org-logo-container {
    position: relative;
    display: inline-block;
}

.org-hero-avatar {
    border: 5px solid rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3),
        0 0 0 1px rgba(255, 255, 255, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.hero-title {
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    background: linear-gradient(45deg, #ffffff, #f8f9ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hero-description {
    max-width: 600px;
    margin: 0 auto;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    color: rgba(255, 255, 255, 0.95);
}

.hero-badges .v-chip {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
}

/* Modern Cards */
.modern-card {
    border-radius: 24px;
    overflow: hidden;
    backdrop-filter: blur(20px);
    background: linear-gradient(145deg,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(255, 255, 255, 0.8) 100%);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 32px 64px rgba(0, 0, 0, 0.2);
    background: linear-gradient(145deg,
            rgba(46, 41, 142, 0.95) 0%,
            rgba(46, 41, 142, 0.85) 100%);
}

/* Section Headers */
.section-header {
    margin-bottom: 3rem;
}

.section-title {
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1.5rem;
}

/* Contact Items */
.contact-items {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.contact-item {
    display: flex;
    align-items: flex-start;
    padding: 1.5rem;
    border-radius: 16px;
    background: linear-gradient(135deg,
            rgba(102, 126, 234, 0.08) 0%,
            rgba(118, 75, 162, 0.05) 100%);
    border: 1px solid rgba(102, 126, 234, 0.1);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.contact-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    transform: scaleY(0);
    transition: transform 0.3s ease;
    transform-origin: bottom;
}

.contact-item:hover::before {
    transform: scaleY(1);
}

.contact-item:hover {
    background: linear-gradient(135deg,
            rgba(102, 126, 234, 0.15) 0%,
            rgba(118, 75, 162, 0.1) 100%);
    transform: translateX(12px);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
}

.contact-label {
    font-size: 0.75rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 0.5rem;
}

.contact-value {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2d3748;
    line-height: 1.4;
}

/* Stats Cards */
.stat-card {
    border-radius: 20px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
    background: linear-gradient(135deg,
            rgba(102, 126, 234, 0.1) 0%,
            rgba(118, 75, 162, 0.05) 100%);
    backdrop-filter: blur(10px);
    position: relative;
    overflow: hidden;
}

.stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
    background-size: 200% 100%;
    animation: shimmer 2s linear infinite;
}

@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }

    100% {
        background-position: 200% 0;
    }
}

.stat-card:hover {
    transform: scale(1.08) rotateY(5deg);
    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.25);
}

.stat-number {
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.stat-label {
    color: #4a5568;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.stat-text {
    color: rgb(var(--v-theme-on-surface));
}

/* Team Cards */
.team-member-card {
    border-radius: 20px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    height: 100%;
    background: linear-gradient(145deg,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(248, 250, 252, 0.8) 100%);
    border: 1px solid rgba(102, 126, 234, 0.1);
    position: relative;
    overflow: hidden;
}

.team-member-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg,
            rgba(102, 126, 234, 0.05) 0%,
            rgba(118, 75, 162, 0.03) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.team-member-card:hover::before {
    opacity: 1;
}

.team-member-card:hover {
    transform: translateY(-12px) rotateX(5deg);
    box-shadow: 0 25px 50px rgba(102, 126, 234, 0.2);
    border-color: rgba(102, 126, 234, 0.3);
}

.team-member-card .v-avatar {
    border: 4px solid rgba(102, 126, 234, 0.1);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

/* CTA Section */
.cta-card {
    background: linear-gradient(135deg,
            #667eea 0%,
            #764ba2 25%,
            #f093fb 50%,
            #f5576c 75%,
            #4facfe 100%);
    background-size: 300% 300%;
    animation: gradientShift 15s ease infinite;
    position: relative;
    overflow: hidden;
}

.cta-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 30%),
        radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 30%);
    pointer-events: none;
}

.cta-actions {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    flex-wrap: wrap;
    position: relative;
    z-index: 1;
}

.cta-actions .v-btn {
    backdrop-filter: blur(15px);
    border: 2px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.cta-actions .v-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent);
    transition: left 0.6s ease;
}

.cta-actions .v-btn:hover::before {
    left: 100%;
}

.cta-actions .v-btn:hover {
    transform: translateY(-4px) scale(1.08);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    border-color: rgba(255, 255, 255, 0.8);
    background: rgba(255, 255, 255, 0.15);
}

/* Specific styles for different button variants */
.cta-actions .v-btn--variant-elevated:hover {
    background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.95) 0%,
            rgba(248, 250, 252, 0.9) 100%) !important;
    color: #667eea !important;
    border-color: rgba(102, 126, 234, 0.3);
}

.cta-actions .v-btn--variant-outlined:hover {
    background: rgba(255, 255, 255, 0.1) !important;
    border-color: rgba(255, 255, 255, 0.9);
    color: rgba(255, 255, 255, 0.95) !important;
}

/* Responsive Design */
@media (max-width: 960px) {
    .hero-section {
        min-height: 50vh;
    }

    .hero-title {
        font-size: 2.5rem !important;
    }

    .hero-description {
        font-size: 1.25rem !important;
    }

    .org-hero-avatar {
        width: 100px !important;
        height: 100px !important;
    }
}

@media (max-width: 600px) {
    .hero-section {
        min-height: 40vh;
    }

    .hero-title {
        font-size: 2rem !important;
    }

    .hero-description {
        font-size: 1.1rem !important;
    }

    .org-hero-avatar {
        width: 80px !important;
        height: 80px !important;
    }

    .hero-actions .v-btn {
        display: block;
        width: 100%;
        margin-bottom: 1rem;
    }

    .contact-item {
        flex-direction: column;
        text-align: center;
    }

    .cta-actions {
        flex-direction: column;
    }

    .cta-actions .v-btn {
        width: 100%;
    }
}

/* Dark mode adjustments */
.v-theme--dark .hero-section {
    background: linear-gradient(135deg,
            #1e3a8a 0%,
            #581c87 25%,
            #be185d 50%,
            #dc2626 75%,
            #0369a1 100%);
    background-size: 300% 300%;
    animation: gradientShift 15s ease infinite;
}

.v-theme--dark .modern-card {
    background: linear-gradient(145deg,
            rgba(30, 41, 59, 0.9) 0%,
            rgba(15, 23, 42, 0.8) 100%);
    border: 1px solid rgba(148, 163, 184, 0.1);
}

.v-theme--dark .modern-card:hover {
    background: linear-gradient(145deg,
            rgba(30, 41, 59, 0.95) 0%,
            rgba(15, 23, 42, 0.85) 100%);
    border-color: rgba(102, 126, 234, 0.3);
}

.v-theme--dark .contact-item {
    background: linear-gradient(135deg,
            rgba(102, 126, 234, 0.1) 0%,
            rgba(118, 75, 162, 0.08) 100%);
    border: 1px solid rgba(102, 126, 234, 0.15);
}

.v-theme--dark .contact-item:hover {
    background: linear-gradient(135deg,
            rgba(102, 126, 234, 0.2) 0%,
            rgba(118, 75, 162, 0.15) 100%);
}

.v-theme--dark .contact-value {
    color: #e2e8f0;
}

.v-theme--dark .team-member-card {
    background: linear-gradient(145deg,
            rgba(30, 41, 59, 0.9) 0%,
            rgba(15, 23, 42, 0.8) 100%);
    border: 1px solid rgba(148, 163, 184, 0.1);
}

.v-theme--dark .team-member-card:hover {
    border-color: rgba(102, 126, 234, 0.3);
}

.v-theme--dark .stat-card {
    background: linear-gradient(135deg,
            rgba(102, 126, 234, 0.15) 0%,
            rgba(118, 75, 162, 0.1) 100%);
}

/* Animation for page load */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(40px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.modern-card {
    animation: fadeInUp 0.8s ease-out;
}

.modern-card:nth-child(2) {
    animation-delay: 0.2s;
}

.modern-card:nth-child(3) {
    animation-delay: 0.4s;
}

/* Pulse animation for loading states */
@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.7;
    }
}

.loading-pulse {
    animation: pulse 2s ease-in-out infinite;
}

/* Glassmorphism effects */
.glass-effect {
    backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Enhanced button styles */
.hero-actions .v-btn {
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-actions .v-btn:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

/* Improved spacing and typography */
.hero-content h1 {
    line-height: 1.2;
    margin-bottom: 2rem;
}

.hero-content p {
    line-height: 1.6;
    margin-bottom: 2.5rem;
}

/* Enhanced focus states for accessibility */
.contact-item:focus-within,
.team-member-card:focus-within,
.stat-card:focus-within {
    outline: 2px solid #667eea;
    outline-offset: 2px;
}

/* Smooth scroll behavior */
html {
    scroll-behavior: smooth;
}
</style>

<script>
import { useOrganizationStorage } from '@/stores/organizationStorage';

export default {
    name: 'PublicOrganizationView',
    data: () => ({
        slug: null,
        loading: false,
        organization: null,
    }),
    methods: {
        formatDate(date) {
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(new Date(date))
        },

        async loadOrganizationData() {
            this.loading = true
            try {
                const orgStorage = useOrganizationStorage()
                const data = await orgStorage.showOrganizationByDomain(this.slug)

                // Only show if organization is active and public
                if (data.data && data.data.is_active) {
                    this.organization = data.data
                } else {
                    this.organization = null
                }
            } catch (error) {
                console.error('Error loading organization data:', error)
                this.organization = null
            } finally {
                this.loading = false
            }
        }
    },

    async mounted() {
        this.slug = this.$route.params.slug
        await this.loadOrganizationData()
    },

    head() {
        if (this.organization) {
            return {
                title: `${this.organization.name} - Organization Profile`,
                meta: [
                    {
                        hid: 'description',
                        name: 'description',
                        content: this.organization.bio || `Learn more about ${this.organization.name}`
                    },
                    {
                        hid: 'og:title',
                        property: 'og:title',
                        content: `${this.organization.name} - Organization Profile`
                    },
                    {
                        hid: 'og:description',
                        property: 'og:description',
                        content: this.organization.bio || `Learn more about ${this.organization.name}`
                    },
                    {
                        hid: 'og:image',
                        property: 'og:image',
                        content: this.organization.logo_image_url || ''
                    }
                ]
            }
        }
        return {
            title: 'Organization Profile',
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: 'View organization profile and details'
                }
            ]
        }
    }
};
</script>
