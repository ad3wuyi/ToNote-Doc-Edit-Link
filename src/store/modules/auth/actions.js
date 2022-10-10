import User from "@/api/Auth";
import router from "@/router/router";
import { useToast } from "vue-toast-notification";
const toast = useToast();

export const logoutUser = ({ commit }, formData) => {
  User.logout(formData)
    .then(() => {
      window.localStorage.removeItem('vuex');

      if (process.env.NODE_ENV == 'development') {
        window.location.href = process.env.VUE_APP_URL_AUTH_LOCAL
      } else {
        window.location.href = router.push({ name: 'Login' });
      }
    })
    .catch((error) => {
      if (error.response.status === 401 || error.response.status == 422) {
        commit("SET_TOKEN", null);
        router.push({ name: "Login" });
      }
    });
};

export const userVerifyOTP = ({ commit }, formData) => {
  if (formData.flag == 0) { commit("SET_FLAG", { guest: true, data: formData.payload }) }

  User.verifyOTP(formData.payload)
    .then((response) => {
      commit("SET_TOKEN", response.data.token);
      commit("SET_TOKEN_TYPE", "Bearer");
      User.show().then((response) => {
        commit("SET_USER_PROFILE", response.data.data);

        router.push({
          name: "document.edit",
          params: { document_id: router.currentRoute.value.query.di },
        });
      });
    })
    .catch((error) => {
      if (error.response.status == 422) {
        toast.error(error.response.data.message, {
          timeout: 5000,
          position: "top-right",
        });
      } else if (error.response.status == 401) {
        let hasError = ''
        if (error.response.data?.data?.error != '') {
          hasError = error.response.data?.data?.error
        }
        if (error.response.data?.errors?.root) {
          hasError = error.response.data?.errors?.root
        }

        toast.error(hasError, {
          timeout: 5000,
          position: "top-right",
        });
      }
    });
};

export const resetPassword = ({ commit }, formData) => {
  User.changePassword(formData)
    .then(() => {
      commit("SET_FLAG", {})
      toast.success("Password created successfully", {
        timeout: 5000,
        position: "top-right",
      });
    })
    .catch((error) => {
      if (error.response.status == 422) {
        commit("SET_FLAG", { guest: false })
      }
    });
};

export const userResendVerifyOTP = ({ commit }, formData) => {
  User.resendVerifyOTP(formData)
    .then(() => {
      commit("SET_RESEND_OTP", true);
      toast.success("OTP has been sent to your email", {
        timeout: 5000,
        position: "top-right",
      });
    })
};

export const setAuthentication = ({ commit }, data) => {
  commit("SET_TOKEN", data.token);
  commit("SET_TOKEN_TYPE", "Bearer");

  User.show()
    .then((response) => {
      commit("SET_USER_PROFILE", response.data.data);
      if (data.documentId != undefined) {
        return router.push({
          name: "document.audit",
          params: { document_id: data.documentId },
        });
      }
      if (data.status != '') {
        return router.push({ name: "Document", query: { status: data.status } })
      }
    })
    .catch((error) => {
      if (error.response.status == 401 || error.response.status == 404) {
        window.location.href = process.env.VUE_APP_URL_AUTH_LIVE;
      }
    });
};

export const setAuthForDocumentUpload = ({ commit }, token) => {
  commit("SET_TOKEN", token);
  commit("SET_TOKEN_TYPE", "Bearer");
  User.show()
    .then((response) => {
      commit("SET_USER_PROFILE", response.data.data);
      router.push({ name: "document.upload" });
    })
};

export const loginUser = ({ commit }, formData) => {
  User.login(formData)
    .then((response) => {
      commit("SET_TOKEN", response.data.token);
      commit("SET_TOKEN_TYPE", response.data.token_type);

      User.show()
        .then((response) => {
          commit("SET_USER_PROFILE", response.data.data);
          router.push({ name: "Document" });

          toast.success("Welcome to ToNote ", {
            timeout: 5000,
            position: "top-right",
          });
        })
    })
    .catch((error) => {
      if (error.response.status == 401 || error.response.status == 404) {
        commit("SET_AUTH_ERROR", error.response.data.message);
        toast.error(`${error.response.data.errors.root}`, {
          timeout: 5000,
          position: "top-right",
        });
      }
      if (error.response.status == 422) {
        commit("SET_AUTH_ERROR", error.response.data.message);
        toast.error(`${error.response.data.message}`, {
          timeout: 5000,
          position: "top-right",
        });
      }
    });
};