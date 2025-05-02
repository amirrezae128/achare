import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSpinner = defineStore('spinner', () => {
    const isLoading = ref(false)

    const startLoading = () => {
        isLoading.value = true
    }

    const stopLoading = () => {
        isLoading.value = false
    }

    const toggleLoading = () => {
        isLoading.value = !isLoading.value
    }

    return {
        isLoading,
        startLoading,
        stopLoading,
        toggleLoading
    }
})
