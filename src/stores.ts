import { writable } from 'svelte/store';

const { API_URL } = __myapp.env;

export interface Me {
  avatar: string;
  username: string;
  id: string;
  player?: Player;
}
export const me = writable<Me>(null);

export interface Player {
  id: string;
  username: string;
  country: string;
  avatar: string;
  timezone: string;
  ranking: number;
  pp: number;
}
export const players = writable<Player[]>(null);

export const page = writable<string>(null);

const pages = new Set(['players', 'countries'])
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
  const { data: playersPayload } = await api('/items/players?fields=id,username,country,avatar,timezone,ranking,pp&sort=ranking&limit=-1');
  players.set(playersPayload);
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
    const mePlayer = playersPayload.find(({ id }) => email == id);
    me.set({
      avatar,
      username: first_name,
      id: email,
      player: mePlayer
    });

    // Redirect to players to confirm registration
    if (!mePlayer) location.hash = '#/players';
  }
})();
