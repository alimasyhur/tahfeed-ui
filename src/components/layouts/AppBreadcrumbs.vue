<template>
    {{ breadcrumbItems }}
    <v-breadcrumbs :items="breadcrumbItems"></v-breadcrumbs>
</template>

<script>
export default {
    computed: {
        breadcrumbItems() {
            const matchedRoutes = this.$route.matched;
            return matchedRoutes.map((route, index) => ({
                title: route.meta.breadcrumb || (index === matchedRoutes.length - 1 ? this.getDynamicParamValue(route) : ''),
                disabled: !!route.meta.breadcrumb,
                href: route.path,
            }));
        },
    },
    methods: {
        getDynamicParamValue(route) {
            const dynamicParam = Object.keys(route.params)[0];
            return dynamicParam ? route.params[dynamicParam] : '';
        },
    }
};
</script>