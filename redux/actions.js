import * as constants from "./constants";
import { toFormData } from "utils/utils";

const config = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
};

export const initializeDataAction = data => ({
  type: constants.INITIALIZE_DATA,
  payload: data
});

export const removeItemAction = id => dispatch => {
  dispatch({
    type: constants.START_REMOVE_ITEM
  });

  fetch(`/prodotti/${id}`, {
    method: "DELETE"
    // config,
  })
    .then(result => result.json())
    .then(() => {
      dispatch({
        type: constants.REMOVE_ITEM_SUCCESS,
        payload: { id }
      });
    })
    .catch(err => {
      dispatch({
        type: constants.REMOVE_ITEM_FAILURE,
        payload: err
      });
    });
};

export const updateQuantityAction = ({ productItem, id, type }) => dispatch => {
  dispatch({
    type: constants.UPDATE_VALUES_START
  });

  fetch(`/prodotti/${id}`, {
    method: "PUT",
    // config,
    body: toFormData({ [type]: productItem[type] })
  })
    .then(result => result.json())
    .then(result => {
      dispatch({
        type: constants.UPDATE_VALUES_SUCCESS,
        payload: result
      });
    })
    .catch(err => {
      dispatch({
        type: constants.UPDATE_VALUES_FAILURE,
        payload: err
      });
    });
};

export const dublicateItemAction = ({
  currentChangedObject: data
}) => dispatch => {
  dispatch({
    type: constants.ADD_DUBLICATION_START
  });

  fetch(`/prodotti`, {
    method: "POST",
    config,
    body: toFormData(data)
  })
    .then(result => result.json())
    .then(result => {
      dispatch({
        type: constants.ADD_DUBLICATION_SUCCESS,
        payload: result
      });
    })
    .catch(err => {
      dispatch({
        type: constants.ADD_DUBLICATION_FAILURE,
        payload: err
      });
    });
};

export const saveListOrderAction = ({ id, position }) => dispatch => {
  dispatch({
    type: constants.SAVE_LIST_ORDER_START
  });

  fetch(`/prodotti/${id}`, {
    method: "PUT",
    // config,
    body: toFormData({ position })
  })
    .then(result => result.json())
    .then(() => {
      dispatch({
        type: constants.SAVE_LIST_ORDER_SUCCESS
      });
    })
    .catch(err => {
      dispatch({
        type: constants.SAVE_LIST_ORDER_FAILURE,
        payload: err
      });
    });
};
