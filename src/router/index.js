import { createRouter, createWebHistory } from 'vue-router';
import FormView from "@/views/FormView.vue";
import MapView from "@/views/MapView.vue";
import HomeView from "@/views/HomeView.vue";

// Create and configure the router
const router = createRouter({
  // Set up history mode using the web history API
  history: createWebHistory(import.meta.env.BASE_URL),

  // Define the routes for the application
  routes: [
    {
      path: '/',               // Path for the home page
      name: 'home',             // Route name for easy reference
      component: HomeView,      // Component to be rendered for this route
    },
    {
      path: '/form',            // Path for the form page
      name: 'form',             // Route name for easy reference
      component: FormView,      // Component to be rendered for this route
    },
    {
      path: '/map',             // Path for the map page
      name: 'map',              // Route name for easy reference
      component: MapView,       // Component to be rendered for this route
    }
  ],
});

// Export the router instance for use in the app
export default router;
