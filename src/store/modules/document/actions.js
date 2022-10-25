import Document from "@/api/Document";
import Tool from "@/api/Tool";
import router from "@/router/router";
import store from "@/store";
import { useToast } from "vue-toast-notification";
const toast = useToast();

export const getUserDocuments = ({ commit }, token) => {
  Document.allDocuments(token)
    .then((response) => { commit("SET_DOCUMENTS", response.data); })
    .catch((error) => {
      if (error.response.status === 401 || error.response.status == 422) {
        commit("SET_TOKEN", null);
        router.push({ name: "Login" });
      }
    });
};

export const getUserDocumentByStatus = ({ commit }, formData) => {
  Document.allDocumentByStatus(formData)
    .then((response) => {
      if (!['Received', 'Deleted'].includes(formData)) {
        commit("SET_DOCUMENTS_BY_STATUS", response.data.data)
      }
    })
};

export const getReceivedDocuments = ({ commit }, token) => {
  Document.allReceivedDocuments(token)
    .then((response) => {
      commit("SET_DOCUMENTS_BY_STATUS", response.data.data)
    })
};

export const getDeletedDocuments = ({ commit }, token) => {
  Document.allDeletedDocuments(token)
    .then((response) => {
      commit("SET_DOCUMENTS_BY_STATUS", response.data.data)
    })
};

export const finishAnnotation = ({ commit }, formData) => {
  Document.allCompletedDocuments(formData)
    .then((response) => { commit("SET_MESSAGE", response.data.data); })
};

export const getUserDocument = ({ commit }, docId) => {
  Document.showDocument(docId)
    .then((response) => { commit("SET_DOCUMENT", response.data.data); })
    .catch((error) => {
      if (error.response.status === 401 || error.response.status == 422) {
        commit("SET_TOKEN", null);
        router.push({ name: "Login" });
      }
    });
};

export const fileUploads = ({ commit }, formData) => {
  Document.storeFileUpload(formData)
    .then((response) => {
      commit("SET_DOCUMENT", response.data.data);
      router.push({ name: "document.prepare" });
    })
    .catch((error) => {
      toast.error(`${error.response.data.data.error}`, {
        timeout: 5000,
        position: "top-right",
      });
    });
};

export const removeDocument = ({ commit }, formData) => {
  Document.deleteDocument(formData)
    .then(() => {
      const status = router.currentRoute.value.query.status;
      const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);

      if (!['Received', 'Deleted'].includes(capitalizedStatus)) {
        Document.allDocumentByStatus(capitalizedStatus)
          .then((response) => {
            commit("SET_DOCUMENTS_BY_STATUS", response.data.data)
          })
      }

      toast.success("Document deleted successfully", {
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

export const retrieveDocument = ({ commit }, formData) => {
  Document.restoreDocument(formData)
    .then((response) => {
      const token = store.getters["auth/token"];
      Document.allDeletedDocuments(token)
        .then((response) => {
          commit("SET_DOCUMENTS_BY_STATUS", response.data.data)
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

export const addSelf = ({ commit }, formData) => {
  Document.storeSelf(formData)
    .then((response) => {
      commit("SET_DOCUMENT", response.data.data);

      toast.success("You added yourself as a signer", {
        timeout: 5000,
        position: "top-right",
      });
    })
    .catch((error) => {
      toast.error(`${error.response.data.data.error}`, {
        timeout: 5000,
        position: "top-right",
      });
    });
};

export const addParticipant = ({ commit }, formData) => {
  Document.storeParticipant({ participants: formData })
    .then((response) => {
      commit("SET_DOCUMENT", response.data.data);
      toast.success(`${response.data.message}`, {
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

export const doneEditing = ({ commit }, formData) => {
  Document.participantDone(formData)
    .then((response) => { commit("SET_DOCUMENT_DONE", response.data.data); })
    .catch((error) => {
      toast.error(`${error.message}`, {
        timeout: 5000,
        position: "top-right",
      });
    });
};

export const editParticipant = ({ commit }, formData) => {
  Document.updateParticipant({ participants: formData })
    .then((response) => {
      commit("SET_DOCUMENT", response.data.data);

      toast.success("Participant updated successfully", {
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
  Document.mailToParticipant({ participants: formData, subject: formData.subject, message: formData.message })
    .then((response) => {
      commit("SET_DOCUMENT", response.data.data);
      commit("SET_NOTIFICATION", true);
    })
    .catch((error) => {
      toast.error(`${error.message}`, {
        timeout: 5000,
        position: "top-right",
      });
    });
};

export const removeParticipant = ({ commit }, formData) => {
  Document.deleteParticipant(formData)
    .then((response) => {
      commit("SET_DOCUMENT", response.data.data);

      toast.success("Participant removed successfully", {
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
  Tool.all(formData).then((response) => { commit("SET_RESOURCE_TOOLS", response.data.data); });
};

export const resourceTools = ({ commit }, formData) => {
  Document.storeTools(formData)
    .then(() => {
      Tool.all(router.currentRoute.value.params.document_id).then((response) => {
        commit("SET_RESOURCE_TOOLS", response.data.data);
      });
    })
    .catch((error) => {
      console.log(error.response);
      // return window.location.reload();
    });
};

export const editTools = ({ commit }, formData) => {
  let check = JSON.parse(localStorage.getItem("vuex"));
  let parsedData = check.document.resourceTools;

  const index = parsedData.findIndex((tool) => tool.id === formData.id)
  if (index !== -1) { parsedData.splice(index, 1, formData.toLocal) }

  commit("SET_RESOURCE_TOOLS", parsedData)

  Document.updateTool(formData.id, formData.payload)
    .then((response) => {
      let data = response.data.data
      commit("SET_EDIT_RESOURCE_TOOL", data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const editToolWithAsset = ({ commit }, formData) => {
  Document.updateTool(formData.id, formData.payload)
    .then((response) => {
      let data = response.data.data
      commit("SET_EDIT_RESOURCE_TOOL", data);

      let check = JSON.parse(localStorage.getItem("vuex"));
      let parsedData = check.document.resourceTools;

      const index = parsedData.findIndex((tool) => tool.id === data.id)

      if (index !== -1) { parsedData.splice(index, 1, data) }

      formData.hasAsset ? commit("SET_RESOURCE_TOOL_WITH_ASSET", parsedData) : commit("SET_RESOURCE_TOOLS", parsedData)
    })
    .catch((error) => {
      console.log(error);
    });
};

export const removeTool = ({ commit }, formData) => {
  let check = JSON.parse(localStorage.getItem("vuex"));
  let parsedData = check.document.resourceTools;

  const index = parsedData.findIndex((tool) => tool.id === formData)

  if (index !== -1) { parsedData.splice(index, 1) }
  commit("SET_RESOURCE_TOOLS", parsedData)
  commit("SET_RESOURCE_TOOL_WITH_ASSET", parsedData)

  Document.deleteTool(formData)
};