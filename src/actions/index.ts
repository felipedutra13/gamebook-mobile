export const addSelectedPlaform = (id: number) => {
  return { type: 'ADD_PLATFORM', id: id };

};

export const removeSelectedPlaform = (id: number) => {
  return { type: 'REMOVE_PLATFORM', id: id };
};

export const replacePlatforms = (ids: number[]) => {
  return { type: 'SET_PLATFORMS', ids: ids}
};

export const selectTab = (tab: string) => {
  return { type: 'CHANGE_TAB', tab: tab };
};

export const selectOption = (option: number) => {
  return { type: 'CHANGE_OPTION', option: option };
};

export const showPlatformSelection = (option: boolean) => {
  return { type: 'CHANGE_VISIBILITY', option: option };
};

export const signIn = (token: string) => {
  // log in the user
  return { type: "AUTH", token: token };

}

export const signUp = (token: string) => {
  // log in the user
  return { type: "AUTH", token: token };
}

export const logout = () => {
  // log in the user
  return { type: "LOGOUT"};
}

export const setEmail = (email: string) => {
  return { type: "SET_EMAIL", email: email }
}