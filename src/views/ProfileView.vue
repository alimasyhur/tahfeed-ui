<template>
  <v-container fluid class="pa-4">
    <!-- Header Section with Gradient Background -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="header-section">
          <v-breadcrumbs :items="breadcrumbsItems" class="pa-0 mb-4">
            <template v-slot:divider>
              <v-icon icon="mdi-chevron-right" size="small"></v-icon>
            </template>
          </v-breadcrumbs>

          <div class="d-flex flex-column flex-md-row align-center justify-space-between">
            <div class="page-title-section mb-4 mb-md-0">
              <h1 class="page-title text-h4 font-weight-bold mb-2">
                <!-- Profile Picture Avatar with Upload -->
                <div class="profile-avatar-section d-inline-flex align-center mr-4">
                  <div class="avatar-container" @click="openProfileImageUpload">
                    <v-avatar size="64" class="profile-avatar">
                      <v-img v-if="profileImageUrl" :src="profileImageUrl" :alt="me?.user?.name || 'Profile'"
                        cover></v-img>
                      <v-icon v-else icon="mdi-account-circle" size="48" color="primary"></v-icon>
                    </v-avatar>
                    <div class="avatar-overlay">
                      <v-icon icon="mdi-camera" color="white" size="24"></v-icon>
                    </div>
                  </div>
                </div>
                My Profile
              </h1>
              <p class="page-subtitle text-body-1 text-medium-emphasis">
                Manage your personal information, organization, and roles
              </p>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <div v-if="me">
      <!-- Profile Information Card -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card class="modern-card profile-card" elevation="4">
            <v-card-title class="card-header pa-6">
              <div class="d-flex align-center justify-space-between w-100">
                <div class="d-flex align-center">
                  <!-- Profile Avatar with Upload -->
                  <div class="profile-icon-container mr-4" @click="openProfileImageUpload">
                    <v-avatar size="40" class="profile-icon-avatar">
                      <v-img v-if="profileImageUrl" :src="profileImageUrl" :alt="me?.user?.name || 'Profile'"
                        cover></v-img>
                      <v-icon v-else icon="mdi-account" size="24" color="primary"></v-icon>
                    </v-avatar>
                    <div class="icon-overlay">
                      <v-icon icon="mdi-camera" color="white" size="16"></v-icon>
                    </div>
                  </div>
                  <span class="text-h5 font-weight-bold">Profile Information</span>
                </div>

                <div class="action-buttons">
                  <v-tooltip :text="me.profile !== null ? 'Edit Profile' : 'Create Profile'" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn v-if="me.profile !== null" color="warning" variant="elevated" size="large"
                        @click="openEditProfile(me.profile)" class="action-btn" prepend-icon="mdi-pencil"
                        v-bind="props">
                        <span class="d-none d-sm-inline">Edit Profile</span>
                        <span class="d-sm-none">Edit</span>
                      </v-btn>
                      <v-btn v-else color="primary" variant="elevated" size="large" @click="openCreateProfile()"
                        class="action-btn" prepend-icon="mdi-plus" v-bind="props">
                        <span class="d-none d-sm-inline">Create Profile</span>
                        <span class="d-sm-none">Create</span>
                      </v-btn>
                    </template>
                  </v-tooltip>
                </div>
              </div>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text class="pa-6">
              <div v-if="me.profile !== null">
                <v-row>
                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <div class="d-flex align-center mb-3">
                        <v-icon icon="mdi-account" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                        <span class="info-label">Name</span>
                      </div>
                      <div class="info-value">{{ me.user.name }}</div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <div class="d-flex align-center mb-3">
                        <v-icon icon="mdi-email" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                        <span class="info-label">Email</span>
                      </div>
                      <div class="info-value">{{ me.user.email }}</div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <div class="d-flex align-center mb-3">
                        <v-icon icon="mdi-account-details" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                        <span class="info-label">Full Name</span>
                      </div>
                      <div class="info-value">{{ me.profile.firstname }} {{ me.profile.lastname }}</div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <div class="d-flex align-center mb-3">
                        <v-icon icon="mdi-calendar" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                        <span class="info-label">Birthdate</span>
                      </div>
                      <div class="info-value">{{ formatDate(me.profile.birthdate) }}</div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <div class="d-flex align-center mb-3">
                        <v-icon icon="mdi-phone" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                        <span class="info-label">Phone</span>
                      </div>
                      <div class="info-value">
                        <a :href="`tel:${me.profile.phone}`" class="text-decoration-none">
                          {{ me.profile.phone }}
                        </a>
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12">
                    <div class="info-item">
                      <div class="d-flex align-center mb-3">
                        <v-icon icon="mdi-text" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                        <span class="info-label">Biography</span>
                      </div>
                      <div class="info-value">{{ me.profile.bio || 'No biography provided' }}</div>
                    </div>
                  </v-col>
                </v-row>
              </div>

              <div v-else class="text-center pa-8">
                <v-icon icon="mdi-account-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
                <h3 class="text-h6 mb-2">Profile Not Complete</h3>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  Complete your profile to get the most out of your account.
                </p>
                <v-btn color="primary" variant="elevated" @click="openCreateProfile()" prepend-icon="mdi-plus">
                  Create Profile
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Organization Information Card -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card class="modern-card organization-card" elevation="4">
            <v-card-title class="card-header pa-6">
              <div class="d-flex align-center justify-space-between w-100">
                <div class="d-flex align-center">
                  <!-- Organization Avatar with Upload -->
                  <div class="org-icon-container mr-4" @click="openOrganizationImageUpload">
                    <v-avatar size="40" class="org-icon-avatar">
                      <v-img v-if="organizationImageUrl" :src="organizationImageUrl"
                        :alt="me?.organization?.name || 'Organization'" cover></v-img>
                      <v-icon v-else icon="mdi-domain" size="24" color="primary"></v-icon>
                    </v-avatar>
                    <div class="icon-overlay">
                      <v-icon icon="mdi-camera" color="white" size="16"></v-icon>
                    </div>
                  </div>
                  <span class="text-h5 font-weight-bold">Organization</span>
                </div>

                <div class="action-buttons" v-if="isSuperAdminOrAdmin()">
                  <v-tooltip :text="me.organization !== null ? 'Edit Organization' : 'Create Organization'"
                    location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn v-if="me.organization !== null" color="warning" variant="elevated" size="large"
                        @click="openEditOrganization(me.organization)" class="action-btn" prepend-icon="mdi-pencil"
                        v-bind="props">
                        <span class="d-none d-sm-inline">Edit Organization</span>
                        <span class="d-sm-none">Edit</span>
                      </v-btn>
                      &nbsp;
                      <v-btn v-else color="primary" variant="elevated" size="large" @click="openCreateOrganization()"
                        class="action-btn" prepend-icon="mdi-plus" v-bind="props">
                        <span class="d-none d-sm-inline">Create Organization</span>
                        <span class="d-sm-none">Create</span>
                      </v-btn>
                      &nbsp;
                      <v-btn v-if="me.organization !== null" color="primary" variant="elevated" size="large"
                        :href="`/org/${me.organization.domain}`" target="_blank" class="action-btn"
                        prepend-icon="mdi-eye" v-bind="props">
                        <span class="d-none d-sm-inline">See Public View</span>
                        <span class="d-sm-none">See Public View</span>
                      </v-btn>

                    </template>
                  </v-tooltip>
                </div>
              </div>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text class="pa-6">
              <div v-if="me.organization !== null">
                <v-row>
                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <div class="d-flex align-center mb-3">
                        <v-icon icon="mdi-domain" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                        <span class="info-label">Organization Name</span>
                      </div>
                      <div class="info-value">{{ me.organization.name }}</div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <div class="d-flex align-center mb-3">
                        <v-icon icon="mdi-web" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                        <span class="info-label">Domain</span>
                      </div>
                      <div class="info-value">{{ me.organization.domain }}</div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <div class="d-flex align-center mb-3">
                        <v-icon icon="mdi-email" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                        <span class="info-label">Email</span>
                      </div>
                      <div class="info-value">
                        <a :href="`mailto:${me.organization.email}`" class="text-decoration-none">
                          {{ me.organization.email }}
                        </a>
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <div class="d-flex align-center mb-3">
                        <v-icon icon="mdi-phone" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                        <span class="info-label">Phone</span>
                      </div>
                      <div class="info-value">
                        <a :href="`tel:${me.organization.phone}`" class="text-decoration-none">
                          {{ me.organization.phone }}
                        </a>
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12">
                    <div class="info-item">
                      <div class="d-flex align-center mb-3">
                        <v-icon icon="mdi-map-marker" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                        <span class="info-label">Address</span>
                      </div>
                      <div class="info-value">{{ me.organization.address }}</div>
                    </div>
                  </v-col>

                  <v-col cols="12">
                    <div class="info-item">
                      <div class="d-flex align-center mb-3">
                        <v-icon icon="mdi-text" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                        <span class="info-label">Description</span>
                      </div>
                      <div class="info-value">{{ me.organization.bio || 'No description provided' }}</div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <div class="d-flex align-center mb-3">
                        <v-icon icon="mdi-check-circle" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                        <span class="info-label">Verification Status</span>
                      </div>
                      <v-chip :color="me.organization.is_verified_label_color" variant="tonal" size="small">
                        {{ me.organization.is_verified_label }}
                      </v-chip>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <div class="d-flex align-center mb-3">
                        <v-icon icon="mdi-toggle-switch" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                        <span class="info-label">Active Status</span>
                      </div>
                      <v-chip :color="me.organization.is_active_label_color" variant="tonal" size="small">
                        {{ me.organization.is_active_label }}
                      </v-chip>
                    </div>
                  </v-col>
                </v-row>
              </div>

              <div v-else class="text-center pa-8">
                <v-icon icon="mdi-domain" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
                <h3 class="text-h6 mb-2">No Organization</h3>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  Create your organization to get started with managing your institution.
                </p>
                <v-btn v-if="isSuperAdminOrAdmin()" color="primary" variant="elevated" @click="openCreateOrganization()"
                  prepend-icon="mdi-plus">
                  Create Organization
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Roles Information Card -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card class="modern-card roles-card" elevation="4">
            <v-card-title class="card-header pa-6">
              <div class="d-flex align-center">
                <v-icon icon="mdi-account-group" size="24" class="mr-3" color="primary"></v-icon>
                <span class="text-h5 font-weight-bold">My Roles</span>
                <v-chip color="primary" variant="tonal" prepend-icon="mdi-account-group" class="ml-4">
                  {{ me.roles.length }} Role{{ me.roles.length !== 1 ? 's' : '' }}
                </v-chip>
              </div>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text class="pa-0">
              <v-data-table :headers="roleHeaders" :items="me.roles" class="modern-table roles-table"
                :mobile-breakpoint="600" hide-default-footer>
                <!-- Role Name -->
                <template v-slot:item.role_name="{ item }">
                  <div class="d-flex align-center">
                    <v-icon icon="mdi-account-tie" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                    <span class="font-weight-medium">{{ item.role_name }}</span>
                  </div>
                </template>

                <!-- Organization -->
                <template v-slot:item.org_name="{ item }">
                  <div class="d-flex align-center">
                    <v-icon icon="mdi-domain" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                    {{ item.org_name }}
                  </div>
                </template>

                <!-- Active Status -->
                <template v-slot:item.is_active_label="{ item }">
                  <v-chip :color="item.is_active_label_color" variant="tonal" size="small">
                    {{ item.is_active_label }}
                  </v-chip>
                </template>

                <!-- Confirmation Status -->
                <template v-slot:item.is_confirmed_label="{ item }">
                  <v-chip :color="item.is_confirmed_label_color" variant="tonal" size="small">
                    {{ item.is_confirmed_label }}
                  </v-chip>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Qur'an Templates Card -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card class="modern-card quran-card" elevation="4">
            <v-card-title class="card-header pa-6">
              <div class="d-flex align-center">
                <v-icon icon="mdi-book-open-page-variant" size="24" class="mr-3" color="primary"></v-icon>
                <span class="text-h5 font-weight-bold">My Qur'an Templates</span>
                <v-chip color="primary" variant="tonal" prepend-icon="mdi-book-open-page-variant" class="ml-4">
                  {{ me.qurans.length }} Template{{ me.qurans.length !== 1 ? 's' : '' }}
                </v-chip>
              </div>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text class="pa-0">
              <v-data-table :headers="quranHeaders" :items="me.qurans" class="modern-table quran-table"
                :mobile-breakpoint="600" hide-default-footer>
                <!-- Template Name -->
                <template v-slot:item.name="{ item }">
                  <div class="d-flex align-center">
                    <v-icon icon="mdi-book" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                    <span class="font-weight-medium">{{ item.name }}</span>
                  </div>
                </template>

                <!-- Description -->
                <template v-slot:item.description="{ item }">
                  <span class="text-body-2">{{ item.description || 'No description' }}</span>
                </template>

                <!-- Organization -->
                <template v-slot:item.organization_name="{ item }">
                  <div class="d-flex align-center">
                    <v-icon icon="mdi-domain" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                    {{ item.organization_name }}
                  </div>
                </template>

                <!-- No Data State -->
                <template v-slot:no-data>
                  <div class="text-center pa-8">
                    <v-icon icon="mdi-book-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
                    <h3 class="text-h6 mb-2">No Templates Found</h3>
                    <p class="text-body-2 text-medium-emphasis">
                      You haven't created any Qur'an templates yet.
                    </p>
                  </div>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Profile Dialog -->
    <v-dialog v-model="dialogProfile" width="auto" min-width="500" persistent>
      <ProfileInput :profile="profile" />
    </v-dialog>

    <!-- Organization Dialog -->
    <v-dialog v-model="dialogOrganization" width="auto" min-width="500" persistent>
      <OrganizationInput :organization="organization" />
    </v-dialog>

    <!-- Profile Image Upload Dialog -->
    <v-dialog v-model="profileImageDialog" max-width="500" persistent>
      <v-card class="image-upload-card">
        <v-card-title class="d-flex align-center pa-6">
          <v-icon icon="mdi-account-circle" class="mr-3" color="primary"></v-icon>
          <span class="text-h6 font-weight-bold">Upload Profile Picture</span>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-6">
          <!-- Current Image Preview -->
          <div class="text-center mb-6">
            <v-avatar size="120" class="current-image-preview">
              <v-img v-if="profileImagePreview || profileImageUrl" :src="profileImagePreview || profileImageUrl"
                :alt="me?.user?.name || 'Profile'" cover></v-img>
              <v-icon v-else icon="mdi-account-circle" size="80" color="grey-lighten-1"></v-icon>
            </v-avatar>
          </div>

          <!-- File Upload Area -->
          <div class="upload-area" :class="{ 'drag-over': isDragging }" @drop="handleProfileDrop"
            @dragover.prevent="isDragging = true" @dragleave="isDragging = false"
            @click="$refs.profileFileInput.click()">
            <div class="text-center pa-4">
              <v-icon icon="mdi-cloud-upload" size="48" color="primary" class="mb-2"></v-icon>
              <p class="text-h6 mb-2">Drag & drop your image here</p>
              <p class="text-body-2 text-medium-emphasis mb-2">or click to browse</p>
              <p class="text-caption text-medium-emphasis">Supported formats: JPG, PNG, GIF (Max: 5MB)</p>
            </div>
          </div>

          <!-- Hidden File Input -->
          <input ref="profileFileInput" type="file" accept="image/*" @change="handleProfileFileSelect"
            style="display: none">

          <!-- Upload Progress -->
          <div v-if="profileUploadProgress > 0 && profileUploadProgress < 100" class="mt-4">
            <v-progress-linear v-model="profileUploadProgress" color="primary" height="6" rounded></v-progress-linear>
            <p class="text-center text-caption mt-2">Uploading... {{ profileUploadProgress }}%</p>
          </div>
        </v-card-text>

        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="closeProfileImageDialog" :disabled="profileUploading">
            Cancel
          </v-btn>
          <v-btn color="primary" variant="elevated" @click="uploadProfileImage" :loading="profileUploading"
            :disabled="!selectedProfileFile">
            Upload
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Organization Image Upload Dialog -->
    <v-dialog v-model="organizationImageDialog" max-width="500" persistent>
      <v-card class="image-upload-card">
        <v-card-title class="d-flex align-center pa-6">
          <v-icon icon="mdi-domain" class="mr-3" color="primary"></v-icon>
          <span class="text-h6 font-weight-bold">Upload Organization Logo</span>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-6">
          <!-- Current Image Preview -->
          <div class="text-center mb-6">
            <v-avatar size="120" class="current-image-preview">
              <v-img v-if="organizationImagePreview || organizationImageUrl"
                :src="organizationImagePreview || organizationImageUrl" :alt="me?.organization?.name || 'Organization'"
                cover></v-img>
              <v-icon v-else icon="mdi-domain" size="80" color="grey-lighten-1"></v-icon>
            </v-avatar>
          </div>

          <!-- File Upload Area -->
          <div class="upload-area" :class="{ 'drag-over': isOrgDragging }" @drop="handleOrganizationDrop"
            @dragover.prevent="isOrgDragging = true" @dragleave="isOrgDragging = false"
            @click="$refs.organizationFileInput.click()">
            <div class="text-center pa-4">
              <v-icon icon="mdi-cloud-upload" size="48" color="primary" class="mb-2"></v-icon>
              <p class="text-h6 mb-2">Drag & drop your logo here</p>
              <p class="text-body-2 text-medium-emphasis mb-2">or click to browse</p>
              <p class="text-caption text-medium-emphasis">Supported formats: JPG, PNG, GIF (Max: 5MB)</p>
            </div>
          </div>

          <!-- Hidden File Input -->
          <input ref="organizationFileInput" type="file" accept="image/*" @change="handleOrganizationFileSelect"
            style="display: none">

          <!-- Upload Progress -->
          <div v-if="organizationUploadProgress > 0 && organizationUploadProgress < 100" class="mt-4">
            <v-progress-linear v-model="organizationUploadProgress" color="primary" height="6"
              rounded></v-progress-linear>
            <p class="text-center text-caption mt-2">Uploading... {{ organizationUploadProgress }}%</p>
          </div>
        </v-card-text>

        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="closeOrganizationImageDialog" :disabled="organizationUploading">
            Cancel
          </v-btn>
          <v-btn color="primary" variant="elevated" @click="uploadOrganizationImage" :loading="organizationUploading"
            :disabled="!selectedOrganizationFile">
            Upload
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success/Error Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<style scoped>
.header-section {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.1) 0%, rgba(var(--v-theme-secondary), 0.05) 100%);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 8px;
}

