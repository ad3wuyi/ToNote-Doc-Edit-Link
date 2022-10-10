<template>
  <div class="grid" v-show="isVerified">
    <PreLoader />
  </div>

  <div v-show="!isVerified" class="auth-wrapper auth-basic px-2">
    <div class="auth-inner my-2">

      <div class="card mb-0">
        <div class="card-body">
          <div class="brand-logo">
            <img src="@/assets/logo-dark.png" alt="" height="26" />
          </div>

          <template v-if="flag == '0'">
            <h2 class="card-title fw-bolder mb-1">Two Step Verification 💬</h2>
            <p class="card-text mb-75">Enter the code from the email in the field below.</p>
            <form class="mt-2" @submit.prevent="verifyAccess">
              <label for="security" class="form-label">Type your security code</label>

              <div class="auth-input-wrapper">
                <v-otp-input ref="otpInput"
                  input-classes="form-control auth-input height-50 text-center numeral-mask mx-25 mb-1" separator=" "
                  :num-inputs="6" :should-auto-focus="true" :is-input-num="false"
                  :conditionalClass="['one', 'two', 'three', 'four', 'five', 'six']"
                  :placeholder="['', '', '', '', '', '']" @on-change="handleOnChange" @on-complete="handleOnComplete" />
              </div>

              <div class="col-12 text-end mb-1">
                <a role="button" class="text-decoration-underline" @click="clearInput()">Clear</a>
              </div>
              <button type="submit" class="btn btn-primary w-100" tabindex="4">Verify</button>
            </form>

            <p class="text-center mt-2">
              <span>Didn't get the code?</span>
              <a href="Javascript:void(0)" @click="resendToken"><span>&nbsp;Resend</span></a>
              <span> or</span>
              <a href="Javascript:void(0)"><span>&nbsp;Contact Us</span></a>
            </p>
          </template>
          <template v-else>
            <h2 class="card-title fw-bolder mb-1">Enter your password 💬</h2>
            <p class="card-text mb-75">
              Please, enter your password to view this document.
            </p>

            <form class="mt-2" @submit.prevent="verifyAccess">
              <div class="d-flex justify-content-between align-items-center">
                <label for="security" class="form-label">Password</label>
                <label class="form-label">
                  <a :href="forgotPassword">Forgot Password?</a>
                </label>
              </div>

              <div class="form-group">
                <input type="password" v-model="otpPassword" class="form-control numeral-mask mb-1" id="security"
                  placeholder="Enter password" />
              </div>
              <button type="submit" class="btn btn-primary w-100" tabindex="4">Sign in</button>
            </form>
          </template>

        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import PreLoader from '@/components/PreLoader.vue';
import VOtpInput from 'vue3-otp-input'
import { createNamespacedHelpers } from "vuex-composition-helpers/dist";
import { useRouter } from "vue-router";

const route = useRouter();
const { useActions } = createNamespacedHelpers("auth");
const { userVerifyOTP } = useActions(["userVerifyOTP"]);
const { userResendVerifyOTP } = useActions(["userResendVerifyOTP"]);

const uri = ref('')
const email = ref('')
const documentId = ref('')
const otpPassword = ref('')
const isVerified = ref(false)
const flag = ref('')
const otpInput = ref(null)
const forgotPassword = ref('')

const handleOnComplete = (value) => { otpPassword.value = value }

const clearInput = () => { otpInput.value.clearInput() }

const verifyAccess = () => {

  const verificationObj = {
    document_id: documentId.value,
    email: email.value,
    password: otpPassword.value
  }
  userVerifyOTP({ flag: flag.value, payload: verificationObj })
}

const resendToken = () => {
  const verificationObj = {
    document_id: documentId.value,
    email: email.value,
  }
  userResendVerifyOTP(verificationObj)
}

onMounted(() => {
  uri.value = route.currentRoute.value.query
  email.value = uri.value.e
  documentId.value = uri.value.di
  flag.value = uri.value.f

  forgotPassword.value =
    process.env.NODE_ENV != "development"
      ? process.env.VUE_APP_URL_AUTH_FORGOT_PASSWORD_LIVE
      : process.env.VUE_APP_URL_AUTH_FORGOT_PASSWORD_LOCAL;
})
</script>

<style scoped>
.grid {
  display: grid;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
}

.auth-wrapper {
  min-height: 80vh;
}
</style>
