import type { Match, Map } from '../../types';
import { writable } from 'svelte/store';
import query from './matches.gql';
import { api } from '../core';

export const stage = writable<string>(null);
export const matches = writable<Match[]>(null);
export const maps = writable<Map[]>(null);

export const init = async (newStage: string) => {
  // Flush between stage transitions
  stage.set(newStage);
  matches.set(null);
  maps.set(null);

  const { data } = await api('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, variables: { stage: newStage } })
  });

  data.matches.forEach(match => {
    // Properly display seed order in matches
    match.players = match.players[0].player.seed < match.players[1].player.seed ? match.players : match.players.reverse();

    // Set up dependencies
    if (match.dependencies) {
      match.dependencies = match.dependencies.split(',').map(id => data.matches.find(m => m.id == id)).filter(x => x);
      match.dependencies.forEach(dep => {
        if (!dep.dependents) dep.dependents = [];
        dep.dependents.push(match);
      });
    }

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


  matches.set(data.matches);
  maps.set(data.maps);
};