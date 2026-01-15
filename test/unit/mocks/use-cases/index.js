/*
  Mocks for the use cases.
*/
/* eslint-disable */

class UserUseCaseMock {
  async createUser(userObj) {
    return {}
  }

  async getAllUsers() {
    return true
  }

  async getUser(params) {
    return true
  }

  async updateUser(existingUser, newData) {
    return true
  }

  async deleteUser(user) {
    return true
  }

  async authUser(login, passwd) {
    return {
      generateToken: () => {}
    }
  }
}

class UsageUseCaseMock {
  async cleanUsage() {
    return {}
  }

  async getRestSummary() {
    return true
  }

  async getTopIps(params) {
    return true
  }

  async getTopEndpoints(existingUser, newData) {
    return true
  }

  async clearUsage() {
    return true
  }

  async saveUsage() {
    return true
  }
}

class SlpUseCaseMock {
  async getAddress(address) {
    return {}
  }

  async getTx(txid) {
    return {}
  }

  async getToken(tokenId, withTxHistory) {
    return {}
  }

  async getStatus() {
    return {}
  }
}

class UseCasesMock {
  constuctor(localConfig = {}) {
    // this.user = new UserUseCaseMock(localConfig)
  }

  user = new UserUseCaseMock()
  usage = new UsageUseCaseMock()
  slp = new SlpUseCaseMock()
}

export default UseCasesMock;
