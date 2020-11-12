import { AsyncStorage } from 'react-native';
import { types, flow } from 'mobx-state-tree';

import { customersApi } from '../api/Api';

const TOKEN_KEY = '@instore/token';

const UserInfo = types.model('UserInfo', {
  _id: types.identifier,
  firstname: types.string,
  lastname: types.string,
  avatarUrl: types.maybe(types.string)
})
export const CurrentUser = types.model('CurrentUser', {
  authToken: types.maybe(types.string),
  info: types.maybe(UserInfo),
})
.actions(self => ({
  getAuthToken: flow(function*() {
    try {
      const token = yield AsyncStorage.getItem(TOKEN_KEY);

      if (token) {
        self.authToken = token
      } else {

      }
    } catch (error) {
      console.log('error', error);
    }
  }),
  saveToken: flow(function*(token) {
    try {
      yield AsyncStorage.setItem(TOKEN_KEY, token)
    } catch (error) {
    console.log('error', error);
    }
  }),
  login: flow( function*(providerToken, provider) {
    try {
      const res = yield customersApi.post({
        token: providerToken,
        provider
      }).json()

      console.log('result' , res);
    } catch (error) {
      console.log('error' , error);
    }
  })
}))
