import axios from "@/services/axios.js";

/**
 * Create a new address
 * @param {Object} data - The address data to be sent to the server
 * @returns {Promise<axios.AxiosResponse<any>>} - The server's response after the request
 */
export const createUser = (data) => {
    return axios.post(`/address`, data);
};

/**
 * Load addresses
 * @returns {Promise<axios.AxiosResponse<any>>} - The server's response containing the loaded addresses
 */
export const loadAddress = () => {
    return axios.get(`/address`);
};
