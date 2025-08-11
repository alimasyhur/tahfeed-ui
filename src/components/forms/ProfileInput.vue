<template>
  <v-card class="profile-card" elevation="8">
    <!-- Header Section -->
    <v-card-title class="profile-header pa-6">
      <div class="d-flex align-center">
        <v-avatar color="primary" size="48" class="mr-4">
          <v-icon icon="mdi-account-edit" size="28" color="white"></v-icon>
        </v-avatar>
        <div>
          <h2 class="text-h5 font-weight-bold mb-1">
            {{ profile.uuid ? 'Update Profile' : 'Complete Your Profile' }}
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-0">
            {{ profile.uuid ? 'Keep your information up to date' : 'Tell us a bit about yourself' }}
          </p>
        </div>
      </div>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="pa-6">
      <!-- Alert Section -->
      <v-alert v-if="hasAlert" :type="alertType" :text="alertMessage" variant="tonal" closable
        class="mb-6 profile-alert">
        <template v-slot:prepend>
          <v-icon :icon="alertType === 'error' ? 'mdi-alert-circle' : 'mdi-check-circle'"></v-icon>
        </template>
      </v-alert>

      <!-- Profile Form -->
      <v-form v-model="form" @submit.prevent="onSubmit" class="profile-form">
        <div class="form-section mb-6">
          <h3 class="section-title text-h6 mb-4 d-flex align-center">
            <v-icon icon="mdi-account" class="mr-2 text-primary"></v-icon>
            Personal Information
          </h3>

          <v-row>
            <!-- First Name -->
            <v-col cols="12">
              <div class="field-group">
                <label class="field-label text-caption font-weight-medium text-medium-emphasis mb-2 d-block">
                  FIRST NAME *
                </label>
                <v-text-field v-model="profile.firstname" :rules="[required]" variant="outlined"
                  placeholder="Enter your first name" prepend-inner-icon="mdi-account-outline" :loading="loading"
                  :disabled="loading" clearable class="modern-field">
                </v-text-field>
              </div>
            </v-col>

            <!-- Last Name -->
            <v-col cols="12">
              <div class="field-group">
                <label class="field-label text-caption font-weight-medium text-medium-emphasis mb-2 d-block">
                  LAST NAME *
                </label>
                <v-text-field v-model="profile.lastname" :rules="[required]" variant="outlined"
                  placeholder="Enter your last name" prepend-inner-icon="mdi-account-outline" :loading="loading"
                  :disabled="loading" clearable class="modern-field">
                </v-text-field>
              </div>
            </v-col>
          </v-row>

          <v-row>
            <!-- Birthdate -->
            <v-col cols="12">
              <div class="field-group">
                <label class="field-label text-caption font-weight-medium text-medium-emphasis mb-2 d-block">
                  DATE OF BIRTH *
                </label>
                <v-text-field v-model="profile.birthdate" :rules="[required]" type="date" variant="outlined"
                  prepend-inner-icon="mdi-calendar" :loading="loading" :disabled="loading" class="modern-field">
                </v-text-field>
              </div>
            </v-col>

            <!-- Phone -->
            <v-col cols="12">
              <div class="field-group">
                <label class="field-label text-caption font-weight-medium text-medium-emphasis mb-2 d-block">
                  PHONE NUMBER *
                </label>
                <v-text-field v-model="profile.phone" :rules="[required, phoneValidation]" type="tel" variant="outlined"
                  placeholder="Enter your phone number" prepend-inner-icon="mdi-phone" :loading="loading"
                  :disabled="loading" clearable class="modern-field">
                </v-text-field>
              </div>
            </v-col>
          </v-row>

          <!-- Bio -->
          <v-row>
            <v-col cols="12">
              <div class="field-group">
                <label class="field-label text-caption font-weight-medium text-medium-emphasis mb-2 d-block">
                  BIO *
                </label>
                <v-textarea v-model="profile.bio" :rules="[required]" variant="outlined"
                  placeholder="Tell us about yourself..." prepend-inner-icon="mdi-text" :loading="loading"
                  :disabled="loading" rows="3" counter="500" clearable class="modern-field">
                </v-textarea>
              </div>
            </v-col>
          </v-row>
        </div>

        <!-- Action Buttons -->
        <div class="action-section">
          <v-divider class="mb-6"></v-divider>

          <v-row>
            <v-col cols="12" sm="6">
              <v-btn :disabled="loading" color="grey-darken-1" size="x-large" variant="outlined" block
                class="cancel-btn" @click="closeDialogProfile">
                <template v-slot:prepend>
                  <v-icon icon="mdi-close"></v-icon>
                </template>
                Cancel
              </v-btn>
            </v-col>
            <v-col cols="12" sm="6">
              <v-btn :disabled="!form || loading" :loading="loading" color="primary" size="x-large" type="submit"
                variant="elevated" block class="save-btn">
                <template v-slot:prepend>
                  <v-icon :icon="profile.uuid ? 'mdi-content-save' : 'mdi-check'" v-if="!loading"></v-icon>
                </template>
                {{ loading ? 'Saving...' : (profile.uuid ? 'Update Profile' : 'Save Profile') }}
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.profile-card {
  border-radius: 20px;
  overflow: hidden;
  max-width: 800px;
  margin: 0 auto;
}

