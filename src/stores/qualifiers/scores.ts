import type { Me, Player, Score, Map as OsuMap } from '../../types';
import { writable } from 'svelte/store';
import query from './scores.gql';
import { api } from '../core';

export interface QualifierScore extends Score {
  lobby: {
    name: string;
    link: string;
  };
}

export interface QualifierPlayer extends Player {
  position?: number;
  totalScore: number;
  sumOfPositions: number;
  mapScores: Map<string, QualifierScore[]>;
}

export interface QualifierMap extends OsuMap {
  players: Map<string, QualifierPlayer>;
}

export const regularMapRanking = writable<QualifierMap[]>(null);
export const regularPlayerRanking = writable<QualifierPlayer[]>(null);

export const eliteMapRanking = writable<QualifierMap[]>(null);
export const elitePlayerRanking = writable<QualifierPlayer[]>(null);

export const myQualifier = writable<QualifierPlayer>(null);

// This assumes that the list of players has been fetched from stores/core,
// so players have to be fed in the init.
export const init = async (rawPlayers: Player[]) => {
  const regularPlayers = rawPlayers.filter(p => !p.elite);
  const elitePlayers = rawPlayers.filter(p => p.elite);

  const { data } = await api('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });

  // there are at least 3 or 4 different meanings of map here please help
  const initMapPlayers = (map: OsuMap): [string, QualifierMap] => [
    map.id,
    {
      ...map,
      players: new Map()
    }
  ];
  const regularMapsMap: Map<string, QualifierMap> = new Map(data.maps.map(initMapPlayers));
  const eliteMapsMap: Map<string, QualifierMap> = new Map(data.maps.map(initMapPlayers));
  const initPlayerScores = (player: Player): [string, QualifierPlayer] => [
    player.id,
    {
      ...player,
      totalScore: 0,
      // Initialize players to bottom ranking
      sumOfPositions: rawPlayers.length * data.maps.length,
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
  const regularPlayersMap: Map<string, QualifierPlayer> = new Map(regularPlayers.map(initPlayerScores));
  const elitePlayersMap: Map<string, QualifierPlayer> = new Map(elitePlayers.map(initPlayerScores));

  // The fetched scores are ordered by descending score,
  // so the map leaderboards should be already sorted upon insertion.
  
  // Settings Map values should conserve order when doing .entries() or .values()
  data.qualifier_scores.forEach((score: QualifierScore) => {
    let player: QualifierPlayer;

    if (player = regularPlayersMap.get(score.player?.id)) {
      if (!regularMapsMap.has(score.map.id)) return;

      player.mapScores.get(score.map.id).push(score);
      const mapPlayers = regularMapsMap.get(score.map.id).players;
      if (!mapPlayers.has(score.player.id)) {
        mapPlayers.set(score.player.id, player);
      }
    } else if (player = elitePlayersMap.get(score.player?.id)) {
      if (!eliteMapsMap.has(score.map.id)) return;

      player.mapScores.get(score.map.id).push(score);
      const mapPlayers = eliteMapsMap.get(score.map.id).players;
      if (!mapPlayers.has(score.player.id)) {
        mapPlayers.set(score.player.id, player);
      }
    }
  });

  // Compute map player positions
  for (const map of regularMapsMap.values()) {
    const mapPlayers = Array.from(map.players.values());
    for (let i = 0; i < mapPlayers.length; ++i) {
      const playerScore = mapPlayers[i].mapScores.get(map.id)[0];
      const previousPlayerScore = mapPlayers[i-1]?.mapScores.get(map.id)[0];
      playerScore.position = playerScore.score == previousPlayerScore?.score ? previousPlayerScore.position : i+1;
    }
  }
  for (const map of eliteMapsMap.values()) {
    const mapPlayers = Array.from(map.players.values());
    for (let i = 0; i < mapPlayers.length; ++i) {
      const playerScore = mapPlayers[i].mapScores.get(map.id)[0];
      const previousPlayerScore = mapPlayers[i-1]?.mapScores.get(map.id)[0];
      playerScore.position = playerScore.score == previousPlayerScore?.score ? previousPlayerScore.position : i+1;
    }
  }

  // Compute player sum of positions and total score
  // and set one's own qualifier
  for (const player of regularPlayersMap.values()) {
    player.sumOfPositions = data.maps.reduce((sum, map) => {
      player.totalScore += player.mapScores.get(map.id)[0]?.score;
      return sum + (player.mapScores.get(map.id)[0]?.position || rawPlayers.length);
    }, 0);
  }
  for (const player of elitePlayersMap.values()) {
    player.sumOfPositions = data.maps.reduce((sum, map) => {
      player.totalScore += player.mapScores.get(map.id)[0]?.score;
      return sum + (player.mapScores.get(map.id)[0]?.position || rawPlayers.length);
    }, 0);
  }

  const sortPlayers = (a: QualifierPlayer, b: QualifierPlayer) => {
    // Tiebreaker = totalScore
    if (a.sumOfPositions == b.sumOfPositions) {
      return a.totalScore < b.totalScore ? 1 : -1;
    }
    return a.sumOfPositions < b.sumOfPositions ? -1 : 1;
  };
  const regularSortedPlayers = Array.from(regularPlayersMap.values()).sort(sortPlayers);
  const eliteSortedPlayers = Array.from(elitePlayersMap.values()).sort(sortPlayers);
  regularSortedPlayers.forEach((p, i) => p.position = i+1);
  eliteSortedPlayers.forEach((p, i) => p.position = i+1);

  regularMapRanking.set(Array.from(regularMapsMap.values()));
  eliteMapRanking.set(Array.from(eliteMapsMap.values()));
  regularPlayerRanking.set(regularSortedPlayers);
  elitePlayerRanking.set(eliteSortedPlayers);
};

export const initMyQualifier = (playerRanking: QualifierPlayer[], me: Me) => {
  const myQualifierIndex = playerRanking.findIndex(player => player.id == me?.id);
  if (myQualifierIndex > -1) {
    myQualifier.set({ ...playerRanking[myQualifierIndex], position: myQualifierIndex + 1 });
  }
}