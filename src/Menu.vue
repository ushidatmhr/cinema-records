<template>
    <div id="menu">
        <LoginModal v-if="isOpenLoginModal" @cancel="modalClose"></LoginModal>
        <i class="material-icons" @click="toggleMenuOpen">menu</i>
        <nav class="menu-block" v-if="isOpen">
            <ul class="menu-list">
                <li class="menu-item" @click="$emit('reload')">
                    <i class="material-icons">refresh</i>
                    Reload
                </li>
                <li class="menu-item" @click="signOut">
                    Sign Out
                </li>
                <li class="menu-item">
                    <div class="switch">
                        <input type="checkbox" class="switch-checkbox" v-model="isEditMode" />
                        <div class="switch-background">
                            <div class="switch-knob"/>
                        </div>
                    </div>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: true,
      isEditMode: false,
      isOpenLoginModal: false
    };
  },
  watch: {
    isEditMode(val) {
      var user = this.firebase().auth().currentUser;
      if (val && !user) {
        this.isOpenLoginModal = true;
      }

      this.$emit("toggleEditMode", val);
    }
  },
  methods: {
    toggleMenuOpen() {
      this.isOpen = !this.isOpen;
    },
    signOut() {
      this.firebase()
        .auth()
        .signOut();
    },
    modalClose() {
      this.isOpenLoginModal = false;
    }
  }
};
</script>

<style lang="scss" scoped>
#menu {
  position: relative;

  .menu-block {
    position: absolute;
    min-width: 105px;
    top: 13px;
    right: 13px;
    background-color: #fff;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
      0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);

    .menu-list {
      list-style: none;
      margin: 0;
      padding: 0;

      .menu-item {
        padding: 10px;
        border-bottom: 1px solid #eee;

        &:hover {
          //   background-color: #ddd;
        }

        .switch {
          display: inline-block;
          position: relative;

          .switch-checkbox {
            position: absolute;
            top: 0;
            left: 0;
            width: 28px;
            height: 14px;
            opacity: 0;
            cursor: pointer;
            z-index: 2;

            &:checked ~ .switch-background .switch-knob {
              background-color: #bdbdbd;
              transform: translateX(15px);
              transition: transform 90ms;
            }
          }

          .switch-background {
            display: block;
            position: relative;
            width: 34px;
            height: 14px;
            outline: none;

            &:before {
              display: block;
              position: absolute;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              transition: opacity 90ms cubic-bezier(0.4, 0, 0.2, 1),
                background-color 90ms cubic-bezier(0.4, 0, 0.2, 1);
              border-radius: 7px;
              background-color: #000;
              opacity: 0.38;
              content: "";
            }

            .switch-knob {
              display: block;
              position: absolute;
              width: 20px;
              height: 20px;
              top: -3px;
              left: 0;
              border-radius: 10px;
              background-color: #fafafa;
              z-index: 1;
              box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
                0px 2px 2px 0px rgba(0, 0, 0, 0.14),
                0px 1px 5px 0px rgba(0, 0, 0, 0.12);
              transition: transform 90ms;
            }
          }
        }
      }
    }
  }
}
</style>