.profile-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-secondary), 0.02) 100%);
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.12);
}

.profile-alert {
  border-radius: 12px;
  border: none;
}

.profile-form {
  position: relative;
  animation: slideUp 0.3s ease-out;
}

.form-section {
  background: rgba(var(--v-theme-surface-variant), 0.02);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(var(--v-theme-outline), 0.08);
}

.section-title {
  color: rgb(var(--v-theme-primary));
  margin-bottom: 16px;
}

.field-group {
  position: relative;
}

.field-label {
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modern-field :deep(.v-field) {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.modern-field :deep(.v-field:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.modern-field :deep(.v-field--focused) {
  box-shadow: 0 4px 20px rgba(var(--v-theme-primary), 0.2);
}

.modern-field :deep(.v-field__input) {
  padding: 16px 16px 16px 48px;
  font-size: 1rem;
}

.modern-field :deep(.v-field__prepend-inner) {
  padding-left: 16px;
}

.modern-field :deep(.v-textarea .v-field__input) {
  padding-top: 16px;
}

.save-btn {
  border-radius: 12px;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.5px;
  height: 56px;
  font-size: 1rem;
  box-shadow: 0 4px 20px rgba(var(--v-theme-primary), 0.3);
  transition: all 0.3s ease;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(var(--v-theme-primary), 0.4);
}

.save-btn:active {
  transform: translateY(0);
}

.cancel-btn {
  border-radius: 12px;
  text-transform: none;
  font-weight: 500;
  height: 56px;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background-color: rgba(var(--v-theme-surface-variant), 0.1);
}

.action-section {
  background: rgba(var(--v-theme-surface), 0.5);
  margin: -24px -24px -24px -24px;
  padding: 24px;
  border-radius: 0 0 16px 16px;
}

/* Focus styles for accessibility */
.modern-field :deep(.v-field--focused .v-field__outline) {
  --v-field-border-width: 2px;
  --v-field-border-opacity: 1;
}

/* Mobile responsive adjustments */
@media (max-width: 600px) {
  .profile-card {
    margin: 8px;
    border-radius: 16px;
  }

  .profile-header {
    padding: 20px !important;
  }

  .profile-header h2 {
    font-size: 1.5rem !important;
  }

  .form-section {
    padding: 16px;
  }

  .modern-field :deep(.v-field__input) {
    padding: 14px 14px 14px 44px;
  }

  .save-btn,
  .cancel-btn {
    height: 52px;
  }

  .action-section {
    margin: -16px -16px -16px -16px;
    padding: 16px;
  }
}

/* Dark mode adjustments */
.v-theme--dark .form-section {
  background: rgba(var(--v-theme-surface-variant), 0.05);
  border-color: rgba(var(--v-theme-outline), 0.15);
}

.v-theme--dark .modern-field :deep(.v-field) {
  background-color: rgba(var(--v-theme-surface-variant), 0.1);
}

.v-theme--dark .modern-field :deep(.v-field:hover) {
  background-color: rgba(var(--v-theme-surface-variant), 0.15);
}

.v-theme--dark .action-section {
  background: rgba(var(--v-theme-surface-variant), 0.08);
}

/* Animation for form appearance */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Field focus animation */
.modern-field :deep(.v-field) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Button ripple effect enhancement */
.save-btn :deep(.v-ripple__container) {
  color: rgba(255, 255, 255, 0.3);
}

.cancel-btn :deep(.v-ripple__container) {
  color: rgba(var(--v-theme-on-surface), 0.1);
}

/* Counter styling for textarea */
.modern-field :deep(.v-counter) {
  padding-top: 8px;
  font-size: 0.75rem;
  color: rgb(var(--v-theme-on-surface-variant));
}

/* Loading state styling */
.v-btn--loading :deep(.v-btn__content) {
  opacity: 0.6;
}

/* Required field indicator */
.field-label::after {
  content: " *";
  color: rgb(var(--v-theme-error));
}

/* Smooth transitions for disabled states */
.modern-field :deep(.v-field--disabled) {
  opacity: 0.6;
  pointer-events: none;
}

/* Enhanced focus ring for accessibility */
.modern-field :deep(.v-field--focused) {
  outline: 2px solid rgba(var(--v-theme-primary), 0.2);
  outline-offset: 2px;
}
</style>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { storeToRefs } from "pinia";
import { useUserStorage } from '@/stores/userStorage';

const userStorage = useUserStorage()

const { closeDialogProfile, addProfile, editProfile } = userStorage

const form = ref(false)

const { loading, hasAlert, alertMessage, alertType } = storeToRefs(userStorage)

const required = (v) => {
  return !!v || 'This field is required'
}

const phoneValidation = (v) => {
  if (!v) return 'Phone number is required'
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(v) || 'Please enter a valid phone number'
}

const props = defineProps({
  profile: {
    type: Object,
    default: reactive({
      uuid: null,
      firstname: null,
      lastname: null,
      birthdate: null,
      phone: null,
      bio: null,
    })
  }
})

const profile = props.profile

const onSubmit = () => {
  if (profile.uuid !== null) {
    editProfile(profile)
  } else {
    addProfile(profile)
  }
}

onMounted(() => {
  userStorage.dataUser()
})
</script>