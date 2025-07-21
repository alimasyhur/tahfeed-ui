<template>
    <v-navigation-drawer :model-value="drawer" :rail="rail" permanent
        @update:model-value="emit('update:drawer', $event)" v-if="(userStorage.currentUser !== null)">
        <v-list-item prepend-avatar="/images/landing/tahfeed-semangat-hafal.png" :title="activeRole.user_name"
            @click="emit('update:rail', !props.rail)">
            <template v-slot:append>
                <v-btn icon="mdi-chevron-left" variant="text" @click.stop="emit('update:rail', !props.rail)"></v-btn>
            </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav>
            <v-list-item v-for="(menu, idx) in listMenu" :key="idx" :prepend-icon="menu.icon" :title="menu.title"
                :to="{ name: menu.toRoute }" :value="menu.toValue" />
        </v-list>

        <template v-slot:append>
            <v-list density="compact" nav>
                <v-list-item @click="logoutUser" block prepend-icon="mdi-power" class="bg-red-darken-2" color="white"
                    title="Logout" value="logout" />
            </v-list>
        </template>
    </v-navigation-drawer>
</template>

<script setup>
import { useUserStorage } from '@/stores/userStorage'
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import eventBus from '@/stores/eventBus'

const props = defineProps({
    drawer: Boolean,
    rail: Boolean,
})

const emit = defineEmits(['update:drawer', 'update:rail'])

const userStorage = useUserStorage()
const router = useRouter()

const { logoutUser, getMenu } = userStorage
const { activeRole } = storeToRefs(userStorage)

const listMenu = ref(getMenu(activeRole.value))

const updateDrawerItems = (userData) => {
    listMenu.value = userData.listMenu
    activeRole.value = userData.activeRole
}

const updateSwitchItems = (userData) => {
    listMenu.value = userData.listMenu
    activeRole.value = userData.activeRole
}

onBeforeMount(() => {
    eventBus.on('dataSwitchRole', updateSwitchItems)
})

onMounted(() => {
    eventBus.on('dataUpdated', updateDrawerItems)
})

onUnmounted(() => {
    eventBus.off('dataSwitchRole', updateSwitchItems)
    eventBus.off('dataUpdated', updateDrawerItems)
})
</script>
