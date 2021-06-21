<template>
  <v-app>
    <v-app-bar app color="primary" dark height="150">
      <div class="d-flex flex-column">
        <div>
          From the groceries on the screen, pick and drag some to go in a
          shopping cart for:
          <v-alert border="left" color="red lighten" class="my-3">
            a family of three with a baby and a busy lifestyle.
          </v-alert>
        </div>
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <HelloWorld @update-total="updateTotal" />
    </v-main>
    <v-footer app>
      <v-row>
        <v-col class="d-flex flex-column justify-center">
          Add items up to between ${{ lowerBound }} and ${{ upperBound }}.
        </v-col>
        <v-col class="d-flex flex-column justify-center">
          <div>
            Total price of selected items:
            <v-chip color="red" text-color="white"
              >${{ total.toFixed(2) }}</v-chip
            >
          </div>
        </v-col>
        <v-spacer></v-spacer>

        <v-col class="d-flex justify-content-right flex-grow-0">
          <div class="mx-auto">
            <v-btn
              color="red"
              class="text--white mx-auto"
              :disabled="!priceWithinRange"
            >
              SUBMIT
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",

  components: {
    HelloWorld,
  },

  data: () => ({
    total: 0,
    lowerBound: 10,
    upperBound: 20,
  }),
  computed: {
    priceWithinRange() {
      return this.lowerBound <= this.total && this.total <= this.upperBound;
    },
  },
  created() {},

  methods: {
    updateTotal(e) {
      this.total = e;
    },
  },
};
</script>
