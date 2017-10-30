<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-container">
                <header class="modal-header">
                    ログイン
                </header>
                <section class="modal-body">
                    <span class="error-message" v-if="showError">Not Login</span>
                    <form @submit.prevent="doLogin">
                        <div>
                            mail
                            <input type="email" v-model.trim="email" />
                        </div>
                        <div>
                            password
                            <input type="password" v-model.trim="password" />
                        </div>
                    </form>
                </section>
                <footer class="modal-footer">
                    <button class="btn" @click="cancel">CANCEL</button>
                    <button class="btn" @click="doLogin">LOGIN</button>
                </footer>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      showError: false
    };
  },
  methods: {
    doLogin() {
      this.firebase()
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(function(usr) {
          this.cancel();
        })
        .catch(error => {
          this.showError = true;
        });
    },
    cancel() {
      this.$emit("cancel");
    },
    clear() {
      email = "";
      password = "";
      showError = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-mask {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 5;

  .modal-container {
    background-color: #ffffff;
    min-width: 640px;
    display: flex;
    flex-direction: column;

    .error-message {
      color: #ff0000;
    }

    .modal-header {
      padding: 24px 24px 0;
      font-weight: bold;
    }

    .modal-body {
      padding: 0 24px 24px;
      margin-top: 20px;
    }

    .modal-footer {
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .btn {
        background-color: transparent;
        border: none;
        height: 36px;
        padding: 0 16px;
        font-weight: 500;
        outline: none;

        &:focus,
        &:hover {
          background-color: #ebebeb;
        }
      }
    }
  }
}
</style>