.page-title {
  color: rgb(var(--v-theme-on-surface));
  display: flex;
  align-items: center;
}

.page-subtitle {
  color: rgb(var(--v-theme-on-surface-variant));
  max-width: 600px;
}

/* Avatar Upload Styles */
.profile-avatar-section {
  position: relative;
}

.avatar-container {
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-container:hover {
  transform: scale(1.05);
}

.profile-avatar {
  border: 3px solid rgba(var(--v-theme-primary), 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

/* Icon Upload Styles */
.profile-icon-container,
.org-icon-container {
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.profile-icon-container:hover,
.org-icon-container:hover {
  transform: scale(1.1);
}

.profile-icon-avatar,
.org-icon-avatar {
  border: 2px solid rgba(var(--v-theme-primary), 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.icon-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.profile-icon-container:hover .icon-overlay,
.org-icon-container:hover .icon-overlay {
  opacity: 1;
}

/* Upload Dialog Styles */
.image-upload-card {
  border-radius: 16px;
  overflow: hidden;
}

.current-image-preview {
  border: 3px solid rgba(var(--v-theme-primary), 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.upload-area {
  border: 2px dashed rgba(var(--v-theme-primary), 0.3);
  border-radius: 12px;
  background: rgba(var(--v-theme-surface-variant), 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: rgba(var(--v-theme-primary), 0.6);
  background: rgba(var(--v-theme-primary), 0.05);
  transform: scale(1.02);
}

.upload-area.drag-over {
  border-style: solid;
  background: rgba(var(--v-theme-primary), 0.1);
}

.modern-card {
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  margin-bottom: 24px;
}

.card-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-secondary), 0.02) 100%);
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.12);
}

.action-btn {
  border-radius: 12px;
  text-transform: none;
  font-weight: 600;
  letter-spacing: normal;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.info-item {
  margin-bottom: 24px;
}

.info-label {
  font-weight: 600;
  color: grey;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
  font-size: 1rem;
  line-height: 1.5;
}

.modern-table :deep(.v-data-table__wrapper) {
  border-radius: 0;
}

.modern-table :deep(.v-data-table-header) {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-secondary), 0.02) 100%);
}

.modern-table :deep(.v-data-table-header th) {
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  border-bottom: 2px solid rgba(var(--v-theme-primary), 0.1);
}

.modern-table :deep(.v-data-table__tr:hover) {
  background: rgba(var(--v-theme-primary), 0.02);
}

/* Mobile Responsive Adjustments */
@media (max-width: 600px) {
  .header-section {
    padding: 16px;
  }

  .page-title {
    font-size: 1.5rem !important;
    flex-direction: column;
    align-items: flex-start;
  }

  .profile-avatar-section {
    margin-bottom: 16px;
    margin-right: 0 !important;
  }

  .action-buttons {
    width: 100%;
  }

  .action-btn {
    flex: 1;
  }

  .card-header {
    padding: 16px !important;
  }

  .info-item {
    margin-bottom: 16px;
  }

  .upload-area {
    margin: 8px 0;
  }
}

/* Dark mode adjustments */
.v-theme--dark .modern-card {
  background: rgba(var(--v-theme-surface), 0.95);
}

.v-theme--dark .header-section {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.15) 0%, rgba(var(--v-theme-secondary), 0.08) 100%);
}

