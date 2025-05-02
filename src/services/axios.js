import axios from "axios";

// Create an Axios instance with custom configuration
const instance = axios.create({
    // Base URL for API requests
    baseURL: "https://stage.achareh.ir/api/karfarmas",

    // Custom headers for the requests
    headers: {
        // The content type is set to JSON
        "Content-Type": "application/json",

        // Authorization header with Basic authentication token
        "Authorization": "Basic MDk4MjIyMjIyMjI6U2FuYTEyMzQ1Njc4"
    },
});

// Export the axios instance to use it in other parts of the app
export default instance;
