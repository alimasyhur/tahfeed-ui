<template>
  <v-card class="modern-organization-card" elevation="8">
    <!-- Modern Header with Gradient -->
    <v-card-title class="organization-header pa-6">
      <div class="d-flex align-center">
        <div class="header-icon-wrapper mr-4">
          <v-icon :icon="organization.uuid ? 'mdi-pencil' : 'mdi-domain-plus'" size="28" color="white"></v-icon>
        </div>
        <div>
          <h2 class="text-h4 font-weight-bold mb-1">
            {{ organization.uuid ? 'Update Organization' : 'Create Organization' }}
          </h2>
          <p class="text-body-1 mb-0 header-subtitle">
            {{ organization.uuid ? 'Modify organization details' : 'Add a new organization to the system' }}
          </p>
        </div>
      </div>
    </v-card-title>

    <v-divider class="mx-6"></v-divider>

    <v-card-text class="pa-6">
      <!-- Alert Section -->
      <v-alert v-if="hasAlert" :type="alertType" :text="alertMessage" variant="tonal" closable class="mb-6 modern-alert"
        border="start" elevation="2"></v-alert>

      <!-- Form Section -->
      <v-form v-model="form" @submit.prevent="onSubmit">
        <div class="form-sections">
          <!-- Basic Information Section -->
          <div class="form-section mb-6">
            <div class="section-header mb-4">
              <v-icon icon="mdi-information" class="mr-2 text-primary"></v-icon>
              <h3 class="text-h6 font-weight-bold section-title">Basic Information</h3>
            </div>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="organization.name" :rules="[required]" label="Organization Name"
                  placeholder="Enter organization name" variant="outlined" prepend-inner-icon="mdi-domain"
                  :loading="loading" clearable class="modern-field" hide-details="auto"></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="organization.domain" :rules="[required, domainRule]" label="Domain"
                  placeholder="example.com" variant="outlined" prepend-inner-icon="mdi-web" :loading="loading" clearable
                  class="modern-field" hide-details="auto"></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-textarea v-model="organization.bio" :rules="[required]" label="Organization Description"
                  placeholder="Describe the organization's mission and activities" variant="outlined"
                  prepend-inner-icon="mdi-text" :loading="loading" rows="3" clearable class="modern-field"
                  hide-details="auto"></v-textarea>
              </v-col>
            </v-row>
          </div>

          <!-- Contact Information Section -->
          <div class="form-section">
            <div class="section-header mb-4">
              <v-icon icon="mdi-contacts" class="mr-2 text-primary"></v-icon>
              <h3 class="text-h6 font-weight-bold section-title">Contact Information</h3>
            </div>

            <v-row>
              <v-col cols="12">
                <v-textarea v-model="organization.address" :rules="[required]" label="Address"
                  placeholder="Enter complete address" variant="outlined" prepend-inner-icon="mdi-map-marker"
                  :loading="loading" rows="2" clearable class="modern-field" hide-details="auto"></v-textarea>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="organization.email" :rules="[required, emailRule]" label="Email Address"
                  placeholder="contact@organization.com" variant="outlined" prepend-inner-icon="mdi-email"
                  :loading="loading" clearable class="modern-field" hide-details="auto"></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="organization.phone" :rules="[required, phoneRule]" label="Phone Number"
                  placeholder="+1 (555) 123-4567" variant="outlined" prepend-inner-icon="mdi-phone" :loading="loading"
                  clearable class="modern-field" hide-details="auto"></v-text-field>
              </v-col>
            </v-row>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="form-actions mt-8">
          <v-row>
            <v-col cols="12" sm="6">
              <v-btn color="grey-darken-1" size="large" type="button" variant="outlined" block
                class="action-btn cancel-btn" prepend-icon="mdi-close" @click="closeDialogOrganization">
                Cancel
              </v-btn>
            </v-col>
            <v-col cols="12" sm="6">
              <v-btn :disabled="!form" :loading="loading" color="primary" size="large" type="submit" variant="elevated"
                block class="action-btn primary-btn" prepend-icon="mdi-content-save">
                {{ organization.uuid ? 'Update Organization' : 'Create Organization' }}
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, reactive } from "vue";
import { storeToRefs } from "pinia";
import { useOrganizationStorage } from '@/stores/organizationStorage';

