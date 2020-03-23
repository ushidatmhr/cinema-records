<template>
  <div id="menu">
    <AddRecordModal
      v-if="isOpenAddModal"
      @addSuccess="$emit('reload')"
      @cancel="modalClose"
      id
      title
      recommend="0"
    ></AddRecordModal>
    <LoginModal v-if="isOpenLoginModal" @cancel="modalClose"></LoginModal>
    <i class="material-icons menu-icon" @click="toggleMenuOpen">more_vert</i>
    <transition name="menu">
      <nav class="menu-block" v-if="isOpen">
        <ul class="menu-list">
          <li class="menu-item select-item" @click="$emit('reload')">
            <i class="material-icons">refresh</i>
            <span>Reload</span>
          </li>
          <li class="menu-item select-item" @click="signOut">
            <i class="material-icons">person_outline</i>
            <span>Sign Out</span>
          </li>
          <li class="menu-item select-item" @click="openAddModal">
            <i class="material-icons">add</i>
            <span>Add Record</span>
          </li>
          <li class="menu-item">
            <i class="material-icons">mode_edit</i>
            <div class="switch">
              <input type="checkbox" class="switch-checkbox" v-model="isEditMode" />
              <div class="switch-background">
                <div class="switch-knob" />
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Watch } from "vue-property-decorator";
import { Component, Mixins } from "vue-mixin-decorator";
import CinemasMixin from "./CinemasMixin";

@Component
export default class Menu extends Mixins<CinemasMixin>(CinemasMixin) {
  /** メニューの表示判定 */
  isOpen: boolean = false;
  /** 追加モーダルの表示フラグ */
  isOpenAddModal: boolean = false;
  /** 編集モード */
  isEditMode: boolean = false;
  /** ログインモーダルの表示フラグ */
  isOpenLoginModal: boolean = false;

  private eventRemovers: any[];

  //==========================================
  // lifecycle hook
  //==========================================

  created() {
    // 画面クリックでメニュー閉じるためにイベント登録
    this.listen(window, "click", e => {
      if (!this.$el.contains(e.srcElement)) {
        this.closeMenu();
      }
    });
  }

  destroyed() {
    if (this.eventRemovers) {
      this.eventRemovers.forEach(function(eventRemover) {
        eventRemover.remove();
      });
    }
  }

  /**
   * 追加モーダル変更時処理
   */
  @Watch("isOpenAddModal")
  doOpenAddModal(newValue: string, oldValue: string) {
    if (newValue && !this.isAuthenticated()) {
      this.isOpenLoginModal = true;
    }
  }

  /**
   * 編集モードの変更時処理
   */
  @Watch("isEditMode")
  chanegEditMode(newValue: string, oldValue: string) {
    if (newValue && !this.isAuthenticated()) {
      this.isOpenLoginModal = true;
    }

    this.$emit("toggleEditMode", newValue);
  }

  //==========================================
  // methods
  //==========================================

  /**
   * イベント登録
   */
  listen(target: Window, eventType: string, callback: EventListener) {
    if (!this.eventRemovers) {
      this.eventRemovers = [];
    }

    target.addEventListener(eventType, callback);

    this.eventRemovers.push({
      remove: function() {
        target.removeEventListener(eventType, callback);
      }
    });
  }

  /**
   * メニューの表示・非表示を切り替える
   */
  toggleMenuOpen() {
    this.isOpen = !this.isOpen;
  }

  /**
   * メニューを閉じる
   */
  closeMenu() {
    this.isOpen = false;
  }

  /**
   * サインアウト実行
   */
  signOut() {
    this.firebase
      .auth()
      .signOut()
      .then(() => {})
      .catch(error => {
        alert(error);
      });
  }

  /**
   * モーダルを閉じる
   */
  modalClose() {
    this.isOpenLoginModal = false;
    this.isOpenAddModal = false;
  }

  /**
   * 追加用モーダルを表示する。
   */
  openAddModal() {
    this.isOpenAddModal = true;
  }

  /**
   * firebase認証済みか判定
   */
  private isAuthenticated(): boolean {
    var user = this.firebase.auth().currentUser;
    if (!user) {
      return false;
    } else {
      return true;
    }
  }
}
</script>

<style lang="scss" scoped>
#menu {
  position: relative;

  .menu-icon {
    cursor: pointer;
    color: #ffffff;
  }

  .menu-block {
    position: absolute;
    min-width: 155px;
    z-index: 9;
    top: 0;
    right: 0;
    background-color: #fff;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
      0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);

    .menu-list {
      list-style: none;
      margin: 0;
      padding: 0;

      .menu-item {
        padding: 0 16px;
        height: 48px;
        display: flex;
        align-items: center;
        flex-direction: row;

        &.select-item {
          cursor: pointer;

          &:active {
            background-color: #ddd;
          }
        }

        .material-icons {
          font-size: 21px;
          margin-right: 8px;
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

.menu-enter-active,
.menu-leave-active {
  transition: all 0.2s ease-out;
}

.menu-enter,
.menu-leave-to {
  opacity: 0;
  transform-origin: top right 0px;
}
</style>
