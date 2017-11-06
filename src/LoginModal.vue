<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-container">
                <header class="modal-header">
                    ログイン
                </header>
                <section class="modal-body">
                    <span class="error-message" v-if="errorMessage">{{errorMessage}}</span>
                    <form @submit.prevent="doLogin">
                        <div class="row-form">
                            <label class="label">
                                mail
                            </label>
                            <div class="text-field">
                                <input type="email" class="text-field-input" v-model.trim="email" />
                            </div>
                        </div>
                        <div class="row-form">
                            <label class="label">
                                password
                            </label>
                            <div class="text-field">
                                <input type="password" class="text-field-input" v-model.trim="password" />
                            </div>
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
      errorMessage: ""
    };
  },
  methods: {
    doLogin() {
      this.firebase()
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(usr => {
          this.cancel();
        })
        .catch(error => {
          this.errorMessage = error;
        });
    },
    cancel() {
      this.$emit("cancel");
    },
    clear() {
      email = "";
      password = "";
      showError = {};
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
    width: 640px;
    display: flex;
    flex-direction: column;

    @media screen and (max-width: 750px) {
      width: 90%;
    }

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

      .row-form {
        display: flex;
        flex-direction: row;
        margin-bottom: 10px;
        align-items: center;

        .label {
          text-align: right;
          flex-basis: 100px;
          padding: 0 10px;
        }

        .text-field {
          width: 60%;

          .text-field-input {
            width: 100%;
            border: none;
            border-bottom: 1px rgba(0, 0, 0, 0.12) solid;
            padding-bottom: 8px;

            &:focus {
              outline: none;
              border-bottom-color: #212121;
            }
          }
        }
      }
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
