import { writable } from 'svelte/store';

export const results = writable<any[]>(null);

export const init = async () => {
  const raw = await fetch('/data/groups-results.json');
  const json = await raw.json();
  let groupCount = 1;
  json.forEach((row, i) => {
    if (groupCount < 3) row.qualified = true;
    groupCount = json[i+1]?.group != row.group ? 1 : groupCount + 1;
  });
  results.set(json);
};
