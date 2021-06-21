<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6">
        <h3>Choices:</h3>

        <draggable
          id="first"
          v-model="list"
          class="d-flex flex-wrap border"
          draggable=".item"
          group="a"
        >
          <div
            outlined
            class="item"
            v-for="element in list"
            :key="element.name"
          >
            <single-item
              v-bind="element"
              actionImg="mdi-plus"
              @itemClicked="itemAdd(element.itemId)"
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
        <h3>Shopping cart</h3>

        <draggable
          v-model="shoppingCart"
          class="d-flex flex-wrap border justify-center"
          draggable=".item"
          group="a"
        >
          <div
            v-if="!isShoppingCartEmpty"
            outlined
            class="item pa-1"
            v-for="element in shoppingCart"
            :key="element.name"
          >
            <single-item
              v-bind="element"
              actionImg="mdi-minus"
              @itemClicked="itemRemove(element.itemId)"
            />
          </div>
          <div v-if="isShoppingCartEmpty" class="align-self-center">
            Shopping cart is empty
          </div>
        </draggable>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import _ from "lodash";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
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
      numItemsToChoose: 1,
      list: [],
      shoppingCart: [],
    };
  },
  computed: {
    isShoppingCartEmpty() {
      return this.shoppingCart.length === 0;
    },
    totAmount() {
      
      return _.sumBy(this.shoppingCart, "price");
    },
  },
  watch: {
    totAmount() {
      this.$emit("update-total", this.totAmount);
    },
  },
  async mounted() {
    const qs = this.$route.query;

    const r = await axios.get(
      "https://6we1uwj492.execute-api.us-east-1.amazonaws.com/Prod/random",
      { params: qs }
    );
    const toAdd = _.range(this.numItemsToChoose);

    this.list = _.map(r.data, (rand) => {
      return {
        itemId: rand.item_id,
        price: rand.Price,
        img: rand["Image URL"],
        name: rand["Item Name"],
        title: rand["Item Name"],
        ounces: rand["Ounces"],
        quantity: rand["Quantity in Bundle"],
      };
    });
  },
  methods: {
    itemAdd(itemId) {
      const objToFind = _.filter(this.list, (i) => {
        return i.itemId === itemId;
      });

      _.remove(this.list, (i) => {
        return i.itemId === itemId;
      });

      this.shoppingCart = [...this.shoppingCart, ...objToFind];
    },
    itemRemove(itemId) {
      const objToFind = _.filter(this.shoppingCart, (i) => {
        return i.itemId === itemId;
      });

      const newShopping = _.filter(this.shoppingCart, (i) => {
        return i.itemId !== itemId;
      });
      this.shoppingCart = newShopping;
      this.list = [...this.list, ...objToFind];
    },
  },
};
</script>
<style scoped>
.border {
  border: 1px solid lightgray;
  border-radius: 10px;
  min-height: 100px;
}
</style>