const organizationStorage = useOrganizationStorage()
const { closeDialogOrganization, addOrganization, editOrganization } = organizationStorage
const form = ref(false)
const { loading, hasAlert, alertMessage, alertType } = storeToRefs(organizationStorage)

// Validation rules
const required = (v) => {
  return !!v || 'This field is required'
}

const emailRule = (v) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return !v || pattern.test(v) || 'Please enter a valid email address'
}

const phoneRule = (v) => {
  const pattern = /^[\+]?[1-9][\d]{0,15}$/
  return !v || pattern.test(v.replace(/[\s\-\(\)]/g, '')) || 'Please enter a valid phone number'
}

const domainRule = (v) => {
  const pattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.?[a-zA-Z]{2,}$/
  return !v || pattern.test(v) || 'Please enter a valid domain'
}

const props = defineProps({
  organization: {
    type: Object,
    default: reactive({
      uuid: null,
      name: null,
      domain: null,
      bio: null,
      address: null,
      email: null,
      phone: null,
    })
  }
})

const organization = props.organization

const onSubmit = () => {
  if (organization.uuid != null) {
    editOrganization(organization)
  } else {
    addOrganization(organization)
  }
}
</script>

<style scoped>
.modern-organization-card {
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
}

.organization-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
}

.organization-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.header-icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.header-subtitle {
  color: rgba(255, 255, 255, 0.9);
}

.form-sections {
  max-width: 100%;
}

.form-section {
  background: rgba(103, 126, 234, 0.02);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(103, 126, 234, 0.1);
}

.section-header {
  display: flex;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 2px solid rgba(103, 126, 234, 0.1);
}

.section-title {
  color: rgb(var(--v-theme-on-surface));
}

.modern-field :deep(.v-field) {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.modern-field :deep(.v-field:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.modern-field :deep(.v-field--focused) {
  box-shadow: 0 4px 16px rgba(103, 126, 234, 0.2);
}

.modern-alert {
  border-radius: 12px;
}

.action-btn {
  border-radius: 12px;
  text-transform: none;
  font-weight: 600;
  letter-spacing: normal;
  height: 48px;
  transition: all 0.3s ease;
}

.primary-btn {
  box-shadow: 0 4px 12px rgba(103, 126, 234, 0.3);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(103, 126, 234, 0.4);
}

.cancel-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-actions {
  border-top: 1px solid rgba(var(--v-theme-outline), 0.12);
  padding-top: 24px;
}

/* Mobile Responsive */
@media (max-width: 600px) {
  .organization-header {
    padding: 20px;
  }

  .header-icon-wrapper {
    width: 50px;
    height: 50px;
  }

  .form-section {
    padding: 16px;
  }

  .modern-organization-card :deep(.v-card-text) {
    padding: 20px;
  }
}

/* Dark mode adjustments */
.v-theme--dark .form-section {
  background: rgba(103, 126, 234, 0.08);
  border-color: rgba(103, 126, 234, 0.2);
}

.v-theme--dark .modern-organization-card {
  background: rgba(var(--v-theme-surface), 0.98);
}

.v-theme--dark .section-header {
  border-color: rgba(103, 126, 234, 0.2);
}

/* Animation for form fields */
.modern-field {
  animation: slideInUp 0.6s ease forwards;
}

.modern-field:nth-child(1) {
  animation-delay: 0.1s;
}

.modern-field:nth-child(2) {
  animation-delay: 0.2s;
}

.modern-field:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Loading state improvements */
.modern-field :deep(.v-field--loading) {
  background: linear-gradient(90deg, transparent, rgba(103, 126, 234, 0.1), transparent);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}
</style>