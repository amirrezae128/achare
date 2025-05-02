<script setup>
import { nextTick, ref, watch } from 'vue'
import { useToast } from 'vue-toast-notification'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useRouter } from 'vue-router'

import Spinner from '@/components/Spinner.vue'
import { useFormStore } from '@/stores/formData.js'
import { useSpinner } from '@/stores/spiner.js'
import { createUser } from '@/services/register.js'
import { useLeafletMap } from '@/composables/useLeafletMap.js'

// form and validation
const schema = yup.object({
  firstName: yup.string().required("نام الزامی است").min(3, "حداقل ۳ حرف وارد کنید"),
  lastName: yup.string().required("نام خانوادگی الزامی است").min(3, "حداقل ۳ حرف وارد کنید"),
  coordinate_mobile: yup.string().required("شماره موبایل الزامی است")
      .matches(/^09\d{9}$/, "شماره موبایل معتبر نیست (مثال: 09121234567)"),
  coordinate_phone_number: yup.string().notRequired()
      .matches(/^0\d{10}$/, "شماره تلفن ثابت باید ۱۱ رقم باشد", { excludeEmptyString: true }),
  address: yup.string().required("آدرس الزامی است").min(10, "حداقل ۱۰ حرف وارد کنید"),
  gender: yup.string().required("انتخاب جنسیت الزامی است")
})

const { handleSubmit, errors } = useForm({ validationSchema: schema })
const { value: firstName } = useField('firstName')
const { value: lastName } = useField('lastName')
const { value: coordinate_mobile } = useField('coordinate_mobile')
const { value: coordinate_phone_number } = useField('coordinate_phone_number')
const { value: address } = useField('address')
const { value: gender } = useField('gender')

// refs and stores
const lat = ref('')
const lng = ref('')
const toast = useToast({ position: 'top-left' })
const router = useRouter()
const formStore = useFormStore()
const spinnerStore = useSpinner()
const { initMap, locateUser } = useLeafletMap(lat, lng)

const getMyLocation = () => {
  locateUser()
}

const stepTwo = ref(false)
const stepComplete = ref(false)

// Submit the first stage of information and go to the map
const onSubmit = handleSubmit(formData => {
  formStore.setFormData({
    first_name: formData.firstName,
    last_name: formData.lastName,
    coordinate_mobile: formData.coordinate_mobile,
    coordinate_phone_number: formData.coordinate_phone_number,
    address: formData.address,
    gender: formData.gender
  })

  if (!stepTwo.value) {
    stepTwo.value = true
    return
  } else {
    submitDataToApi()
  }
})

// Submit the final stage of information after selecting a location
const submitDataToApi = async () => {
  if (!lat.value || !lng.value) {
    toast.error('لطفاً ابتدا موقعیت خود را روی نقشه انتخاب کنید.')
    return
  }

  formStore.setFormData({
    ...formStore.formData,
    lat: lat.value,
    lng: lng.value
  })

  try {
    spinnerStore.startLoading()
    await createUser()
    toast.success('ثبت نام شما با موفقیت انجام شد')
    stepComplete.value = true
  } catch (error) {
    toast.error('در ثبت اطلاعات خطایی پیش آمده، لطفاً دوباره امتحان کنید')
    console.error(error)
  } finally {
    spinnerStore.stopLoading()
  }
}

// Initialize the map when the second stage is activated
watch(stepTwo, (newVal) => {
  if (newVal) {
    nextTick(() => {
      initMap()
    })
  }
})

</script>

