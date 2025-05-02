import { ref } from 'vue'
import L from 'leaflet'

/**
 * Custom hook for managing Leaflet map in Vue.
 * @param {Ref} latRef - A reference to store the latitude of the marker.
 * @param {Ref} lngRef - A reference to store the longitude of the marker.
 */
export function useLeafletMap(latRef, lngRef) {
    // Reactive variables to hold the map and marker instances
    const map = ref(null)
    const marker = ref(null)

    /**
     * Initialize the map and set up event listeners.
     */
    const initMap = () => {
        // Create the map and set its initial view (coordinates and zoom level)
        map.value = L.map('map').setView([35.6892, 51.3890], 13) // Default coordinates set to Tehran

        // Add tile layer to the map (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map.value)

        // Event listener for when the map is clicked
        map.value.on('click', (e) => {
            latRef.value = e.latlng.lat   // Update latitude
            lngRef.value = e.latlng.lng   // Update longitude
            setMarker(e.latlng)          // Place a marker at the clicked location
        })

        // Event listener for when the user's location is found
        map.value.on('locationfound', (e) => {
            latRef.value = e.latlng.lat   // Update latitude
            lngRef.value = e.latlng.lng   // Update longitude
            setMarker(e.latlng)          // Place a marker at the user's location
        })

        // Request the user's location and center the map
        map.value.locate({ setView: true, maxZoom: 16 })
    }

    /**
     * Set a marker at a given latitude and longitude.
     * @param {L.LatLng} latlng - The latitude and longitude to place the marker at.
     */
    const setMarker = (latlng) => {
        // Remove the previous marker if it exists
        if (marker.value) {
            map.value.removeLayer(marker.value)
        }

        // Create a new marker and add it to the map
        marker.value = L.marker(latlng).addTo(map.value)
    }

    /**
     * Locate the user's position and center the map.
     */
    const locateUser = () => {
        if (map.value) {
            map.value.locate({ setView: true, maxZoom: 16 })  // Locate and zoom in to the user's position
        }
    }

    // Return the functions to be used in the component
    return {
        initMap,
        locateUser
    }
}
