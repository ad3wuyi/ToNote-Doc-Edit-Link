import SignLink from "@/api/SignLink";
import { useToast } from "vue-toast-notification";
import router from "@/router/router";
import store from "@/store";
const toast = useToast();

export const getLinks = ({ commit }) => {
  const token = store.getters["auth/token"];
  SignLink.all(token)
    .then((response) => {
      commit("SET_LINKS", response.data.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getLink = ({ commit }, formData) => {
  SignLink.show(formData)
    .then((response) => {
      commit("SET_LINK", response.data.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const createLink = ({ commit }, formData) => {
  commit("SET_LINK_NOTIFICATION", false);
  SignLink.store(formData)
    .then((response) => {
      commit("SET_LINKS", response.data.data);
      commit("SET_LINK_NOTIFICATION", true);

      toast.success("Saved successfully", {
        timeout: 5000,
        position: "top-right",
      });
    })
    .catch((error) => {
      if (error.response.status == 403) {
        commit("SET_LINK_NOTIFICATION", true);
      }
      toast.error(`${error.response.data.data.error}`, {
        timeout: 5000,
        position: "top-right",
      });
    });
};

export const removeCancel = ({ commit }) => {
  commit("SET_CANCEL", false);
};

export const removeDocument = ({ commit }, formData) => {
  SignLink.deleteDocument(formData)
    .then((response) => {
      const token = store.getters["auth/token"];
      const status = router.currentRoute.value.query.status;

      if (status != undefined) {
        const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);

        SignLink.documentStatistics(token)
          .then((response) => {
            commit("SET_DOCUMENT_STATISTICS", response.data);
          })

        if (!['Received', 'Deleted'].includes(capitalizedStatus)) {
          SignLink.allDocumentByStatus(capitalizedStatus)
            .then((response) => {
              commit("SET_DOCUMENTS_BY_STATUS", response.data.data)
            })
        } else {
          if (capitalizedStatus == 'Received') {
            SignLink.allReceivedDocuments(token)
              .then((response) => {
                commit("SET_DOCUMENTS_BY_STATUS", response.data.data)
              })
          }
          if (capitalizedStatus == 'Deleted') {
            SignLink.allDeletedDocuments(token)
              .then((response) => {
                commit("SET_DOCUMENTS_BY_STATUS", response.data.data)
              })
          }
        }
      }

      toast.success(`${response.data.data.message}`, {
        timeout: 5000,
        position: "top-right",
      });
    })
    .catch((error) => {
      toast.error(`${error.message}`, {
        timeout: 5000,
        position: "top-right",
      });
    });
};

export const fileUploads = ({ commit }, formData) => {
  SignLink.storeFileUpload(formData)
    .then((response) => {
      commit("SET_LINK", response.data.data);
      commit("SET_CANCEL", true);
      router.push({ name: "SignLink.prepare" });
    })
    .catch((error) => {
      toast.error(`${error.response.data.data.error}`, {
        timeout: 5000,
        position: "top-right",
      });
    });
};

export const editLink = ({ commit }, formData) => {
  SignLink.update(formData)
    .then((response) => {
      commit("SET_LINKS", response.data.data);
    })
    .catch((error) => {
      toast.error(`${error.response.data.data.error}`, {
        timeout: 5000,
        position: "top-right",
      });
    });
};

export const removeLink = ({ commit }, formData) => {
  SignLink.deleteLink(formData)
    .then((response) => {
      console.log(response.data.data)
      commit("SET_LINKS", response.data.data);
    })
    .catch((error) => {
      toast.error(`${error.message}`, {
        timeout: 5000,
        position: "top-right",
      });
    });
};

export const retrieveLink = ({ commit }, formData) => {
  SignLink.restoreDocument(formData)
    .then((response) => {
      const token = store.getters["auth/token"];
      SignLink.allDeletedDocuments(token)
        .then((response) => {
          commit("SET_DOCUMENTS_BY_STATUS", response.data.data)
        }).then(() => {
          SignLink.documentStatistics(token)
            .then((response) => {
              commit("SET_DOCUMENT_STATISTICS", response.data);
            })
        })

      toast.success(`${response.data.data.message}`, {
        timeout: 5000,
        position: "top-right",
      });
    })
    .catch((error) => {
      toast.error(`${error.message}`, {
        timeout: 5000,
        position: "top-right",
      });
    });
};
