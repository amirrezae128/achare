<script setup>
import { onMounted, ref, computed } from "vue";
import { useToast } from "vue-toast-notification";
import { loadAddress } from "@/services/register.js";
import { useSpinner } from "@/stores/spiner.js";

// Toast notification instance
const toast = useToast({ position: "top-right" });

// All loaded addresses
const address = ref([]);

// Computed: First 10 items only
const firstTen = computed(() => address.value.slice(0, 10));

// Spinner store instance
const spinnerStore = useSpinner();

// Load address data from API
const loadAddressApi = async () => {
  spinnerStore.startLoading();

  try {
    const { data } = await loadAddress();
    address.value = data;
  } catch (error) {
    console.error(error);
    toast.error(`هنگام بارگیری داده ها خطایی روی داد: ${error.message}`);
  } finally {
    spinnerStore.stopLoading();
  }
};

// Fetch data when component is mounted
onMounted(loadAddressApi);

</script>

<template>
  <div class="container py-5 my-5">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <h4 class="fs-5 mb-2 py-2 fw-normal">آدرس ها و مشخصات</h4>

        <template v-if="spinnerStore.isLoading">
          <div
              v-for="n in 10"
              :key="n"
              class="bg-white mb-4 shadow p-5 mt-2 rounded position-relative"
          >
            <div class="row gx-4 gy-4">
              <div class="col-md-4">
                <p class="text-muted mb-2 font-14">نام</p>
                <div class="placeholder-glow">
                  <span class="placeholder col-6 rounded"></span>
                </div>
              </div>
              <div class="col-md-4">
                <p class="text-muted mb-2 font-14">نام خانوادگی</p>
                <div class="placeholder-glow">
                  <span class="placeholder col-6 rounded"></span>
                </div>
              </div>
              <div class="col-md-4">
                <p class="text-muted mb-2 font-14">شماره تلفن همراه</p>
                <div class="placeholder-glow">
                  <span class="placeholder col-8 rounded"></span>
                </div>
              </div>
              <div class="col-md-4">
                <p class="text-muted mb-2 font-14">شماره تلفن ثابت</p>
                <div class="placeholder-glow">
                  <span class="placeholder col-7 rounded"></span>
                </div>
              </div>
              <div class="col-md-4">
                <p class="text-muted mb-2 font-14">جنسیت</p>
                <div class="placeholder-glow">
                  <span class="placeholder col-5 rounded"></span>
                </div>
              </div>
              <div class="col-md-4">
                <p class="text-muted mb-2 font-14">آدرس</p>
                <div class="placeholder-glow">
                  <span class="placeholder col-10 rounded"></span>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <main
              v-for="item in firstTen"
              :key="item.id"
              class="bg-white mb-4 shadow p-5 mt-2 rounded position-relative"
          >
            <div class="row gx-4 gy-5 align-items-center">
              <div class="col-md-4">
                <p class="text-muted mb-3 font-14">نام </p>
                <h4 class="font-16 fw-bold">{{ item.first_name }}</h4>
              </div>
              <div class="col-md-4">
                <p class="text-muted mb-3 font-14">نام خانوادگی</p>
                <h4 class="font-16 fw-bold">{{ item.last_name }}</h4>
              </div>
              <div class="col-md-4">
                <p class="text-muted mb-3 font-14">شماره تلفن همراه</p>
                <h4 class="font-16 fw-bold">{{ item.coordinate_mobile }}</h4>
              </div>
              <div class="col-md-4">
                <p class="text-muted mb-3 font-14">شماره تلفن ثابت</p>
                <h4 class="font-16 fw-bold">{{ item.coordinate_phone_number }}</h4>
              </div>
              <div class="col-md-4">
                <p class="text-muted mb-3 font-14">جنسیت</p>
                <h4 class="font-16 fw-bold">{{ item.gender }}</h4>
              </div>
              <div class="col-md-4">
                <p class="text-muted mb-3 font-14">آدرس</p>
                <h4 class="font-16 fw-bold">{{ item.address }}</h4>
              </div>
            </div>
          </main>
        </template>

      </div>
    </div>
  </div>
</template>

