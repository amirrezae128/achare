<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toast-notification'
import logo from '@/assets/images/logo.png'
import { useFormStore } from '@/stores/formData.js'
import { createUser } from '@/services/register.js'
import { useLeafletMap } from '@/composables/useLeafletMap.js'

const formStore = useFormStore()
const formData = formStore.formData

const lat = ref('')
const lng = ref('')
const toast = useToast({ position: 'top-left' })
import {useSpinner} from "@/stores/spiner.js";
import Spinner from "@/components/Spinner.vue";
import {useRouter} from "vue-router";

const spinnerStore = useSpinner()
const router = useRouter()

const { locateUser } = useLeafletMap(lat, lng)

const submitDataToApi = async () => {
  if (!lat.value || !lng.value) {
    toast.error('لطفاً ابتدا موقعیت خود را روی نقشه انتخاب کنید.')
    return
  }

  formStore.setFormData({
    ...formData,
    lat: lat.value,
    lng: lng.value
  })

  try {
    spinnerStore.startLoading()
    await createUser()
    toast.success('ثبت نام شما با موفقیت انجام شد')
    router.push({
      name : 'home'
    })
  } catch (error) {
    toast.error('در ثبت اطلاعات خطایی پیش آمده، لطفاً دوباره امتحان کنید')
    console.error(error)
  }finally {
    spinnerStore.stopLoading()
  }
}
</script>

<template>
  <header class="d-flex align-items-center flex-row-reverse justify-content-between px-3 py-2">
    <figure class="m-0">
      <img :src="logo" alt="لوگو" style="max-height: 40px;" />
    </figure>
    <h2 class="fs-5 fw-bold text-center mb-0">ثبت آدرس</h2>
    <div class="text-end">
      <a href="#" class="color-primary fs-6 text-decoration-none">مشاهده آدرس‌ها</a>
    </div>
  </header>

  <section class="">
    <main class="bg-white shadow mt-2 rounded">
      <form @submit.prevent="submitDataToApi">
        <div style="padding: 0 11px;background: rgb(10 10 10 / 6%)">
          <header class="row py-1" style="z-index: 1001">
            <div class="col-4">
              <router-link class="text-dark" :to="{'name' : 'form'}">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Symbols Light by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="m13.692 17.308l-.707-.72l4.088-4.088H5v-1h12.073l-4.088-4.088l.707-.72L19 12z"/></svg>
              </router-link>
            </div>
            <div class="col-8">
              <h3 class="fs-6 fw-bold mt-2 text-start">انتخاب موقعیت</h3>
            </div>
          </header>
        </div>


        <div id="map" style="height: 400px;" class="position-relative">
          <div class="position-sticky bottom-0 m-2" style="z-index: 1000;">
            <button @click.prevent="getMyLocation" class="btn btn-light">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 1024 1024"><!-- Icon from Ant Design Icons by HeskeyBaozi - https://github.com/ant-design/ant-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M952 474H829.8C812.5 327.6 696.4 211.5 550 194.2V72c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v122.2C327.6 211.5 211.5 327.6 194.2 474H72c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h122.2C211.5 696.4 327.6 812.5 474 829.8V952c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V829.8C696.4 812.5 812.5 696.4 829.8 550H952c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8M512 756c-134.8 0-244-109.2-244-244s109.2-244 244-244s244 109.2 244 244s-109.2 244-244 244"/><path fill="currentColor" d="M512 392c-32.1 0-62.1 12.4-84.8 35.2c-22.7 22.7-35.2 52.7-35.2 84.8s12.5 62.1 35.2 84.8C449.9 619.4 480 632 512 632s62.1-12.5 84.8-35.2C619.4 574.1 632 544 632 512s-12.5-62.1-35.2-84.8C574.1 404.4 544.1 392 512 392"/></svg>
            </button>
          </div>
        </div>

        <div class="mt-4 position-sticky bottom-0 p-3 pt-0 bg-white" style="z-index: 1000;">
          <button type="submit" class="btn bg-custom-primary text-white w-100 py-3">
            <span v-if="!spinnerStore.isLoading">ثبت و ادامه</span>
            <Spinner v-else />
          </button>
        </div>

      </form>
    </main>
  </section>
</template>
