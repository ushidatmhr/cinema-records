<template>
  <div id="app">
    <main class="contents">
      <header class="header">
        <section class="menu">
          <input type="text" placeholder="Search" class="search" v-model="searchText" />
          <select class="recommend-select" v-model="searchRecommend">
            <option></option>
            <option :value="0">☆</option>
            <option :value="1">★</option>
            <option :value="2">★★</option>
            <option :value="3">★★★</option>
          </select>
          <i @click="switchSortMode" class="material-icons sort-icon">{{sortIconName}}</i>
          <Menu class="hamburger" @reload="reload" @toggleEditMode="toggleEditMode"></Menu>
        </section>
      </header>
      <section class="sub-info">
        <label class="item-count">{{displayCount}} / {{cinemas.length}}</label>
      </section>
      <section class="board">
        <ul class="list-item">
          <li v-for="(item) in cinemas" :key="item.id">
            <div class="item" v-if="item.visible">
              <span class="item-info">
                <span>{{item.title}}</span>
                <span>
                  <span class="recommends">
                    <i
                      class="material-icons"
                      v-for="(i, key) in Number(item.recommend)"
                      :key="key"
                    >star</i>
                    <i class="material-icons" v-if="item.recommend == 0"></i>
                  </span>
                  <span class="created-date">{{formatDate(item.watchedDate)}}</span>
                </span>
              </span>
              <span class="actions">
                <a
                  target="_blank"
                  class="material-icons"
                  :href="'https://www.google.co.jp/search?q=映画+' + item.title"
                >web</a>
                <span v-if="editMode">
                  <i class="material-icons" @click="doDelete(item.id)">delete</i>
                  <i class="material-icons" @click="openEditModal(item.id)">mode_edit</i>
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
        :id="editTargetItem.id"
        :title="editTargetItem.title"
        :recommend="editTargetItem.recommend"
        :watchedDate="editTargetItem.watchedDate"
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

enum SortMode {
  Alphabet,
  Date
}

@Component
export default class App extends Mixins<CinemasMixin>(CinemasMixin) {
  /** 表示用オブジェクト */
  cinemas: {
    id: string;
    title: string;
    recommend: number;
    watchedDate: Date;
    visible: boolean;
  }[] = [];
  /** 検索文字 */
  searchText = "";
  /** 検索スター数 */
  searchRecommend = "";
  /** 編集モード */
  editMode = false;
  /** 編集対象 */
  editTargetItem = null;
  /** 編集モーダル表示フラグ */
  isOpenEditModal = false;
  /** 読み込み中フラグ */
  isLoading = false;
  /** ソートモード */
  sortMode = SortMode.Alphabet;

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

  @Watch("sortMode")
  sortCinemaList(newValue: string, oldValue: string) {
    this.cinemas.sort((a, b) => {
      if (this.sortMode == SortMode.Date) {
        let timeA = a.watchedDate ? a.watchedDate.getTime() : 0;
        let timeB = b.watchedDate ? b.watchedDate.getTime() : 0;
        return timeB - timeA;
      } else {
        return b.title < a.title ? 1 : -1;
      }
    });
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

  get sortIconName(): string {
    switch (this.sortMode) {
      case SortMode.Alphabet:
        return "font_download";
      case SortMode.Date:
        return "calendar_today";
    }
  }

  //==========================================
  // methods
  //==========================================

  /**
   * データを再取得する。
   */
  reload() {
    this.cinemas = [];
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
          this.cinemas.push({
            id: doc.id,
            title: doc.data().title,
            recommend: doc.data().recommend,
            watchedDate: doc.data().watchedDate
              ? doc.data().watchedDate.toDate()
              : null,
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
    let edit = this.cinemas.filter(item => item.id == id);
    this.editTargetItem = edit[0];
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

  /**
   * 日付を表示用フォーマットに変換する。
   */
  formatDate(date: Date): string {
    if (!date) {
      return "";
    }

    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return `${year}/${month}/${day}`;
  }

  /**
   * 並べ替えモードを切り替える
   */
  switchSortMode() {
    switch (this.sortMode) {
      case SortMode.Alphabet:
        this.sortMode = SortMode.Date;
        break;
      case SortMode.Date:
        this.sortMode = SortMode.Alphabet;
        break;
    }
  }
}
</script>


<style lang="scss">
@font-face {
  font-family: "CinemaFont";
  src: url("./assets/Cinema_VFP_subset.ttf");
}

body,
body * {
  font-family: "CinemaFont";
}

body {
  font-size: 18px;
  margin: 0;
  background-color: #eee;
}
</style>


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

      .sort-icon {
        color: #fff;
        cursor: pointer;
        padding: 2px 16px;
        user-select: none;
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
      text-align: center;
      padding: 2px 5px;
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
    -webkit-overflow-scrolling: touch;

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
            display: inline-block;
            padding-left: 4px;
            width: 36px;

            .material-icons {
              font-size: 11px;
            }
          }

          .created-date {
            font-size: 13px;
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
