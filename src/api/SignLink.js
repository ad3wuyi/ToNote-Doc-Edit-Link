import Api from "./Api";

const END_POINT = "signlink-documents";

export default {
  all(token) {
    return Api.get(`${END_POINT}`, token);
  },

  show(id) {
    return Api.get(`${END_POINT}/${id}`);
  },

  store(data) {
    return Api.post(END_POINT, data);
  },

  storeFileUpload(data) {
    return Api.post(END_POINT, data);
  },

  update(data) {
    return Api.put(`${END_POINT}/${data.id}`, data.payload);
  },


  deleteDocument(data) {
    return Api.post(END_POINT, data);
  },

  deleteLink(linkId) {
    return Api.delete(`${END_POINT}/${linkId}`);
  },
};

