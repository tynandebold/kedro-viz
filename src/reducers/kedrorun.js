import {
  UPDATE_FEATURES_CHANGES,
  UPDATE_TARGET_CHANGES,
  UPDATE_MODEL_EVALUATOR_CHANGES,
  UPDATE_MODEL_OBJECT_CHANGES,
} from '../actions/kedro-run';

function runConfigReducer(runConfigState = {}, action) {
  switch (action.type) {
    case UPDATE_FEATURES_CHANGES: {
      return Object.assign({}, runConfigState, {
        runConfig: {
          features: action.value,
        },
      });
    }

    case UPDATE_TARGET_CHANGES: {
      return Object.assign({}, runConfigState, {
        runConfig: {
          target: action.value,
        },
      });
    }

    case UPDATE_MODEL_EVALUATOR_CHANGES: {
      return Object.assign({}, runConfigState, {
        runConfig: {
          modelEvaluators: action.value,
        },
      });
    }

    case UPDATE_MODEL_OBJECT_CHANGES: {
      return Object.assign({}, runConfigState, {
        runConfig: {
          modelObject: action.value,
        },
      });
    }

    default:
      return runConfigState;
  }
}

export default runConfigReducer;
