<script setup>
import { RouterView } from 'vue-router'
import logo from "@/assets/images/logo.png"
</script>

<template>
  <header class="bg-white shadow-sm py-3">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-4">
          <img :src="logo" class="logo" alt="">
        </div>
        <div class="col-8">
          <div class="d-flex align-items-center justify-content-end">
            <router-link :to="{'name': 'form'}" class="font-14 fw-bold text-center text-decoration-none text-dark app-title letter-spacing-px ">ثبت آدرس</router-link>
            <router-link :to="{'name': 'home'}" class="font-14 fw-bold text-dark text-decoration-none color-primary letter-spacing-px">مشاهده آدرس‌ها</router-link>
          </div>
        </div>
      </div>
    </div>
  </header>


  <RouterView />
</template>
