<template>
  <v-container fluid class="pa-4">
    <!-- Header Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="header-section">
          <div class="d-flex flex-column flex-md-row align-center justify-space-between">
            <div class="page-title-section mb-4 mb-md-0">
              <h1 class="page-title text-h4 font-weight-bold mb-2">
                <v-icon icon="mdi-view-dashboard" class="mr-3" color="primary"></v-icon>
                Tahfeedz Dashboard
              </h1>
              <p class="page-subtitle text-body-1 text-medium-emphasis">
                Monitor organizations across Indonesia
              </p>
            </div>

            <!-- Stats Summary -->
            <div class="stats-summary d-flex gap-4">
              <div class="stat-item text-center">
                <div class="text-h4 font-weight-bold text-primary">{{ totalOrganizations }}</div>
                <div class="text-caption text-medium-emphasis">Total Orgs</div>
              </div>
              <div class="stat-item text-center">
                <div class="text-h4 font-weight-bold text-success">{{ activeOrganizations }}</div>
                <div class="text-caption text-medium-emphasis">Active</div>
              </div>
              <div class="stat-item text-center">
                <div class="text-h4 font-weight-bold text-info">{{ verifiedOrganizations }}</div>
                <div class="text-caption text-medium-emphasis">Verified</div>
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Quick Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" elevation="4" color="primary" variant="elevated">
          <v-card-text class="pa-6 text-center">
            <v-icon icon="mdi-domain" size="48" class="mb-3" color="white"></v-icon>
            <div class="text-h3 font-weight-bold text-white mb-2">{{ totalOrganizations }}</div>
            <div class="text-subtitle-1 text-white opacity-80">Total Organizations</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" elevation="4" color="success" variant="elevated">
          <v-card-text class="pa-6 text-center">
            <v-icon icon="mdi-check-circle" size="48" class="mb-3" color="white"></v-icon>
            <div class="text-h3 font-weight-bold text-white mb-2">{{ activeOrganizations }}</div>
            <div class="text-subtitle-1 text-white opacity-80">Active Organizations</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" elevation="4" color="info" variant="elevated">
          <v-card-text class="pa-6 text-center">
            <v-icon icon="mdi-shield-check" size="48" class="mb-3" color="white"></v-icon>
            <div class="text-h3 font-weight-bold text-white mb-2">{{ verifiedOrganizations }}</div>
            <div class="text-subtitle-1 text-white opacity-80">Verified Organizations</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" elevation="4" color="warning" variant="elevated">
          <v-card-text class="pa-6 text-center">
            <v-icon icon="mdi-clock-outline" size="48" class="mb-3" color="white"></v-icon>
            <div class="text-h3 font-weight-bold text-white mb-2">{{ pendingOrganizations }}</div>
            <div class="text-subtitle-1 text-white opacity-80">Pending Verification</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Map and Details Section -->
    <v-row>
      <!-- Map Card -->
      <v-col cols="12" lg="8">
        <v-card class="map-card" elevation="4">
          <v-card-title class="card-header pa-6">
            <div class="d-flex align-center justify-space-between w-100">
              <div class="d-flex align-center">
                <v-icon icon="mdi-map" size="24" class="mr-3" color="primary"></v-icon>
                <span class="text-h6 font-weight-bold">Organizations Map</span>
              </div>

              <!-- Map Controls -->
              <div class="d-flex gap-2">
                <v-btn-toggle v-model="mapView" color="primary" variant="outlined" density="comfortable">
                  <v-btn icon="mdi-satellite" value="satellite" size="small">
                    <v-icon>mdi-satellite</v-icon>
                    <v-tooltip activator="parent" location="bottom">Satellite View</v-tooltip>
                  </v-btn>
                  <v-btn icon="mdi-map-outline" value="street" size="small">
                    <v-icon>mdi-map-outline</v-icon>
                    <v-tooltip activator="parent" location="bottom">Street View</v-tooltip>
                  </v-btn>
                </v-btn-toggle>

                <v-btn @click="centerToIndonesia" icon="mdi-crosshairs-gps" size="small" variant="outlined">
                  <v-icon>mdi-crosshairs-gps</v-icon>
                  <v-tooltip activator="parent" location="bottom">Center to Indonesia</v-tooltip>
                </v-btn>
              </div>
            </div>
          </v-card-title>

          <v-divider></v-divider>

          <!-- Map Container -->
          <div class="map-container" :style="{ height: mapHeight + 'px' }">
            <div ref="mapContainer" class="map-element"></div>

            <!-- Loading Overlay -->
            <div v-if="mapLoading" class="map-loading">
              <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
              <div class="text-h6 mt-4">Loading map...</div>
            </div>
          </div>

          <!-- Map Legend -->
          <v-card-text class="pa-4">
            <div class="map-legend d-flex flex-wrap gap-4">
              <div class="legend-item d-flex align-center">
                <div class="legend-marker active mr-2"></div>
                <span class="text-body-2">Active & Verified</span>
              </div>
              <div class="legend-item d-flex align-center">
                <div class="legend-marker verified mr-2"></div>
                <span class="text-body-2">Verified Only</span>
              </div>
              <div class="legend-item d-flex align-center">
                <div class="legend-marker pending mr-2"></div>
                <span class="text-body-2">Pending Verification</span>
              </div>
              <div class="legend-item d-flex align-center">
                <div class="legend-marker inactive mr-2"></div>
                <span class="text-body-2">Inactive</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Organization Details -->
      <v-col cols="12" lg="4">
        <v-card class="details-card" elevation="4">
          <v-card-title class="card-header pa-6">
            <div class="d-flex align-center">
              <v-icon icon="mdi-information" size="24" class="mr-3" color="secondary"></v-icon>
              <span class="text-h6 font-weight-bold">Organization Details</span>
            </div>
          </v-card-title>

          <v-divider></v-divider>

          <div class="details-content" :style="{ height: (mapHeight - 60) + 'px', overflowY: 'auto' }">
            <!-- Selected Organization Info -->
            <div v-if="selectedOrganization" class="pa-6">
              <div class="selected-org-info">
                <div class="d-flex align-center mb-4">
                  <v-avatar size="48" :color="getOrgStatusColor(selectedOrganization)" class="mr-3">
                    <v-icon icon="mdi-domain" color="white"></v-icon>
                  </v-avatar>
                  <div>
                    <h3 class="text-h6 font-weight-bold">{{ selectedOrganization.name }}</h3>
                    <div class="d-flex gap-2">
                      <v-chip :color="selectedOrganization.is_active ? 'success' : 'error'" size="x-small"
                        variant="tonal">
                        {{ selectedOrganization.is_active ? 'Active' : 'Inactive' }}
                      </v-chip>
                      <v-chip :color="selectedOrganization.is_verified ? 'info' : 'warning'" size="x-small"
                        variant="tonal">
                        {{ selectedOrganization.is_verified ? 'Verified' : 'Pending' }}
                      </v-chip>
                    </div>
                  </div>
                </div>

                <div class="org-details">
                  <div class="detail-item mb-3">
                    <div class="text-caption font-weight-medium text-medium-emphasis mb-1">DOMAIN</div>
                    <div class="text-body-2">{{ selectedOrganization.domain }}</div>
                  </div>

                  <div class="detail-item mb-3">
                    <div class="text-caption font-weight-medium text-medium-emphasis mb-1">EMAIL</div>
                    <div class="text-body-2">{{ selectedOrganization.email }}</div>
                  </div>

                  <div class="detail-item mb-3">
                    <div class="text-caption font-weight-medium text-medium-emphasis mb-1">PHONE</div>
                    <div class="text-body-2">{{ selectedOrganization.phone }}</div>
                  </div>

                  <div class="detail-item mb-3">
                    <div class="text-caption font-weight-medium text-medium-emphasis mb-1">ADDRESS</div>
                    <div class="text-body-2">{{ selectedOrganization.address }}</div>
                  </div>

                  <div class="detail-item mb-3">
                    <div class="text-caption font-weight-medium text-medium-emphasis mb-1">DESCRIPTION</div>
                    <div class="text-body-2">{{ selectedOrganization.bio }}</div>
                  </div>

                  <div class="detail-item">
                    <div class="text-caption font-weight-medium text-medium-emphasis mb-1">CREATED</div>
                    <div class="text-body-2">{{ formatDate(selectedOrganization.created_at) }}</div>
                  </div>
                </div>

                <v-divider class="my-4"></v-divider>

                <div class="action-buttons">
                  <v-btn color="primary" variant="elevated" block class="mb-2">
                    <v-icon icon="mdi-eye" class="mr-2"></v-icon>
                    View Details
                  </v-btn>
                  <v-btn color="secondary" variant="outlined" block>
                    <v-icon icon="mdi-message" class="mr-2"></v-icon>
                    Contact
                  </v-btn>
                </div>
              </div>
            </div>

            <!-- Organization List -->
            <div v-else class="pa-6">
              <div class="text-center mb-4">
                <v-icon icon="mdi-map-marker" size="48" color="grey-lighten-1"></v-icon>
                <h4 class="text-h6 mt-2 mb-2">Select Organization</h4>
                <p class="text-body-2 text-medium-emphasis">Click on a marker to view details</p>
              </div>

              <v-divider class="mb-4"></v-divider>

              <div class="org-list">
                <h4 class="text-subtitle-1 font-weight-bold mb-3">Recent Organizations</h4>
                <div v-for="org in recentOrganizations" :key="org.uuid"
                  class="org-list-item pa-3 mb-2 rounded cursor-pointer" @click="selectOrganization(org)">
                  <div class="d-flex align-center">
                    <v-avatar size="32" :color="getOrgStatusColor(org)" class="mr-3">
                      <v-icon icon="mdi-domain" color="white" size="small"></v-icon>
                    </v-avatar>
                    <div class="flex-grow-1">
                      <div class="text-body-2 font-weight-medium">{{ org.name }}</div>
                      <div class="text-caption text-medium-emphasis">{{ org.address }}</div>
                    </div>
                    <v-chip :color="org.is_active && org.is_verified ? 'success' : 'warning'" size="x-small"
                      variant="dot"></v-chip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
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

