import { createSelector } from 'reselect';
import { getPipelineTagIDs } from './pipeline';

const getTagName = state => state.tag.name;
const getTagActive = state => state.tag.active;
const getTagEnabled = state => state.tag.enabled;
const getPaiTags = state => state.tag.pai;

/**
 * Retrieve the formatted list of tag filters
 */
export const getTagData = createSelector(
  [getPipelineTagIDs, getTagName, getTagActive, getTagEnabled, getPaiTags],
  (tagIDs, tagName, tagActive, tagEnabled, paiTags) =>
    tagIDs.sort().map(id => ({
      id,
      name: tagName[id],
      active: Boolean(tagActive[id]),
      enabled: Boolean(tagEnabled[id]),
      pai: paiTags.name[id]
    }))
);

/**
 * Retrieve the formatted list of pai tag filters
 */
export const getPaiTagsData = createSelector(
  [getPaiTags],
  paiTags =>
    paiTags.id.sort().map(id => ({
      id,
      name: paiTags.name[id]
    }))
);

/**
 * Get the total and enabled number of tags
 */
export const getTagCount = createSelector(
  [getPipelineTagIDs, getTagEnabled],
  (tagIDs, tagEnabled) => ({
    total: tagIDs.length,
    enabled: tagIDs.filter(id => tagEnabled[id]).length
  })
);
