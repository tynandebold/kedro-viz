import { getUrl } from '../utils';
import loadJsonData from '../store/load-data';

/**
 * update value of features on state
 * @param {boolean} value value of updated feature changes
 */
export const UPDATE_FEATURES_CHANGES = 'UPDATE_FEATURES_CHANGES';
export function updateFeatureChanges(value) {
  return {
    type: UPDATE_FEATURES_CHANGES,
    value,
  };
}

/**
 * Toggle whether to display the loading spinner when a run is triggered
 * @param {boolean} value True if runis still loading
 */
export const UPDATE_TARGET_CHANGES = 'UPDATE_TARGET_CHANGES';
export function updateTargetChanges(value) {
  return {
    type: UPDATE_TARGET_CHANGES,
    value,
  };
}

/**
 * Toggle whether to display the loading spinner when a run is triggered
 * @param {boolean} value True if runis still loading
 */
export const UPDATE_MODEL_EVALUATOR_CHANGES = 'UPDATE_MODEL_EVALUATOR_CHANGES';
export function updateModelEvaluatorChanges(value) {
  return {
    type: UPDATE_MODEL_EVALUATOR_CHANGES,
    value,
  };
}

/**
 * Toggle whether to display the loading spinner when a run is triggered
 * @param {boolean} value True if runis still loading
 */
export const UPDATE_MODEL_OBJECT_CHANGES = 'UPDATE_MODEL_OBJECT_CHANGES';
export function updateModelObjectChanges(value) {
  return {
    type: UPDATE_MODEL_OBJECT_CHANGES,
    value,
  };
}

/**
 * Toggle whether to display the loading spinner when a run is triggered
 * @param {boolean} loading True if runis still loading
 */
export const TOGGLE_RUN_LOADING = 'TOGGLE_RUN_LOADING';
export function toggleRunLoading(loading) {
  return {
    type: TOGGLE_RUN_LOADING,
    loading,
  };
}

/**
 * Determine where to load data from
 * @param {object} pipeline Pipeline state
 */
export const getRunUrl = (query) => {
  return getUrl('kedrorun', query);
};

/**
 * Change pipeline on selection, loading new data if necessary
 * @param {string} pipelineID Unique ID for new pipeline
 * @return {function} A promise that resolves when the data is loaded
 */
export function toggleKedroRun() {
  return async function (dispatch, getState) {
    const { runConfig } = getState();
    const { features, targetVariables, modelClass, modelEvaluators } =
      runConfig;

    // we need to stitch the queries from the state here
    const query = `features:${features.toString()}, targetVariables:${targetVariables}, modelClass:${modelClass}, modelEvaluators:${modelEvaluators}`;

    console.log('query', query);

    dispatch(toggleRunLoading(true));
    const url = getRunUrl(query);
    await loadJsonData(url).then((data) => {
      dispatch(toggleRunLoading(false));
    });
  };
}
