<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <h3>Choices:</h3>

        <draggable
          id="first"
          data-source="juju"
          :list="list"
          class='d-flex flex-wrap'
          draggable=".item"
          group="a"
        >
          <div
            outlined
            class=" item"
            v-for="element in list"
            :key="element.name"
          >
            <single-item
              :img="element.img"
              :price="element.price"
              :title="element.title"
              :description="element.description"
            />
          </div>

          <div
            slot="header"
            class="btn-group list-group-item"
            role="group"
            aria-label="Basic example"
          ></div>
        </draggable>
      </v-col>
      <v-col cols="6">
        <h3>Shopping card</h3>

        <draggable
          :list="list2"
          class='d-flex flex-wrap border'
          draggable=".item"
          group="a"
        >
          <div
            outlined
            class="item pa-1"
            v-for="element in list2"
            :key="element.name"
          >
            <single-item
              :img="element.img"
              :price="element.price"
              :title="element.title"
              :description="element.description"
            />
          </div>

          
        </draggable>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import _ from 'lodash'
import draggable from "vuedraggable";
import SingleItem from "./SingleItem";
let id = 1;
export default {
  name: "two-list-headerslots",
  display: "Two list header slot",
  order: 14,
  components: {
    draggable,
    SingleItem,
  },
  data() {
    return {
      list: [
        {
          name: "fish",
          id: 0,
          price: 8.0,
          title: "Fish",
          description: "Fresh salmon",
          img:
            "https://thumbs.dreamstime.com/z/fresh-raw-salmon-red-fish-steak-isolated-white-background-64128737.jpg",
        },
        {
          name: "meat",
          id: 1,
          price: 15.0,
          title: "Meat",
          description: "Steak",
          img: "https://images.megapixl.com/233/2338892.jpg",
        },
        {
          name: "banana",
          id: 2,
          price: 2.0,
          title: "Banana",
          description: "Fresh banana",
          img:
            "https://www.misterproduce.com/wp-content/uploads/2018/10/banana.jpg",
        },
      ],
      list2: [
        // { name: "Jonny 4", id: 3 }, { name: "Guisepe 5", id: 4 }
      ],
    };
  },
  watch: {
    list2(v) {
      
      
      this.$emit("update-total", _.sumBy(v, 'price'));
    },
  },

  methods: {
    add: function () {
      this.list.push({ name: "Juan " + id, id: id++ });
    },
    replace: function () {
      this.list = [{ name: "Edgard", id: id++ }];
    },
    add2: function () {
      this.list2.push({ name: "Juan " + id, id: id++ });
    },
    replace2: function () {
      this.list2 = [{ name: "Edgard", id: id++ }];
    },
  },
};
</script>
<style scoped>
.border{border: 1px solid black;
  min-height: 100px;}

</style>