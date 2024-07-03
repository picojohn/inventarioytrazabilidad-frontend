import {
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
  HIDE_MESSAGE,
  SHOW_MESSAGE,
  TOGGLE_APP_DRAWER,
  UPDATING_CONTENT,
} from '../../shared/constants/ActionTypes';

const INIT_STATE = {
  error: '',
  loading: false,
  isAppDrawerOpen: false,
  updatingContent: false,
  message: '',
  messageType: 0,
};

const commonReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case FETCH_START: {
      return {...state, error: '', message: '', loading: true};
    }
    case UPDATING_CONTENT: {
      return {...state, error: '', message: '', updatingContent: true};
    }
    case FETCH_SUCCESS: {
      return {
        ...state,
        // error: '',
        // message: '',
        loading: false,
        updatingContent: false,
      };
    }
    case SHOW_MESSAGE: {
      return {
        ...state,
        error: '',
        message: action.payload[0],
        messageType: action.payload[1],
        loading: false,
        updatingContent: false,
      };
    }
    case FETCH_ERROR: {
      return {
        ...state,
        loading: false,
        error: action.payload,
        messageType: 4,
        message: '',
        updatingContent: false,
      };
    }
    case HIDE_MESSAGE: {
      return {
        ...state,
        loading: false,
        error: '',
        message: '',
        updatingContent: false,
      };
    }
    case TOGGLE_APP_DRAWER: {
      return {
        ...state,
        isAppDrawerOpen: !state.isAppDrawerOpen,
      };
    }
    default:
      return state;
  }
};
export default commonReducer;
