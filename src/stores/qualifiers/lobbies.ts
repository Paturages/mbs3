import type { QualifierLobby, Map } from '../../types';
import { writable } from 'svelte/store';
import query from './lobbies.gql';
import { api } from '../core';

export const qualifierLobbies = writable<QualifierLobby[]>(null);
export const qualifierMaps = writable<Map[]>(null);

export const init = async () => {
  // const { data } = await api('/graphql', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({ query })
  // });
  const { data } = await api(`/data/qualifiers.lobbies.json`);
  qualifierLobbies.set(data.qualifier_lobbies);
  qualifierMaps.set(data.maps);
};