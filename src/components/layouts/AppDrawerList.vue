<template>
    <div v-if="userStorage.currentUser !== null">
        <!-- Desktop/Tablet Sidebar - Hidden on mobile -->
        <v-navigation-drawer :model-value="drawer" :rail="rail" :permanent="$vuetify.display.mdAndUp"
            :temporary="$vuetify.display.smAndDown" @update:model-value="emit('update:drawer', $event)"
            class="d-none d-md-flex modern-drawer" :width="rail ? 72 : 280">
            <!-- User Profile Header -->
            <v-list-item :prepend-avatar="profile?.profile_image_url" :title="activeRole.user_name"
                :subtitle="activeRole.role_name" @click="emit('update:rail', !props.rail)" class="user-profile-item">
                <template v-slot:append>
                    <v-btn :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'" variant="text" size="small"
                        @click.stop="emit('update:rail', !props.rail)" class="toggle-btn" />
                </template>
            </v-list-item>

            <v-divider class="mx-3 my-2"></v-divider>

            <!-- Desktop Menu Items -->
            <v-list density="compact" nav class="menu-list">
                <v-list-item v-for="(menu, idx) in listMenu" :key="idx" :prepend-icon="menu.icon" :title="menu.title"
                    :to="{ name: menu.toRoute }" :value="menu.toValue" class="menu-item" />
            </v-list>

            <!-- Logout Button at Bottom -->
            <template v-slot:append>
                <v-list density="compact" nav class="pa-2">
                    <v-list-item @click="logoutUser" prepend-icon="mdi-power" title="Logout" value="logout"
                        class="logout-item rounded-lg" color="error" />
                </v-list>
            </template>
        </v-navigation-drawer>

        <!-- Mobile Bottom Navigation - Only visible on mobile -->
        <div class="d-flex d-md-none mobile-nav-wrapper">
            <v-bottom-navigation v-model="activeTab" color="primary" grow class="mobile-bottom-nav" :height="64">
                <v-btn v-for="(menu, idx) in limitedMenu" :key="idx" :value="menu.toValue" :to="{ name: menu.toRoute }"
                    class="text-caption mobile-nav-btn">
                    <v-icon size="20">{{ menu.icon }}</v-icon>
                    <span class="mobile-nav-text">{{ menu.shortTitle || menu.title }}</span>
                </v-btn>

                <v-btn value="more" @click="showMoreMenu = true" class="text-caption mobile-nav-btn">
                    <v-icon size="20">mdi-dots-horizontal</v-icon>
                    <span class="mobile-nav-text">More</span>
                </v-btn>
            </v-bottom-navigation>
        </div>

        <!-- Mobile "More" Menu Dialog -->
        <v-dialog v-model="showMoreMenu" max-width="400" location="bottom" transition="dialog-bottom-transition"
            class="mobile-more-dialog">
            <v-card class="rounded-t-xl mobile-more-card">
                <v-card-title class="d-flex align-center justify-space-between pa-4">
                    <div class="d-flex align-center">
                        <v-avatar size="32" class="me-3">
                            <v-img :src="profile?.profile_image_url || '/images/landing/tahfeed-semangat-hafal.png'" />
                        </v-avatar>
                        <div>
                            <div class="font-weight-bold text-body-2">{{ activeRole.user_name }}</div>
                            <div class="text-caption text-grey-darken-1">{{ activeRole.role_name }}</div>
                        </div>
                    </div>
                    <v-btn icon="mdi-close" variant="text" size="small" @click="showMoreMenu = false" />
                </v-card-title>

                <v-divider></v-divider>

                <v-card-text class="pa-0">
                    <v-list density="compact" class="py-2">
                        <v-list-item v-for="(menu, idx) in additionalMenu" :key="idx" :prepend-icon="menu.icon"
                            :title="menu.title" :to="{ name: menu.toRoute }" @click="showMoreMenu = false"
                            class="mobile-more-item" />

                        <v-divider class="my-2"></v-divider>

                        <v-list-item @click="logoutUser" prepend-icon="mdi-power" title="Logout"
                            class="mobile-logout-item" />
                    </v-list>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { useUserStorage } from '@/stores/userStorage'