.stats-summary {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 16px 24px;
}

.stat-item {
  min-width: 80px;
}

.stat-card {
  border-radius: 16px;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, var(--v-theme-primary) 0%, rgba(var(--v-theme-primary), 0.8) 100%);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.map-card,
.details-card {
  border-radius: 16px;
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-secondary), 0.02) 100%);
}

.map-container {
  position: relative;
  overflow: hidden;
}

.map-element {
  width: 100%;
  height: 100%;
  border-radius: 0;
}

.map-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.map-legend {
  background: rgba(var(--v-theme-surface-variant), 0.05);
  border-radius: 8px;
  padding: 8px;
}

.legend-marker {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.legend-marker.active {
  background: #4CAF50;
}

.legend-marker.verified {
  background: #2196F3;
}

.legend-marker.pending {
  background: #FF9800;
}

.legend-marker.inactive {
  background: #9E9E9E;
}

.details-content {
  background: rgba(var(--v-theme-surface), 0.02);
}

.selected-org-info {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.detail-item {
  border-left: 3px solid rgba(var(--v-theme-primary), 0.1);
  padding-left: 12px;
}

.org-list-item {
  background: rgba(var(--v-theme-surface-variant), 0.03);
  border: 1px solid rgba(var(--v-theme-outline), 0.08);
  transition: all 0.2s ease;
}

.org-list-item:hover {
  background: rgba(var(--v-theme-primary), 0.05);
  border-color: rgba(var(--v-theme-primary), 0.2);
  transform: translateX(4px);
}

/* Mobile responsive */
@media (max-width: 600px) {
  .header-section {
    padding: 16px;
  }

  .page-title {
    font-size: 1.5rem !important;
  }

  .stats-summary {
    flex-direction: column;
    gap: 8px !important;
  }

  .stat-item {
    min-width: auto;
  }
}

/* Dark theme adjustments */
.v-theme--dark .stats-summary {
  background: rgba(var(--v-theme-surface), 0.8);
}

.v-theme--dark .selected-org-info {
  background: rgba(var(--v-theme-surface), 0.95);
}

.v-theme--dark .org-list-item {
  background: rgba(var(--v-theme-surface-variant), 0.08);
}

.v-theme--dark .org-list-item:hover {
  background: rgba(var(--v-theme-primary), 0.1);
}
</style>

<script>
import { ref, reactive, onMounted, nextTick, computed } from 'vue';
import moment from 'moment';

export default {
  name: 'DashboardView',

  setup() {
    // Reactive state
    const mapContainer = ref(null);
    const map = ref(null);
    const mapLoading = ref(true);
    const mapView = ref('street');
    const mapHeight = ref(500);
    const selectedOrganization = ref(null);

    // Mock data - replace with actual API calls
    const organizations = ref([
      {
        uuid: '1',
        name: 'Tahfidz Al-Ikhlas Jakarta',
        domain: 'tahfidzjakarta.com',
        bio: 'Lembaga tahfidz terpercaya di Jakarta',
        address: 'Jl. Sudirman No. 123, Jakarta Pusat',
        email: 'info@tahfidzjakarta.com',
        phone: '+62 21 1234567',
        is_verified: 1,
        is_active: 1,
        created_at: '2024-01-15T10:00:00Z',
        lat: -6.2088,
        lng: 106.8456
      },
      {
        uuid: '2',
        name: 'Pesantren Tahfidz Surabaya',
        domain: 'tahfidzsby.com',
        bio: 'Pesantren modern dengan fokus tahfidz',
        address: 'Jl. Ahmad Yani No. 456, Surabaya',
        email: 'admin@tahfidzsby.com',
        phone: '+62 31 2345678',
        is_verified: 1,
        is_active: 1,
        created_at: '2024-02-10T14:30:00Z',
        lat: -7.2575,
        lng: 112.7521
      },
      {
        uuid: '3',
        name: 'Tahfidz Center Bandung',
        domain: 'tahfidzbandung.org',
        bio: 'Pusat tahfidz terbaik di Bandung',
        address: 'Jl. Dago No. 789, Bandung',
        email: 'contact@tahfidzbandung.org',
        phone: '+62 22 3456789',
        is_verified: 0,
        is_active: 1,
        created_at: '2024-03-05T09:15:00Z',
        lat: -6.9175,
        lng: 107.6191
      },
      {
        uuid: '4',
        name: 'Al-Quran Institute Medan',
        domain: 'quranmedan.ac.id',
        bio: 'Institut Al-Quran dan tahfidz',
        address: 'Jl. Gatot Subroto No. 321, Medan',
        email: 'info@quranmedan.ac.id',
        phone: '+62 61 4567890',
        is_verified: 1,
        is_active: 0,
        created_at: '2024-01-20T16:45:00Z',
        lat: 3.5952,
        lng: 98.6722
      },
      {
        uuid: '5',
        name: 'Tahfidz Baitul Hikmah Makassar',
        domain: 'baitulhikmah-mks.org',
        bio: 'Lembaga tahfidz islami',
        address: 'Jl. AP Pettarani No. 654, Makassar',
        email: 'admin@baitulhikmah-mks.org',
        phone: '+62 411 5678901',
        is_verified: 1,
        is_active: 1,
        created_at: '2024-02-28T11:20:00Z',
        lat: -5.1477,
        lng: 119.4327
      }
    ]);

    // Computed properties
    const totalOrganizations = computed(() => organizations.value.length);
    const activeOrganizations = computed(() =>
      organizations.value.filter(org => org.is_active === 1).length
    );
    const verifiedOrganizations = computed(() =>
      organizations.value.filter(org => org.is_verified === 1).length
    );
    const pendingOrganizations = computed(() =>
      organizations.value.filter(org => org.is_verified === 0).length
    );
    const recentOrganizations = computed(() =>
      organizations.value
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
    );

    // Methods
    const initializeMap = async () => {
      mapLoading.value = true;

      try {
        // Wait for next tick to ensure DOM is ready
        await nextTick();

        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Initialize Leaflet map
        const L = window.L;
        if (!L) {
          console.error('Leaflet not loaded');
          return;
        }

        map.value = L.map(mapContainer.value).setView([-2.5, 118.0], 5);

        // Add tile layer based on view type
        updateMapLayer();

        // Add organization markers
        addOrganizationMarkers();

        mapLoading.value = false;
      } catch (error) {
        console.error('Error initializing map:', error);
        mapLoading.value = false;
      }
    };

    const updateMapLayer = () => {
      if (!map.value) return;

      const L = window.L;

      // Remove existing layers
      map.value.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          map.value.removeLayer(layer);
        }
      });

      // Add appropriate tile layer
      let tileLayer;
      if (mapView.value === 'satellite') {
        tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
          maxZoom: 18
        });
      } else {
        tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 18
        });
      }

      tileLayer.addTo(map.value);
    };

    const addOrganizationMarkers = () => {
      if (!map.value) return;

      const L = window.L;

      organizations.value.forEach(org => {
        const color = getOrgMarkerColor(org);

        // Create custom marker
        const marker = L.circleMarker([org.lat, org.lng], {
          radius: 10,
          fillColor: color,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        });

        // Create popup content
        const popupContent = `
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${org.name}</h3>
            <p style="margin: 4px 0; font-size: 12px; color: #666;">${org.address}</p>
            <div style="margin: 8px 0; display: flex; gap: 4px;">
              <span style="background: ${org.is_active ? '#4CAF50' : '#9E9E9E'}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">
                ${org.is_active ? 'Active' : 'Inactive'}
              </span>
              <span style="background: ${org.is_verified ? '#2196F3' : '#FF9800'}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">
                ${org.is_verified ? 'Verified' : 'Pending'}
              </span>
            </div>
            <button onclick="window.selectOrgFromMap('${org.uuid}')" style="background: #1976d2; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">
              View Details
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.addTo(map.value);

        // Add click event
        marker.on('click', () => {
          selectOrganization(org);
        });
      });
    };

    const getOrgMarkerColor = (org) => {
      if (org.is_active && org.is_verified) return '#4CAF50'; // Green
      if (org.is_verified) return '#2196F3'; // Blue
      if (!org.is_verified) return '#FF9800'; // Orange
      return '#9E9E9E'; // Gray
    };

    const getOrgStatusColor = (org) => {
      if (org.is_active && org.is_verified) return 'success';
      if (org.is_verified) return 'info';
      if (!org.is_verified) return 'warning';
      return 'grey';
    };

    const centerToIndonesia = () => {
      if (map.value) {
        map.value.setView([-2.5, 118.0], 5);
      }
    };

    const selectOrganization = (org) => {
      selectedOrganization.value = org;
      if (map.value) {
        map.value.setView([org.lat, org.lng], 12);
      }
    };

    const formatDate = (date) => {
      return moment(date).format('DD MMM YYYY');
    };

    // Load Leaflet CSS and JS
    const loadLeaflet = () => {
      return new Promise((resolve, reject) => {
        if (window.L) {
          resolve();
          return;
        }

        // Load CSS
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
        document.head.appendChild(cssLink);

        // Load JS
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    // Watch for map view changes
    const watchMapView = () => {
      if (mapView.value !== watchMapView.previousValue) {
        updateMapLayer();
        watchMapView.previousValue = mapView.value;
      }
    };

    // Global function for popup buttons
    window.selectOrgFromMap = (uuid) => {
      const org = organizations.value.find(o => o.uuid === uuid);
      if (org) {
        selectOrganization(org);
      }
    };

    // Lifecycle hooks
    onMounted(async () => {
      try {
        await loadLeaflet();
        await initializeMap();

        // Set responsive map height
        const updateMapHeight = () => {
          const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
          mapHeight.value = Math.min(500, vh * 0.6);
        };

        updateMapHeight();
        window.addEventListener('resize', updateMapHeight);

        // Watch map view changes
        const watchMapViewRef = () => {
          watchMapView();
        };

        // Set up watcher for mapView
        const unwatchMapView = (() => {
          let prev = mapView.value;
          const check = () => {
            if (mapView.value !== prev) {
              updateMapLayer();
              prev = mapView.value;
            }
            requestAnimationFrame(check);
          };
          check();
        })();

      } catch (error) {
        console.error('Failed to initialize dashboard:', error);
        mapLoading.value = false;
      }
    });

    // Return reactive data and methods
    return {
      // Refs
      mapContainer,
      mapLoading,
      mapView,
      mapHeight,
      selectedOrganization,
      organizations,

      // Computed
      totalOrganizations,
      activeOrganizations,
      verifiedOrganizations,
      pendingOrganizations,
      recentOrganizations,

      // Methods
      centerToIndonesia,
      selectOrganization,
      getOrgStatusColor,
      formatDate,
      updateMapLayer: watchMapView
    };
  }
};
</script>
