import SignLink from "@/api/modules/SignLink";
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

export const previewResponse = ({ commit }, formData) => {
  const URL =
    process.env.NODE_ENV === "development"
      ? process.env.VUE_APP_URL_AUTH_LOCAL
      : process.env.VUE_APP_URL_SIGN_LINK;
  commit("SET_RESPONSE_PREVIEW", formData)
  window.open(URL + '/document/response', '_blank');
};

export const getPublicLink = ({ commit }, formData) => {
  SignLink.showPublic(formData)
    .then((response) => {
      commit("SET_LINK", response.data.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getPublicState = ({ commit }, formData) => {
  SignLink.showPublicState(formData)
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
            commit("SET_LINK_STATISTICS", response.data);
          })

        if (!['Received', 'Deleted', 'Sign'].includes(capitalizedStatus)) {
          SignLink.allDocumentByStatus(capitalizedStatus)
            .then((response) => {
              commit("SET_LINKS_BY_STATUS", response.data.data)
            })
        } else {
          if (capitalizedStatus == 'Received') {
            SignLink.allReceivedDocuments(token)
              .then((response) => {
                commit("SET_LINKS_BY_STATUS", response.data.data)
              })
          }
          if (capitalizedStatus == 'Deleted') {
            SignLink.allDeletedDocuments(token)
              .then((response) => {
                commit("SET_LINKS_BY_STATUS", response.data.data)
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
      router.push({ name: "document.prepare" });
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
          commit("SET_LINKS_BY_STATUS", response.data.data)
        }).then(() => {
          SignLink.documentStatistics(token)
            .then((response) => {
              commit("SET_LINK_STATISTICS", response.data);
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

export const getTools = ({ commit }, formData) => {
  SignLink.allTools(formData)
    .then((response) => {
      commit("SET_TOOLS", response.data.data);
    });
};

export const resourceTools = ({ commit }, formData) => {
  SignLink.storeTools(formData)
    .then((response) => {
      commit("SET_TOOLS", response.data.data);

      // SignLink.allTools(router.currentRoute.value.params.document_id).then((response) => {
      //   commit("SET_TOOLS", response.data.data);
      // });
    })
    .catch((error) => {
      console.log(error.response);
    });
};

export const editTools = ({ commit }, formData) => {
  let check = JSON.parse(localStorage.getItem("vuex"));
  let parsedData = check.signLink.resourceTools;

  const index = parsedData.findIndex((tool) => tool.id === formData.id)
  if (index !== -1) { parsedData.splice(index, 1, formData.toLocal) }

  commit("SET_TOOLS", parsedData)

  SignLink.updateTool(formData.id, formData.payload)
    .then((response) => {
      let data = response.data.data
      commit("SET_EDIT_TOOL", data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const editPublicTools = ({ commit }, formData) => {
  let check = JSON.parse(localStorage.getItem("vuex"));
  let parsedData = check.signLink.link.signlink_tools;

  const index = parsedData.findIndex((tool) => tool.id === formData.id)
  if (index !== -1) { parsedData.splice(index, 1, formData.payload) }

  commit("SET_TOOLS", parsedData)

  SignLink.updatePublicTool(formData.id, formData.payload)
    .then(() => {
      commit("SET_EDIT_TOOL", formData.payload);
    })
};

export const editToolWithAsset = ({ commit }, formData) => {
  SignLink.updatePublicTool(formData.id, formData.payload)
    .then(() => {
      commit("SET_EDIT_TOOL", formData.payload);

      let check = JSON.parse(localStorage.getItem("vuex"));
      let parsedData = check.signLink.link.signlink_tools;
      const index = parsedData.findIndex((tool) => tool.id === formData.id)

      if (index !== -1) { parsedData.splice(index, 1, formData.payload) }

      formData.hasAsset ? commit("SET_TOOL_WITH_ASSET", parsedData) : commit("SET_TOOLS", parsedData)

      SignLink.showPublicState(formData.payload.document_id)
        .then((response) => {
          commit("SET_LINK", response.data.data);
        })

    })
    .catch((error) => {
      console.log(error);
    });
};

export const publicSignCompleted = ({ commit }, formData) => {
  SignLink.linkCompleted(formData.id, formData.payload)
    .then((response) => {
      commit("SET_TOOLS", [])

      toast.success(`${response.data.data.message}`, {
        timeout: 5000,
        position: "top-right",
      });

      setTimeout(() => {
        window.localStorage.removeItem('vuex');
        window.location.href = process.env.VUE_APP_URL_WEBSITE;
      }, 2000);
    })
    .catch((error) => {
      if (error.response.status == 422) {
        toast.error(`${error.response.data.message}`, {
          timeout: 5000,
          position: "top-right",
        });
      }
    });
};

export const getSignLinkResponses = ({ commit }, formData) => {
  SignLink.allSignLinkResponses(formData)
    .then((response) => {
      commit("SET_SIGN_LINK_RESPONSES", response.data.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const removeTool = ({ commit }, formData) => {
  let check = JSON.parse(localStorage.getItem("vuex"));
  let parsedData = check.signLink.resourceTools;

  const index = parsedData.findIndex((tool) => tool.id === formData)

  if (index !== -1) { parsedData.splice(index, 1) }
  commit("SET_TOOLS", parsedData)
  commit("SET_TOOL_WITH_ASSET", parsedData)

  SignLink.deleteTool(formData)
};

export const doneEditing = ({ commit }, formData) => {
  SignLink.participantDone(formData)
    .then((response) => {
      commit("SET_LINK_DONE", response.data.data);

      toast.success("Document edited successfully", {
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

export const removeNotification = ({ commit }, closeModal) => { commit("SET_NOTIFICATION", closeModal); };

export const invitationMail = ({ commit }, formData) => {
  SignLink.mailToParticipant({ participants: formData, subject: formData.subject, message: formData.message })
    .then((response) => {
      commit("SET_LINK", response.data.data);
      commit("SET_NOTIFICATION", true);
    })
    .catch((error) => {
      toast.error(`${error.message}`, {
        timeout: 5000,
        position: "top-right",
      });
    });
};