import type { Roll } from '../../types';
import { writable } from 'svelte/store';
import query from './rolls.gql';
import { api } from '../core';

export const stage = writable<string>(null);
export const rolls = writable<Roll[]>(null);

export const init = async (newStage: string) => {
  const { data } = await api('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, variables: { stage: newStage } })
  });
  rolls.set(data.rolls);
};
