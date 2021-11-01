const myuser = {
    // 因为模块化了，所以解决刷新问题的代码需要改造一下
    state: sessionStorage.getItem('userState') ? JSON.parse(sessionStorage.getItem('userState')) : {
      myuser: {
        id: ''
      }
    },
    getters: {
      getUser(state) {
        return state.myuser;
      }
    },
    mutations: {
      updateUser(state, myuser) {
        state.myuser = myuser;
      }
    },
    actions: {
      asyncUpdateUser(context, myuser) {
        context.commit('updateUser', myuser);
      }
    }
  };
  
  export default myuser;