<template>


  <div class="container py-5 my-5">
    <div class="row align-content-center justify-content-center">
      <div class="col-md-10">

        <!-- start main form -->
        <div v-if="!stepTwo">
        <h4 class="fs-5 mb-2 py-2 fw-normal">ثبت آدرس</h4>
        <main class="bg-white shadow p-5 mt-2 rounded">
          <form @submit.prevent="onSubmit">
            <h4 class="fs-5 fw-bold mb-5">لطفاً مشخصات و آدرس خود را وارد کنید</h4>

            <div class="row g-4 align-items-center">
              <div class="col-md-4">
                <div class="">
                  <label for="firstName" class="form-label font-14">نام</label>
                  <input v-model="firstName" id="firstName" class="form-control py-3" placeholder="مثال: امیر" />
                  <div class="text-danger small my-2">{{ errors.firstName }}</div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="">
                  <label for="lastName" class="form-label font-14">نام خانوادگی</label>
                  <input v-model="lastName" id="lastName" class="form-control py-3" placeholder="مثال: رضایی" />
                  <div class="text-danger small my-2">{{ errors.lastName }}</div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="">
                  <label for="coordinate_mobile1" class="form-label font-14">شماره تلفن همراه</label>
                  <input v-model="coordinate_mobile" id="coordinate_mobile" class="form-control py-3" placeholder="مثال: 09121234567" />
                  <div class="text-danger small my-2">{{ errors.coordinate_mobile }}</div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="">
                  <div class="d-flex align-items-center justify-content-between">
                    <label for="coordinate_phone_number" class="form-label font-14">شماره تلفن ثابت (اختیاری)</label>
                    <span class="text-muted small">با پیش شماره *</span>
                  </div>
                  <input v-model="coordinate_phone_number" id="coordinate_phone_number" class="form-control py-3" placeholder="مثال: 02133218961" />
                  <div class="text-danger small my-2">{{ errors.coordinate_phone_number }}</div>
                </div>
              </div>
              <div class="col-md-8">
                <div class="">
                  <label for="address" class="form-label font-14">آدرس</label>
                  <textarea v-model="address" id="address" class="form-control" rows="2"
                            placeholder="مثال: تهران، خیابان ولیعصر، خیابان یوسفی، پلاک ۷"></textarea>
                  <div class="text-danger small my-2">{{ errors.address }}</div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="row gy-4">
                  <div class="col-2">
                    <label class="form-label font-14">جنسیت</label>
                  </div>
                  <div class="col-10">
                    <div class="d-flex gap-3">
                      <div>
                        <input class="form-check-input" type="radio" id="male" value="male" v-model="gender" />
                        <label for="male" class="form-check-label ms-2">آقا</label>
                      </div>
                      <div>
                        <input class="form-check-input" type="radio" id="female" value="female" v-model="gender" />
                        <label for="female" class="form-check-label ms-2">خانم</label>
                      </div>
                    </div>
                    <div class="text-danger small my-2">{{ errors.gender }}</div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </main>
        </div>
        <!-- end main form -->

        <!-- start map -->
        <div v-if="stepTwo && !stepComplete">
          <h4 class="fs-5 mb-2 py-2 fw-normal">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Symbols Light by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="m13.692 17.308l-.707-.72l4.088-4.088H5v-1h12.073l-4.088-4.088l.707-.72L19 12z"></path></svg>
            <span class="ms-2">انتخاب آدرس</span>
          </h4>
          <main class="bg-white shadow mt-2 rounded">
            <form @submit.prevent="submitDataToApi">
              <div class="bg-white rounded">
                <header class="title-map" style="z-index: 1001">
                  <h3 class="font-12 fw-bold mt-2 text-start">
                    موقعیت مورد نظر خود را روی نقشه مشخص کنید
                  </h3>
                </header>
              </div>


              <div id="map" style="height: 400px;" class="position-relative">
                <div class="position-absolute bottom-0 m-2 mb-4" style="z-index: 1000;">
                  <button @click.prevent="getMyLocation" class="btn-aim" style="z-index: 2000;">
                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.9999 26.9168C22.4767 26.9168 26.9166 22.477 26.9166 17.0002C26.9166 11.5233 22.4767 7.0835 16.9999 7.0835C11.5231 7.0835 7.08325 11.5233 7.08325 17.0002C7.08325 22.477 11.5231 26.9168 16.9999 26.9168Z" stroke="#37474F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M17.0001 19.8332C18.5649 19.8332 19.8334 18.5646 19.8334 16.9998C19.8334 15.435 18.5649 14.1665 17.0001 14.1665C15.4353 14.1665 14.1667 15.435 14.1667 16.9998C14.1667 18.5646 15.4353 19.8332 17.0001 19.8332Z" fill="#37474F" stroke="#37474F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M17 29.7502V24.0835" stroke="#37474F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M17 4.25V9.91667" stroke="#37474F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M9.91667 17H4.25" stroke="#37474F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M29.7499 17H24.0833" stroke="#37474F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>

                  </button>
                </div>
              </div>
            </form>
          </main>
        </div>
        <!-- end map -->

        <!-- start success message -->

        <div v-if="stepComplete" class="text-center">
          <div class="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 24 24"><path fill="#323232" d="m10.562 15.908l6.396-6.396l-.708-.708l-5.688 5.688l-2.85-2.85l-.708.708zM12.003 21q-1.866 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709M12 20q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"/></svg>
            <h5 class="font-14 fw-bold mt-2">اطلاعات شما با موفقیت ثبت شد</h5>
            <router-link :to="{'name' : 'home'}" class="btn-action-outline mt-5 font-16">مشاهده اطلاعات</router-link>
          </div>
        </div>

        <!-- end success message -->

      </div>
    </div>
  </div>

  <div v-if="!stepComplete" class="mt-4 position-sticky bottom-0 bg-white py-3 text-center" style="z-index: 1000;">
    <button @click="onSubmit" type="submit" class="btn bg-custom-primary btn-action text-white mx-auto py-3">
      <span v-if="!spinnerStore.isLoading">ثبت و ادامه</span>
      <Spinner v-else />
    </button>
  </div>

</template>
