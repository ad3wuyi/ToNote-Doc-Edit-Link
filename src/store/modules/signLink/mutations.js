export const SET_LINKS = (state, link) => {
  state.links = link;
};

export const SET_LINK = (state, link) => {
  state.link = link;
};

export const SET_CANCEL = (state, cancel) => {
  state.cancel = cancel;
};

export const SET_LINK_NOTIFICATION = (state, isSaved) => {
  state.isLinkSaved = isSaved;
};
