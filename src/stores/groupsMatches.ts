import type { Match, Map } from '../types';
import { writable } from 'svelte/store';
import query from './groupsMatches.gql';
import { api } from './core';

export const groupsMatches = writable<Match[]>(null);
export const groupsMaps = writable<Map[]>(null);

export const init = async () => {
  const { data } = await api('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });

  // Properly display seed order in matches
  data.matches.forEach(match => {
    match.players = match.players[0].player.seed < match.players[1].player.seed ? match.players : match.players.reverse();
  });

  groupsMatches.set(data.matches);
  groupsMaps.set(data.maps);
};