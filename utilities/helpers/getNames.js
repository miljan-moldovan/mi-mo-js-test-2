export function getFullName(...strings) {
  return strings
    .filter(item => !!item)
    .map(item => item.trim())
    .join(' ');
}

export function getProviderFullName(provider): string {
  return getFullName(provider.name, provider.middleName, provider.lastName);
}

export function getUserName(user) {
  return user.firstName || user.lastName ?
    getFullName(user.firstName, user.lastName) : user.username;
}