import { onBeforeMount, onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import eventBus from '@/stores/eventBus'

const props = defineProps({
    drawer: Boolean,
    rail: Boolean,
})

const emit = defineEmits(['update:drawer', 'update:rail'])

const userStorage = useUserStorage()
const router = useRouter()
const route = useRoute()

const { logoutUser, getMenu } = userStorage
const { activeRole, me } = storeToRefs(userStorage)

const listMenu = ref([])
const showMoreMenu = ref(false)
const activeTab = ref(null)
const profile = ref(null)

// Update active tab based on current route - PINDAH KE ATAS
const updateActiveTab = () => {
    const currentMenu = listMenu.value.find(menu => menu.toRoute === route.name)
    if (currentMenu) {
        activeTab.value = currentMenu.toValue
    }
}

// WATCH untuk memantau perubahan data user
watch(
    () => me.value,
    (newUserData) => {
        if (newUserData) {
            profile.value = newUserData.profile
            // Update menu ketika user data berubah
            if (activeRole.value) {
                listMenu.value = getMenu(activeRole.value)
            }
            updateActiveTab()
        }
    },
    { deep: true, immediate: true }
)

// Watch activeRole changes
watch(
    () => activeRole.value,
    (newRole) => {
        if (newRole) {
            listMenu.value = getMenu(newRole)
            updateActiveTab()
        }
    },
    { deep: true, immediate: true }
)

// Initialize data on component mount
onMounted(() => {
    if (activeRole.value) {
        listMenu.value = getMenu(activeRole.value)
    }
    if (me.value?.profile) {
        profile.value = me.value.profile
    }
    updateActiveTab()
})

// For bottom navigation: limit to 4 main items + more button
const limitedMenu = computed(() => {
    return listMenu.value.slice(0, 4).map(menu => ({
        ...menu,
        shortTitle: menu.title.length > 8 ? menu.title.substring(0, 6) + '...' : menu.title
    }))
})

const additionalMenu = computed(() => {
    return listMenu.value.slice(4)
})

// Close mobile menu when route changes
router.afterEach(() => {
    showMoreMenu.value = false
});


const updateDrawerItems = (userData) => {
    listMenu.value = userData.listMenu
    activeRole.value = userData.activeRole
    updateActiveTab()
}

const updateSwitchItems = (userData) => {
    listMenu.value = userData.listMenu
    activeRole.value = userData.activeRole
    updateActiveTab()
}

onBeforeMount(() => {
    eventBus.on('dataSwitchRole', updateSwitchItems)
    updateActiveTab()
})

onMounted(() => {
    eventBus.on('dataUpdated', updateDrawerItems)
    updateActiveTab()
})

onUnmounted(() => {
    eventBus.off('dataSwitchRole', updateSwitchItems)
    eventBus.off('dataUpdated', updateDrawerItems)
})
</script>

<style scoped>
/* Desktop Drawer Styling */
.modern-drawer {
    border-right: 1px solid rgba(0, 0, 0, 0.08);
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.user-profile-item {
    background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
    margin: 8px;
    border-radius: 12px;
    transition: all 0.3s ease;
}

.user-profile-item:hover {
    background: linear-gradient(135deg, #e0f2e1 0%, #e8f5e9 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.15);
}

.toggle-btn {
    transition: all 0.3s ease;
}

.toggle-btn:hover {
    background: rgba(76, 175, 80, 0.1);
    transform: rotate(180deg);
}

.menu-list {
    padding: 0 8px;
}

.menu-item {
    margin-bottom: 4px;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.menu-item:hover {
    background: rgba(76, 175, 80, 0.08);
    transform: translateX(4px);
}

.menu-item.v-list-item--active {
    background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
    color: white;
}

.menu-item.v-list-item--active:hover {
    background: linear-gradient(135deg, #43a047 0%, #5cb85c 100%);
}

.logout-item {
    background: linear-gradient(135deg, #f44336 0%, #ef5350 100%);
    color: white;
    transition: all 0.3s ease;
}

.logout-item:hover {
    background: linear-gradient(135deg, #d32f2f 0%, #e53935 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
}

/* Mobile Navigation Styling - CRITICAL FIXES */
.mobile-nav-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1005;
}

.mobile-bottom-nav {
    position: fixed !important;
    bottom: 0;
    left: 0 !important;
    /* Remove any left margin/padding */
    right: 0 !important;
    /* Remove any right margin/padding */
    width: 100% !important;
    /* Ensure full width */
    z-index: 1005;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    background: white;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
    margin: 0 !important;
    /* Remove any margin */
    padding: 0 !important;
    /* Remove any padding */
}

.mobile-nav-btn {
    min-width: 0 !important;
    flex: 1;
    height: 64px !important;
    border-radius: 0 !important;
    margin: 0 !important;
    padding: 8px 4px !important;
}

.mobile-nav-text {
    font-size: 10px;
    line-height: 1.2;
    margin-top: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 60px;
}

/* Mobile More Dialog */
.mobile-more-dialog {
    margin: 0 !important;
}

.mobile-more-card {
    margin: 0 !important;
    width: 100% !important;
    max-width: none !important;
    border-radius: 16px 16px 0 0 !important;
    max-height: 70vh;
    overflow-y: auto;
}

.mobile-more-item {
    transition: all 0.2s ease;
    margin: 2px 8px;
    border-radius: 8px;
}

.mobile-more-item:hover {
    background: rgba(76, 175, 80, 0.08);
}

.mobile-more-item.v-list-item--active {
    background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
    color: white;
}

.mobile-logout-item {
    color: #f44336;
    margin: 2px 8px;
    border-radius: 8px;
}

.mobile-logout-item:hover {
    background: rgba(244, 67, 54, 0.08);
}

/* Hide desktop drawer completely on mobile */
@media (max-width: 959px) {
    .modern-drawer {
        display: none !important;
    }

    /* Ensure main content takes full width on mobile */
    .v-main {
        --v-layout-left: 0px !important;
        margin-left: 0 !important;
        padding-left: 0 !important;
    }
}

/* Desktop responsiveness */
@media (min-width: 960px) {

    .mobile-nav-wrapper,
    .mobile-bottom-nav,
    .mobile-more-dialog {
        display: none !important;
    }
}

/* Smooth transitions */
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
    transition: transform 0.3s ease;
}

.dialog-bottom-transition-enter-from,
.dialog-bottom-transition-leave-to {
    transform: translateY(100%);
}

/* Ensure no gaps or margins on mobile */
@media (max-width: 959px) {
    .v-application {
        padding: 0 !important;
        margin: 0 !important;
    }

    .v-main {
        padding: 0 !important;
        margin: 0 !important;
    }

    .v-main__wrap {
        padding: 0 !important;
        margin: 0 !important;
    }
}
</style>