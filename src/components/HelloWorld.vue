<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6">
        <h3>Choices:</h3>

        <draggable
          id="first"
          v-model="choice_set"
          class="d-flex flex-wrap border"
          draggable=".item"
          group="a"
        >
          <div
            outlined
            class="item"
            v-for="element in choice_set"
            :key="element.itemId"
          >
            <single-item v-bind="element" actionImg="mdi-plus" @itemClicked='addToShoppingCart(element.itemId)'/>
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
            :key="element.itemId"
          >
            <single-item v-bind="element" actionImg="mdi-minus" @itemClicked='removeFromShoppingCart(element.itemId)' />
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
import { mapActions, mapMutations, mapState, mapGetters } from "vuex";

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
    };
  },
  computed: {
    choice_set: {
      get() {
        return this.$store.state.choice_set;
      },
      set(value) {
        this.$store.commit("SET_CHOICE_SET", value);
      },
    },
    shoppingCart: {
      get() {
        return this.$store.state.shoppingCart;
      },
      set(value) {
        this.$store.commit("SET_SHOPPING_CART", value);
      },
    },
    isShoppingCartEmpty() {
      return this.shoppingCart.length === 0;
    },
    totAmount() {
      return _.sumBy(this.shoppingCart, "price");
    },
  },
  watch: {},
  async mounted() {},
  methods: {
    ...mapMutations({ addToShoppingCart: "ADD_TO_SHOPPING_CART" , removeFromShoppingCart:'REMOVE_FROM_SHOPPING_CART'}),
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