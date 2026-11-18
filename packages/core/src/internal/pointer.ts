import { toMediaAtRuleKey, type VariantOptionStyle } from 'typestyles';
import { typestyles } from '../runtime';
import { coarsePointerQuery } from '../shared/pointer';

/**
 * Touch-first styles — spread into a style object: hide keyboard hints, show touch affordances
 * (a Cancel button). Only one per style object (a second spread replaces the first).
 */
export function atCoarsePointer(style: VariantOptionStyle) {
  return typestyles.atRuleBlock(toMediaAtRuleKey(coarsePointerQuery), style);
}