.v-theme--dark .upload-area {
  background: rgba(var(--v-theme-surface-variant), 0.1);
}

.v-theme--dark .upload-area:hover,
.v-theme--dark .upload-area.drag-over {
  background: rgba(var(--v-theme-primary), 0.1);
}

/* Profile specific styling */
.profile-card .card-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-success), 0.05) 0%, rgba(var(--v-theme-primary), 0.02) 100%);
}

.organization-card .card-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-info), 0.05) 0%, rgba(var(--v-theme-primary), 0.02) 100%);
}

.roles-card .card-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-warning), 0.05) 0%, rgba(var(--v-theme-primary), 0.02) 100%);
}

.quran-card .card-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-secondary), 0.05) 0%, rgba(var(--v-theme-primary), 0.02) 100%);
}

/* Animation for success upload */
@keyframes pulse-success {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

.upload-success {
  animation: pulse-success 0.6s ease;
}
</style>

<script setup>
import ProfileInput from "@/components/forms/ProfileInput.vue"
import OrganizationInput from "@/components/forms/OrganizationInput.vue"
import { useUserStorage } from '@/stores/userStorage';
import { useOrganizationStorage } from '@/stores/organizationStorage';
import { storeToRefs } from 'pinia'
import { onMounted, ref, reactive, inject } from 'vue';

const reloadSidebar = inject('reloadSidebar', null)

const userStorage = useUserStorage()
const { me, dialogProfile } = storeToRefs(userStorage)
const { isSuperAdminOrAdmin } = userStorage

const organizationStorage = useOrganizationStorage()
const { dialogOrganization } = storeToRefs(organizationStorage)

// Image upload states
const profileImageDialog = ref(false)
const organizationImageDialog = ref(false)
const profileImageUrl = ref(null)
const organizationImageUrl = ref(null)
const profileImagePreview = ref(null)
const organizationImagePreview = ref(null)
const selectedProfileFile = ref(null)
const selectedOrganizationFile = ref(null)
const profileUploading = ref(false)
const organizationUploading = ref(false)
const profileUploadProgress = ref(0)
const organizationUploadProgress = ref(0)
const isDragging = ref(false)
const isOrgDragging = ref(false)

// Snackbar for notifications
const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

// Breadcrumbs
const breadcrumbsItems = [
  {
    title: 'Dashboard',
    disabled: false,
    href: '/dashboard',
  },
  {
    title: 'My Profile',
    disabled: true,
    href: '/profile',
  }
];

// Table headers
const roleHeaders = [
  {
    title: 'Role',
    align: 'start',
    key: 'role_name',
    width: '200px'
  },
  {
    title: 'Organization',
    key: 'org_name',
    width: '200px'
  },
  {
    title: 'Active Status',
    key: 'is_active_label',
    width: '150px'
  },
  {
    title: 'Confirmation Status',
    key: 'is_confirmed_label',
    width: '150px'
  },
];

const quranHeaders = [
  {
    title: 'Template Name',
    align: 'start',
    key: 'name',
    width: '200px'
  },
  {
    title: 'Description',
    key: 'description',
    width: '300px'
  },
  {
    title: 'Organization',
    key: 'organization_name',
    width: '200px'
  },
];

// Helper methods
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const openEditProfile = (profileData) => {
  dialogProfile.value = true
  profile.value = profileData
}

const openCreateProfile = () => {
  dialogProfile.value = true
}

const openEditOrganization = (organizationData) => {
  dialogOrganization.value = true
  organization.value = organizationData
}

const openCreateOrganization = () => {
  dialogOrganization.value = true
}

// Image upload methods
const openProfileImageUpload = () => {
  profileImageDialog.value = true
}

const openOrganizationImageUpload = () => {
  organizationImageDialog.value = true
}

const closeProfileImageDialog = () => {
  profileImageDialog.value = false
  selectedProfileFile.value = null
  profileImagePreview.value = null
  profileUploadProgress.value = 0
}

const closeOrganizationImageDialog = () => {
  organizationImageDialog.value = false
  selectedOrganizationFile.value = null
  organizationImagePreview.value = null
  organizationUploadProgress.value = 0
}

const handleProfileFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    validateAndPreviewFile(file, 'profile')
  }
}

const handleOrganizationFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    validateAndPreviewFile(file, 'organization')
  }
}

const handleProfileDrop = (event) => {
  event.preventDefault()
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    validateAndPreviewFile(file, 'profile')
  }
}

const handleOrganizationDrop = (event) => {
  event.preventDefault()
  isOrgDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    validateAndPreviewFile(file, 'organization')
  }
}

const validateAndPreviewFile = (file, type) => {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    showSnackbar('Please select a valid image file (JPG, PNG, or GIF)', 'error')
    return
  }

  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  if (file.size > maxSize) {
    showSnackbar('File size must be less than 5MB', 'error')
    return
  }

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    if (type === 'profile') {
      profileImagePreview.value = e.target.result
      selectedProfileFile.value = file
    } else {
      organizationImagePreview.value = e.target.result
      selectedOrganizationFile.value = file
    }
  }
  reader.readAsDataURL(file)
}

const uploadProfileImage = async () => {
  if (!selectedProfileFile.value) return

  profileUploading.value = true
  profileUploadProgress.value = 0

  try {
    // Simulate upload progress
    const interval = setInterval(() => {
      if (profileUploadProgress.value < 90) {
        profileUploadProgress.value += Math.random() * 10
      }
    }, 100)

    // Create FormData
    const formData = new FormData()
    formData.append('image', selectedProfileFile.value)
    formData.append('type', 'profile')

    const response = await userStorage.uploadProfileImage(formData)
    console.log('RESPONSE: ', response);

    await new Promise(resolve => setTimeout(resolve, 2000))

    clearInterval(interval)
    profileUploadProgress.value = 100

    // Update profile image URL
    profileImageUrl.value = profileImagePreview.value

    showSnackbar('Profile picture uploaded successfully!', 'success')
    closeProfileImageDialog()

    userStorage.dataUser()

    if (reloadSidebar) {
      reloadSidebar()
    }

  } catch (error) {
    console.error('Profile image upload failed:', error)
    showSnackbar('Failed to upload profile picture. Please try again.', 'error')
  } finally {
    profileUploading.value = false
  }
}

