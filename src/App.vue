<template>
    <div id="app">
        <main class="contents">
            <header class="header">
                <section class="menu">
                    <input type="text" placeholder="Search" class="search" v-model="searchText"/>
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
                <label class="item-count">
                    {{displayCount}} / {{Object.keys(cinemas).length}}
                </label>
            </section>
            <section class="board">
                <ul class="list-item">
                    <li v-for="(item, key) in cinemas" v-if="item.visible" :key="key">
                        <div class="item" v-if="key == changeItemId">
                            <span class="item-info">
                                <input type="text" v-model.trim="edit.title"/>
                                <select v-model="edit.recommend">
                                    <option>0</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                </select>
                            </span>
                            <span class="actions">
                                <i class="material-icons" @click="doDelete(key)">delete</i>
                                <i class="material-icons" @click="cancel">clear</i>
                                <i class="material-icons" @click="done(key)">done</i>
                            </span>
                        </div>
                        <div class="item" v-else>
                            <span class="item-info">
                                <span>
                                    {{item.title}}
                                </span>
                                <span class="recommends">
                                    <i class="material-icons" v-for="(i, key) in item.recommend" :key="key">star</i>
                                    <i class="material-icons" v-if="item.recommend == 0"></i>
                                </span>
                            </span>
                            <span class="actions">
                                <a target="_blank" class="material-icons" :href="'https://www.google.co.jp/search?q=映画+' + item.title">web</a>
                                <i class="material-icons" v-if="editMode" @click="changeEditView(key)">mode_edit</i>
                            </span>
                        </div>
                    </li>
                </ul>
            </section>
        </main>
    </div>
</template>


<script>
export default {
  name: "app",
  data() {
    return {
      cinemas: {},
      searchText: "",
      searchRecommend: "",
      editMode: false,
      changeItemId: null,
      edit: {
        title: "",
        recommend: 0
      }
    };
  },
  created: function() {
    this.firestore()
      .collection("cinemas")
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
      });
  },
  computed: {
    displayCount() {
      var count = 0;
      Object.keys(this.cinemas).forEach(element => {
        if (this.cinemas[element].visible) {
          count++;
        }
      });

      return count;
    }
  },
  watch: {
    searchText(val) {
      this.searchCinema();
    },
    searchRecommend(val) {
      this.searchCinema();
    }
  },
  methods: {
    reload() {
      this.cinemas = {};
      // TODO createdと同じ処理になってる
      this.firestore()
        .collection("cinemas")
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
        });
    },
    toggleEditMode(flag) {
      this.editMode = flag;
    },
    searchCinema() {
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
    },
    changeEditView(id) {
      this.changeItemId = id;
      this.edit.title = this.cinemas[id].title;
      this.edit.recommend = this.cinemas[id].recommend;
    },
    cancel() {
      this.changeItemId = null;
      this.edit.title = "";
    },
    done(id) {
      var title = this.edit.title;
      var recommend = Number(this.edit.recommend);

      this.firestore()
        .collection("cinemas")
        .doc(id)
        .set({
          title: title,
          recommend: recommend
        })
        .then(function() {
          console.log("Document successfully written!");
        })
        .catch(function(error) {
          alert(error);
        });

      this.cinemas[id].title = title;
      this.cinemas[id].recommend = recommend;

      this.cancel();
    },
    doDelete(id) {
      if (confirm("削除しますか？")) {
        this.firestore()
          .collection("cinemas")
          .doc(id)
          .delete()
          .then(() => {
            console.log("delete success");
            delete this.cinemas[id];
            this.cancel();
          })
          .catch(function(error) {
            console.error("delete faild", error);
          });
      }
    }
  }
};
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
</style>

<style>
body {
  font-family: "Noto Sans JP", sans-serif;
  font-size: 100%;
  background-color: #eee;
}
</style>
