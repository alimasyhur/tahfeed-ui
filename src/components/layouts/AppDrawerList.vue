<template>
    <v-navigation-drawer permanent v-if="(userStorage.currentUser !== null)">
        <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/78.jpg"
            :title="userStorage.currentUser.user.name"></v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav>
            <v-list-item v-for="(menu, idx) in menuDrawer" :key="idx" :prepend-icon="menu.icon" :title="menu.title"
                :to="{ name: menu.toRoute }" :value="menu.toValue">
            </v-list-item>
        </v-list>

        <template v-slot:append>
            <v-list density="compact" nav>
                <v-list-item @click="logoutUser" block prepend-icon="mdi-power" class="bg-red-darken-2" color="white"
                    title="Logout" value="logout"></v-list-item>
            </v-list>
        </template>
    </v-navigation-drawer>
</template>

<script>
import { useUserStorage } from '@/stores/userStorage'
import { storeToRefs } from 'pinia';
import { reactive } from 'vue';

export default {
    props: {
        key: Number,
    },
    setup(props) {
        console.log('wkwk props: ', props)
        const userStorage = useUserStorage()

        const { isSuperAdmin, isSuperAdminOrAdmin } = userStorage

        const { activeRole } = storeToRefs(userStorage)

        const { logoutUser } = userStorage

        let menuDrawerData = [
            {
                icon: 'mdi-view-dashboard',
                title: 'Dashboard',
                toRoute: 'dashboard',
                toValue: 'dashboard',
            }
        ]

        if (isSuperAdmin()) {
            const adminMenuDrawerData = [{
                icon: 'mdi-home-group',
                title: 'Organization',
                toRoute: 'organization',
                toValue: 'organization',
            },
            {
                icon: 'mdi-cog-outline',
                title: 'Role',
                toRoute: 'role',
                toValue: 'role',
            }]
            menuDrawerData = menuDrawerData.concat(adminMenuDrawerData)
        }

        if (isSuperAdminOrAdmin()) {
            const adminMenuDrawerData = [
                {
                    icon: 'mdi-account-group-outline',
                    title: 'User',
                    toRoute: 'user',
                    toValue: 'user',
                },
                {
                    icon: 'mdi-star',
                    title: 'Grade',
                    toRoute: 'grade',
                    toValue: 'grade',
                }]
            menuDrawerData = menuDrawerData.concat(adminMenuDrawerData)
        }

        menuDrawerData = menuDrawerData.concat([{
            icon: 'mdi-account',
            title: 'My Profile',
            toRoute: 'profile',
            toValue: 'profile',
        }])

        const menuDrawer = reactive(menuDrawerData)

        return {
            userStorage,
            isSuperAdmin,
            isSuperAdminOrAdmin,
            activeRole,
            menuDrawer,
            logoutUser,
        }
    }
}
</script>