const uploadOrganizationImage = async () => {
  if (!selectedOrganizationFile.value) return

  organizationUploading.value = true
  organizationUploadProgress.value = 0

  try {
    // Simulate upload progress
    const interval = setInterval(() => {
      if (organizationUploadProgress.value < 90) {
        organizationUploadProgress.value += Math.random() * 10
      }
    }, 100)

    // Create FormData
    const formData = new FormData()
    formData.append('image', selectedOrganizationFile.value)
    formData.append('type', 'organization')

    const orgUUID = me.value?.organization?.uuid

    console.log('ORG: ', organization);

    formData.append('org_uuid', orgUUID);


    const response = await organizationStorage.uploadOrganizationImage(formData)
    console.log('RESPONSE: ', response);

    await new Promise(resolve => setTimeout(resolve, 2000))

    clearInterval(interval)
    organizationUploadProgress.value = 100

    // Update organization image URL
    organizationImageUrl.value = organizationImagePreview.value

    showSnackbar('Organization logo uploaded successfully!', 'success')
    closeOrganizationImageDialog()

    userStorage.dataUser()

    if (reloadSidebar) {
      reloadSidebar()
    }

  } catch (error) {
    console.error('Organization image upload failed:', error)
    showSnackbar('Failed to upload organization logo. Please try again.', 'error')
  } finally {
    organizationUploading.value = false
  }
}

const showSnackbar = (message, color = 'success') => {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
}

const profile = ref({
  uuid: null,
  firstname: null,
  lastname: null,
  birthdate: null,
  phone: null,
  bio: null,
})

const organization = ref({
  uuid: null,
  name: null,
  domain: null,
  bio: null,
  address: null,
  email: null,
  phone: null,
})

// Load existing images if available
const loadExistingImages = () => {
  if (me.value?.profile?.profile_image) {
    profileImageUrl.value = me.value.profile.profile_image_url
  }
  if (me.value?.organization?.logo_image) {
    organizationImageUrl.value = me.value.organization.logo_image_url
  }
}

if (me != null) {
  profile.value = me.profile
  organization.value = me.organization
}

onMounted(() => {
  userStorage.dataUser()
  loadExistingImages()
})
</script>
