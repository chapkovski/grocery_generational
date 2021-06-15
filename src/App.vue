<template>
  <v-app>
    <v-app-bar app color="primary" dark height="100">
      <div class="d-flex flex-column">
        <div>
          From the groceries on the screen, pick and drag some to go in the cart today
          for a family of three with a baby and a busy lifestyle that add up to
          between $6 and $8.
        </div>
        <div>
          Total amount selected:
          <v-chip  color="red"
      text-color="white">${{ total }}</v-chip>
        </div>
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <HelloWorld @update-total="updateTotal" />
    </v-main>
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
  }),
  methods: {
    updateTotal(e) {
      
      this.total = e;
    },
  },
};
</script>
