<template>
  <div class="login-container">
    <!-- Header Section -->
    <div class="login-header mb-6">
      <div class="d-flex align-center justify-center mb-4">
        <v-avatar color="primary" size="48" class="mr-3">
          <v-icon icon="mdi-account-circle" size="32" color="white"></v-icon>
        </v-avatar>
        <div>
          <h2 class="text-h4 font-weight-bold mb-1">Welcome Back</h2>
          <p class="text-body-2 text-medium-emphasis">Sign in to your account</p>
        </div>
      </div>
    </div>

    <v-divider class="mb-6"></v-divider>

    <!-- Alert Section -->
    <v-alert v-if="hasAlert" :type="alertType" :text="alertMessage" variant="tonal" closable class="mb-6 login-alert">
      <template v-slot:prepend>
        <v-icon :icon="alertType === 'error' ? 'mdi-alert-circle' : 'mdi-check-circle'"></v-icon>
      </template>
    </v-alert>

    <!-- Login Form -->
    <v-form v-model="form" @submit.prevent="onSubmit" class="login-form">
      <div class="form-fields mb-6">
        <!-- Email Field -->
        <div class="field-group mb-4">
          <label class="field-label text-caption font-weight-medium text-medium-emphasis mb-2 d-block">
            EMAIL ADDRESS
          </label>
          <v-text-field v-model="email" :rules="[required]" type="email" variant="outlined"
            placeholder="Enter your email address" prepend-inner-icon="mdi-email-outline" :loading="loading"
            :disabled="loading" clearable class="modern-field" autocomplete="email">
          </v-text-field>
        </div>

        <!-- Password Field -->
        <div class="field-group mb-6">
          <label class="field-label text-caption font-weight-medium text-medium-emphasis mb-2 d-block">
            PASSWORD
          </label>
          <v-text-field v-model="password" :rules="[required]" :type="showPassword ? 'text' : 'password'"
            variant="outlined" placeholder="Enter your password" prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword" :loading="loading" :disabled="loading"
            class="modern-field" autocomplete="current-password">
          </v-text-field>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <v-btn :disabled="!form || loading" :loading="loading" color="primary" size="x-large" type="submit"
          variant="elevated" block class="sign-in-btn mb-4">
          <template v-slot:prepend>
            <v-icon icon="mdi-login" v-if="!loading"></v-icon>
          </template>
          {{ loading ? 'Signing In...' : 'Sign In' }}
        </v-btn>

        <v-btn :disabled="loading" color="grey-darken-1" size="large" variant="outlined" block class="cancel-btn"
          @click="closeDialog">
          <template v-slot:prepend>
            <v-icon icon="mdi-close"></v-icon>
          </template>
          Cancel
        </v-btn>
      </div>
    </v-form>

    <!-- Additional Links -->
    <div class="login-footer mt-6 text-center">
      <v-divider class="mb-4"></v-divider>
      <p class="text-caption text-medium-emphasis">
        Having trouble signing in?
        <a href="#" class="text-primary text-decoration-none font-weight-medium">
          Contact Support
        </a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 24px;
}

.login-header {
  text-align: center;
}

.login-alert {
  border-radius: 12px;
  border: none;
}

.login-form {
  position: relative;
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

.sign-in-btn {
  border-radius: 12px;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.5px;
  height: 56px;
  font-size: 1rem;
  box-shadow: 0 4px 20px rgba(var(--v-theme-primary), 0.3);
  transition: all 0.3s ease;
}

.sign-in-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(var(--v-theme-primary), 0.4);
}

.sign-in-btn:active {
  transform: translateY(0);
}

.cancel-btn {
  border-radius: 12px;
  text-transform: none;
  font-weight: 500;
  height: 48px;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background-color: rgba(var(--v-theme-surface-variant), 0.1);
}

.login-footer a:hover {
  text-decoration: underline !important;
}

/* Loading state animations */
.v-btn--loading :deep(.v-btn__content) {
  opacity: 0.6;
}

/* Focus styles for accessibility */
.modern-field :deep(.v-field--focused .v-field__outline) {
  --v-field-border-width: 2px;
  --v-field-border-opacity: 1;
}

/* Mobile responsive adjustments */
@media (max-width: 600px) {
  .login-container {
    padding: 16px;
  }

  .login-header h2 {
    font-size: 1.75rem !important;
  }

  .modern-field :deep(.v-field__input) {
    padding: 14px 14px 14px 44px;
  }

  .sign-in-btn {
    height: 52px;
  }
}

/* Dark mode adjustments */
.v-theme--dark .modern-field :deep(.v-field) {
  background-color: rgba(var(--v-theme-surface-variant), 0.1);
}

.v-theme--dark .modern-field :deep(.v-field:hover) {
  background-color: rgba(var(--v-theme-surface-variant), 0.15);
}

/* Animation for form appearance */
.login-form {
  animation: slideUp 0.3s ease-out;
}

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
.sign-in-btn :deep(.v-ripple__container) {
  color: rgba(255, 255, 255, 0.3);
}

.cancel-btn :deep(.v-ripple__container) {
  color: rgba(var(--v-theme-on-surface), 0.1);
}
</style>

<script setup>
import { ref } from "vue";
import { useUserStorage } from "@/stores/userStorage";
import { storeToRefs } from "pinia";
import eventBus from "@/stores/eventBus"

const userStorage = useUserStorage()

const { loginUser, closeDialog, getMenu } = userStorage

const form = ref(false)
const showPassword = ref(false)
const loading = ref(false);
const email = ref('')
const password = ref('')

const { hasAlert, alertMessage, alertType, me, activeRole, selectedRole } = storeToRefs(userStorage)

const onSubmit = async () => {
  loading.value = true
  try {
    await loginUser({ email: email.value, password: password.value })

    const myRoleList = me?.value?.roles || []
    const changedRole = myRoleList[selectedRole.value]
    activeRole.value = changedRole
    const listMenu = getMenu(changedRole)

    eventBus.emit('dataUpdated', {
      activeRole: changedRole,
      listMenu,
      myRoleList
    })
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const required = (v) => {
  return !!v || 'Field is required'
}
</script>