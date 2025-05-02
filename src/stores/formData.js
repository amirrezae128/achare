import { defineStore } from 'pinia'

/**
 * Pinia store for managing form data.
 */
export const useFormStore = defineStore('form', {
    // State definition
    state: () => ({
        // The structure of form data with initial empty values
        formData: {
            first_name: '',
            last_name: '',
            coordinate_mobile: '',
            coordinate_phone_number: '',
            address: '',
            gender: '',
            lat: '',
            lng: ''
        }
    }),

    // Actions for mutating state
    actions: {
        /**
         * Set the form data.
         * @param {Object} data - The form data to set.
         */
        setFormData(data) {
            // Update the form data by merging the current data with the new one
            this.formData = { ...data }
        }
    }
})
