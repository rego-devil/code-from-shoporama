import * as constants from "./constants";

const initialState = {
  isSaving: false,
  isDeleting: false,
  data: [],
  error: {}
};

export const tableList = (state = initialState, action) => {
  switch (action.type) {
    case constants.INITIALIZE_DATA:
      return { ...state, data: action.payload };

    case constants.START_SAVE_SORT_ORDER:
      return { ...state, isSaving: true };
    case constants.SAVE_SORT_ORDER_SUCCESS:
      return { ...state, isSaving: false };

    case constants.START_REMOVE_ITEM:
      return { ...state, isDeleting: true };

    case constants.REMOVE_ITEM_SUCCESS:
      return {
        ...state,
        isDeleting: false,
        data: state.data.filter(product => product.id !== action.payload.id)
      };

    case constants.REMOVE_ITEM_FAILURE:
      return { ...state, isDeleting: false, error: action.payload };

    case constants.UPDATE_VALUES_START:
      return { ...state, isSaving: true };

    case constants.UPDATE_VALUES_SUCCESS:
      return {
        ...state,
        isSaving: false,
        data: state.data.map(
          product =>
            product.id === action.payload.id ? action.payload : product
        )
      };

    case constants.UPDATE_VALUES_FAILURE:
      return { ...state, isSaving: false, error: action.payload };

    case constants.ADD_DUBLICATION_START:
      return { ...state, isSaving: true };

    case constants.ADD_DUBLICATION_SUCCESS:
      return {
        ...state,
        isSaving: false,
        data: [action.payload, ...state.data]
      };

    case constants.ADD_DUBLICATION_FAILURE:
      return { ...state, isSaving: false, error: action.payload };

    case constants.SAVE_LIST_ORDER_START:
      return { ...state, isSaving: true };

    case constants.SAVE_LIST_ORDER_SUCCESS:
      return { ...state, isSaving: false };

    case constants.SAVE_LIST_ORDER_FAILURE:
      return { ...state, isSaving: false, error: action.payload };

    default:
      return state;
  }
};
