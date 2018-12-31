<template>
  <div id="app">
    <main class="contents">
      <header class="header">
        <section class="menu">
          <input type="text" placeholder="Search" class="search" v-model="searchText">
          <select class="recommend-select" v-model="searchRecommend">
            <option></option>
            <option :value="0">☆</option>
            <option :value="1">★</option>
            <option :value="2">★★</option>
            <option :value="3">★★★</option>
          </select>
          <Menu class="hamburger" @reload="reload" @toggleEditMode="toggleEditMode"></Menu>
        </section>
      </header>
      <section class="sub-info">
        <label class="item-count">{{displayCount}} / {{Object.keys(cinemas).length}}</label>
      </section>
      <section class="board">
        <ul class="list-item">
          <li v-for="(item, key) in cinemas" v-if="item.visible" :key="key">
            <div class="item">
              <span class="item-info">
                <span>{{item.title}}</span>
                <span class="recommends">
                  <i
                    class="material-icons"
                    v-for="(i, key) in Number(item.recommend)"
                    :key="key"
                  >star</i>
                  <i class="material-icons" v-if="item.recommend == 0"></i>
                </span>
              </span>
              <span class="actions">
                <a
                  target="_blank"
                  class="material-icons"
                  :href="'https://www.google.co.jp/search?q=映画+' + item.title"
                >web</a>
                <span v-if="editMode">
                  <i class="material-icons" @click="doDelete(key)">delete</i>
                  <i class="material-icons" @click="openEditModal(key)">mode_edit</i>
                </span>
              </span>
            </div>
          </li>
        </ul>
      </section>
      <AddRecordModal
        v-if="isOpenEditModal"
        @addSuccess="reload"
        @cancel="modalClose"
        :id="editItemId"
        :title="cinemas[editItemId].title"
        :recommend="cinemas[editItemId].recommend"
      ></AddRecordModal>
      <i class="material-icons loading" v-if="isLoading">sync</i>
    </main>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import { Watch } from "vue-property-decorator";
import { Component, Mixins } from "vue-mixin-decorator";
import CinemasMixin from "./CinemasMixin";

@Component
export default class App extends Mixins<CinemasMixin>(CinemasMixin) {
  /** 表示用オブジェクト */
  cinemas = {};
  /** 検索文字 */
  searchText = "";
  /** 検索スター数 */
  searchRecommend = "";
  /** 編集モード */
  editMode = false;
  /** 編集対象ID */
  editItemId = null;
  /** 編集モーダル表示フラグ */
  isOpenEditModal = false;
  /** 読み込み中フラグ */
  isLoading = false;

  //==========================================
  // lifecycle hook
  //==========================================

  /**
   * インスタンス作成時処理
   */
  created() {
    this.selectForAll();
  }

  //==========================================
  //
  //==========================================

  /**
   * 検索文字列の変更時に検索を実行する。
   */
  @Watch("searchText")
  changeSearchText(newValue: string, oldValue: string) {
    this.doSearch();
  }

  /**
   * レコメンドの変更時に検索を実行する。
   */
  @Watch("searchRecommend")
  changeSearchRecommend(newValue: string, oldValue: string) {
    this.doSearch();
  }

  //==========================================
  // get
  //==========================================

  /**
   * 画面への表示件数を取得
   */
  get displayCount(): number {
    var count = 0;
    Object.keys(this.cinemas).forEach(element => {
      if (this.cinemas[element].visible) {
        count++;
      }
    });

    return count;
  }

  //==========================================
  // methods
  //==========================================

  /**
   * データを再取得する。
   */
  reload() {
    this.cinemas = {};
    this.selectForAll();
  }

  /**
   * データを全件取得する。
   */
  selectForAll() {
    this.isLoading = true;

    this.collection()
      .orderBy("title")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.$set(this.cinemas, doc.id, {
            title: doc.data().title,
            recommend: doc.data().recommend,
            visible: true
          });
        });

        this.isLoading = false;
      });
  }

  /**
   * 絞り込みを実行
   */
  doSearch() {
    Object.keys(this.cinemas).forEach(element => {
      if (
        (!this.searchText ||
          ~this.cinemas[element].title.indexOf(this.searchText)) &&
        (this.searchRecommend === "" ||
          this.cinemas[element].recommend == this.searchRecommend)
      ) {
        this.cinemas[element].visible = true;
      } else {
        this.cinemas[element].visible = false;
      }
    });
  }

  /**
   * 編集モードを切り替える
   */
  toggleEditMode(flag) {
    this.editMode = flag;
  }

  /**
   * 編集モーダルを表示する
   */
  openEditModal(id: string) {
    this.editItemId = id;
    this.isOpenEditModal = true;
  }

  /**
   * モーダルを閉じる
   */
  modalClose() {
    this.isOpenEditModal = false;
  }

  /**
   * レコード削除を実施
   */
  doDelete(id) {
    if (confirm("削除しますか？")) {
      this.collection()
        .doc(id)
        .delete()
        .then(() => {
          this.reload();
        })
        .catch(error => {
          console.error("delete faild", error);
          alert(error);
        });
    }
  }
}
</script>


<style lang="scss" scoped>
$contentWidth: 600px;

.contents {
  display: flex;
  flex-direction: column;
  height: 100vh;
  align-items: flex-start;
  margin: 0 auto;

  .header {
    background-color: #212121;
    width: 100%;
    height: 57px;
    display: flex;
    flex-direction: row;

    @media screen and (max-width: 750px) {
      width: 100%;
    }

    .menu {
      width: $contentWidth;
      margin: auto;
      padding: 0 10px;
      display: flex;
      flex-direction: row;
      align-items: stretch;

      .search {
        border: 1px solid #ddd;
        border-radius: 12px;
        height: 21px;
        padding: 2px 10px;

        &:focus {
          outline: none;
        }
      }

      .recommend-select {
        margin-left: 10px;
      }
    }

    .hamburger {
      margin-right: 0;
      margin-left: auto;
      display: inline-block;
    }
  }

  .sub-info {
    width: $contentWidth;
    margin: auto;
    display: flex;

    @media screen and (max-width: 750px) {
      width: 100%;
    }

    .item-count {
      width: 80px;
      text-align: center;
    }
  }

  .board {
    padding: 0;
    height: 100vh;
    width: $contentWidth;
    margin: 5px auto;
    background-color: #fff;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
      0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
    overflow-y: scroll;

    @media screen and (max-width: 750px) {
      width: 100%;
    }

    .list-item {
      list-style: none;
      margin: 0;
      padding: 0;

      .item {
        min-height: 72px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        border-bottom: 1px solid #eee;
        padding: 0 16px;

        .item-info {
          display: flex;
          flex-direction: column;
          width: 264px;

          .recommends {
            padding-left: 4px;

            .material-icons {
              font-size: 11px;
            }
          }
        }

        .actions {
          margin-right: 0;
          margin-left: auto;

          .material-icons {
            color: #333;
            text-decoration: none;
            cursor: pointer;

            &:not(:last-child) {
              margin-right: 11px;
            }
          }
        }
      }
    }
  }
}

.loading {
  animation: spin 1.5s linear infinite;
  position: fixed;
  top: 50%;
  left: 50%;
  color: #cfd8dc;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}
</style>
