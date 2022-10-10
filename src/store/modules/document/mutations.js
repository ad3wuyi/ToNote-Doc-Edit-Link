export const SET_DOCUMENTS = (state, docs) => {
  state.documents = docs;
};

export const SET_DOCUMENTS_BY_STATUS = (state, docs) => {
  state.documentsByStatus = docs;
};

export const SET_DOCUMENT = (state, doc) => {
  state.document = doc;
};

export const SET_DOCUMENT_DONE = (state, done) => {
  state.doneEditing = done;
};

export const SET_NOTIFICATION = (state, modal) => {
  state.isOpenModal = modal;
};

export const SET_RESOURCE_TOOLS = (state, tool) => {
  state.resourceTools = tool;
};

export const SET_RESOURCE_TOOL_WITH_ASSET = (state, tool) => {
  state.resourceToolWithAsset = tool;
};

export const SET_EDIT_RESOURCE_TOOL = (state, edit) => {
  const index = state.resourceTools.findIndex((tool) => tool.id === edit.id)
  if (index !== -1) { state.resourceTools.splice(index, 1, edit) }
};

export const SET_MESSAGE = (state, msg) => {
  state.message = msg;
};
