export default function fetchFormCache (
  formIdentifier: string,
  itemIdentifier: string,
  state: Object
) {
  if (state && state[formIdentifier] && state[formIdentifier][itemIdentifier])
    return state[formIdentifier][itemIdentifier];
  else return false;
}
