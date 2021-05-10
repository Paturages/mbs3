import type { Player, Score, Match, Map as OsuMap } from '../../types';
import { writable } from 'svelte/store';
import query from './scores.gql';
import { api } from '../core';

export interface TournamentScore extends Score {
  match: Match;
}

export interface TournamentPlayer extends Player {
  mapScores: Map<string, TournamentScore[]>;
}

export interface TournamentMap extends OsuMap {
  players: Map<string, TournamentPlayer>;
  bans: {
    player: Player;
  }[];
  protects: {
    player: Player;
  }[];
}

export const stage = writable<string>(null);
export const mapRanking = writable<TournamentMap[]>(null);

// This assumes that the list of players has been fetched from stores/core,
// so players have to be fed in the init.
export const init = async (newStage: string, rawPlayers: Player[]) => {
  // Flush between stages
  stage.set(newStage);
  mapRanking.set(null);

  const { data } = await api('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, variables: { stage: newStage } })
  });

  // there are at least 3 or 4 different meanings of map here please help
  const initMapPlayers = (map: TournamentMap): [string, TournamentMap] => [
    map.id,
    {
      ...map,
      players: new Map()
    }
  ];
  const mapsMap: Map<string, TournamentMap> = new Map(data.maps.map(initMapPlayers));
  const initPlayerScores = (player: Player): [string, TournamentPlayer] => [
    player.id,
    {
      ...player,
      mapScores: new Map(
        data.maps.map(
          map => [
            map.id,
            []
          ]
        )
      )
    }
  ];
  const playersMap: Map<string, TournamentPlayer> = new Map(rawPlayers.map(initPlayerScores));

  // The fetched scores are ordered by descending score,
  // so the map leaderboards should be already sorted upon insertion.
  
  // Settings Map values should conserve order when doing .entries() or .values()
  data.scores.forEach((score: TournamentScore) => {
    let player: TournamentPlayer;

    if (player = playersMap.get(score.player?.id)) {
      if (!mapsMap.has(score.map.id)) return;

      player.mapScores.get(score.map.id).push(score);
      const mapPlayers = mapsMap.get(score.map.id).players;
      if (!mapPlayers.has(score.player.id)) {
        mapPlayers.set(score.player.id, player);
      }
    }
  });

  // Compute map player positions
  for (const map of mapsMap.values()) {
    const mapPlayers = Array.from(map.players.values());
    for (let i = 0; i < mapPlayers.length; ++i) {
      const playerScore = mapPlayers[i].mapScores.get(map.id)[0];
      const previousPlayerScore = mapPlayers[i-1]?.mapScores.get(map.id)[0];
      playerScore.position = playerScore.score == previousPlayerScore?.score ? previousPlayerScore.position : i+1;
    }
  }

  mapRanking.set(Array.from(mapsMap.values()));
};
