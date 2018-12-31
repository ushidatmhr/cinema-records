<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-container">
        <header class="modal-header">Add Record</header>
        <section class="modal-body">
          <form @submit.prevent="save">
            <div class="row-form">
              <label class="label">title</label>
              <div class="text-field">
                <input type="text" class="text-field-input" v-model.trim="cinemaModel.title">
              </div>
            </div>
            <div class="row-form">
              <label class="label">recommend</label>
              <div class="text-field">
                <select v-model="cinemaModel.recommend">
                  <option :value="0"></option>
                  <option :value="1">★</option>
                  <option :value="2">★★</option>
                  <option :value="3">★★★</option>
                </select>
              </div>
            </div>
          </form>
        </section>
        <footer class="modal-footer">
          <button class="btn" @click="cancel">CANCEL</button>
          <button class="btn" @click="save">SAVE</button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Mixins } from "vue-mixin-decorator";
import CinemasMixin from "./CinemasMixin";
import { Prop } from "vue-property-decorator";

@Component
export default class AddRecordModal extends Mixins<CinemasMixin>(CinemasMixin) {
  /** id */
  @Prop()
  id: string;
  /** タイトル */
  @Prop()
  title: string;
  /** リコメンド */
  @Prop()
  recommend: number;

  /** 編集入力モデル */
  cinemaModel: {
    title: string;
    recommend: number;
  };

  //==========================================
  // lifecycle hook
  //==========================================

  /**
   * インスタンス作成時処理
   */
  created() {
    this.cinemaModel = {
      title: this.title,
      recommend: this.recommend
    };
  }

  //==========================================
  // methods
  //==========================================

  /**
   * 入力内容でfirestoreへ保存する。
   */
  save() {
    if (!this.cinemaModel.title) {
      return;
    }

    if (this.id) {
      this.updateRecord();
    } else {
      this.addRecord();
    }
  }

  /**
   * データを新規登録
   */
  private addRecord() {
    this.collection()
      .add({
        title: this.cinemaModel.title,
        recommend: this.cinemaModel.recommend
      })
      .then(docRef => {
        this.$emit("addSuccess");
        this.cancel();
      })
      .catch(function(error) {
        alert(error);
      });
  }

  /**
   * データを更新登録
   */
  private updateRecord() {
    this.collection()
      .doc(this.id)
      .set({
        title: this.cinemaModel.title,
        recommend: this.cinemaModel.recommend
      })
      .then(() => {
        this.$emit("addSuccess");
        this.cancel();
      })
      .catch(error => {
        alert(error);
      });
  }

  /**
   * キャンセルする。
   */
  cancel() {
    this.$emit("cancel");
  }
}
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

          @media screen and (max-width: 750px) {
            flex-basis: 72px;
          }
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