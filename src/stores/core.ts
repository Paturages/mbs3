import type { Me, Player, Referee, Commentator, Streamer, Stage } from '../types';
import { writable } from 'svelte/store';
import query from './core.gql';

const { API_URL } = __myapp.env;

export const me = writable<Me>(null);
export const players = writable<Player[]>(null);
export const referees = writable<Referee[]>([]);
export const commentators = writable<Commentator[]>([]);
export const streamers = writable<Streamer[]>([]);
export const stages = writable<Stage[]>([]);

export const page = writable<string>(null);
export const pages = new Set(['players', 'countries', 'qualifiers'])
const onHashChange = () => {
  const { hash } = location;
  const [, query] = hash.split('/');
  if (pages.has(query)) {
    page.set(query);
  } else {
    page.set('home');
    if (hash != '#/') {
      location.hash = '#/';
    }
  }
};
window.addEventListener('hashchange', onHashChange);
onHashChange();

export const api = (path: string, options: Parameters<typeof fetch>[1] = { headers: {} }) =>
  fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: access_token ? `Bearer ${access_token}` : undefined,
      ...options.headers
    }
  }).then(res => res.json());

let access_token;
(async () => {
  const { data } = await api('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });
  stages.set(data.stages);
  players.set(data.players);
  const playersMap = new Map<string, Player>(data.players.map(player => [player.id, player]));
  referees.set(data.referees);
  const refereesMap = new Map<string, Referee>(data.referees.map(ref => [ref.id, ref]));
  commentators.set(data.commentators);
  const commentatorsMap = new Map<string, Commentator>(data.commentators.map(commentator => [commentator.id, commentator]));
  streamers.set(data.streamers);
  const streamersMap = new Map<string, Streamer>(data.streamers.map(streamer => [streamer.id, streamer]));
  
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include'
  });
  if (res.status == 200) {
    const json = await res.json();
    access_token = json.data.access_token;
    const {
      data: {
        first_name,
        email,
        avatar
      }
    } = await api('/users/me?fields=first_name,email');
    let shouldChangeTimezone = false;
    const timezone = -new Date().getTimezoneOffset() / 60;
    const mePlayer = playersMap.get(email);
    if (mePlayer) {
      shouldChangeTimezone = !mePlayer.timezone || !mePlayer.timezone.endsWith(String(timezone));
    }
    const meReferee = refereesMap.get(email);
    if (meReferee && !shouldChangeTimezone) {
      shouldChangeTimezone = !meReferee.timezone || !meReferee.timezone.endsWith(String(timezone));
    }
    const meCommentator = commentatorsMap.get(email);
    if (meCommentator && !shouldChangeTimezone) {
      shouldChangeTimezone = !meCommentator.timezone || !meCommentator.timezone.endsWith(String(timezone));
    }
    const meStreamer = streamersMap.get(email);
    if (meStreamer && !shouldChangeTimezone) {
      shouldChangeTimezone = !meStreamer.timezone || !meStreamer.timezone.endsWith(String(timezone));
    }
    me.set({
      avatar,
      username: first_name,
      id: email,
      player: mePlayer,
      referee: meReferee,
      commentator: meCommentator,
      streamer: meStreamer,
      qualifier: mePlayer?.qualifier
    });

    if (shouldChangeTimezone) {
      await api('/custom/profile/timezone', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ offset: new Date().getTimezoneOffset() })
      });
    }
  }
})();