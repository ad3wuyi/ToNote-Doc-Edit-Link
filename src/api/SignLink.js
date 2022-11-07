import Api from "./Api";

const SIGN_LINK = "signlink-documents";
const SIGN_LINK_TOOL = "signlink-annotations";
const SIGN_LINK_TOOLS = "signlink-annotation-tools";
const SIGN_LINK_PUBLIC = "signlink-public-sign";

const DOCUMENT_DELETE = "document-multiple-delete";
const SIGN_LINK_DONE = "document-participants-done";

export default {
  all(token) {
    return Api.get(`${SIGN_LINK}`, token);
  },

  show(id) {
    return Api.get(`${SIGN_LINK}/${id}`);
  },

  showPublic(docId) {
    return Api.get(`${SIGN_LINK_PUBLIC}/${docId}`);
  },

  store(data) {
    return Api.post(SIGN_LINK, data);
  },

  storeFileUpload(data) {
    return Api.post(SIGN_LINK, data);
  },

  update(data) {
    return Api.put(`${SIGN_LINK}/${data.id}`, data.payload);
  },

  deleteDocument(data) {
    return Api.post(DOCUMENT_DELETE, data);
  },

  deleteLink(linkId) {
    return Api.delete(`${SIGN_LINK}/${linkId}`);
  },

  allTools(docId) {
    return Api.get(`${SIGN_LINK_TOOLS}/${docId}`);
  },

  storeTools(data) {
    return Api.post(SIGN_LINK_TOOL, data);
  },

  updateTool(id, data) {
    return Api.put(`${SIGN_LINK_TOOL}/${id}`, data);
  },

  deleteTool(toolId) {
    return Api.delete(`${SIGN_LINK_TOOL}/${toolId}`);
  },

  participantDone(data) {
    return Api.post(SIGN_LINK_DONE, data);
  },
};

