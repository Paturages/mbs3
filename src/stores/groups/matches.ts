import type { Match, Map } from '../../types';
import { writable } from 'svelte/store';
import query from './matches.gql';
import { api } from '../core';

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

  data.matches.forEach(match => {
    // Properly display seed order in matches
    match.players = match.players[0].player.seed < match.players[1].player.seed ? match.players : match.players.reverse();

    // Compute match scores
    if (match.wbd) {
      match.points1 = match.wbd.id == match.players[0].player.id ? 'WBD' : 0;
      match.points2 = match.wbd.id == match.players[1].player.id ? 'WBD' : 0;
    } else {
      match.points1 = 0;
      match.points2 = 0;
      match.picks.forEach(pick => {
        let scores = match.scores.filter(s => s.map.id == pick.map.id) || [];

        // If there's only one score for the pick, the other player most likely disconnected
        if (scores.length == 1) {
          scores.push({
            ...scores[0],
            player: match.players[
              scores[0]?.player.id == match.players[0].player.id ? 1 : 0
            ].player,
            score: 0
          });
        }

        if (scores[0]?.player.id != match.players[0].player.id) {
          scores = scores.reverse();
        }
        const [score1, score2] = scores;
        if (score1 && score2) {
          if (score1.score > score2.score) {
            match.points1 += 1;
          } else {
            match.points2 += 1;
          }
        }
      });
    }
  });


  groupsMatches.set(data.matches);
  groupsMaps.set(data.maps);
};